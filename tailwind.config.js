// tailwind.config.js
module.exports = {
    darkMode: "class",
    content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
    theme: { extend: { colors: { primary: "#2563eb", secondary: "#1e293b" } } },
    safelist: [
        "text-green-600", "text-red-600",
        "bg-red-100", "hover:bg-red-200",
        { pattern: /rounded(-(lg|xl|2xl))?/ },
        { pattern: /shadow(-(md|xl))?/ },
        { pattern: /(p|px|py|gap)-(1|2|3|4|5|6)/ }
    ],
    plugins: [],
};
