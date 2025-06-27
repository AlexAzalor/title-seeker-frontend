import { POSTER_URL } from "@/lib/constants";
import { Header } from "@/components/layout/header";
import { LastSeenTitles } from "@/components/layout/last-watched";
import { Footer } from "./footer";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div id="main-layout" className="mx-auto min-h-screen w-full">
      <Header />

      <div className="mx-auto grid place-items-center">{children}</div>

      <LastSeenTitles posterURL={POSTER_URL || "NO URL!"} />

      <Footer />
    </div>
  );
};
