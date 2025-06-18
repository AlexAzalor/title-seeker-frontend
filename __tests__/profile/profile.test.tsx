import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { Language } from "@/orval_api/model";

import { AdminPanel } from "@/components/profile/admin/admin-panel";
import { MyMovies } from "@/components/profile/my-lists/my-movies";
import { UserSettings } from "@/components/profile/settings/user-settings";
import { UserInfo } from "@/components/profile/user-info";
import { UserProfileMenu } from "@/components/profile/menu-nav/user-profile-menu";
import { ProjectProviders, TEST_USER } from "../page.test";
import { VisualProfileEditPage } from "@/components/profile/admin/visual-profile/visual-profile";
import { TitleFilterSelector } from "@/components/profile/admin/title-filters/title-filter-selector";

test("Should render AdminSidebarNav", () => {
  render(
    <AdminPanel
      session={{
        expires: "",
        user: {
          my_language: Language.uk,
          uuid: "uuid",
          role: "admin",
          new_movies_to_add_count: 1,
        },
      }}
    />,
    {
      wrapper: ProjectProviders,
    },
  );

  expect(screen.getByLabelText("admin-sidebar-nav")).toBeDefined();
});

test("Should render MyMovies", () => {
  render(<MyMovies movies={[]} />, {
    wrapper: ProjectProviders,
  });
  expect(screen.getByLabelText("my-movies")).toBeDefined();
});

test("Should render UserSettings", () => {
  render(<UserSettings />, {
    wrapper: ProjectProviders,
  });
  expect(screen.getByLabelText("settings")).toBeDefined();
});

test("Should render UserInfo", () => {
  render(
    <UserInfo
      joinedDate={"2023-10-01T00:00:00Z"}
      lang={Language.en}
      user={{
        my_language: Language.uk,
        uuid: "uuid",
        role: "admin",
        new_movies_to_add_count: 1,
      }}
      lastMovieRateDate={"2023-10-01T00:00:00Z"}
      moviesRated={3}
    />,
    {
      wrapper: ProjectProviders,
    },
  );
  expect(screen.getByLabelText("user-info")).toBeDefined();
});

test("Should render UserProfileMenu", () => {
  render(<UserProfileMenu user={TEST_USER.user} />, {
    wrapper: ProjectProviders,
  });
  expect(screen.getByLabelText("user-profile-menu")).toBeDefined();
});

test("Should render VisualProfileEditPage", () => {
  render(<VisualProfileEditPage categories={[]} />, {
    wrapper: ProjectProviders,
  });
  expect(screen.getByLabelText("visual-profile-edit-page")).toBeDefined();
});

test("Should render TitleFilterSelector", () => {
  render(<TitleFilterSelector />, {
    wrapper: ProjectProviders,
  });
  expect(screen.getByLabelText("title-filter-selector")).toBeDefined();
});
