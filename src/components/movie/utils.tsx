import { cn } from "@/lib/utils";

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
