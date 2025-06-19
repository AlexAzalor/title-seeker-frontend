import {
  BadgeJapaneseYenIcon,
  FilePlus,
  FileScan,
  Film,
  Flower,
  Gamepad2,
  LayoutDashboard,
  NotebookText,
  Settings,
  Tv,
  User,
  Users,
} from "lucide-react";
import type { Formats, TranslationValues } from "next-intl";

export const CONTENT_ICONS = {
  movies: <Film />,
  tvseries: <Tv />,
  games: <Gamepad2 />,
  anime: <BadgeJapaneseYenIcon />,
};

export const USER_ITEMS = ["profile", "dashboard", "myLists"];

export const ADMIN_ITEMS = [
  "newMoviesToAdd",
  "allUsers",
  "visualProfile",
  "titleFilters",
];

export const OTHER_ITEMS = ["settings"];

export function getMenuItems(
  menu: (key: string, values?: TranslationValues, formats?: Formats) => string,
  selectItems: string[] = [],
  moviesCount?: number,
) {
  const items = [
    {
      key: "profile",
      href: "/account/user/" + menu("profile.key"),
      icon: <User />,
      label: menu("profile.label"),
    },
    {
      key: "dashboard",
      href: "/account/user/" + menu("dashboard.key"),
      icon: <LayoutDashboard />,
      label: menu("dashboard.label"),
    },
    {
      key: "myLists",
      href: "/account/user/" + menu("myLists.key"),
      icon: <NotebookText />,
      label: menu("myLists.label"),
    },
    {
      key: "settings",
      href: "/account/user/" + menu("settings.key"),
      icon: <Settings />,
      label: menu("settings.label"),
    },

    ////////// Admin items //////////

    {
      key: "newMoviesToAdd",
      href: "/account/admin/" + menu("newMoviesToAdd.key"),
      icon: <FilePlus />,
      label: menu("newMoviesToAdd.label"),
      extraElement: !!moviesCount ? (
        <div className="absolute top-[20%] right-1 size-5 rounded-full bg-red-300 text-center text-sm font-bold dark:text-black">
          {moviesCount}
        </div>
      ) : null,
    },
    {
      key: "allUsers",
      href: "/account/admin/" + menu("allUsers.key"),
      icon: <Users />,
      label: menu("allUsers.label"),
    },
    {
      key: "visualProfile",
      href: "/account/admin/" + menu("visualProfile.key"),
      icon: <Flower />,
      label: menu("visualProfile.label"),
    },
    {
      key: "titleFilters",
      href: "/account/admin/" + menu("titleFilters.key"),
      icon: <FileScan />,
      label: menu("titleFilters.label"),
    },
  ];

  return items.filter((e) => selectItems.includes(e.key));
}
