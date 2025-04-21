import { backendURL } from "@/lib/constants";
import { Language } from "@/orval_api/model";
import { getLocale } from "next-intl/server";
import { AxiosRequestConfig, AxiosResponse } from "axios";

type Props<
  Datum,
  Params,
  Fetch extends <TData = AxiosResponse<Datum>>(
    params: Params,
    options?: AxiosRequestConfig,
  ) => Promise<TData>,
> = {
  apiFetch: Fetch;
  params: Params;
  children: (args: {
    result: AxiosResponse<Datum>;
    lang: Language;
  }) => React.ReactElement;
};

export const FetchWrapper = async <
  Datum,
  Params,
  Fetch extends <TData = AxiosResponse<Datum>>(
    params: Params,
    options?: AxiosRequestConfig,
  ) => Promise<TData>,
>({
  apiFetch,
  children,
  params,
}: Props<Datum, Params, Fetch>) => {
  const locale = await getLocale();
  const lang = Language[locale as keyof typeof Language];

  const result = await apiFetch({ lang, ...params }, backendURL);

  return <>{children({ result, lang })}</>;
};
