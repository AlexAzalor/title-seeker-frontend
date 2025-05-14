import { cn } from "@/lib/utils";
import { GENRE_KEY, SUBGENRE_KEY } from "../super-search/genre-selector";
import {
  ACTION_TIME_KEY,
  ACTOR_KEY,
  DIRECTOR_KEY,
  KEYWORD_KEY,
  SPEC_KEY,
} from "../super-search/filter-fetch-wrapper";
import { COLORS } from "@/lib/colors";

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
    [GENRE_KEY]: COLORS.genre,
    [SUBGENRE_KEY]: COLORS.subgenre,
    [SPEC_KEY]: COLORS.specification,
    [KEYWORD_KEY]: COLORS.keyword,
    [ACTION_TIME_KEY]: COLORS.actionTime,
    [ACTOR_KEY]: COLORS.actor,
    [DIRECTOR_KEY]: COLORS.director,
  })[type] || "#000";
