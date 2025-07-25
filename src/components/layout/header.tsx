import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { ALL_ROLES } from "@/middleware";
import { POSTER_URL } from "@/lib/constants";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { RoleGate } from "@/components/providers/role-gate";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Search } from "@/components/layout/search/search";
import { LanguageSelector } from "@/components/layout/language-selector";
import { UserProfileMenu } from "@/components/profile/menu-nav/user-profile-menu";
import { UserRole } from "@/orval_api/model";

export const Header = () => {
  const t = useTranslations("HomePage");
  const navigationKeys = Object.keys(t.raw("navigation"));
  const locale = useLocale();

  return (
    <header
      id="movie"
      aria-label="project-header"
      className="bg-header header-shadow flex items-center justify-between px-4 py-4 shadow-sm shadow-gray-200 sm:px-10 lg:px-40"
    >
      <div className="flex items-center justify-between gap-10">
        <Link
          href="/"
          className="group flex items-center gap-3 transition-all duration-300 ease-in-out hover:scale-105"
        >
          <div className="relative">
            <Image
              src="/static/logo.webp"
              alt="Logo"
              width={50}
              height={50}
              className="rounded-full ring-2 shadow-lg ring-white/30 transition-all duration-300 group-hover:shadow-xl group-hover:ring-white/60"
              priority
              loading="eager"
            />
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
          </div>

          <p className="to-main-dark-hover from-main-dark-bg hidden bg-gradient-to-r bg-clip-text text-xl font-bold text-transparent drop-shadow-sm transition-all duration-300 group-hover:drop-shadow-md lg:block">
            {t("title")}
          </p>
        </Link>

        <nav className="hidden w-70 items-center justify-center 2xl:flex">
          <ul className="flex items-center space-x-5">
            {navigationKeys.map((key) => (
              <li key={key}>
                <Link href={`/${key}`} className="link-style text-black">
                  {t(`navigation.${key}`)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <Search posterURL={POSTER_URL ?? "NO POSTER"} />

      <div className="flex items-center gap-2">
        <RoleGate allowedRoles={[UserRole.owner]}>
          {() => (
            <>
              <Link href="/owner/add-movie" className="hidden lg:block">
                <Button>
                  <PlusCircle />
                  {t("addMovie")}
                </Button>
              </Link>

              <Link href="/owner/quick-add-movie" className="hidden 2xl:block">
                <Button>
                  <PlusCircle />
                  {t("quicklyAddMovie")}
                </Button>
              </Link>
            </>
          )}
        </RoleGate>

        <div className="hidden 2xl:block">
          <LanguageSelector locale={locale} />
        </div>

        <div className="hidden 2xl:block">
          <ThemeToggle />
        </div>

        <div className="hidden 2xl:block">
          <RoleGate allowedRoles={ALL_ROLES} showLogin>
            {(session) => <UserProfileMenu user={session.user} />}
          </RoleGate>
        </div>

        <div className="2xl:hidden">
          <SidebarTrigger />
        </div>
      </div>
    </header>
  );
};
