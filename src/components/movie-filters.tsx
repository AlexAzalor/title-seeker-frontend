"use client";
import { cn } from "@/lib/utils";
import { ActionTimeOut, KeywordOut, SpecificationOut } from "@/orval_api/model";
import { useRouter, useSearchParams } from "next/navigation";

// type Props = {
//   specifications: SpecificationOut[];
// };
type Props = {
  data: SpecificationOut[] | KeywordOut[] | ActionTimeOut[];
  param_key: string;
};

// const SPECIFICATION = "specification_name";

export const MovieFilters = ({ data, param_key }: Props) => {
  const route = useRouter();

  const currentSearchParams = useSearchParams();
  const currentSelectedSpecifications = currentSearchParams.getAll(param_key);

  const deleteSpecificationParam = (name: string) => {
    const updatedSearchParams = new URLSearchParams(
      currentSearchParams.toString(),
    );
    updatedSearchParams.delete(param_key, name);
    window.history.pushState(null, "", "?" + updatedSearchParams.toString());

    // route.refresh();
    route.replace("/super-search" + "?" + updatedSearchParams.toString(), {
      scroll: false,
    });
  };

  function onClick(name: string) {
    const query = name;

    if (currentSearchParams.has(param_key, query)) {
      deleteSpecificationParam(query);

      return;
    }

    const updatedSearchParams = new URLSearchParams(
      currentSearchParams.toString(),
    );

    updatedSearchParams.append(param_key, query);

    window.history.pushState(null, "", "?" + updatedSearchParams.toString());

    // route.refresh();
    route.replace("/super-search" + "?" + updatedSearchParams.toString(), {
      scroll: false,
    });

    // window.location.reload();
  }

  const clearAllFilters = () => {
    const updatedSearchParams = new URLSearchParams();
    window.history.pushState(null, "", "?" + updatedSearchParams.toString());

    route.replace("/super-search" + "?" + updatedSearchParams.toString(), {
      scroll: false,
    });
  };

  return (
    <div>
      <h1>Specifications</h1>

      <button
        className="cursor-pointer bg-red-500 p-4"
        onClick={clearAllFilters}
      >
        Clear all filters
      </button>

      <div className="grid grid-cols-1 gap-4">
        {data.map((specification) => (
          <div key={specification.key}>
            <div
              className={cn(
                "cursor-pointer border border-blue-300 p-3",
                currentSelectedSpecifications.includes(specification.key)
                  ? "bg-green-400"
                  : "",
              )}
              onClick={() => onClick(specification.key)}
            >
              {specification.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
