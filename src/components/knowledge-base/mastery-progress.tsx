import { Target, Trophy } from "lucide-react";
// Determine skill level and colors based on progress
const getSkillLevel = (progress: number) => {
  if (progress >= 90)
    return {
      level: "Expert",
      color: "from-purple-500 to-indigo-600",
      bg: "bg-purple-100 dark:bg-purple-900/30",
      text: "text-purple-700 dark:text-purple-300",
      icon: Trophy,
    };
  if (progress >= 70)
    return {
      level: "Advanced",
      color: "from-green-500 to-emerald-600",
      bg: "bg-green-100 dark:bg-green-900/30",
      text: "text-green-700 dark:text-green-300",
      icon: Trophy,
    };
  if (progress >= 50)
    return {
      level: "Intermediate",
      color: "from-blue-500 to-cyan-600",
      bg: "bg-blue-100 dark:bg-blue-900/30",
      text: "text-blue-700 dark:text-blue-300",
      icon: Target,
    };
  if (progress >= 25)
    return {
      level: "Beginner",
      color: "from-yellow-500 to-orange-600",
      bg: "bg-yellow-100 dark:bg-yellow-900/30",
      text: "text-yellow-700 dark:text-yellow-300",
      icon: Target,
    };
  return {
    level: "Novice",
    color: "from-gray-500 to-slate-600",
    bg: "bg-gray-100 dark:bg-gray-900/30",
    text: "text-gray-700 dark:text-gray-300",
    icon: Target,
  };
};
// Mastery Progress Component
export const MasteryProgress = ({
  progress,
  size = "normal",
}: {
  progress: number;
  size?: "normal" | "compact";
}) => {
  // Ensure progress is between 0 and 100
  const normalizedProgress = Math.max(0, Math.min(100, progress));
  const skillData = getSkillLevel(normalizedProgress);
  const IconComponent = skillData.icon;

  if (size === "compact") {
    return (
      <div className="w-full">
        <div className="mb-1 flex items-center justify-between">
          <span className={`text-xs font-medium ${skillData.text}`}>
            {skillData.level}
          </span>
          <span className="text-xs text-gray-600 dark:text-gray-400">
            {normalizedProgress}%
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className={`h-2 bg-gradient-to-r ${skillData.color} relative rounded-full transition-all duration-1000 ease-out`}
            style={{ width: `${normalizedProgress}%` }}
          >
            <div className="absolute inset-0 animate-pulse bg-white opacity-20"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-3 w-full">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IconComponent className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Mastery Level
          </span>
        </div>
        <div
          className={`rounded-full px-2 py-1 text-xs font-medium ${skillData.bg} ${skillData.text}`}
        >
          {skillData.level}
        </div>
      </div>

      <div className="relative">
        <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className={`h-3 bg-gradient-to-r ${skillData.color} relative rounded-full transition-all duration-1000 ease-out group-hover:shadow-lg`}
            style={{ width: `${normalizedProgress}%` }}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white to-transparent opacity-30"></div>
            {/* Glow effect on hover */}
            <div
              className={`absolute inset-0 bg-gradient-to-r ${skillData.color} opacity-50 blur-sm transition-opacity duration-300 group-hover:opacity-70`}
            ></div>
          </div>
        </div>

        <div className="mt-1 flex justify-between">
          <span className="text-xs text-gray-500 dark:text-gray-400">0%</span>
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {normalizedProgress}%
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">100%</span>
        </div>
      </div>
    </div>
  );
};
