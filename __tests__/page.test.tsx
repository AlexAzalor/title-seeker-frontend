import { afterEach } from "node:test";
import { expect, test, vi, describe } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { SessionProvider } from "next-auth/react";

import messages from "../messages/en.json";
import { Language, UserRole } from "@/orval_api/model";
import { ThemeProvider } from "next-themes";
// import { Header } from "@/components/layout/header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { MoviesCollection } from "@/components/movie/movie-page/movies-collection";

import type { PropsWithChildren } from "react";
import type { Session } from "next-auth";

const currentDate = new Date();
currentDate.setMonth(currentDate.getMonth() + 1);
const isoString = currentDate.toISOString();
export const TEST_USER: Session = {
  user: {
    name: "Test User",
    email: "test@email",
    new_movies_to_add_count: 0,
    role: UserRole.owner,
    uuid: "test-uuid",
    my_language: Language.en,
  },
  expires: isoString,
};

/**
 *
 * Auth Provider with User (Private)
 */
export const ProjectProviders = ({ children }: PropsWithChildren) => (
  <ThemeProvider
    attribute="class"
    defaultTheme="light"
    enableSystem
    disableTransitionOnChange
  >
    <NextIntlClientProvider messages={messages} locale="en">
      <SessionProvider session={TEST_USER}>
        <SidebarProvider defaultOpen={false}>{children}</SidebarProvider>
      </SessionProvider>
    </NextIntlClientProvider>
  </ThemeProvider>
);

describe("Should render components with Image (next/image)", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  // For some reason, the image is not loading in the test environment
  vi.mock("next/image", () => ({
    __esModule: true,
    // eslint-disable-next-line
    default: (props: any) => {
      const { src, alt, ...rest } = props;
      // eslint-disable-next-line
      return <img src={src} alt={alt} {...rest} width={50} height={50} />;
    },
  }));

  // test("Should render Header", () => {
  //   render(<Header />, {
  //     wrapper: ProjectProviders,
  //   });

  //   expect(screen.getByLabelText("project-header")).toBeDefined();
  // });

  test("Should render MoviesCollection", () => {
    render(
      <MoviesCollection
        currentMovieKey="test"
        data={{
          key: "test",
          name: "test",
          description: "test",
          movies: [{ key: "test", title: "test", poster: "test" }],
        }}
        index={0}
        posterUrl="test"
      />,
      {
        wrapper: ProjectProviders,
      },
    );

    expect(screen.getByLabelText("movies-collection")).toBeDefined();
  });
});
