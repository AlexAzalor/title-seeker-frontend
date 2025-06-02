"use client";

import { signOut } from "next-auth/react";
import {
  ChevronsUpDown,
  FilePlus,
  Flower,
  LayoutDashboard,
  LogOut,
  NotebookText,
  Settings,
  User,
  Users,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { User as UserType } from "next-auth";
import { UserExtended } from "@/auth";

import { SortBy, SortOrder } from "@/orval_api/model";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/lib/constants";

type Props = {
  user: UserType & UserExtended;
};

export function UserProfileMenu({ user }: Props) {
  const menu = useTranslations("MenuItems");

  return (
    <SidebarMenu aria-label="user-profile-menu">
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground transition-colors hover:bg-gray-100/40 active:bg-gray-100/40"
            >
              <Avatar className="mx-auto h-10 w-10 rounded-lg">
                <AvatarImage
                  src={user.image || ""}
                  alt={user.name || "Avatar"}
                />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>

              {!!user.new_movies_to_add_count && (
                <div className="absolute top-0 right-0 size-5 rounded-full bg-red-300 text-center text-sm font-bold dark:text-black">
                  {user.new_movies_to_add_count}
                </div>
              )}

              <div className="grid flex-1 text-left text-sm leading-tight 2xl:hidden">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="size-4 2xl:hidden" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            // side={isMobile ? "bottom" : "right"}
            side="bottom"
            align="center"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={user.image || ""}
                    alt={user.name || "Avatar"}
                  />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href={"/user/" + menu("profile.key")}>
                  <User />
                  {menu("profile.label")}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href={"/user/" + menu("dashboard.key")}>
                  <LayoutDashboard />
                  {menu("dashboard.label")}
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild className="cursor-pointer">
                <Link
                  href={{
                    pathname: "/user/" + menu("myLists.key"),
                    query: {
                      sort_by: SortBy.rated_at,
                      sort_order: SortOrder.desc,
                      page: DEFAULT_PAGE,
                      size: DEFAULT_PAGE_SIZE,
                    },
                  }}
                >
                  <NotebookText />
                  {menu("myLists.label")}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            {user.role === "owner" && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href={"/user/" + menu("newMoviesToAdd.key")}>
                      <FilePlus />
                      {menu("newMoviesToAdd.label")}
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href={"/user/" + menu("allUsers.key")}>
                      <Users />
                      {menu("allUsers.label")}
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href={"/user/" + menu("visualProfile.key")}>
                      <Flower />
                      {menu("visualProfile.label")}
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </>
            )}

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href={"/user/" + menu("settings.key")}>
                  <Settings />
                  {menu("settings.label")}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => signOut({ redirectTo: "/" })}
            >
              <LogOut />
              {menu("logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
