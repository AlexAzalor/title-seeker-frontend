"use client";

import {
  MovieActionTime,
  MovieKeyword,
  MovieSpecification,
} from "@/orval_api/model";
import { ItemFeature } from "./item-feature";
import { ACTION_TIME, KEYWORD, SPEC } from "@/components/filter-fetch-wrapper";

type Props = {
  specifications: MovieSpecification[];
  keywords: MovieKeyword[];
  action_times: MovieActionTime[];
};

export const FeaturesList = ({
  specifications,
  keywords,
  action_times,
}: Props) => {
  return (
    <div className="my-4 flex flex-col gap-4">
      <ItemFeature
        data={specifications}
        queryKey={SPEC}
        title="Specifications"
      />

      <ItemFeature data={keywords} queryKey={KEYWORD} title="Keywords" />

      <ItemFeature
        data={action_times}
        queryKey={ACTION_TIME}
        title="Action Times"
      />
    </div>
  );
};
