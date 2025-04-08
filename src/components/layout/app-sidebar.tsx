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
} from "@/components/ui/sidebar";
import Link from "next/link";
import { ButtonSwitchServer } from "../button-server";
import { ModeToggle } from "../toggles/theme-toggle";
import { Button } from "../ui/button";
import { PlusCircle } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { auth } from "@/auth";
import { GoogleLogin } from "../google-login";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SignOut } from "../custom/sign-out";

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const session = await auth();

  // if (!session) {
  //   return null;
  // }

  const t = await getTranslations("HomePage");
  const navigationKeys = Object.keys(t.raw("navigation"));

  return (
    <Sidebar {...props} className="dark:border-r-black">
      {!session && (
        <SidebarHeader>
          <GoogleLogin />
        </SidebarHeader>
      )}
      {session?.user.role === "owner" && (
        <SidebarHeader>
          <Link href="/quick-add-movie">
            <Button className="w-full">
              <PlusCircle />
              Quickly add new Movie
            </Button>
          </Link>
        </SidebarHeader>
      )}
      {session && (
        <SidebarHeader className="">
          <Link
            href="/profile"
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
      <SidebarContent className="dark:border-r-[#211979]">
        {/* We create a SidebarGroup for each parent. */}

        <SidebarGroup>
          <SidebarGroupLabel className="text-2xl">Content</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="mb-3">
              {navigationKeys.map((item) => (
                <SidebarMenuItem key={item}>
                  <SidebarMenuButton
                    className="text-xl"
                    asChild
                    closeOnClick
                    size="lg"
                  >
                    <Link href={`/${item}`}>{t(`navigation.${item}`)}</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>

            {session && (
              <>
                <SidebarGroupLabel className="text-xl">
                  Features
                </SidebarGroupLabel>
                <div className="flex flex-col gap-3">
                  <Link href="/dashboard">Dashboard</Link>
                </div>

                <div className="flex flex-col gap-3">
                  <Link href="/settings">Settings</Link>
                </div>
              </>
            )}
            {/* <div className="flex flex-col gap-3">
              <Link href="/profile">Profile</Link>
            </div> */}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center justify-between">
          <ButtonSwitchServer />
          <ModeToggle />
        </div>
        {session && (
          <SignOut />
          // <NavUser
          //   user={{
          //     name: session.user.name ?? "User",
          //     email: session.user.email ?? "example@com",
          //     avatar: session.user.image ?? "",
          //   }}
          // />
        )}
        <span>version: 1.0.0</span>
      </SidebarFooter>
      {/* <SidebarRail /> */}
    </Sidebar>
  );
}
