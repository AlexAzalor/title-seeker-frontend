"use client";

import { setUserLocale } from "@/app/services/locale";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Language } from "@/orval_api/model";
import { useLocale } from "next-intl";

export const LanguageSelector = () => {
  const locale = useLocale();

  const handleLocaleChange = async (locale: string) => {
    setUserLocale(locale as Language);
  };

  return (
    <Select defaultValue={locale} onValueChange={handleLocaleChange}>
      <SelectTrigger className="w-28" aria-label="language-selector">
        <SelectValue placeholder={locale} />
      </SelectTrigger>
      <SelectContent side="top">
        <SelectGroup>
          <SelectItem value={Language.uk}>Українська</SelectItem>
          <SelectItem value={Language.en}>English</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
