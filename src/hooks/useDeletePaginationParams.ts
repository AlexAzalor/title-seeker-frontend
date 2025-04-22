import { useSearchParams } from "next/navigation";

export const useDeletePaginationParams = () => {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  params.delete("page");
  params.delete("size");
  params.delete("sort_order");
  params.delete("sort_by");

  return params.toString();
};
