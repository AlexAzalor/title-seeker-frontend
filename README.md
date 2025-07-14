# 🎬 Title Seeker

<div id="title-seeker" align="center">
  <img src="public/static/logo.webp" alt="Title Seeker Logo" width="100" height="100" style="border-radius: 50%;">

**A powerful movie discovery platform built with modern web technologies**

</div>

---

## ✨ Features

- 🎨 **Modern UI** - Beautiful, responsive design with dark/light themes
- 🌍 **Internationalization** - Multi-language support
- 📱 **Mobile Responsive** - Optimized for all device sizes
- ⚡ **Fast Performance** - Built with Next.js for optimal speed

---

## 🛠️ Tech Stack

<table>
  <tr>
    <td align="center">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180" width="32"><mask height="180" id=":r8:mask0_408_134" maskUnits="userSpaceOnUse" width="180" x="0" y="0" style="mask-type: alpha;"><circle cx="90" cy="90" fill="black" r="90"></circle></mask><g mask="url(#:r8:mask0_408_134)"><circle cx="90" cy="90" data-circle="true" fill="black" r="90"></circle><path d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z" fill="url(#:r8:paint0_linear_408_134)"></path><rect fill="url(#:r8:paint1_linear_408_134)" height="72" width="12" x="115" y="54"></rect></g><defs><linearGradient gradientUnits="userSpaceOnUse" id=":r8:paint0_linear_408_134" x1="109" x2="144.5" y1="116.5" y2="160.5"><stop stop-color="white"></stop><stop offset="1" stop-color="white" stop-opacity="0"></stop></linearGradient><linearGradient gradientUnits="userSpaceOnUse" id=":r8:paint1_linear_408_134" x1="121" x2="120.799" y1="54" y2="106.875"><stop stop-color="white"></stop><stop offset="1" stop-color="white" stop-opacity="0"></stop></linearGradient></defs></svg>
      <br><strong><a href="https://nextjs.org/">Next.js</a></strong>
      <br><sub>React Framework</sub>
    </td>
    <td align="center">
      <img src="https://www.typescriptlang.org/favicon-32x32.png" width="32" height="32" alt="TypeScript">
      <br><strong><a href="https://www.typescriptlang.org/">TypeScript</a></strong>
      <br><sub>Type Safety</sub>
    </td>
    <td align="center">
      <img src="https://tailwindcss.com/favicons/favicon-32x32.png" width="32" height="32" alt="TailwindCSS">
      <br><strong><a href="https://tailwindcss.com/">TailwindCSS</a></strong>
      <br><sub>Styling</sub>
    </td>
    <td align="center">
      <img src="https://ui.shadcn.com/favicon.ico" width="32" height="32" alt="Shadcn">
      <br><strong><a href="https://ui.shadcn.com/">Shadcn/ui</a></strong>
      <br><sub>UI Components</sub>
    </td>

  </tr>
  <tr>
    <td align="center">
      <img src="https://orval.dev/images/emblem.svg" width="32" height="32" alt="Orval">
      <br><strong><a href="https://orval.dev/">Orval</a></strong>
      <br><sub>API Generation</sub>
    </td>
    <td align="center">
      <img src="https://playwright.dev/img/playwright-logo.svg" width="32" height="32" alt="Playwright">
      <br><strong><a href="https://playwright.dev/">Playwright</a></strong>
      <br><sub>E2E Testing</sub>
    </td>
    <td align="center">
      <img src="https://vitest.dev/favicon.ico" width="32" height="32" alt="Vitest">
      <br><strong><a href="https://vitest.dev/">Vitest</a></strong>
      <br><sub>Unit Testing</sub>
    </td>
    <td align="center">
      <img src="https://www.docker.com/favicon.ico" width="32" height="32" alt="Docker">
      <br><strong><a href="https://www.docker.com/">Docker</a></strong>
      <br><sub>Containerization</sub>
    </td>
  </tr>
</table>

---

## 🚀 Getting Started

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd title-seeker-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install (I use)
   # or
   pnpm install
   # or
   bun install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   ⚠️ Ask the owner for credentials ⚠️
   ```

4. **Generate API client**

   ```bash
   yarn gen-api
   ```

   If the schemas have changed on the backend, run this command, and then repeat the previous one:

   ```bash
   yarn get-openapi
   ```

5. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

---

## 📝 Scripts

| Command           | Description                            |
| ----------------- | -------------------------------------- |
| `dev`             | Start development server               |
| `build`           | Build for production                   |
| `start`           | Start production server                |
| `lint`            | Run ESLint                             |
| `type-check`      | Run a typescript check                 |
| `get-openapi`     | Get API schemas from backend (Swagger) |
| `gen-api`         | Generate API client with Orval         |
| `test`            | Run Vitest unit tests                  |
| `test-playwright` | Run Playwright E2E tests               |

---

## 🧪 Testing

### Unit Tests (Vitest)

```bash
npm run test
# or
yarn test
```

### End-to-End Tests (Playwright)

```bash
npm run test-playwright
# or
yarn test-playwright
```

For E2E it is better to use an <strong><a href="https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright">extension</a></strong>

---

## 🌍 Internationalization

The application supports multiple languages using **next-intl**:

- English (en)
- Ukrainian (uk)

Translation files are located in the `messages/` directory.

---

## 🚢 Deploy

Deployment is done using Docker. Changes are pushed to the repository and then pulled on the server.
For hotfixes there is a quick script, and after significant changes it is better to use git actions. To do this you need to create a runner on your machine.

---

## 🔢 Versioning

After changes in the project, the version should be updated. This is done with a script:

```bash
sh version.sh patch/minor/major
```

---

<div align="center">
  <p>
    <a href="#title-seeker">Back to top</a>
  </p>
</div>
