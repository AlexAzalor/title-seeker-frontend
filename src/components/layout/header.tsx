import { useTranslations } from "next-intl";
import Link from "next/link";
import { ButtonSwitchServer } from "../button-server";
import { ModeToggle } from "../toggles/theme-toggle";
import { Button } from "../ui/button";
import { PlusCircle } from "lucide-react";

// import { LanguageSwitcher } from "./LanguageSwitcher";
// import { ModeToggle } from "./ModeToggle";
// import { SideMenuPanel } from "./SideMenuPanel";

export const Header = () => {
  const t = useTranslations("HomePage");
  const navigationKeys = Object.keys(t.raw("navigation"));

  return (
    <header className="flex items-center justify-between bg-[#77c9fb] px-[16px] py-4 shadow shadow-gray-200 sm:px-[40px] lg:px-[160px]">
      <div>
        <Link href="/">Logo</Link>
      </div>

      <div className="flex flex-col items-center">
        <input className="bg-white px-1 text-black" type="text" />
        <Link className="text-xs" href="/super-search">
          Extendet search
        </Link>
      </div>

      <nav className="hidden items-center justify-center sm:flex">
        <ul className="flex items-center space-x-5">
          {navigationKeys.map((key) => (
            <li key={key}>
              <Link href={`/${key}`}>{t(`navigation.${key}`)}</Link>
            </li>
          ))}
        </ul>
      </nav>

      <ButtonSwitchServer />

      <ModeToggle />

      {/* <div className="flex items-center gap-2">
        <LanguageSwitcher />

        <ModeToggle />
      </div>

      <SideMenuPanel /> */}

      <Link href="/add-movie">
        <Button>
          <PlusCircle />
          Add Movie
        </Button>
      </Link>
      <div>
        <Link href="/dashboard">Dashboard</Link>
      </div>
      <div>
        <Link href="/login">Login</Link>
      </div>
    </header>
  );
};
