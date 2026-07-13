// @ts-check
// Docusaurus config for the Report Hub.
// This site reads the report markdown DIRECTLY from the repo root (../) — no
// copy step. Every top-level folder = a project; nested folders become nested
// sidebar categories (unlimited depth). Images live next to their .md files.

import {themes as prismThemes} from 'prism-react-renderer';

// GitHub Pages url/baseUrl are injected by the deploy workflow so this config
// works unchanged in ANY repo. Locally (no env) it falls back to '/'.
//   SITE_URL  = https://<org>.github.io
//   BASE_URL  = /<repo-name>/
const SITE_URL = process.env.SITE_URL || 'https://your-org.github.io';
const BASE_URL = process.env.BASE_URL || '/';
const GH_ORG = process.env.GH_ORG || 'your-org';
const GH_REPO = process.env.GH_REPO || 'report-hub';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Report Hub',
  tagline: 'Trung tâm báo cáo nội bộ',
  favicon: undefined,

  url: SITE_URL,
  baseUrl: BASE_URL,
  organizationName: GH_ORG,
  projectName: GH_REPO,

  // Report content is arbitrary Markdown that may contain broken cross-links or
  // '<'/'{' characters — warn instead of failing the whole build.
  onBrokenLinks: 'warn',
  onBrokenAnchors: 'warn',

  // Parse .md as CommonMark (so literal '<', '{', '<script>', 'a < b' in prose
  // don't break the build) and enable mermaid code fences.
  markdown: {
    format: 'detect',
    mermaid: true,
    hooks: {
      onBrokenMarkdownImages: 'warn',
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'vi',
    locales: ['vi'],
  },

  themes: ['@docusaurus/theme-mermaid'],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          // Read reports straight from the repo root — the folders you already
          // create and commit. No duplication.
          path: '..',
          routeBasePath: '/', // the whole site IS the report browser
          sidebarPath: './sidebars.js',
          editUrl: undefined,
          showLastUpdateTime: false,
          // Everything under the repo root is a report EXCEPT the site itself
          // and dependency/build dirs.
          exclude: [
            'website/**',
            '**/node_modules/**',
            '**/.git/**',
            '**/_*.{js,jsx,ts,tsx,md,mdx}',
            '**/_*/**',
          ],
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'Report Hub',
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'reportsSidebar',
            position: 'left',
            label: 'Báo cáo',
          },
        ],
      },
      footer: {
        style: 'dark',
        copyright: `Report Hub · Built with Docusaurus`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
