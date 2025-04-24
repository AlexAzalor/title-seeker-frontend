import { FilterFetchWrapper } from "@/components/super-search/filter-fetch-wrapper";

export default function SuperSearchLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return <FilterFetchWrapper>{children}</FilterFetchWrapper>;
}
