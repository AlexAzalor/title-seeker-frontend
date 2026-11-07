"use client";

import { useEffect } from "react";
import { collectClientInfo } from "@/components/audit-log/get-info";
// import { saveMovieUserInfo } from "@/app/(app)/services/user-api";

type Props = {
  children: React.ReactNode;
};

// TODO: remove later
/** Sends stringified client info to the backend when the movie page is opened */
export const UserInfoWrapper = ({ children }: Props) => {
  useEffect(() => {
    const info = collectClientInfo();
    if (!info) return;

    // saveMovieUserInfo(JSON.stringify(info)).catch(() => {});
  }, []);

  return children;
};
