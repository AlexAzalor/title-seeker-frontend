// "use client";

import { useTranslations } from "next-intl";
import { GlobeIcon, HomeIcon, WalletIcon } from "lucide-react";
import { TooltipWrapper } from "@/components/my-custom-ui/tooltip-wrapper";

type Props = {
  budget: string;
  domesticGross: string;
  worldwideGross: string;
};

export const MovieMoney = ({
  budget,
  domesticGross,
  worldwideGross,
}: Props) => {
  const t = useTranslations("MovieParts.boxOffice");

  return (
    <div className="flex flex-col text-lg lg:justify-self-start">
      <TooltipWrapper className="max-w-80" content={t("budget")}>
        <div className="flex items-center gap-1">
          <WalletIcon size={24} />
          <span className="movie-money text-xl">{budget}</span>
        </div>
      </TooltipWrapper>

      <TooltipWrapper className="max-w-80" content={t("domesticGross")}>
        <div className="flex items-center gap-1">
          <HomeIcon size={24} />
          <span className="movie-money text-xl">{domesticGross}</span>
        </div>
      </TooltipWrapper>

      <TooltipWrapper className="max-w-80" content={t("worldwideGross")}>
        <div className="flex items-center gap-1">
          <GlobeIcon size={24} />
          <span className="movie-money text-xl">{worldwideGross}</span>
        </div>
      </TooltipWrapper>
    </div>
  );
};
