// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Baut trotz aller Typ-Fehler
  typescript: {
    ignoreBuildErrors: true,
  },
  // Kein Static Export (Middleware/Netlify kompatibel)
};

module.exports = nextConfig;
