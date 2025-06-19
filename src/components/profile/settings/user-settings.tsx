"use client";

import { useTranslations } from "next-intl";
import { signOut, useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useModal } from "@/hooks/use-modal";
import { checkIfOwner } from "@/middleware";
import { Language } from "@/orval_api/model";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { setUserLocale } from "@/app/services/locale";
import { deleteProfile, setLanguage } from "@/app/services/user-api";
import type { Session } from "next-auth";

const CustomModal = dynamic(() => import("../../my-custom-ui/custom-modal"), {
  ssr: false,
});

export const UserSettings = () => {
  const t = useTranslations("Settings");

  const { data, update } = useSession();
  const { open, close, isOpen } = useModal();

  if (!data?.user) {
    return null;
  }

  const isOwner = checkIfOwner(data.user.role);

  const handleOpen = () => {
    open();
  };

  const handleDeleteProfile = async () => {
    const res = await deleteProfile(data.user.uuid);

    if (res === 200) {
      close();
      signOut({ redirectTo: "/" });
    } else {
      console.error("Failed to delete profile", res);
    }
  };

  const handleLocaleChange = async (locale: Language) => {
    await setUserLocale(locale);

    if (data.user) {
      await setLanguage(data.user.uuid, locale);

      await update({
        user: {
          ...data.user,
          my_language: locale,
        },
      } as Session);
    }
  };

  return (
    <>
      <h1 aria-label="settings">{t("title")}</h1>

      <p>{t("subTitle")}</p>

      <Separator className="my-4" />

      <div className="flex flex-col gap-4">
        <div>
          <h3>{t("language")}</h3>
          <p>{t("langSubtext")}</p>
          <div className="flex gap-2">
            <Button
              onClick={() => handleLocaleChange(Language.uk)}
              disabled={data.user.my_language === Language.uk}
            >
              Українська
            </Button>
            <Button
              onClick={() => handleLocaleChange(Language.en)}
              disabled={data.user.my_language === Language.en}
            >
              English
            </Button>
          </div>
        </div>

        <Separator />

        <div>
          <h3>{t("delete")}</h3>
          <p>{t("deleteSubtext")}</p>
          <Button className="w-max" variant="destructive" onClick={handleOpen}>
            {t("delete")}
          </Button>
        </div>
      </div>

      {isOpen && (
        <CustomModal isOpen={isOpen} onClose={close}>
          <h1>{t("delete")}</h1>
          <div>
            <p className="text-lg">{t("deleteWarning")}</p>

            {isOwner && (
              <p className="text-sm font-bold text-red-500">
                Note: If you are the Owner of the Platform, you cannot delete
                it.
              </p>
            )}

            <Button
              disabled={isOwner}
              variant="destructive"
              onClick={handleDeleteProfile}
            >
              Confirm
            </Button>
          </div>
        </CustomModal>
      )}
    </>
  );
};
