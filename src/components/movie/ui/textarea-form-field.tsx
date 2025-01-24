"use client";

import React, { TextareaHTMLAttributes } from "react";
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
  name: TFieldName;
  register: UseFormRegister<TFormValues>;
  error: FieldError | undefined;
  labelWidth?: number;
  label: string;
  value?: string;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

export const TextareaFormField = <
  TFormValues extends FieldValues,
  TFieldName extends Path<TFormValues>,
>({
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
      <div className="relative mt-7 w-full">
        <textarea
          value={value}
          disabled={FORM_FIELD.includes(name)}
          placeholder=" "
          autoComplete="new-password"
          rows={3}
          {...register(name)}
          className={cn(
            "textarea box-border h-full w-full rounded-xl border border-[#EFF0F7] px-5 py-1 text-[18px] text-[#495AFF] shadow-input-default outline-0 disabled:bg-gray-200 dark:border-[#4A3AFF] [&:focus~.cut]:translate-y-[8px] [&:focus~.placeholder]:translate-x-[10px] [&:focus~.placeholder]:translate-y-[-38px] [&:focus~.placeholder]:scale-75 [&:focus~.placeholder]:text-[#6F6C90] [&:not(:placeholder-shown)~.cut]:translate-y-[8px] [&:not(:placeholder-shown)~.placeholder]:translate-x-[10px] [&:not(:placeholder-shown)~.placeholder]:translate-y-[-38px] [&:not(:placeholder-shown)~.placeholder]:scale-75 [&:not(:placeholder-shown)~.placeholder]:text-[#6F6C90]",
          )}
          {...inputProps}
        />

        <div
          className="cut absolute left-[20px] top-[-20px] h-[20px] translate-y-0 rounded-[10px] transition-transform duration-200"
          style={{ width: labelWidth }}
        />

        <label className="placeholder pointer-events-none absolute left-5 top-5 origin-[0_50%] text-lg leading-3 text-[#6F6C90] transition-transform duration-200">
          {label}
        </label>

        {error && (
          <div className="absolute text-sm text-red-500">{error.message}</div>
        )}
      </div>
    </>
  );
};
