import { cn } from "@/lib/utils";
import { GENRE, SUBGENRE } from "../genres";
import { ACTION_TIME, KEYWORD, SPEC } from "../filter-fetch-wrapper";
import { ACTOR } from "../actors";
import { DIRECTOR } from "../director";

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
    [GENRE]: "#4A3AFF",
    [SUBGENRE]: "#9d4eff",
    [SPEC]: "#64fcfe",
    [KEYWORD]: "#FFC55C",
    [ACTION_TIME]: "#92A8D1",
    [ACTOR]: "#90ee90",
    [DIRECTOR]: "#f08080",
  })[type] || "#000";
