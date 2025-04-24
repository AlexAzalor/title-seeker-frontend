"use client";

import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { deleteProfile } from "@/app/services/user-api";

import { UserRole } from "@/orval_api/model";
import { Button } from "@/components/ui/button";
import ModalWindow from "@/components/my-custom-ui/modal-window";

export const UserSettings = () => {
  const session = useSession();
  const [open, setOpen] = useState(false);

  if (!session?.data?.user) {
    return null;
  }

  const isOwner = session.data.user.role === UserRole.owner;

  const handleOpen = () => {
    setOpen(true);
  };

  const handleDeleteProfile = async () => {
    const res = await deleteProfile(session?.data?.user.uuid);

    if (res === 200) {
      setOpen(false);
      signOut({ redirectTo: "/" });
    } else {
      console.error("Failed to delete profile", res);
    }
  };

  return (
    <>
      <Button variant="destructive" onClick={handleOpen}>
        Delete Profile
      </Button>

      <ModalWindow title="Delete Profile" open={open} setOpen={setOpen}>
        <div>
          <p className="text-lg">
            Are you sure you want to delete your profile? This action cannot be
            undone.
          </p>

          {isOwner && (
            <p className="text-sm font-bold text-red-500">
              Note: If you are the Owner of the Platform, you cannot delete it.
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
      </ModalWindow>
    </>
  );
};
