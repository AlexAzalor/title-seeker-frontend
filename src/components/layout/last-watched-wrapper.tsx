"use client";

import { useEffect } from "react";
import { useLastWatchedStore } from "@/lib/store";

type Props = {
  movieKey: string;
  poster: string;
  children: React.ReactNode;
};

export const LastWatchedWrapper = ({ movieKey, poster, children }: Props) => {
  const addMovie = useLastWatchedStore((s) => s.addMovie);

  useEffect(() => {
    addMovie({ key: movieKey, poster });
  }, [addMovie, movieKey, poster]);

  return children;
};
