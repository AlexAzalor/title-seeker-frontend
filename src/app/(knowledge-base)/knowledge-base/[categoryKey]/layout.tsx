import { AddNewTechnologyForm } from "@/components/knowledge-base/forms/add-new-technology";
import { Technologies } from "@/components/knowledge-base/technologies";
import { backendURL } from "@/lib/constants";
import { getKnowledgeBase } from "@/orval_api/knowledge-base/knowledge-base";
import type { PropsWithChildren } from "react";

export type PageProps = {
  params: Promise<{ categoryKey: string }>;
};

export default async function Layout({
  params,
  children,
}: PropsWithChildren<PageProps>) {
  const { categoryKey } = await params;
  const { aPIGetTechnologies } = getKnowledgeBase();
  const { data } = await aPIGetTechnologies(categoryKey, backendURL);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <AddNewTechnologyForm categoryKey={categoryKey} />
      <Technologies categoryKey={categoryKey} technologies={data.technologies}>
        {children}
      </Technologies>
    </div>
  );
}
