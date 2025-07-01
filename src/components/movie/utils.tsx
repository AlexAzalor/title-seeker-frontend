import { cn } from "@/lib/utils";
import { COLORS } from "@/lib/colors";
import { FilterEnum } from "@/orval_api/model";

const EXCELLENT = 75;
const GOOD = 50;
const POOR = 25;

/**
 *
Renders the color of the match percentage for movie filters (genres, keywords...)
 */
export const percentageMatchColor = (
  percentage: number,
  text: string,
  name: string,
) => {
  const veryPoor = percentage < POOR;
  const fair = percentage >= POOR && percentage < GOOD;
  const good = percentage >= GOOD && percentage < EXCELLENT;
  const excellent = percentage >= EXCELLENT;

  return (
    <div>
      <div
        className={cn(
          "mb-2 flex items-center justify-between gap-2 rounded-2xl px-3 text-center font-bold text-black",
          veryPoor && "bg-danger shadow-danger",
          fair && "bg-warning shadow-warning",
          good && "bg-medium shadow-medium",
          excellent && "bg-success shadow-success",
        )}
      >
        <span className="text-base">{name}</span>
        <span className="text-lg">{percentage}%</span>
      </div>
      <p>{text}</p>
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
