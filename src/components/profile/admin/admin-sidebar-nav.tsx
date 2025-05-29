"use client";

import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Link from "next/link";

export const AdminSidebarNav = () => {
  const session = useSession();
  const t = useTranslations("MenuItems");

  if (!session.data?.user || session.data.user.role !== "owner") {
    return null;
  }
  const moviesCount = session.data.user.new_movies_to_add_count;
  return (
    <div className="grid gap-2" aria-label="admin-sidebar-nav">
      <Link
        href="/user/new-movies-to-add"
        className="dark:hover:bg-main-dark-hover hover:bg-white-dark relative cursor-pointer rounded-[6px] px-2 py-1 text-lg transition-colors"
      >
        <span>{t("newMoviesToAdd.label")}</span>
        {!!moviesCount && (
          <div className="absolute top-[25%] right-1 size-5 rounded-full bg-red-200 text-center text-sm font-bold dark:text-black">
            {moviesCount}
          </div>
        )}
      </Link>

      <Link
        href="/user/all-users"
        className="dark:hover:bg-main-dark-hover hover:bg-white-dark cursor-pointer rounded-[6px] px-2 py-1 text-lg transition-colors"
      >
        {t("allUsers.label")}
      </Link>

      <Link
        href="/user/visual-profile"
        className="dark:hover:bg-main-dark-hover hover:bg-white-dark cursor-pointer rounded-[6px] px-2 py-1 text-lg transition-colors"
      >
        Visual Profile
      </Link>
    </div>
  );
};
