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
  prod: "https://api.neurocrest.in"   // ✅ Production API
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
export const API_BASE = inferBase();
console.log("🔗 Using API Base:", API_BASE);

// ------------------------------------------
// Generic Fetch Wrapper
// ------------------------------------------
export async function api(path, options = {}) {
  const url = `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
  console.log("🌐 Fetching:", url);

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    if (!res.ok) {
      const text = await res.text();
      console.error(`❌ API ${res.status}: ${text}`);
      throw new Error(`API ${res.status}: ${text}`);
    }

    // Return parsed JSON if possible
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await res.json();
    } else {
      return await res.text();
    }
  } catch (err) {
    console.error("🚨 API Error:", err.message);
    throw err;
  }
}
