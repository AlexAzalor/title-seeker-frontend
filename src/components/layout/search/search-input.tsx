import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

type Props = {
  placeholder: string;
  isMobile: boolean;
  onSearch: (query: string) => void;
};

export const SearchInput = ({ placeholder, isMobile, onSearch }: Props) => (
  <div
    className="mb-3 flex items-center border-b px-3 dark:border-b-neutral-700"
    cmdk-input-wrapper=""
  >
    <SearchIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
    <Input
      placeholder={placeholder}
      onChange={(e) => onSearch(e.target.value)}
      autoFocus={!isMobile}
      className="flex field-sizing-content h-11 w-full rounded-md border-none bg-transparent py-3 text-sm outline-hidden placeholder:text-lg placeholder:text-neutral-500 disabled:cursor-not-allowed disabled:opacity-50 dark:placeholder:text-neutral-400"
    />
  </div>
);
