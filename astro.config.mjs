// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
    vite: {
        assetsInclude: ['**/*.Astro'],
      },	
    site: 'https://kev1n.netlify.app',
    // base: 'Kevin.ai',
    integrations: [mdx(), sitemap()],
});