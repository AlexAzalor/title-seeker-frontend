import { GlobeIcon, HomeIcon, WalletIcon } from "lucide-react";
import { TooltipWrapper } from "../custom/tooltip-wrapper";

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
  return (
    <div className="place-self-start self-center text-lg">
      <TooltipWrapper
        asChild
        className="max-w-80"
        content="The total budget of the picture, how much was spent."
      >
        <div className="flex items-center gap-1">
          <WalletIcon size={24} />
          <span className="movie-money text-xl">{budget}</span>
        </div>
      </TooltipWrapper>

      <TooltipWrapper
        asChild
        className="max-w-80"
        content="How much the movie earned in the country where it was filmed. Also, only the studio producer can be considered domestic (a movie can be made in many countries)."
      >
        <div className="flex items-center gap-1">
          <HomeIcon size={24} />
          <span className="movie-money text-xl">{domesticGross}</span>
        </div>
      </TooltipWrapper>

      <TooltipWrapper
        asChild
        className="max-w-80"
        content="How much the movie has earned for all time (or until now) around the world."
      >
        <div className="flex items-center gap-1">
          <GlobeIcon size={24} />
          <span className="movie-money text-xl">{worldwideGross}</span>
        </div>
      </TooltipWrapper>
    </div>
  );
};
