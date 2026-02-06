// -----------------------------------------------
// src/lib/api.js
// Universal API Base Configuration for NeuroCrest
// -----------------------------------------------

const RAW =
  (typeof import.meta !== "undefined" && import.meta.env)
    ? import.meta.env.VITE_BACKEND_BASE_URL
    : undefined;

const isBrowser =
  typeof window !== "undefined" && typeof document !== "undefined";

// ✅ Only one backend should be used — your live Render one
const DEFAULTS = {
<<<<<<< HEAD
  emulator: "http://10.0.2.2:8000",   // ✅ Android Emulator alias
  local: "http://127.0.0.1:8000",     // ✅ Localhost (desktop)
  lan: "http://192.168.1.5:8000",     // ✅ Your PC IP for real devices on same Wi-Fi
  prod: "https://backend-app-k52v.onrender.com"   // ✅ Production API
=======
  localDev: "http://127.0.0.1:8000",         // Local FastAPI
  emulator: "http://10.0.2.2:8000",          // Android Emulator
  genymotion: "http://10.0.3.2:8000",        // Genymotion
  production: "https://api.neurocrest.in",   // ✅ YOUR LIVE BACKEND
>>>>>>> 91bb098cdeaf6f4860fe35fa3fb79a4689566426
};

function inferBase() {
  if (RAW && typeof RAW === "string" && RAW.trim() !== "") {
    return RAW.trim();
  }

  if (isBrowser) {
    const host = window.location.hostname;

    if (host === "localhost" || host === "127.0.0.1") {
      return DEFAULTS.localDev;
    }
    if (host.startsWith("10.0.2.")) return DEFAULTS.emulator;
    if (host.startsWith("10.0.3.")) return DEFAULTS.genymotion;

    // Everything else → production
    return DEFAULTS.production;
  }

  return DEFAULTS.production;
}

export const API_BASE_URL = inferBase();
export const API_BASE = API_BASE_URL;

<<<<<<< HEAD
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
=======
export async function api(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  return res;
}

export async function apiFetch(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status}: ${text}`);
  }
  return res.json();
}

if (isBrowser) {
  console.log("🌐 NeuroCrest API Base URL →", API_BASE_URL);
>>>>>>> 91bb098cdeaf6f4860fe35fa3fb79a4689566426
}
