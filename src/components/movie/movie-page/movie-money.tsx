"use client";

import { useTranslations } from "next-intl";
import { GlobeIcon, HomeIcon, WalletIcon } from "lucide-react";
import { TooltipWrapper } from "@/components/my-custom-ui/tooltip-wrapper";
import { checkIfAdmin } from "@/proxy";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import CustomModal from "@/components/my-custom-ui/custom-modal";
import { useModal } from "@/hooks/use-modal";
import { EditMovieBoxOffice } from "./edit/movie-box-office";

type Props = {
  movieKey: string;
  budget: string;
  domesticGross?: string;
  worldwideGross?: string;
};

export const MovieMoney = ({
  movieKey,
  budget,
  domesticGross,
  worldwideGross,
}: Props) => {
  const t = useTranslations("MovieParts.boxOffice");
  const session = useSession();
  const { isOpen, open, close } = useModal();

  return (
    <>
      <div className="flex flex-col text-lg xl:justify-self-start">
        {checkIfAdmin(session.data?.user.role) && (
          <Button variant="link" className="h-7 p-0" onClick={open}>
            Edit
          </Button>
        )}
        <TooltipWrapper className="max-w-80" content={t("budget")}>
          <div className="flex items-center gap-1">
            <WalletIcon size={24} />
            <span className="movie-money text-xl">{budget}</span>
          </div>
        </TooltipWrapper>

        {domesticGross && (
          <TooltipWrapper className="max-w-80" content={t("domesticGross")}>
            <div className="flex items-center gap-1">
              <HomeIcon size={24} />
              <span className="movie-money text-xl">{domesticGross}</span>
            </div>
          </TooltipWrapper>
        )}

        {worldwideGross && (
          <TooltipWrapper className="max-w-80" content={t("worldwideGross")}>
            <div className="flex items-center gap-1">
              <GlobeIcon size={24} />
              <span className="movie-money text-xl">{worldwideGross}</span>
            </div>
          </TooltipWrapper>
        )}
      </div>

      {isOpen && (
        <CustomModal isOpen={isOpen} onClose={close}>
          <EditMovieBoxOffice
            movieKey={movieKey}
            boxOfficeData={{ budget, domesticGross, worldwideGross }}
          />
        </CustomModal>
      )}
    </>
  );
};
