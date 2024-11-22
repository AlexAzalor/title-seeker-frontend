import React from "react";
import { Header } from "./header";
// import Header from "./Header";

export const MainLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <>
                     <Header />

        <div className="mx-auto grid max-w-[1280px] place-content-center">
        {children}
      </div>

      <div className="grid h-20 place-content-center bg-black">Footer</div>
    </>
  );
};
