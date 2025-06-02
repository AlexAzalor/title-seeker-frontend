import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { ThemeSelector } from "./theme-selector";
import { Button } from "../ui/button";
import {
  BadgeJapaneseYenIcon,
  FilePlus,
  Film,
  Flower,
  Gamepad2,
  LayoutDashboard,
  NotebookText,
  PlusCircle,
  Settings,
  Tv,
  Users,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { auth } from "@/auth";
import { GoogleLogin } from "./google-login";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SignOut } from "../my-custom-ui/sign-out";
import { LanguageSelector } from "./language-selector";

export const CONTENT_ICONS = {
  movies: <Film />,
  tvseries: <Tv />,
  games: <Gamepad2 />,
  anime: <BadgeJapaneseYenIcon />,
};

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const session = await auth();

  const isOwner = session?.user.role === "owner";

  const t = await getTranslations("HomePage");
  const menu = await getTranslations("MenuItems");

  const navigationKeys: { title: string; path: string }[] = Object.entries(
    t.raw("navigation"),
  ).map(([key, value]) => ({
    title: value as string,
    path: `/${key}`,
  }));

  return (
    <Sidebar {...props} className="p-4 dark:border-r-black">
      {!session && (
        <SidebarHeader className="mt-3">
          <GoogleLogin />
        </SidebarHeader>
      )}
      {isOwner && (
        <SidebarHeader className="mt-3">
          <Link href="/quick-add-movie">
            <Button className="w-full">
              <PlusCircle />
              Quickly add new Movie
            </Button>
          </Link>
        </SidebarHeader>
      )}
      {session && (
        <SidebarHeader className="border-sidebar-border mt-3 border-b">
          <Link
            href="/user/profile"
            className="flex w-full items-center justify-between gap-2"
          >
            <Avatar className="mx-auto h-10 w-10 rounded-lg">
              <AvatarImage
                src={session.user.image ?? ""}
                alt={session.user.name ?? ""}
              />
              <AvatarFallback className="rounded-lg">CN</AvatarFallback>
            </Avatar>

            <div className="grid flex-1 text-left text-sm leading-tight 2xl:hidden">
              <span className="truncate font-semibold">
                {session.user.name}
              </span>
              <span className="truncate text-xs">{session.user.email}</span>
            </div>
          </Link>
        </SidebarHeader>
      )}
      <SidebarContent className="dark:border-r-dark-border">
        {/* We create a SidebarGroup for each parent. */}
        <SidebarGroup>
          <SidebarMenu className="gap-2">
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <p className="font-medium">{"Content"}</p>
              </SidebarMenuButton>

              <SidebarMenuSub className="ml-0 border-l-0 px-1.5">
                {navigationKeys.map((item) => (
                  <SidebarMenuSubItem key={item.title}>
                    <SidebarMenuSubButton asChild>
                      <Link href={item.path} className="">
                        {
                          CONTENT_ICONS[
                            item.path.replace(
                              "/",
                              "",
                            ) as keyof typeof CONTENT_ICONS
                          ]
                        }
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </SidebarMenuItem>

            {!!session?.user && (
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <p className="font-medium">{menu("user")}</p>
                </SidebarMenuButton>

                <SidebarMenuSub className="ml-0 border-l-0 px-1.5">
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <Link
                        href={"/user/" + menu("dashboard.key")}
                        className=""
                      >
                        <LayoutDashboard />
                        <span>{menu("dashboard.label")}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>

                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <Link href={"/user/" + menu("myLists.key")} className="">
                        <NotebookText />
                        <span>{menu("myLists.label")}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>

                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <Link href={"/user/" + menu("settings.key")} className="">
                        <Settings />
                        <span>{menu("settings.label")}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </SidebarMenuItem>
            )}

            {isOwner && (
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <p className="font-medium">{menu("admin")}</p>
                </SidebarMenuButton>

                <SidebarMenuSub className="ml-0 border-l-0 px-1.5">
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <Link
                        href={"/user/" + menu("newMoviesToAdd.key")}
                        className=""
                      >
                        <FilePlus />
                        <span>{menu("newMoviesToAdd.label")}</span>
                      </Link>
                    </SidebarMenuSubButton>

                    {!!session?.user.new_movies_to_add_count && (
                      <div className="absolute top-0 right-0 size-5 rounded-full bg-red-300 text-center text-sm font-bold dark:text-black">
                        {session.user.new_movies_to_add_count}
                      </div>
                    )}
                  </SidebarMenuSubItem>

                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <Link href={"/user/" + menu("allUsers.key")} className="">
                        <Users />
                        <span>{menu("allUsers.label")}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>

                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <Link
                        href={"/user/" + menu("visualProfile.key")}
                        className=""
                      >
                        <Flower />
                        <span>{menu("visualProfile.label")}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center justify-between">
          <LanguageSelector />
          <ThemeSelector />
        </div>
        {session && <SignOut name={menu("logout")} />}
        <span>version: 1.0.0</span>
      </SidebarFooter>
    </Sidebar>
  );
}
