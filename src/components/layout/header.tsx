import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { ALL_ROLES } from "@/middleware";

import { ThemeSelector } from "./theme-selector";
import { Button } from "../ui/button";
import { PlusCircle } from "lucide-react";
import { Search } from "./search/search";
import { POSTER_URL } from "@/lib/constants";
import { SidebarTrigger } from "../ui/sidebar";
import { UserProfileMenu } from "../profile/menu-nav/user-profile-menu";
import { LanguageSelector } from "./language-selector";
import { RoleGate } from "../providers/role-gate";
import { UserRole } from "@/orval_api/model";

export const Header = () => {
  const t = useTranslations("HomePage");
  const navigationKeys = Object.keys(t.raw("navigation"));
  const locale = useLocale();

  return (
    <header
      aria-label="project-header"
      className="bg-header flex items-center justify-between px-[16px] py-4 shadow-sm shadow-gray-200 sm:px-[40px] lg:px-[160px]"
    >
      <div className="flex items-center justify-between gap-10">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.jpg"
            alt="Logo"
            width={50}
            height={50}
            className="rounded-full"
          />

          <p className="logo hidden text-xl font-bold text-black lg:block">
            Title Seeker
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
          <ThemeSelector />
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
