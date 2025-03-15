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
import { VersionSwitcher } from "../version-switcher";
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
        <VersionSwitcher versions={["1", "2", "3"]} defaultVersion="1" />
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}

        <SidebarGroup>
          <SidebarGroupLabel>Content</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationKeys.map((item) => (
                <SidebarMenuItem key={item}>
                  <SidebarMenuButton asChild>
                    <Link href={`/${item}`}>{t(`navigation.${item}`)}</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>

            <div className="flex flex-col gap-3">
              <ButtonSwitchServer />
              <ModeToggle />
              <Link href="/add-movie" className="">
                <Button>
                  <PlusCircle />
                  Add Movie
                </Button>
              </Link>

              <Link href="/quick-add-movie" className="">
                <Button>
                  <PlusCircle />
                  Quickly add Movie
                </Button>
              </Link>

              <div className="">
                <Link href="/dashboard">Dashboard</Link>
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <NavUser
          user={{
            name: "shadcn",
            email: "m@example.com",
            avatar: "/static/avatars/069.jpg",
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
