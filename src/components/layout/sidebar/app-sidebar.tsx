import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { auth } from "@/auth";
import { PlusCircle } from "lucide-react";
import { checkIfAdmin, checkIfOwner } from "@/middleware";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

import {
  ADMIN_ITEMS,
  CONTENT_ICONS,
  getMenuItems,
  OTHER_ITEMS,
  PUBLIC_ITEMS,
  USER_ITEMS,
} from "@/components/layout/sidebar/menu-item-collection";
import { ThemeSelector } from "@/components/layout/theme-selector";
import { GoogleLogin } from "@/components/layout//google-login";
import { SignOut } from "@/components/my-custom-ui/sign-out";
import { LanguageSelector } from "@/components/layout/language-selector";
import {
  type MenuItem,
  SidebarNavMenuGroup,
} from "@/components/layout/sidebar/sidebar-nav-menu-group";
import { UserProfileCard } from "@/components/layout/sidebar/user-link";

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  locale: string;
};

async function AppSidebar({ locale, ...props }: AppSidebarProps) {
  const session = await auth();

  const isAdmin = checkIfAdmin(session?.user.role);
  const isOwner = checkIfOwner(session?.user.role);

  const t = await getTranslations("HomePage");
  const menu = await getTranslations("MenuItems");

  const navigationKeys: MenuItem[] = Object.entries(t.raw("navigation")).map(
    ([key, value]) => ({
      label: value as string,
      href: `/${key}`,
      icon: CONTENT_ICONS[key as keyof typeof CONTENT_ICONS],
      key,
    }),
  );

  return (
    <Sidebar {...props} className="dark:border-r-black">
      {session ? (
        <SidebarHeader className="border-sidebar-border mt-3 border-b">
          {isOwner && (
            <Link href="/account/admin/quick-add-movie" className="mb-2">
              <Button className="w-full">
                <PlusCircle />
                Quickly add new Movie
              </Button>
            </Link>
          )}

          <SidebarMenuButton>
            <Link href="/account/user/profile">
              <UserProfileCard
                name={session.user.name ?? ""}
                image={session.user.image ?? ""}
                email={session.user.email ?? ""}
              />
            </Link>
          </SidebarMenuButton>
        </SidebarHeader>
      ) : (
        <SidebarHeader className="mt-3">
          <GoogleLogin />
        </SidebarHeader>
      )}

      <SidebarContent className="dark:border-r-dark-border">
        <SidebarGroup>
          <SidebarMenu className="gap-2">
            <SidebarNavMenuGroup
              title={menu("content")}
              items={navigationKeys}
            />

            {session && (
              <SidebarNavMenuGroup
                title={menu("user")}
                items={getMenuItems(menu, [
                  ...USER_ITEMS,
                  ...PUBLIC_ITEMS,
                  ...OTHER_ITEMS,
                ])}
              />
            )}

            {isAdmin && (
              <SidebarNavMenuGroup
                title={menu("admin")}
                items={getMenuItems(
                  menu,
                  ADMIN_ITEMS,
                  session?.user.new_movies_to_add_count,
                )}
              />
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center justify-between">
          <LanguageSelector locale={locale} />
          <ThemeSelector />
        </div>
        {session && <SignOut name={menu("logout")} />}
        <span>Version {process.env.NEXT_PUBLIC_APP_VERSION}</span>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
