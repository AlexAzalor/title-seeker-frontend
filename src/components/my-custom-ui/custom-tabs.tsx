"use client";

import { useTranslations } from "next-intl";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";

type Tab = {
  key: string;
  component: React.ReactNode;
};

type Props = {
  tabs: Tab[];
  /** Styles of the tab item */
  className?: string;
  /** To place something above the button panel */
  header?: React.ReactNode;
};

export const CustomTabs = ({ tabs, className, header }: Props) => {
  const t = useTranslations("Rating");

  return (
    <AnimatePresence>
      <Tabs defaultValue={tabs[0].key}>
        {header}

        <div className="flex w-full justify-center">
          <TabsList className="flex w-60">
            <TabsTrigger value={tabs[0].key}>
              {t("visualProfile.name")}
            </TabsTrigger>
            <TabsTrigger value={tabs[1].key}>{t("name")}</TabsTrigger>
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
              className={className}
            >
              {tab.component}
            </motion.div>
          </TabsContent>
        ))}
      </Tabs>
    </AnimatePresence>
  );
};
