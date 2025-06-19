"use client";

import React, { type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import type {
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
  label: string;
  value?: string;
  autoResize?: boolean;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

const TextareaFormField = <
  TFormValues extends FieldValues,
  TFieldName extends Path<TFormValues>,
>({
  name,
  register,
  error,
  label,
  value,
  autoResize = true,
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
            "textarea shadow-input-default dark:border-main-ui-purple border-light-border [&:focus~.placeholder]:text-gray-purple [&:not(:placeholder-shown)~.placeholder]:text-gray-purple text-form-ui-blue box-border h-full min-h-20 w-full rounded-xl border px-5 py-1 text-[18px] outline-0 disabled:bg-gray-200 [&:focus~.cut]:translate-y-[8px] [&:focus~.placeholder]:translate-x-[10px] [&:focus~.placeholder]:translate-y-[-38px] [&:focus~.placeholder]:scale-75 [&:not(:placeholder-shown)~.cut]:translate-y-[8px] [&:not(:placeholder-shown)~.placeholder]:translate-x-[10px] [&:not(:placeholder-shown)~.placeholder]:translate-y-[-38px] [&:not(:placeholder-shown)~.placeholder]:scale-75",
            autoResize && "field-sizing-content",
          )}
          {...inputProps}
        />

        <div className="cut absolute top-[-20px] left-[20px] h-[20px] translate-y-0 rounded-[10px] transition-transform duration-200" />

        <label className="placeholder text-gray-purple pointer-events-none absolute top-5 left-5 origin-[0_50%] text-lg leading-3 transition-transform duration-200">
          {label}
        </label>

        {error && (
          <div className="error-message absolute rounded-md px-2 text-sm">
            {error.message}
          </div>
        )}
      </div>
    </>
  );
};

const TextareaFormFieldMemo = React.memo(
  TextareaFormField,
) as typeof TextareaFormField;

export { TextareaFormFieldMemo as TextareaFormField };
