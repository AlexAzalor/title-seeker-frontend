import { Button } from "@/components/ui/button";

type Props = {
  value: string;
  onClick: () => void;
};

export const RatingButton = ({ onClick, value }: Props) => {
  return (
    <Button
      title="Rating"
      onClick={onClick}
      className="hover:before:animate-rating-button relative min-w-22 overflow-hidden rounded-[7px] border border-[rgb(61,106,255)] bg-[rgba(61,106,255,0.12)] px-[20px] py-[10px] text-[16px] font-semibold tracking-[2px] text-black uppercase shadow-[0_0_10px_2px_rgba(61,106,255,0.3)] transition-all duration-200 ease-in before:absolute before:top-[7%] before:left-0 before:block before:h-[86%] before:w-0 before:[transform:skewX(-20deg)] before:bg-white before:opacity-0 before:shadow-[0_0_50px_30px_#fff] before:content-[''] hover:bg-[rgb(61,106,255)] hover:text-white hover:shadow-[0_0_10px_5px_rgba(0,142,236,0.815)] hover:ease-out active:shadow-[0_0_0_0_transparent] active:transition-[box-shadow] active:duration-200 active:ease-in dark:border-[rgb(61,106,255)] dark:bg-[rgba(61,106,255,0.12)] dark:text-white dark:hover:bg-[rgb(61,106,255)] dark:hover:text-white"
    >
      <span>{value}</span>
    </Button>
  );
};
