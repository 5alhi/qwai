/**
 * Server-side analytics helpers
 * - IP geolocation via ip-api.com (free, no key required, 45 req/min)
 * - User agent parsing (regex-based, no external dependency)
 */

interface GeoResult {
  ip: string;
  country: string;
  countryCode: string;
  region: string;
  city: string;
  latitude: string;
  longitude: string;
  timezone: string;
  isp: string;
}

// Simple in-memory cache to avoid hammering the geo API for the same IP
const geoCache = new Map<string, { data: GeoResult | null; ts: number }>();
const GEO_CACHE_TTL = 60 * 60 * 1000; // 1 hour

export async function lookupGeo(ip: string): Promise<GeoResult | null> {
  if (!ip || ip === "127.0.0.1" || ip === "::1" || ip.startsWith("192.168.") || ip.startsWith("10.")) {
    return null; // Skip local/private IPs
  }

  const cached = geoCache.get(ip);
  if (cached && Date.now() - cached.ts < GEO_CACHE_TTL) {
    return cached.data;
  }

  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,countryCode,regionName,city,lat,lon,timezone,isp,query`, {
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) {
      geoCache.set(ip, { data: null, ts: Date.now() });
      return null;
    }
    const json = await res.json() as {
      status: string; country: string; countryCode: string;
      regionName: string; city: string; lat: number; lon: number;
      timezone: string; isp: string; query: string;
    };
    if (json.status !== "success") {
      geoCache.set(ip, { data: null, ts: Date.now() });
      return null;
    }
    const result: GeoResult = {
      ip: json.query,
      country: json.country ?? "",
      countryCode: json.countryCode ?? "",
      region: json.regionName ?? "",
      city: json.city ?? "",
      latitude: String(json.lat ?? ""),
      longitude: String(json.lon ?? ""),
      timezone: json.timezone ?? "",
      isp: json.isp ?? "",
    };
    geoCache.set(ip, { data: result, ts: Date.now() });
    return result;
  } catch {
    geoCache.set(ip, { data: null, ts: Date.now() });
    return null;
  }
}

export function extractIp(req: { headers: Record<string, string | string[] | undefined>; socket?: { remoteAddress?: string } }): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) {
    const first = Array.isArray(forwarded) ? forwarded[0] : forwarded.split(",")[0];
    return first.trim();
  }
  return req.socket?.remoteAddress ?? "";
}

interface ParsedUA {
  browser: string;
  browserVersion: string;
  os: string;
  osVersion: string;
  device: "desktop" | "mobile" | "tablet";
}

export function parseUserAgent(ua: string): ParsedUA {
  if (!ua) return { browser: "Unknown", browserVersion: "", os: "Unknown", osVersion: "", device: "desktop" };

  // Device
  let device: "desktop" | "mobile" | "tablet" = "desktop";
  if (/tablet|ipad|playbook|silk/i.test(ua)) device = "tablet";
  else if (/mobile|iphone|ipod|android|blackberry|mini|windows\sce|palm/i.test(ua)) device = "mobile";

  // Browser
  let browser = "Unknown";
  let browserVersion = "";
  if (/Edg\//i.test(ua)) {
    browser = "Edge";
    browserVersion = ua.match(/Edg\/([0-9.]+)/i)?.[1] ?? "";
  } else if (/OPR\//i.test(ua) || /Opera/i.test(ua)) {
    browser = "Opera";
    browserVersion = ua.match(/(?:OPR|Opera)\/([0-9.]+)/i)?.[1] ?? "";
  } else if (/Chrome\//i.test(ua) && !/Chromium/i.test(ua)) {
    browser = "Chrome";
    browserVersion = ua.match(/Chrome\/([0-9.]+)/i)?.[1] ?? "";
  } else if (/Firefox\//i.test(ua)) {
    browser = "Firefox";
    browserVersion = ua.match(/Firefox\/([0-9.]+)/i)?.[1] ?? "";
  } else if (/Safari\//i.test(ua) && !/Chrome/i.test(ua)) {
    browser = "Safari";
    browserVersion = ua.match(/Version\/([0-9.]+)/i)?.[1] ?? "";
  } else if (/MSIE|Trident/i.test(ua)) {
    browser = "IE";
    browserVersion = ua.match(/(?:MSIE |rv:)([0-9.]+)/i)?.[1] ?? "";
  }

  // OS
  let os = "Unknown";
  let osVersion = "";
  if (/Windows NT/i.test(ua)) {
    os = "Windows";
    const v = ua.match(/Windows NT ([0-9.]+)/i)?.[1];
    const winMap: Record<string, string> = { "10.0": "10/11", "6.3": "8.1", "6.2": "8", "6.1": "7", "6.0": "Vista", "5.1": "XP" };
    osVersion = v ? (winMap[v] ?? v) : "";
  } else if (/iPhone|iPad|iPod/i.test(ua)) {
    os = "iOS";
    osVersion = ua.match(/OS ([0-9_]+)/i)?.[1]?.replace(/_/g, ".") ?? "";
  } else if (/Mac OS X/i.test(ua)) {
    os = "macOS";
    osVersion = ua.match(/Mac OS X ([0-9_]+)/i)?.[1]?.replace(/_/g, ".") ?? "";
  } else if (/Android/i.test(ua)) {
    os = "Android";
    osVersion = ua.match(/Android ([0-9.]+)/i)?.[1] ?? "";
  } else if (/Linux/i.test(ua)) {
    os = "Linux";
  } else if (/CrOS/i.test(ua)) {
    os = "ChromeOS";
  }

  return { browser, browserVersion, os, osVersion, device };
}

export function extractReferrerDomain(referrer?: string | null): string {
  if (!referrer) return "";
  try {
    const url = new URL(referrer);
    return url.hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}
