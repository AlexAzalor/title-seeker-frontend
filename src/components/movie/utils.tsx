import { cn } from "@/lib/utils";
import { COLORS } from "@/lib/colors";
import { FilterEnum } from "@/orval_api/model";

/**
 *
Renders the color of the match percentage for movie filters (genres, keywords...)
 */
export const percentageMatchColor = (percentage: number, text: string) => {
  return (
    <div>
      <div
        className={cn(
          "ml-auto grid size-10 place-items-center rounded-full bg-transparent text-center font-bold text-black",
          percentage < 25 && "shadow-danger bg-danger",
          percentage >= 25 &&
            percentage < 50 &&
            "bg-warning shadow-2xl shadow-orange-300",
          percentage >= 50 && percentage < 75 && "bg-blue-400",
          percentage >= 75 && "shadow-success bg-success",
        )}
      >
        <p>{percentage}%</p>
      </div>
      {text}
    </div>
  );
};

export const getFilterColor = (type: string) =>
  ({
    [FilterEnum.genre]: COLORS.genre,
    [FilterEnum.subgenre]: COLORS.subgenre,
    [FilterEnum.specification]: COLORS.specification,
    [FilterEnum.keyword]: COLORS.keyword,
    [FilterEnum.action_time]: COLORS.actionTime,
    [FilterEnum.actor]: COLORS.actor,
    [FilterEnum.director]: COLORS.director,
    [FilterEnum.character]: COLORS.character,
    [FilterEnum.shared_universe]: COLORS.sharedUniverse,
    [FilterEnum.visual_profile]: COLORS.visualProfile,
  })[type] || "#000";
