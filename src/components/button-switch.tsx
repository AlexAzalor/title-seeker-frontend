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
  // console.log('-------------------', cookieStore);

  const handleLanguageChange = async (locale: string) => {
    console.log("locale", locale);
    // const cookieStore = await cookies();
    // cookieStore().set('locale', locale);
    create(locale);
  };

  return (
    <>
      <div>Selected: {locale}</div>
      <Select
        defaultValue={locale}
        onValueChange={(e) => handleLanguageChange(e)}
      >
        <SelectTrigger className="max-w-max">
          <SelectValue placeholder={locale} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="uk">uk</SelectItem>
            <SelectItem value="en">en</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  );
};
