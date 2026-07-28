import { defineConfig } from 'astro/config';

// Static output — Vercel auto-detects Astro and deploys it correctly
// with zero config. No adapter needed since nothing here requires SSR.
export default defineConfig({
  site: 'https://henoch-automation-portfolio.vercel.app',
  output: 'static',
});
