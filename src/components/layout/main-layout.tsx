import React from "react";
import { Header } from "./header";
// import Header from "./Header";

export const MainLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="mx-auto min-h-screen w-full">
      <Header />

      <div className="mx-auto grid place-items-center">{children}</div>

      <footer className="grid h-20 place-content-center bg-black">
        Footer
      </footer>
    </div>
  );
};
