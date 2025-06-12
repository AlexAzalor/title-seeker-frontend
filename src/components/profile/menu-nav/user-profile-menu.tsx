"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { checkIfAdmin } from "@/middleware";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
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
import { useTranslations } from "next-intl";
import { User as UserType } from "next-auth";
import { UserExtended } from "@/auth";

import { ItemsGroup } from "./items-group";
import {
  ADMIN_ITEMS,
  getMenuItems,
  OTHER_ITEMS,
  USER_ITEMS,
} from "@/components/layout/sidebar/menu-item-collection";
import { UserProfileCard } from "@/components/layout/sidebar/user-link";

type Props = {
  user: UserType & UserExtended;
};

export function UserProfileMenu({ user }: Props) {
  const menu = useTranslations("MenuItems");

  const isAdmin = checkIfAdmin(user.role);

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
                <AvatarImage src={user.image ?? ""} alt={user.name ?? ""} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>

              {!!user.new_movies_to_add_count && (
                <div className="absolute top-0 right-0 size-5 rounded-full bg-red-300 text-center text-sm font-bold dark:text-black">
                  {user.new_movies_to_add_count}
                </div>
              )}
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
              <UserProfileCard
                email={user.email ?? ""}
                image={user.image ?? ""}
                name={user.name ?? ""}
              />
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <ItemsGroup
              showAfterKeys={["profile", "myLists"]}
              items={getMenuItems(menu, USER_ITEMS)}
            />

            {isAdmin && (
              <ItemsGroup
                showAfterKeys={["titleFilters"]}
                items={getMenuItems(menu, ADMIN_ITEMS)}
              />
            )}

            <ItemsGroup
              showAfterKeys={[]}
              items={getMenuItems(menu, OTHER_ITEMS)}
            />

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
