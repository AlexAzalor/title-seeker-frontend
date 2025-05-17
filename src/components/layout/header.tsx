import { Session } from "next-auth";
import Image from "next/image";
import { useTranslations } from "next-intl";
import Link from "next/link";

import { ThemeSelector } from "./theme-selector";
import { Button } from "../ui/button";
import { PlusCircle } from "lucide-react";
import { Search } from "./search";
import { POSTER_URL } from "@/lib/constants";
import { SidebarTrigger } from "../ui/sidebar";
import { GoogleLogin } from "./google-login";
import { UserProfileMenu } from "../profile/user-profile-menu";
import { LanguageSelector } from "./language-selector";

type Props = {
  session: Session | null;
};

export const Header = ({ session }: Props) => {
  const t = useTranslations("HomePage");
  const navigationKeys = Object.keys(t.raw("navigation"));

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

          <p className="logo hidden text-xl font-bold text-white lg:block">
            Title Seeker
          </p>
        </Link>

        <nav className="hidden w-70 items-center justify-center 2xl:flex">
          <ul className="flex items-center space-x-5">
            {navigationKeys.map((key) => (
              <li key={key}>
                <Link href={`/${key}`} className="text-white">
                  {t(`navigation.${key}`)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <Search posterURL={POSTER_URL ?? "NO POSTER"} />

      <div className="flex items-center gap-2">
        {session?.user.role === "owner" && (
          <>
            <Link href="/add-movie" className="hidden lg:block">
              <Button>
                <PlusCircle />
                {t("addMovie")}
              </Button>
            </Link>

            <Link href="/quick-add-movie" className="hidden 2xl:block">
              <Button>
                <PlusCircle />
                {t("quicklyAddMovie")}
              </Button>
            </Link>
          </>
        )}

        <div className="hidden 2xl:block">
          <LanguageSelector />
        </div>

        <div className="hidden 2xl:block">
          <ThemeSelector />
        </div>
        {!session && (
          <div className="hidden 2xl:block">{!session && <GoogleLogin />}</div>
        )}

        <div className="hidden 2xl:block">
          {session?.user && <UserProfileMenu user={session.user} />}
        </div>

        <div className="2xl:hidden">
          <SidebarTrigger />
        </div>
      </div>
    </header>
  );
};
