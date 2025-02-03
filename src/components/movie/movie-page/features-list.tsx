"use client";

import {
  MovieActionTime,
  MovieKeyword,
  MovieSpecification,
} from "@/orval_api/model";
import { ItemFeature } from "./item-feature";

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
        color="#64fcfe"
        queryKey="specification_name"
      />

      <ItemFeature data={keywords} color="#FFC55C" queryKey="keyword_name" />

      <ItemFeature
        data={action_times}
        color="#92A8D1"
        queryKey="action_time_name"
      />
    </div>
  );
};
