"use client";

import {
  MovieActionTime,
  MovieKeyword,
  MovieSpecification,
} from "@/orval_api/model";
import { ItemFeature } from "./item-feature";
import {
  ACTION_TIME_KEY,
  KEYWORD_KEY,
  SPEC_KEY,
} from "@/components/filter-fetch-wrapper";

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
    <div className="my-4 flex flex-wrap gap-4">
      <ItemFeature
        data={specifications}
        queryKey={SPEC_KEY}
        title="Specifications"
      />

      <ItemFeature data={keywords} queryKey={KEYWORD_KEY} title="Keywords" />

      <ItemFeature
        data={action_times}
        queryKey={ACTION_TIME_KEY}
        title="Action Times"
      />
    </div>
  );
};
