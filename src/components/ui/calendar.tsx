"use client"

import * as React from "react"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"
import { DayButton, DayPicker, getDefaultClassNames } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "bg-[var(--popover)] group/calendar p-3 [--cell-size:2.5rem] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent dark:bg-[var(--popover)]",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "relative flex flex-col gap-4 md:flex-row",
          defaultClassNames.months
        ),
        month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-(--cell-size) w-(--cell-size) select-none p-0 aria-disabled:opacity-50",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-(--cell-size) w-(--cell-size) select-none p-0 aria-disabled:opacity-50",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "flex h-(--cell-size) w-full items-center justify-center gap-1.5 text-sm font-medium",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "has-focus:border-[color:var(--muted-foreground)] border-[color:var(--primary)] shadow-xs has-focus:ring-[color:var(--muted-foreground)]/50 has-focus:ring-[3px] relative rounded-md border dark:has-focus:border-[color:var(--muted-foreground)] dark:border-[color:var(--border)] dark:has-focus:ring-[color:var(--muted-foreground)]/50",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          "bg-[var(--popover)] absolute inset-0 opacity-0 dark:bg-[color:var(--primary)]",
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          "select-none font-medium",
          captionLayout === "label"
            ? "text-sm"
            : "[&>svg]:text-[color:var(--muted-foreground)] flex h-8 items-center gap-1 rounded-md pl-2 pr-1 text-sm [&>svg]:size-3.5 dark:[&>svg]:text-[color:var(--muted-foreground)]",
          defaultClassNames.caption_label
        ),
        month_grid: cn("w-full border-collapse", defaultClassNames.month_grid),
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "text-[color:var(--muted-foreground)] flex-1 select-none rounded-md text-[0.8rem] font-normal dark:text-[color:var(--muted-foreground)]",
          defaultClassNames.weekday
        ),
        week: cn("mt-2 flex w-full", defaultClassNames.week),
        week_number_header: cn(
          "w-(--cell-size) select-none",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "text-[color:var(--muted-foreground)] select-none text-[0.8rem] dark:text-[color:var(--muted-foreground)]",
          defaultClassNames.week_number
        ),
        day: cn(
          "group/day relative aspect-square h-full w-full select-none p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md",
          defaultClassNames.day
        ),
        range_start: cn(
          "bg-[color:var(--accent)] rounded-l-md dark:bg-[color:var(--accent)]",
          defaultClassNames.range_start
        ),
        range_middle: cn("rounded-none", defaultClassNames.range_middle),
        range_end: cn("bg-[color:var(--accent)] rounded-r-md dark:bg-[color:var(--accent)]", defaultClassNames.range_end),
        today: cn(
          "bg-[color:var(--accent)] text-[color:var(--primary)] rounded-md data-[selected=true]:rounded-none dark:bg-[color:var(--accent)] dark:text-[color:var(--primary-foreground)]",
          defaultClassNames.today
        ),
        outside: cn(
          "text-[color:var(--muted-foreground)] aria-selected:text-[color:var(--muted-foreground)] dark:text-[color:var(--muted-foreground)] dark:aria-selected:text-[color:var(--muted-foreground)]",
          defaultClassNames.outside
        ),
        disabled: cn(
          "text-[color:var(--muted-foreground)] opacity-50 dark:text-[color:var(--muted-foreground)]",
          defaultClassNames.disabled
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          )
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return (
              <ChevronLeftIcon className={cn("size-4", className)} {...props} />
            )
          }

          if (orientation === "right") {
            return (
              <ChevronRightIcon
                className={cn("size-4", className)}
                {...props}
              />
            )
          }

          return (
            <ChevronDownIcon className={cn("size-4", className)} {...props} />
          )
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-(--cell-size) items-center justify-center text-center">
                {children}
              </div>
            </td>
          )
        },
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames()

  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "data-[selected-single=true]:bg-[color:var(--primary)] data-[selected-single=true]:text-[color:var(--primary-foreground)] data-[range-middle=true]:bg-[color:var(--accent)] data-[range-middle=true]:text-[color:var(--primary)] data-[range-start=true]:bg-[color:var(--primary)] data-[range-start=true]:text-[color:var(--primary-foreground)] data-[range-end=true]:bg-[color:var(--primary)] data-[range-end=true]:text-[color:var(--primary-foreground)] group-data-[focused=true]/day:border-[color:var(--muted-foreground)] group-data-[focused=true]/day:ring-[color:var(--muted-foreground)]/50 flex aspect-square h-auto w-full min-w-(--cell-size) flex-col gap-1 font-normal leading-none data-[range-end=true]:rounded-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] [&>span]:text-xs [&>span]:opacity-70 dark:data-[selected-single=true]:bg-[color:var(--primary)] dark:data-[selected-single=true]:text-[color:var(--primary)] dark:data-[range-middle=true]:bg-[color:var(--accent)] dark:data-[range-middle=true]:text-[color:var(--primary-foreground)] dark:data-[range-start=true]:bg-[color:var(--primary)] dark:data-[range-start=true]:text-[color:var(--primary)] dark:data-[range-end=true]:bg-[color:var(--primary)] dark:data-[range-end=true]:text-[color:var(--primary)] dark:group-data-[focused=true]/day:border-[color:var(--muted-foreground)] dark:group-data-[focused=true]/day:ring-[color:var(--muted-foreground)]/50",
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }
