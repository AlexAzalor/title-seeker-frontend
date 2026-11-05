"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ImagePlus, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { changeMoviePoster } from "@/app/(app)/services/admin-api";
import { Button } from "@/components/ui/button";

type Props = {
  movieKey: string;
  posterUrl: string;
  poster: string;
  title: string;
  isAdmin?: boolean;
};

export const MoviePoster = ({
  movieKey,
  posterUrl,
  poster,
  title,
  isAdmin = false,
}: Props) => {
  const t = useTranslations("MoviePoster");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploaded, setUploaded] = useState<{
    source: string;
    value: string;
  } | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Ignore the uploaded value once the server provides a different poster.
  const currentPoster = uploaded?.source === poster ? uploaded.value : poster;

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error(t("invalidImage"));
      return;
    }

    setIsUploading(true);

    try {
      const res = await changeMoviePoster(movieKey, file);

      if (res.status === 200 && "poster" in res && res.poster) {
        setUploaded({ source: poster, value: res.poster });
        toast.success(t("updated"));
        router.refresh();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error(t("error"));
      console.error("Poster update error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <Image
        key={currentPoster}
        src={`${posterUrl}/posters/${currentPoster}`}
        alt={`${title} poster`}
        className="max-h-75 max-w-50 sm:max-h-112 sm:max-w-76"
        height={450}
        width={300}
        priority
        loading="eager"
      />

      {isAdmin && (
        <>
          <input
            ref={inputRef}
            type="file"
            accept=".webp"
            className="hidden"
            onChange={onFileChange}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isUploading}
            onClick={() => inputRef.current?.click()}
          >
            {isUploading ? <Loader2 className="animate-spin" /> : <ImagePlus />}
            {t("change")}
          </Button>
        </>
      )}
    </div>
  );
};
