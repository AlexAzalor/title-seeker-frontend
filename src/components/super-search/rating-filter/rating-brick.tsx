import { cn } from "@/lib/utils";
import { CircleX } from "lucide-react";

export const RatingBrick = ({
  value,
  label,
  paramKey,
  onDelete,
}: {
  value: string | null;
  label: string;
  paramKey: string;
  onDelete: (value: string, key: string) => void;
}) => {
  if (!value) return null;
  return (
    <div
      className={cn(
        "hover:shadow-rating dark:hover:shadow-rating flex items-center space-x-1 rounded-xl border-2 border-[#d2df14] p-1 font-bold text-black transition-shadow dark:text-white",
      )}
    >
      <div className="flex flex-col items-center">
        <span>{label}</span>
        <span>{value.replace(",", "-")}</span>
      </div>
      <CircleX
        className="top-0 right-0 h-4 w-4 cursor-pointer"
        onClick={() => onDelete(value, paramKey)}
      />
    </div>
  );
};
