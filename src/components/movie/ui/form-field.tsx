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
          className="input shadow-input-default box-border h-full w-full rounded-[46px] border border-[#EFF0F7] px-5 py-1 text-[18px] text-[#495AFF] outline-0 disabled:bg-gray-200 disabled:shadow-none dark:border-[#4A3AFF] dark:disabled:border-black dark:disabled:bg-black [&:focus~.cut]:translate-y-[8px] [&:focus~.placeholder]:translate-x-[10px] [&:focus~.placeholder]:translate-y-[-38px] [&:focus~.placeholder]:scale-75 [&:focus~.placeholder]:text-[#6F6C90] [&:not(:placeholder-shown)~.cut]:translate-y-[8px] [&:not(:placeholder-shown)~.placeholder]:translate-x-[10px] [&:not(:placeholder-shown)~.placeholder]:translate-y-[-38px] [&:not(:placeholder-shown)~.placeholder]:scale-75 [&:not(:placeholder-shown)~.placeholder]:text-[#6F6C90]"
          {...inputProps}
        />

        {formattedValue && (
          <span className="absolute top-1/4 right-4">{formattedValue}</span>
        )}

        <div className="cut absolute top-[-20px] left-[20px] h-[20px] translate-y-0 rounded-[10px] transition-transform duration-200" />

        <label className="placeholder pointer-events-none absolute top-5 left-5 origin-[0_50%] text-lg leading-3 text-[#6F6C90] transition-transform duration-200">
          {label}
        </label>

        {error && (
          <div className="absolute text-sm text-red-500">{error.message}</div>
        )}
      </div>
    </>
  );
};

const FormFieldMemo = memo(FormField) as typeof FormField;

export { FormFieldMemo as FormField };
