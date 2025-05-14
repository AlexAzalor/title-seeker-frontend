import Link from "next/link";

import { SortBy, SortOrder } from "@/orval_api/model";
import { AdminSidebarNav } from "@/components/profile/admin/admin-sidebar-nav";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/lib/constants";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full gap-10 p-4 2xl:p-20">
      <div className="shadow-form-layout dark:shadow-dark-form-layout dark:border-dark-border border-light-border hidden max-h-120 w-60 flex-col justify-between rounded-[34px] border p-4 transition-colors duration-300 2xl:flex">
        <ul className="grid gap-2">
          <Link
            href="/user/profile"
            className="dark:hover:bg-main-dark-hover hover:bg-white-dark cursor-pointer rounded-[6px] px-2 py-1 text-lg transition-colors"
          >
            Profile
          </Link>
          <Link
            href="/user/dashboard"
            className="dark:hover:bg-main-dark-hover hover:bg-white-dark cursor-pointer rounded-[6px] px-2 py-1 text-lg transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href={{
              pathname: "/user/my-lists",
              query: {
                sort_by: SortBy.rated_at,
                sort_order: SortOrder.desc,
                page: DEFAULT_PAGE,
                size: DEFAULT_PAGE_SIZE,
              },
            }}
            className="dark:hover:bg-main-dark-hover hover:bg-white-dark cursor-pointer rounded-[6px] px-2 py-1 text-lg transition-colors"
          >
            My lists
          </Link>
        </ul>

        <AdminSidebarNav />

        <Link
          href="/user/settings"
          className="dark:hover:bg-main-dark-hover hover:bg-white-dark cursor-pointer rounded-[6px] px-2 py-1 text-lg transition-colors"
        >
          Settings
        </Link>
      </div>

      <div className="flex-1">{children}</div>
    </div>
  );
}
