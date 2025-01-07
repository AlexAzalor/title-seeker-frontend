"use client";

import { cn } from "@/lib/utils";
import { MovieFormFieldProps } from "@/types/general";

const passwordInputs = ["key"];

export const MovieFormField = ({
  type,
  name,
  register,
  error,
  labelWidth,
  label,
  value,
}: MovieFormFieldProps) => {
  return (
    <>
      <div className="relative mt-7 h-[50px] w-full">
        <input
          value={passwordInputs.includes(name) ? value : undefined}
          disabled={passwordInputs.includes(name)}
          placeholder=" "
          autoComplete="new-password"
          type={type}
          {...register(name)}
          className={cn(
            "input box-border h-full w-full rounded-[12px] border-0 bg-animeprimary-light px-5 py-1 text-[18px] text-animeprimary-dark outline-0 [&:focus~.cut]:translate-y-[8px] [&:focus~.placeholder]:translate-x-[10px] [&:focus~.placeholder]:translate-y-[-30px] [&:focus~.placeholder]:scale-75 [&:focus~.placeholder]:text-animeneutral [&:not(:placeholder-shown)~.cut]:translate-y-[8px] [&:not(:placeholder-shown)~.placeholder]:translate-x-[10px] [&:not(:placeholder-shown)~.placeholder]:translate-y-[-30px] [&:not(:placeholder-shown)~.placeholder]:scale-75 [&:not(:placeholder-shown)~.placeholder]:text-animeneutral",
            passwordInputs.includes(name) && "disabled:bg-gray-200",
          )}
        />

        <div
          className="cut absolute left-[20px] top-[-20px] h-[20px] translate-y-0 rounded-[10px] bg-animeprimary transition-transform duration-200"
          style={{ width: labelWidth }}
        />

        <label className="placeholder pointer-events-none absolute left-5 top-5 origin-[0_50%] leading-3 text-LightGray2 transition-transform duration-200">
          {label}
        </label>
      </div>

      {error && <span className="text-sm text-black">{error.message}</span>}
    </>
  );
};
