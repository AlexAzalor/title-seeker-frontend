import { Button } from "@/components/ui/button";

type Props = {
  title?: string;
  handlePrev?: () => void;
  isFirstStep?: boolean;
};

export const FormButtons = ({ title, handlePrev, isFirstStep }: Props) => {
  return (
    <div className="mt-7 flex justify-between">
      {!isFirstStep && (
        <Button
          type="button"
          className="h-16 w-[164px] rounded-[56px] border border-[#4A3AFF] text-lg text-[#4A3AFF] hover:text-[#4A3AFF]"
          variant="outline"
          onClick={handlePrev}
        >
          Previous step
        </Button>
      )}

      <Button
        type="submit"
        className="h-16 w-[164px] cursor-pointer rounded-[56px] border-0 bg-[#4A3AFF] text-center text-lg transition-all duration-200 hover:bg-[#252154]"
      >
        <p>{title || "Next step"}</p>
      </Button>
    </div>
  );
};

// #252154
// Light Tones of #4A3AFF
// #726CFF
// A slightly brighter tone with more softness.
// #938EFF
// Noticeably lighter but still retains the vibrant bluish-purple.
// #B4AFFF
// A pastel-like tone, great for a softer palette.
// #D6D1FF
// Very light, almost a lavender hue.
// #F7F4FF
// Almost white, with a hint of bluish-purple.
// Dark Tones of #4A3AFF
// #4035E6
// A slightly deeper and richer tone.
// #362FCC
// Noticeably darker but retains the vibrancy.
// #2C29B2
// A deep and intense purple-blue.
// #222399
// Much darker, nearing indigo shades.
// #181D7F
// Extremely dark, a deep midnight blue.

// Gradient Transition Colors
// #4A3AFF (Default Color)
// Vibrant bluish-purple.
// #4235E8
// Slightly darker, more blue-dominant.
// #3B30D2
// A balanced deep blue-purple tone.
// #342BBB
// Rich purple, leaning darker.
// #2D26A5
// Deep indigo tone, with reduced brightness.
// #271F8F
// A dark, moody purple tone.
// #211979
// A dark blue with hints of purple.
// #1B1263
// Approaching indigo, very dark.
// #150C4D
// Almost blackened indigo with subtle color hints.
// #2C003E (Dark Purple/Indigo)
// The final deep, dark indigo.
