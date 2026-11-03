# Third-party credits

TRIZ VIBES builds on the open source packages below. Each stays under its own licence, which governs those parts. The licence of this repository is in LICENSE and NOTICE.

## Runtime dependencies

| Package | Version | Licence | Source |
| --- | --- | --- | --- |
| Next.js | ^16.2.4 | MIT | https://github.com/vercel/next.js |
| React | 19.1.0 | MIT | https://github.com/facebook/react |
| React DOM | 19.1.0 | MIT | https://github.com/facebook/react |
| three.js | 0.176.0 | MIT | https://github.com/mrdoob/three.js |
| @react-three/fiber | 9.1.2 | MIT | https://github.com/pmndrs/react-three-fiber |
| Framer Motion | 12.10.5 | MIT | https://github.com/motiondivision/motion |
| Lucide React | 0.511.0 | ISC (parts derived from Feather, MIT) | https://github.com/lucide-icons/lucide |
| OpenAI Node SDK | 4.100.0 | Apache-2.0 | https://github.com/openai/openai-node |
| Zod | 3.24.4 | MIT | https://github.com/colinhacks/zod |
| Zustand | 5.0.4 | MIT | https://github.com/pmndrs/zustand |
| clsx | 2.1.1 | MIT | https://github.com/lukeed/clsx |

## Development dependencies

Tailwind CSS 3.4.17 (MIT), PostCSS 8.5.3 (MIT), Autoprefixer 10.4.21 (MIT), TypeScript 5.8.3 (Apache-2.0), ESLint 9.27.0 (MIT) with eslint-config-next (MIT), and the type packages @types/node, @types/react, @types/react-dom and @types/three (MIT). They are used to build the site and are not part of the shipped code.

## Fonts

The stylesheets name IBM Plex Mono and Cormorant Garamond, both under the SIL Open Font License 1.1, with system fonts as fallback. No font files are bundled in this repository.

## Services

If an OpenAI API key is set in the environment, text entered by the visitor is sent to the OpenAI API (https://openai.com/policies/).
