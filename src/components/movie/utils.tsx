import { cn } from "@/lib/utils";
import { GENRE_KEY, SUBGENRE_KEY } from "../genres";
import {
  ACTION_TIME_KEY,
  KEYWORD_KEY,
  SPEC_KEY,
} from "../filter-fetch-wrapper";
import { ACTOR_KEY } from "../actors";
import { DIRECTOR_KEY } from "../director";

export const percentageMatchColor = (percentage: number, text: string) => {
  return (
    <div>
      <div
        className={cn(
          "grid size-10 place-items-center rounded-full bg-transparent text-center text-lg font-bold text-black",
          percentage < 25 && "circle-border2 bg-red-500",
          percentage >= 25 &&
            percentage < 50 &&
            "bg-orange-400 shadow-2xl shadow-orange-300",
          percentage >= 50 && percentage < 75 && "bg-green-500",
          percentage >= 75 && percentage < 90 && "bg-blue-400",
          percentage >= 90 &&
            "shadow-neon-border-fill circle-border bg-[#4a3aff]",
        )}
      >
        <p className="">{percentage}%</p>
      </div>
      {text}
    </div>
  );
};

export const getFilterColor = (type: string) =>
  ({
    [GENRE_KEY]: "#4A3AFF",
    [SUBGENRE_KEY]: "#9d4eff",
    [SPEC_KEY]: "#64fcfe",
    [KEYWORD_KEY]: "#FFC55C",
    [ACTION_TIME_KEY]: "#92A8D1",
    [ACTOR_KEY]: "#90ee90",
    [DIRECTOR_KEY]: "#f08080",
  })[type] || "#000";
