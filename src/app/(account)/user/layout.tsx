import Link from "next/link";

import { useTranslations } from "next-intl";
import { AdminPanel } from "@/components/profile/admin/admin-panel";
import { RoleGate } from "@/components/providers/role-gate";
import { Separator } from "@/components/ui/separator";
import { ADMINS_ROLES } from "@/lib/utils";
import {
  getMenuItems,
  OTHER_ITEMS,
  USER_ITEMS,
} from "@/components/layout/sidebar/menu-item-collection";

export default function Layout({ children }: { children: React.ReactNode }) {
  const t = useTranslations("MenuItems");
  const menuItems = getMenuItems(t, USER_ITEMS);
  const otherItems = getMenuItems(t, OTHER_ITEMS);

  return (
    <div className="flex min-h-screen w-full gap-10 p-4 2xl:p-20">
      <div className="shadow-form-layout dark:shadow-dark-form-layout dark:border-dark-border border-light-border hidden max-h-fit w-60 flex-col justify-between rounded-[34px] border p-4 transition-colors duration-300 2xl:flex">
        <div className="grid gap-2">
          {menuItems.map((e) => (
            <Link
              key={e.key}
              href={e.href}
              className="dark:hover:bg-main-dark-hover hover:bg-white-dark relative cursor-pointer rounded-[6px] px-2 py-1 text-lg transition-colors"
            >
              {e.label}
              {e.extraElement}
            </Link>
          ))}
        </div>

        <RoleGate allowedRoles={ADMINS_ROLES}>
          {(session) => <AdminPanel session={session} />}
        </RoleGate>

        <Separator className="my-4" />

        {otherItems.map((e) => (
          <Link
            key={e.key}
            href={e.href}
            className="dark:hover:bg-main-dark-hover hover:bg-white-dark cursor-pointer rounded-[6px] px-2 py-1 text-lg transition-colors"
          >
            {e.label}
          </Link>
        ))}
      </div>

      <div className="flex-1">{children}</div>
    </div>
  );
}
