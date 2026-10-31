// TODO: remove later
export function collectClientInfo() {
  if (typeof window === "undefined") {
    return null;
  }

  const { navigator, screen } = window;

  return {
    user_agent: navigator.userAgent,
    language: navigator.language,
    languages: [...navigator.languages],
    platform: navigator.platform,

    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,

    screen: {
      width: screen.width,
      height: screen.height,
      color_depth: screen.colorDepth,
    },

    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
    },

    device: {
      logical_cores: navigator.hardwareConcurrency ?? null,
      memory_gb:
        "deviceMemory" in navigator
          ? (navigator as Navigator & { deviceMemory?: number }).deviceMemory
          : null,
      touch_supported: navigator.maxTouchPoints > 0,
      cookies_enabled: navigator.cookieEnabled,
    },

    referrer: document.referrer || null,
  };
}
