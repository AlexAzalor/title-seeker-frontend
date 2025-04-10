"use client";

import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export const UserInfo = () => {
  const session = useSession();
  const user = session?.data?.user;
  if (!user) {
    return null;
  }

  return (
    <div className="grid gap-2 p-4">
      <div className="flex flex-col gap-4">
        <Avatar className="mx-auto h-20 w-20 rounded-full">
          <AvatarImage src={user.image ?? ""} alt={user.name ?? ""} />
          <AvatarFallback className="rounded-lg">CN</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-lg font-bold">{user.name}</p>
          <p>{user.email}</p>
          <p>{"created acc date"}</p>
        </div>
      </div>

      <div>
        <p>Movies rated: {12}</p>
        <p>Last movie rate date: {"2025"}</p>
      </div>

      <div>
        <p>Last 5 movies</p>
      </div>
    </div>
  );
};
