import { ThemeSelector } from "@/components/layout/theme-selector";

export default function PortfolioPage() {
  return (
    <>
      <main className="container flex min-h-screen max-w-320 flex-col items-center gap-5 p-4 lg:px-10 lg:py-8">
        <h1>Portfolio</h1>
        <ThemeSelector />
      </main>
    </>
  );
}
