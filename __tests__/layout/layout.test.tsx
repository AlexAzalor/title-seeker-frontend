import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import type { PropsWithChildren } from "react";

import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "next-themes";
import messages from "../../messages/en.json";

import { GoogleLogin } from "@/components/layout/google-login";
import { LanguageSelector } from "@/components/layout/language-selector";
import { LastWatched } from "@/components/layout/last-watched";
import { Search } from "@/components/layout/search";
import { ThemeSelector } from "@/components/layout/theme-selector";
import { SessionProvider } from "next-auth/react";
import { SidebarProvider } from "@/components/ui/sidebar";

const ProjectProviders = ({ children }: PropsWithChildren) => (
  <ThemeProvider
    attribute="class"
    defaultTheme="light"
    enableSystem
    disableTransitionOnChange
  >
    <NextIntlClientProvider messages={messages} locale="en">
      <SessionProvider session={null}>
        <SidebarProvider defaultOpen={false}>{children}</SidebarProvider>
      </SessionProvider>
    </NextIntlClientProvider>
  </ThemeProvider>
);

test("Should render GoogleLogin", () => {
  render(<GoogleLogin />, {
    wrapper: ProjectProviders,
  });

  expect(screen.getByLabelText("google-login-button")).toBeDefined();
});

test("Should render LanguageSelector", async () => {
  render(<LanguageSelector />, {
    wrapper: ProjectProviders,
  });

  expect(screen.getByLabelText("language-selector")).toBeDefined();
});

test("Should render LastWatched", () => {
  render(<LastWatched posterURL="test" />, {
    wrapper: ProjectProviders,
  });

  expect(
    screen.getByRole("heading", { level: 2, name: "Last Watched" }),
  ).toBeDefined();
});

test("Should render Search", () => {
  render(<Search posterURL="test" />, {
    wrapper: ProjectProviders,
  });

  expect(screen.getByLabelText("search")).toBeDefined();
});

test("Should render ThemeSelector", async () => {
  render(<ThemeSelector />, { wrapper: ProjectProviders });

  expect(screen.getByLabelText("select-theme")).toBeDefined();
});
