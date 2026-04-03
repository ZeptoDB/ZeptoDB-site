// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://zeptodb.com',
  integrations: [
    starlight({
      title: 'ZeptoDB',
      logo: {
        light: './src/assets/logo-light.svg',
        dark: './src/assets/logo-dark.svg',
        replacesTitle: true,
      },
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/zeptodb/zeptodb' },
      ],
      defaultLocale: 'root',
      locales: {
        root: { label: 'English', lang: 'en' },
        ko: { label: '한국어', lang: 'ko' },
      },
      customCss: ['./src/styles/brand.css'],
      components: {
        Header: './src/components/Header.astro',
      },
      sidebar: [
        { label: 'Getting Started', autogenerate: { directory: 'getting-started' } },
        { label: 'API Reference', autogenerate: { directory: 'api' } },
        { label: 'Architecture', autogenerate: { directory: 'design' } },
        { label: 'Deployment', autogenerate: { directory: 'deployment' } },
        { label: 'Operations', autogenerate: { directory: 'operations' } },
        { label: 'Ops', collapsed: true, autogenerate: { directory: 'ops' } },
        { label: 'Feed Handlers', autogenerate: { directory: 'feeds' } },
        { label: 'Benchmarks', autogenerate: { directory: 'bench' } },
        { label: 'Business', collapsed: true, autogenerate: { directory: 'business' } },
        { label: 'Community', collapsed: true, autogenerate: { directory: 'community' } },
        { label: 'Development Log', collapsed: true, autogenerate: { directory: 'devlog' } },
      ],
    }),
  ],
});
