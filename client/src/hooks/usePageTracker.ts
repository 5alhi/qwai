import { useEffect, useRef } from "react";
import { trpc } from "@/lib/trpc";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getSessionId(): string {
  const key = "qwai_session";
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    sessionStorage.setItem(key, id);
  }
  return id;
}

function isNewVisitor(): boolean {
  const key = "qwai_visited";
  const visited = localStorage.getItem(key);
  if (!visited) {
    localStorage.setItem(key, "1");
    return true;
  }
  return false;
}

function getUtmParams(): Record<string, string> {
  const params = new URLSearchParams(window.location.search);
  const result: Record<string, string> = {};
  const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
  for (const key of keys) {
    const val = params.get(key);
    if (val) result[key] = val;
  }
  return result;
}

function getPageLoadTime(): number | undefined {
  try {
    const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    if (nav) return Math.round(nav.loadEventEnd - nav.startTime);
    // Fallback
    const timing = performance.timing;
    if (timing?.loadEventEnd && timing?.navigationStart) {
      return timing.loadEventEnd - timing.navigationStart;
    }
  } catch { /* ignore */ }
  return undefined;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function usePageTracker(articleSlug?: string) {
  const trackMutation = trpc.analytics.track.useMutation();
  const updateEngagement = trpc.analytics.updateEngagement.useMutation();
  const trackEvent = trpc.analytics.trackEvent.useMutation();
  const tracked = useRef(false);
  const pageViewIdRef = useRef<number | null>(null);
  const sessionId = useRef(getSessionId());
  const maxScroll = useRef(0);
  const startTime = useRef(Date.now());

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;

    const path = window.location.pathname;
    const referrer = document.referrer || undefined;
    const utm = getUtmParams();

    // Wait for load event to get accurate load time
    const doTrack = () => {
      const loadTime = getPageLoadTime();
      trackMutation.mutate({
        path,
        referrer,
        sessionId: sessionId.current,
        articleSlug,
        screenWidth: screen.width,
        screenHeight: screen.height,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        colorDepth: screen.colorDepth,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        pageLoadTime: loadTime,
        utmSource: utm.utm_source,
        utmMedium: utm.utm_medium,
        utmCampaign: utm.utm_campaign,
        utmContent: utm.utm_content,
        utmTerm: utm.utm_term,
        isNewVisitor: isNewVisitor(),
      }, {
        onSuccess: (data) => {
          if (data?.id) pageViewIdRef.current = data.id;
        },
      });
    };

    if (document.readyState === "complete") {
      doTrack();
    } else {
      window.addEventListener("load", doTrack, { once: true });
    }

    // ─── Scroll depth tracking ──────────────────────────────────────────────
    const handleScroll = () => {
      const scrolled = window.scrollY + window.innerHeight;
      const total = document.documentElement.scrollHeight;
      const pct = Math.round((scrolled / total) * 100);
      if (pct > maxScroll.current) maxScroll.current = pct;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // ─── Click event tracking ───────────────────────────────────────────────
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      // Only track meaningful clicks (links, buttons, interactive elements)
      const tag = target.tagName.toLowerCase();
      if (!["a", "button", "input", "select", "textarea"].includes(tag) && !target.closest("a, button")) return;

      const anchor = target.closest("a") as HTMLAnchorElement | null;
      const button = target.closest("button") as HTMLButtonElement | null;
      const el = anchor ?? button ?? target;
      const text = el.textContent?.trim().slice(0, 100) ?? "";
      const href = anchor?.href ?? "";
      const selector = el.id ? `#${el.id}` : `${el.tagName.toLowerCase()}${el.className ? "." + el.className.split(" ")[0] : ""}`;

      trackEvent.mutate({
        pageViewId: pageViewIdRef.current ?? undefined,
        sessionId: sessionId.current,
        eventType: "click",
        eventTarget: selector.slice(0, 200),
        eventValue: (text || href).slice(0, 512),
        positionX: Math.round(e.clientX),
        positionY: Math.round(e.clientY),
        path,
      });
    };
    document.addEventListener("click", handleClick, { passive: true });

    // ─── Engagement flush on page unload ────────────────────────────────────
    const flushEngagement = () => {
      if (!pageViewIdRef.current) return;
      const timeOnPage = Math.round((Date.now() - startTime.current) / 1000);
      // Use sendBeacon for reliability on unload
      const payload = JSON.stringify({
        "0": {
          json: {
            id: pageViewIdRef.current,
            scrollDepth: Math.min(maxScroll.current, 100),
            timeOnPage,
          },
        },
      });
      navigator.sendBeacon?.("/api/trpc/analytics.updateEngagement?batch=1", new Blob([payload], { type: "application/json" }));
    };

    window.addEventListener("beforeunload", flushEngagement);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") flushEngagement();
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("click", handleClick);
      window.removeEventListener("beforeunload", flushEngagement);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
