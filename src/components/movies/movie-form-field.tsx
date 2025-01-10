"use client";

import React, { HTMLInputTypeAttribute, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import {
  FieldError,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";

const FORM_FIELD = ["key"];

type FieldProps<
  TFormValues extends FieldValues,
  TFieldName extends Path<TFormValues>,
> = {
  type: HTMLInputTypeAttribute;
  name: TFieldName;
  register: UseFormRegister<TFormValues>;
  error: FieldError | undefined;
  labelWidth?: number;
  label: string;
  value?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export const MovieFormField = <
  TFormValues extends FieldValues,
  TFieldName extends Path<TFormValues>,
>({
  type,
  name,
  register,
  error,
  labelWidth,
  label,
  value,
  ...inputProps
}: FieldProps<TFormValues, TFieldName>) => {
  return (
    <>
      <div className="relative mt-7 h-[50px] w-full">
        <input
          value={FORM_FIELD.includes(name) ? value : undefined}
          disabled={FORM_FIELD.includes(name)}
          placeholder=" "
          autoComplete="new-password"
          type={type}
          {...register(name)}
          className={cn(
            "input box-border h-full w-full rounded-[12px] border-0 bg-animeprimary-light px-5 py-1 text-[18px] text-animeprimary-dark outline-0 [&:focus~.cut]:translate-y-[8px] [&:focus~.placeholder]:translate-x-[10px] [&:focus~.placeholder]:translate-y-[-30px] [&:focus~.placeholder]:scale-75 [&:focus~.placeholder]:text-animeneutral [&:not(:placeholder-shown)~.cut]:translate-y-[8px] [&:not(:placeholder-shown)~.placeholder]:translate-x-[10px] [&:not(:placeholder-shown)~.placeholder]:translate-y-[-30px] [&:not(:placeholder-shown)~.placeholder]:scale-75 [&:not(:placeholder-shown)~.placeholder]:text-animeneutral",
            FORM_FIELD.includes(name) && "disabled:bg-gray-200",
          )}
          {...inputProps}
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
