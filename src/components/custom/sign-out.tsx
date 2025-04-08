"use client";

import { LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { signOut } from "next-auth/react";

type Props = {
  name: string;
};

export const SignOut = ({ name }: Props) => {
  return (
    <Button variant="outline" onClick={() => signOut({ redirectTo: "/" })}>
      <LogOut />
      {name}
    </Button>
  );
};
