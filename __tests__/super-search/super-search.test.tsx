import { beforeEach, expect, test, describe, Mock } from "vitest";
import { render, screen } from "@testing-library/react";
import { useSearchParams } from "next/navigation";
import type { PropsWithChildren } from "react";

import { ThemeProvider } from "next-themes";
import { NextIntlClientProvider } from "next-intl";
import { ResizablePanelGroup } from "@/components/ui/resizable";
import messages from "../../messages/en.json";

import { EnhanceSearch } from "@/components/super-search/enhance-search";
import { SelectedFilters } from "@/components/super-search/selected-filters";
import { FilterList } from "@/components/super-search/filter-list";
import { FilterBrick } from "@/components/super-search/filter-brick";
import { HoverBrick } from "@/components/super-search/hover-brick";
import { SideMenuPanel } from "@/components/super-search/side-menu-panel";
import { SessionProvider } from "next-auth/react";

const ProjectProviders = ({ children }: PropsWithChildren) => (
  <ThemeProvider
    attribute="class"
    defaultTheme="light"
    enableSystem
    disableTransitionOnChange
  >
    <NextIntlClientProvider messages={messages} locale="en">
      <SessionProvider session={null}>
        <ResizablePanelGroup
          direction="vertical"
          className="rounded-lg p-4"
          autoSaveId="super-search"
        >
          {" "}
          {children}
        </ResizablePanelGroup>
      </SessionProvider>
    </NextIntlClientProvider>
  </ThemeProvider>
);

test("Should render FilterBrick", () => {
  render(
    <FilterBrick
      data={[
        {
          key: "test",
          name: "test",
          description: "test",
          parent_genre_key: "test",
        },
      ]}
      deleteItem={() => {}}
      searchParamsList={["test"]}
      type="test"
      onMouseEnter={() => {}}
      onMouseLeave={() => {}}
    />,
    {
      wrapper: ProjectProviders,
    },
  );

  expect(screen.getByLabelText("filter-brick")).toBeDefined();
});

test("Should render HoverBrick", () => {
  render(
    <HoverBrick
      genreItemsList={["test"]}
      subgenreItemsList={["test"]}
      genres={[
        {
          key: "test-genre",
          name: "test GENRE",
          description: "test",
          subgenres: [],
        },
      ]}
      subgenres={[
        {
          key: "test",
          name: "test SUBGENRE",
          description: "test",
          parent_genre_key: "test-genre",
        },
      ]}
      deleteSearchParam={() => {}}
    />,
    {
      wrapper: ProjectProviders,
    },
  );

  expect(screen.getByLabelText("hover-brick")).toBeDefined();
});

test("Should render SideMenuPanel", () => {
  const content = "test-side-menu-panel";
  render(
    <SideMenuPanel side="left" type={content} handleOnly>
      <h1>Test children content</h1>
    </SideMenuPanel>,
    {
      wrapper: ProjectProviders,
    },
  );

  expect(screen.getByText(content)).toBeDefined();
});

describe("Components with search params", () => {
  beforeEach(() => {
    // Mock the return value of useSearchParams
    (useSearchParams as Mock).mockReturnValue({
      getAll: (key: string) => {
        const mockParams: Record<string, string[]> = {
          genres: ["action(10,100)", "drama(20,100)"],
          subgenres: ["superhero(30,100)"],
        };
        return mockParams[key] || [];
      },
      get: (key: string) => {
        const mockParams: Record<string, string> = {
          genres: "action(10,100)",
          subgenres: "superhero(10,100)",
        };
        return mockParams[key] || "";
      },
      toString: () =>
        "genre=action(10,100)&genre=drama(10,100)&subgenre=superhero(10,100)",
    });
  });

  test("Should render renders EnhanceSearch component", () => {
    render(<EnhanceSearch />, {
      wrapper: ProjectProviders,
    });
    expect(screen.getByLabelText("enhance-search")).toBeDefined();
  });

  test("Should render FilterList", () => {
    render(
      <FilterList
        genres={[]}
        specifications={[]}
        keywords={[]}
        action_times={[]}
        actors={[]}
        directors={[]}
        shared_universes={[]}
        visual_profile_categories={[]}
      />,
      {
        wrapper: ProjectProviders,
      },
    );

    expect(screen.getByLabelText("filter-list")).toBeDefined();
  });

  test("Should render SelectedFilters", () => {
    render(
      <SelectedFilters
        genres={[]}
        subgenres={[]}
        specifications={[]}
        keywords={[]}
        action_times={[]}
        actors={[]}
        directors={[]}
        shared_universes={[]}
        visual_profile_categories={[]}
      >
        <h1>Test content</h1>
      </SelectedFilters>,
      {
        wrapper: ProjectProviders,
      },
    );

    expect(screen.getByLabelText("selected-filters")).toBeDefined();
  });
});
