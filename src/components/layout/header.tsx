import { useTranslations } from "next-intl";
import Link from "next/link";
import { ButtonSwitchServer } from "../button-server";
import { ModeToggle } from "../toggles/theme-toggle";
import { Button } from "../ui/button";
import { PlusCircle } from "lucide-react";
import { Search } from "../search";
import { POSTER_URL } from "@/lib/constants";
import { SidebarTrigger } from "../ui/sidebar";

// import { LanguageSwitcher } from "./LanguageSwitcher";
// import { ModeToggle } from "./ModeToggle";
// import { SideMenuPanel } from "./SideMenuPanel";

export const Header = () => {
  const t = useTranslations("HomePage");
  const navigationKeys = Object.keys(t.raw("navigation"));

  return (
    <header className="flex items-center justify-between bg-[#77c9fb] px-[16px] py-4 shadow-sm shadow-gray-200 sm:px-[40px] lg:px-[160px]">
      <div>
        <Link href="/">Logo</Link>
      </div>

      <nav className="hidden items-center justify-center lg:flex">
        <ul className="flex items-center space-x-5">
          {navigationKeys.map((key) => (
            <li key={key}>
              <Link href={`/${key}`}>{t(`navigation.${key}`)}</Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="hidden lg:block">
        <ButtonSwitchServer />
      </div>

      <div className="flex flex-col items-center">
        <Search posterURL={POSTER_URL ?? "NO POSTER"} />
      </div>

      <div className="hidden lg:block">
        <ModeToggle />
      </div>
      <SidebarTrigger />
      {/* <div className="flex items-center gap-2">
        <LanguageSwitcher />

        <ModeToggle />
      </div>

      <SideMenuPanel /> */}

      <Link href="/add-movie" className="hidden lg:block">
        <Button>
          <PlusCircle />
          Add Movie
        </Button>
      </Link>

      <Link href="/quick-add-movie" className="hidden lg:block">
        <Button>
          <PlusCircle />
          Quickly add Movie
        </Button>
      </Link>
      <div className="hidden lg:block">
        <Link href="/dashboard">Dashboard</Link>
      </div>
      <div className="hidden lg:block">
        <Link href="/login">Login</Link>
      </div>
    </header>
  );
};
