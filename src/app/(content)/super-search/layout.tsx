import { FilterFetchWrapper } from "@/components/filter-fetch-wrapper";

export default function SuperSearchLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <FilterFetchWrapper>
      <div>
        <div className="flex flex-wrap gap-4 p-3">{children}</div>
      </div>
    </FilterFetchWrapper>
  );
}
