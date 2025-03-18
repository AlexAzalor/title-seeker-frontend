// "use client";
import * as React from "react";

// import { SearchForm } from "@/components/search-form"
// import { VersionSwitcher } from "@/components/version-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { NavUser } from "../nav-user";
import { ButtonSwitchServer } from "../button-server";
import { ModeToggle } from "../toggles/theme-toggle";
import { Button } from "../ui/button";
import { PlusCircle } from "lucide-react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const t = useTranslations("HomePage");

  const navigationKeys = Object.keys(t.raw("navigation"));
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <Link href="/quick-add-movie">
          <Button className="w-full">
            <PlusCircle />
            Quickly add new Movie
          </Button>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}

        <SidebarGroup>
          <SidebarGroupLabel className="text-xl">Content</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="mb-3">
              {navigationKeys.map((item) => (
                <SidebarMenuItem key={item}>
                  <SidebarMenuButton asChild closeOnClick size="lg">
                    <Link className="text-2xl" href={`/${item}`}>
                      {t(`navigation.${item}`)}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>

            <SidebarGroupLabel className="text-xl">Features</SidebarGroupLabel>
            <div className="flex flex-col gap-3">
              <Link href="/dashboard">Dashboard</Link>
            </div>

            <div className="flex flex-col gap-3">
              <Link href="/dashboard">Settings</Link>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center justify-between">
          <ButtonSwitchServer />
          <ModeToggle />
        </div>
        <NavUser
          user={{
            name: "User",
            email: "user@example.com",
            avatar: "/static/avatars/069.jpg",
          }}
        />
        <span>version: 1.0.0</span>
      </SidebarFooter>
      {/* <SidebarRail /> */}
    </Sidebar>
  );
}
