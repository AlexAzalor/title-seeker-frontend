"use client";

import { deleteProfile } from "@/app/actions";
import ModalWindow from "@/components/movie/ui/modal-movie";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";

export const UserSettings = () => {
  const session = useSession();
  const [open, setOpen] = useState(false);

  if (!session?.data?.user) {
    return null;
  }

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
          <Button variant="destructive" onClick={handleDeleteProfile}>
            Confirm
          </Button>
        </div>
      </ModalWindow>
    </>
  );
};
