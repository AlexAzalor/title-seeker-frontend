"use client";

import { useEffect } from "react";
import { useLastWatchedStore } from "@/lib/store";

type Props = {
  movie: { key: string; poster: string };
  children: React.ReactNode;
};
export const LastWatchedWrapper = ({ movie, children }: Props) => {
  const addMovie = useLastWatchedStore((s) => s.addMovie);

  useEffect(() => {
    addMovie(movie);
  }, [addMovie, movie]);

  return children;
};
