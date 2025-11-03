// src/lib/api.js

// ----------------------
// Environment-based Base
// ----------------------
const ENV_BASE =
  typeof import.meta !== "undefined" &&
  import.meta?.env?.VITE_BACKEND_BASE_URL
    ? String(import.meta.env.VITE_BACKEND_BASE_URL).trim()
    : "";

// Default fallback URLs
const DEFAULTS = {
  emulator: "http://10.0.2.2:8000",          // ✅ Android Emulator alias
  local: "http://127.0.0.1:8000",            // ✅ Localhost (desktop)
  lan: "http://192.168.1.5:8000",            // ✅ Your PC IP for real devices on same Wi-Fi
  prod: "https://api.neurocrest.in",         // ✅ Production API (HTTPS)
};

// Small helpers
const isBrowser = typeof window !== "undefined";
const isHttpsPage = isBrowser && window.location.protocol === "https:";

// Capacitor/native check (works in WebView too)
const isNative =
  typeof window !== "undefined" &&
  !!(window.Capacitor?.isNativePlatform?.() || window.Capacitor?.platform);

/**
 * If the app is running on HTTPS and base is HTTP for a host that supports TLS,
 * upgrade to HTTPS to avoid mixed-content blocks.
 */
function maybeUpgradeToHttps(base) {
  if (!isHttpsPage) return base;
  if (!/^http:\/\//i.test(base)) return base;

  // Known hosts that should always be HTTPS in prod
  const canUpgrade =
    /(\.onrender\.com|\.vercel\.app|neurocrest\.in)$/i.test(base) ||
    // add your own domains here if needed
    false;

  if (canUpgrade) return base.replace(/^http:\/\//i, "https://");
  // Otherwise, keep HTTP (e.g., LAN), but you may hit mixed-content on web.
  return base;
}

// ------------------------------------------
// Pick correct base automatically
// ------------------------------------------
function inferBase() {
  // 0️⃣ Manual override for debugging (optional)
  //   window.NEURO_API_BASE_OVERRIDE = "https://example.com";
  if (isBrowser && window.NEURO_API_BASE_OVERRIDE) {
    return String(window.NEURO_API_BASE_OVERRIDE).replace(/\/+$/, "");
  }

  // 1️⃣ Environment variable (highest priority)
  if (ENV_BASE) return maybeUpgradeToHttps(ENV_BASE.replace(/\/+$/, ""));

  // 2️⃣ Native (Capacitor) — prefer stable HTTPS prod to avoid cleartext issues
  if (isNative) {
    return DEFAULTS.prod;
  }

  // 3️⃣ Browser hostname check (auto-switch based on where it runs)
  if (isBrowser) {
    const host = window.location.hostname;

    // If running on a Vercel preview/prod domain, always use prod API
    if (host.endsWith(".vercel.app")) return DEFAULTS.prod;

    if (host.startsWith("10.0.2.")) return DEFAULTS.emulator; // Android emulator
    if (host.startsWith("192.168.")) return DEFAULTS.lan;      // LAN dev
    if (host === "localhost" || host === "127.0.0.1") return DEFAULTS.local;
  }

  // 4️⃣ Default: production API
  return DEFAULTS.prod;
}

// ✅ Final API base URL (with HTTPS upgrade when needed)
export const API_BASE = maybeUpgradeToHttps(inferBase()).replace(/\/+$/, "");
console.log("🔗 Using API Base:", API_BASE);

// ------------------------------------------
// Generic Fetch Wrapper (with timeout & logs)
// ------------------------------------------
function withTimeout(ms) {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), ms);
  return { signal: ctrl.signal, cancel: () => clearTimeout(id) };
}

export async function api(path, options = {}) {
  // Normalize URL pieces to avoid double slashes
  const base = String(API_BASE || "").replace(/\/+$/, "");
  const tail = String(path || "").replace(/^\//, "");
  const url = `${base}/${tail}`;

  // Step-5 style logging: show method, full URL, and a safe preview of body
  const method = (options.method || "GET").toUpperCase();
  let bodyPreview = options?.body;
  try {
    if (typeof bodyPreview === "string" && bodyPreview.trim().startsWith("{")) {
      bodyPreview = JSON.parse(bodyPreview);
    }
  } catch {
    /* keep original if parsing fails */
  }
  console.log("[NEUROCREST] →", method, url, bodyPreview ?? "<no body>");

  // 12s network timeout (tweak if needed)
  const t = withTimeout(12000);

  try {
    const res = await fetch(url, {
      ...options,
      signal: t.signal,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    // Clone the response to log a short preview without consuming the stream
    const clone = res.clone();
    let preview = "";
    try {
      const text = await clone.text();
      preview = text.slice(0, 500); // keep log compact
    } catch {
      preview = "<unreadable body>";
    }

    console.log("[NEUROCREST] ←", res.status, url, preview || "<empty>");

    if (!res.ok) {
      console.error(`❌ API ${res.status} @ ${url}:`, preview);
      throw new Error(`API ${res.status}: ${preview}`);
    }

    // Return parsed JSON if possible
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      return await res.json();
    } else {
      return await res.text();
    }
  } catch (err) {
    console.error("🚨 API Error:", err?.message || err, "@", url);
    throw err;
  } finally {
    t.cancel();
  }
}
