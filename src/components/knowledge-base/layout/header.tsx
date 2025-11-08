"use client";

import { signOut } from "next-auth/react";
import { GoogleLogin } from "@/components/layout/google-login";
import type { Session } from "next-auth";

type Props = {
  session: Session | null;
};
export const Header = ({ session }: Props) => {
  return (
    <div>
      {!session ? (
        <GoogleLogin />
      ) : (
        <div
          className="cursor-pointer text-blue-500 hover:underline"
          onClick={() => signOut({ redirectTo: "/knowledge-base" })}
        >
          Sign out
        </div>
      )}
    </div>
  );
};
