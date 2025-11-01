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
  emulator: "http://10.0.2.2:8000",   // ✅ Android Emulator alias
  local: "http://127.0.0.1:8000",     // ✅ Localhost (desktop)
  lan: "http://192.168.1.5:8000",     // ✅ Your PC IP for real devices on same Wi-Fi

  prod: "https://backend-app-k52v.onrender.com"   // ✅ Production API   // ✅ Production API

};

// ------------------------------------------
// Pick correct base automatically
// ------------------------------------------
function inferBase() {
  // 1️⃣ Environment variable (highest priority)
  if (ENV_BASE) return ENV_BASE.replace(/\/+$/, "");

  // 2️⃣ Browser hostname check (auto-switch based on where it runs)
  if (typeof window !== "undefined") {
    const host = window.location.hostname;

    if (host.startsWith("10.0.2.")) return DEFAULTS.emulator;
    if (host.startsWith("192.168.")) return DEFAULTS.lan;
    if (host === "localhost" || host === "127.0.0.1") return DEFAULTS.local;
  }

  // 3️⃣ Default: production API
  return DEFAULTS.prod;
}

// ✅ Final API base URL
export const API_BASE = "http://192.168.1.5:8000";
if (import.meta?.env?.DEV) {
  console.log("[api] API_BASE =", API_BASE);
  fetch(`${API_BASE}/healthz`)
    .then(r => r.text())
    .then(t => console.log("[api] /healthz =>", t))
    .catch(e => console.error("[api] /healthz error:", e));
}
console.log("🔗 Using API Base:", API_BASE);

// ------------------------------------------
// Generic Fetch Wrapper (with detailed logs)
// ------------------------------------------
export async function api(path, options = {}) {
  // Normalize URL pieces to avoid double slashes
  const base = String(API_BASE || "").replace(/\/+$/, "");
  const tail = String(path || "").replace(/^\//, "");
  const url = `${base}/${tail}`;

  // Step-5 style logging: show method, full URL, and a safe preview of body
  const method = (options.method || "GET").toUpperCase();
  let bodyPreview = options?.body;
  try {
    // If body is JSON string, log parsed object for readability
    if (typeof bodyPreview === "string" && bodyPreview.trim().startsWith("{")) {
      bodyPreview = JSON.parse(bodyPreview);
    }
  } catch {
    // Keep original if parsing fails
  }
  console.log("[NEUROCREST] →", method, url, bodyPreview ?? "<no body>");

  try {
    const res = await fetch(url, {
      ...options,
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
      // Keep existing behavior but with clearer error
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
    // Network / CORS / DNS / Abort, etc.
    console.error("🚨 API Error:", err?.message || err, "@", url);
    throw err;
  }
}
