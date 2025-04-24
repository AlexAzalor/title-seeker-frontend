"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

export const AdminSidebarNav = () => {
  const session = useSession();

  if (!session.data?.user || session.data.user.role !== "owner") {
    return null;
  }
  const moviesCount = session.data.user.new_movies_to_add_count;
  return (
    <div className="grid gap-2">
      <Link
        href="/user/new-movies-to-add"
        className="relative cursor-pointer rounded-[6px] px-2 py-1 text-lg transition-colors hover:bg-[#f5f5f5] dark:hover:bg-[#1A183D]"
      >
        <span>New Movies to add</span>
        {!!moviesCount && (
          <div className="absolute top-[25%] right-1 size-5 rounded-full bg-red-200 text-center text-sm font-bold dark:text-black">
            {moviesCount}
          </div>
        )}
      </Link>

      <Link
        href="/user/all-users"
        className="cursor-pointer rounded-[6px] px-2 py-1 text-lg transition-colors hover:bg-[#f5f5f5] dark:hover:bg-[#1A183D]"
      >
        Users list
      </Link>
    </div>
  );
};
