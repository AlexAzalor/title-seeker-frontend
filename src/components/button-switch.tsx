"use client";

import { create } from "@/app/actions";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// import {cookies} from "next/headers";

type Props = {
  locale: string;
};

export const ButtonSwitch = ({ locale }: Props) => {
  const handleLanguageChange = async (locale: string) => {
    // const cookieStore = await cookies();
    // cookieStore().set('locale', locale);
    create(locale);
  };

  return (
    <Select
      defaultValue={locale}
      onValueChange={(e) => handleLanguageChange(e)}
    >
      <SelectTrigger className="w-28">
        <SelectValue placeholder={locale} />
      </SelectTrigger>
      <SelectContent side="top">
        <SelectGroup>
          <SelectItem value="uk">Українська</SelectItem>
          <SelectItem value="en">English</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
