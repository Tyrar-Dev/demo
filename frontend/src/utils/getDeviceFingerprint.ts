export function getDeviceFingerprint(): string | null {
    if (typeof window === 'undefined') {
        return null;
    }

    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const screenRes = `${window.screen.width}x${window.screen.height}`;

    return btoa(`${userAgent}|${platform}`);
}

export function detectBrowser(): string {
    const ua = navigator.userAgent;
    const vendor = navigator.vendor;

    // Brave detection (nếu navigator.brave tồn tại)
    // @ts-ignore
    if (navigator.brave) return "Brave";

    // Edge Chromium
    if (/Edg\//.test(ua)) return "Edge";

    // Opera
    if (/OPR\//.test(ua)) return "Opera";

    // Cốc Cốc (CocCocBrowser)
    if (/CocCocBrowser/.test(ua)) return "Cốc Cốc";

    // Chrome (Google Chrome)
    if (/Chrome/.test(ua) && vendor === "Google Inc.") return "Chrome";

    // Firefox
    if (/Firefox/.test(ua)) return "Firefox";

    // Safari (không phải Chrome)
    if (/Safari/.test(ua) && !/Chrome/.test(ua)) return "Safari";

    return "Unknown";
}

export function detectBrowserFromUA(ua: string): string {
    if (/Edg\//.test(ua)) return "Edge";
    if (/OPR\//.test(ua)) return "Opera";
    if (/CocCocBrowser/.test(ua)) return "Cốc Cốc";
    if (/Chrome/.test(ua) && /Google Inc/.test(navigator.vendor)) return "Chrome";
    if (/Firefox/.test(ua)) return "Firefox";
    if (/Safari/.test(ua) && !/Chrome/.test(ua)) return "Safari";
    return "Unknown";
}
