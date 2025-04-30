IF NO FORMAT CODE ON SAVE BUTTON!!!!!
if we have PRETTIER PLUGIN but DO NOT HAVE PRETTIER - check in package.json!!!! in devDEP !!!
yarn add prettier -D

===project-m READMY===

npx depcheck
[text](https://www.npmjs.com/package/@next/bundle-analyzer)

If bad things with localhost pathname url...
need to delete images and files - not cookies
chrome://settings/clearBrowserData

npx create-next-app@latest
npx storybook@latest init
yarn add -D @storybook/nextjs - ? само установилось с прошлой команды
tailwind-merge
yarn add prettier prettier-plugin-tailwindcss -D
module.exports = {
plugins: ["prettier-plugin-tailwindcss"],
};

yarn add @storybook/addon-themes -D
addons - "@storybook/addon-themes",

fix @/../.. fix alias import bug
main.ts
add:
webpackFinal: async (config) => {
if (!config.resolve) {
return config;
}

    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "../src"),
    };

    return config;

},

yarn add @storybook/addon-a11y --dev
yarn add -D chromatic - як гіт?

yarn add next-themes

yarn add @typescript-eslint/eslint-plugin -D
"plugins": ["@typescript-eslint"],

---

yarn add next-intl
.mjs
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/\*_ @type {import('next').NextConfig} _/
const nextConfig = {};

## export default withNextIntl(nextConfig);

npx shadcn-ui@latest init
add accurate path! - [locale]
Where is your global CSS file? › › app/[locale]/globals.css
Where is your tailwind.config.js located? › tailwind.config.ts - js => ts

yarn add @radix-ui/react-icons

yarn add orval -D
add config - https://github.com/Simple2B/orval-showcase/blob/main/orval.config.ts
gererate code
yarn orval --config ./orval.config.ts
generate new config
yarn orval --config ./orval.config.ts -p orval-prod

yarn add @faker-js/faker
yarn add @tanstack/react-query
yarn add axios
yarn add msw@latest -D

yarn add swr
yarn add zod

========================

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

Playwright
yarn playwright codegen --viewport-size=2460,1040 http://localhost:3000
yarn playwright codegen --viewport-size=385,851 http://localhost:3000
