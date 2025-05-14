"use client";

import React, {
  HTMLInputTypeAttribute,
  InputHTMLAttributes,
  memo,
} from "react";
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
  label: string;
  value?: string;
  formattedValue?: string;
} & InputHTMLAttributes<HTMLInputElement>;

const FormField = <
  TFormValues extends FieldValues,
  TFieldName extends Path<TFormValues>,
>({
  type,
  name,
  register,
  error,
  label,
  value,
  formattedValue,
  ...inputProps
}: FieldProps<TFormValues, TFieldName>) => {
  return (
    <>
      <div className="relative h-[50px] w-full">
        <input
          value={value}
          disabled={FORM_FIELD.includes(name)}
          placeholder=" "
          autoComplete="new-password"
          type={type}
          {...register(name)}
          className="input shadow-input-default dark:border-main-ui-purple border-light-border [&:not(:placeholder-shown)~.placeholder]:text-gray-purple [&:focus~.placeholder]:text-gray-purple text-form-ui-blue box-border h-full w-full rounded-[46px] border px-5 py-1 text-[18px] outline-0 disabled:bg-gray-200 disabled:shadow-none dark:disabled:border-black dark:disabled:bg-black [&:focus~.cut]:translate-y-[8px] [&:focus~.placeholder]:translate-x-[10px] [&:focus~.placeholder]:translate-y-[-38px] [&:focus~.placeholder]:scale-75 [&:not(:placeholder-shown)~.cut]:translate-y-[8px] [&:not(:placeholder-shown)~.placeholder]:translate-x-[10px] [&:not(:placeholder-shown)~.placeholder]:translate-y-[-38px] [&:not(:placeholder-shown)~.placeholder]:scale-75"
          {...inputProps}
        />

        {formattedValue && (
          <span className="absolute top-1/4 right-4">{formattedValue}</span>
        )}

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

const FormFieldMemo = memo(FormField) as typeof FormField;

export { FormFieldMemo as FormField };
