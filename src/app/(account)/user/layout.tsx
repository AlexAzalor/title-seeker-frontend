import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full gap-10 p-4 2xl:p-20">
      <div className="shadow-form-layout dark:shadow-dark-form-layout hidden max-h-120 w-60 flex-col justify-between rounded-[34px] border border-[#EFF0F7] p-4 transition-colors duration-300 2xl:flex dark:border-[#211979]">
        <ul className="grid gap-2">
          <Link
            href="/user/profile"
            className="cursor-pointer rounded-[6px] px-2 py-1 text-lg transition-colors hover:bg-[#f5f5f5]"
          >
            Profile
          </Link>
          <Link
            href="/user/dashboard"
            className="cursor-pointer rounded-[6px] px-2 py-1 text-lg transition-colors hover:bg-[#f5f5f5]"
          >
            Dashboard
          </Link>
          <Link
            href="/user/my-lists"
            className="cursor-pointer rounded-[6px] px-2 py-1 text-lg transition-colors hover:bg-[#f5f5f5]"
          >
            My lists
          </Link>
        </ul>

        <ul>
          <li className="cursor-pointer rounded-[6px] px-2 py-1 text-lg transition-colors hover:bg-[#f5f5f5]">
            Movies to add
          </li>
          <li className="cursor-pointer rounded-[6px] px-2 py-1 text-lg transition-colors hover:bg-[#f5f5f5]">
            All users
          </li>
          <li className="cursor-pointer rounded-[6px] px-2 py-1 text-lg transition-colors hover:bg-[#f5f5f5]">
            History of rated movies
          </li>
        </ul>

        <Link
          href="/user/settings"
          className="cursor-pointer rounded-[6px] px-2 py-1 text-lg transition-colors hover:bg-[#f5f5f5]"
        >
          Settings
        </Link>

        {/* <li className="text-danger cursor-pointer rounded-[6px] px-2 py-1 text-lg transition-colors hover:bg-[#f5f5f5]">
            Delete account
          </li> */}
      </div>

      <div className="flex-1">{children}</div>
    </div>
  );
}
