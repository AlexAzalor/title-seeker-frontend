"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
    range: boolean;
  }
>(({ className, range, ...props }, ref) => {
  const thumb = (
    <SliderPrimitive.Thumb className="block h-6 w-6 rounded-full border-2 border-neutral-900 bg-white ring-offset-white transition-colors focus-visible:ring-neutral-950 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-50 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:focus-visible:ring-neutral-300" />
  );

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none items-center select-none",
        className,
      )}
      {...props}
    >
      {/* change "bg-neutral-900 to bg-transparent" and add "bg-custom-gradient and remove dark:bg-neutral-50*/}
      <SliderPrimitive.Track className="bg-custom-gradient relative h-3 w-full grow overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
        <SliderPrimitive.Range className="absolute h-full bg-transparent" />
      </SliderPrimitive.Track>
      {thumb}
      {range && thumb}
    </SliderPrimitive.Root>
  );
});
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
