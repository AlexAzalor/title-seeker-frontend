"use client";

import { LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { signOut } from "next-auth/react";

export const SignOut = () => {
  return (
    <Button variant="outline" onClick={() => signOut({ redirectTo: "/" })}>
      <LogOut />
      Log out
    </Button>
  );
};
