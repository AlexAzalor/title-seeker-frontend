"use client";

import { useTranslations } from "next-intl";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { TooltipWrapper } from "./tooltip-wrapper";

type Tab = {
  key: string;
  component: React.ReactNode;
};

type Props = {
  tabs: Tab[];
};

export const CustomTabs = ({ tabs }: Props) => {
  const t = useTranslations("Rating");

  return (
    <AnimatePresence>
      <Tabs defaultValue={tabs[0].key}>
        <div className="flex w-full justify-center">
          <TooltipWrapper
            content={
              <div>
                <div className="mb-1 font-semibold">
                  {t("visualProfile.mainInfo")}
                </div>
                <div className="mb-2 font-semibold">
                  {t("visualProfile.criteria")}
                </div>
                <div className="mb-1">{t("visualProfile.syndrome.info")}</div>
                <div className="mb-1">
                  {t("visualProfile.syndrome.movieSeries")}
                </div>
                <div className="mb-1">
                  {t("visualProfile.syndrome.problem")}
                </div>
                <div className="mb-1">
                  {t("visualProfile.syndrome.example")}
                </div>
              </div>
            }
          />

          <TabsList className="flex w-60">
            <TabsTrigger value={tabs[0].key}>Visual Profile</TabsTrigger>
            <TabsTrigger value={tabs[1].key}>Rating</TabsTrigger>
          </TabsList>
        </div>

        {tabs.map((tab) => (
          <TabsContent key={tab.key} value={tab.key}>
            <motion.div
              layout
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="h-[498px] max-w-[594px] lg:w-[594px]"
            >
              {tab.component}
            </motion.div>
          </TabsContent>
        ))}
      </Tabs>
    </AnimatePresence>
  );
};
