"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

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
