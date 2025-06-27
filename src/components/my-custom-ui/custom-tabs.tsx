"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Tab = {
  key: string;
  name: string;
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
  return (
    <AnimatePresence>
      <Tabs defaultValue={tabs[0].key}>
        {header}

        <div className="flex w-full justify-center">
          <TabsList className="flex w-fit">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.key} value={tab.key}>
                {tab.name}
              </TabsTrigger>
            ))}
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
