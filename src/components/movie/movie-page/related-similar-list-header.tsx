"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { recalculateSimilarities } from "@/app/(app)/services/admin-api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { checkIfAdmin } from "@/proxy";

type Props = {
  type: "related" | "similar";
  bottom?: boolean;
};

export const RelatedSimilarListHeader = ({ type, bottom }: Props) => {
  const t = useTranslations("MovieParts");
  const router = useRouter();
  const session = useSession();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (isRefreshing) {
      return;
    }

    setIsRefreshing(true);
    const res = await recalculateSimilarities();

    if (res.status === 200 && res.data) {
      toast.success(
        <p className="text-xl">
          Upserted: {res.data.pairs_upserted}, Skipped: {res.data.pairs_skipped}
        </p>,
        {
          duration: 15000,
        },
      );
    }

    setIsRefreshing(false);
    router.refresh();
  };

  return (
    <div className="flex items-center justify-between">
      <h4 className={cn("text-lg", bottom && "p-2 text-2xl")}>
        {type === "related" ? t("related") : t("similar")}
      </h4>

      {type === "similar" && checkIfAdmin(session.data?.user.role) && (
        <Button variant="ghost" onClick={handleRefresh}>
          <RefreshCw className={cn(isRefreshing && "animate-spin")} />
        </Button>
      )}
    </div>
  );
};
