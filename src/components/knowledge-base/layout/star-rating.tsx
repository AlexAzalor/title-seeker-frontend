import { Star } from "lucide-react";
import { useState, type RefObject } from "react";

type StarProps = {
  score: number;
  scoreRef?: RefObject<number | null>;
  readonly?: boolean;
};

// Star Rating Component with animations
export const StarRating = ({ score, scoreRef, readonly }: StarProps) => {
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [scoreState, setScoreState] = useState(score);

  // Ensure score is between 0 and 5
  const normalizedScore = Math.max(0, Math.min(5, scoreState));

  const handleChangeScore = (newScore: number) => {
    if (readonly) return;
    setScoreState(newScore);

    if (scoreRef) {
      scoreRef.current = newScore;
    }
  };

  return (
    <div className="mb-6 flex items-center justify-center gap-3">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((starIndex) => {
          const isFilled = starIndex <= normalizedScore;
          const isHovered = hoveredStar !== null && starIndex <= hoveredStar;

          return (
            <div
              key={starIndex}
              className="relative transform cursor-pointer transition-all duration-200 hover:scale-110"
              onMouseEnter={
                !readonly ? () => setHoveredStar(starIndex) : undefined
              }
              onMouseLeave={!readonly ? () => setHoveredStar(null) : undefined}
            >
              <Star
                className={`h-6 w-6 transition-all duration-300 ${
                  isFilled || isHovered
                    ? "fill-yellow-400 text-yellow-400 drop-shadow-sm"
                    : "text-gray-300 hover:text-yellow-300 dark:text-gray-600"
                }`}
                style={{
                  filter:
                    isFilled || isHovered
                      ? "drop-shadow(0 0 4px rgba(251, 191, 36, 0.4))"
                      : "none",
                }}
                onClick={() => handleChangeScore(starIndex)}
              />

              {/* Sparkle animation for filled stars */}
              {isFilled && (
                <div className="absolute inset-0 animate-pulse">
                  <Star
                    onClick={() => handleChangeScore(starIndex)}
                    className="h-6 w-6 fill-yellow-300 text-yellow-300 opacity-50"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* <div className="ml-2 flex items-center gap-2">
        <span className="text-lg font-bold text-gray-900 dark:text-white">
          {normalizedScore.toFixed(1)}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">/ 5.0</span>
      </div> */}

      {/* Quality badge */}
      {/* <div
        className={`ml-2 rounded-full px-3 py-1 text-xs font-medium ${
          normalizedScore >= 4.5
            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
            : normalizedScore >= 3.5
              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
              : normalizedScore >= 2.5
                ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
        }`}
      >
        {normalizedScore >= 4.5
          ? "Excellent"
          : normalizedScore >= 3.5
            ? "Good"
            : normalizedScore >= 2.5
              ? "Fair"
              : "Poor"}
      </div> */}
    </div>
  );
};
