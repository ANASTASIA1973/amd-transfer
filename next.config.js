// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Baut trotz aller Typ-Fehler
  typescript: {
    ignoreBuildErrors: true,
  },
  // Schaltet das moderne Static-Export-Feature ein
  output: 'export',
};

module.exports = nextConfig;
