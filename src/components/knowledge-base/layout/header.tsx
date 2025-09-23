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
        <div onClick={() => signOut({ redirectTo: "/knowledge-base" })}>
          Logged in!
        </div>
      )}
    </div>
  );
};
