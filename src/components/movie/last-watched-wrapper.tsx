"use client";

import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useEffect } from "react";

type Props = {
  movie: { key: string; poster: string };
  children: React.ReactNode;
};
export const LastWatchedWrapper = ({ movie, children }: Props) => {
  const { data, setData } = useLocalStorage<{ key: string; poster: string }[]>(
    "last_watched",
    [],
  );

  useEffect(() => {
    if (data.find((item) => item.key === movie.key)) {
      return;
    }

    if (data.length === 10) {
      data.splice(0, 1);
    }

    data.push(movie);

    setData(data);
  }, [data, movie, setData]);

  return children;
};
