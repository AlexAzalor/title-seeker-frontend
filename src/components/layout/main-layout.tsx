import React from "react";
import { Header } from "./header";
import { auth } from "@/auth";
import { LastWatched } from "../movie/last-watched";
import { POSTER_URL } from "@/lib/constants";
// import Header from "./Header";

export const MainLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const session = await auth();

  return (
    <div id="main-layout" className="mx-auto min-h-screen w-full">
      <Header session={session} />

      <div className="mx-auto grid place-items-center">{children}</div>

      <div className="mx-auto my-2 max-w-[1280px] text-center">
        <LastWatched posterURL={POSTER_URL || "NO URL!"} />
      </div>

      <footer className="grid h-20 place-content-center bg-black">
        Footer
        <span>version: 1.0.0</span>
      </footer>
    </div>
  );
};
