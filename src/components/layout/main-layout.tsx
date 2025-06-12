import React from "react";
import { Header } from "./header";
import { LastSeenTitles } from "./last-watched";
import { POSTER_URL } from "@/lib/constants";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div id="main-layout" className="mx-auto min-h-screen w-full">
      <Header />

      <div className="mx-auto grid place-items-center">{children}</div>

      <LastSeenTitles posterURL={POSTER_URL || "NO URL!"} />

      <footer className="grid h-20 place-content-center bg-black text-white">
        Footer
        <span>Version {process.env.npm_package_version ?? "0.0.0"}</span>
      </footer>
    </div>
  );
};
