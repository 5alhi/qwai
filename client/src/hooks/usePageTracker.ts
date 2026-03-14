import { useEffect, useRef } from "react";
import { trpc } from "@/lib/trpc";

// Detect device type from user agent
function getDevice(): "desktop" | "mobile" | "tablet" {
  const ua = navigator.userAgent;
  if (/tablet|ipad|playbook|silk/i.test(ua)) return "tablet";
  if (/mobile|iphone|ipod|android|blackberry|mini|windows\sce|palm/i.test(ua)) return "mobile";
  return "desktop";
}

// Get or create a session ID stored in sessionStorage (anonymous, expires when tab closes)
function getSessionId(): string {
  const key = "qwai_session";
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    sessionStorage.setItem(key, id);
  }
  return id;
}

export function usePageTracker(articleSlug?: string) {
  const trackMutation = trpc.analytics.track.useMutation();
  const tracked = useRef(false);

  useEffect(() => {
    // Only track once per page mount
    if (tracked.current) return;
    tracked.current = true;

    const path = window.location.pathname;
    const referrer = document.referrer || undefined;
    const device = getDevice();
    const sessionId = getSessionId();

    // Fire and forget: don't block rendering
    trackMutation.mutate({
      path,
      referrer,
      device,
      sessionId,
      articleSlug,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
