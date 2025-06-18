import { Header } from "./header";
import { POSTER_URL } from "@/lib/constants";
import { LastSeenTitles } from "./last-watched";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div id="main-layout" className="mx-auto min-h-screen w-full">
      <Header />

      <div className="mx-auto grid place-items-center">{children}</div>

      <LastSeenTitles posterURL={POSTER_URL || "NO URL!"} />

      <footer className="grid h-20 place-content-center bg-black text-white">
        Footer
        <span>Version {process.env.NEXT_PUBLIC_APP_VERSION ?? "0.0.0"}</span>
        <span>Version {process.env.NEXT_PUBLIC_APP_VERSION}</span>
      </footer>
    </div>
  );
};
