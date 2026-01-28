// src/lib/heartbeat.js
const BASE = import.meta?.env?.VITE_BACKEND_BASE_URL?.trim().replace(/\/+$/, "")
  || "https://paper-trading-backend-sqllite.onrender.com";

export function startHeartbeat() {
  // Ping every 45s while the tab is open
  setInterval(() => {
    fetch(`${BASE}/healthz`, { method: "GET", cache: "no-store" })
<<<<<<< HEAD
      .catch(() => {}); // silent
=======
      .catch(() => { }); // silent
>>>>>>> 6c42a83969e64dded0190e1fc5cbd41fda1a4d53
  }, 45000);
}
