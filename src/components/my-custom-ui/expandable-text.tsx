"use client";

import { getMovieDescription } from "@/app/(app)/services/admin-api";
import { checkIfAdmin } from "@/proxy";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import CustomModal from "./custom-modal";
import { useModal } from "@/hooks/use-modal";
import { type EditMovieDescriptionType } from "@/types/movie-schema";
import { EditMovieDescription } from "../movie/movie-page/edit/movie-description";
const MAX_LENGTH = 256;

type Props = {
  movieKey: string;
  text: string;
  maxLength?: number;
};

export const MovieDescription = ({
  movieKey,
  text,
  maxLength = MAX_LENGTH,
}: Props) => {
  const t = useTranslations("Other");
  const session = useSession();
  const [isExpanded, setIsExpanded] = useState(false);

  const [descriptionData, setDescriptionData] =
    useState<EditMovieDescriptionType | null>(null);

  const { isOpen, open, close } = useModal();

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const loadMovieDescription = async () => {
    try {
      const res = await getMovieDescription(movieKey);

      if (res.status === 200 && res.data) {
        setDescriptionData(res.data);
      } else {
        toast.error(res.message);
        setDescriptionData(null);
      }
    } catch (error) {
      toast.error("An error occurred while fetching the movie description");
      console.error("Fetch movie description error:", error);
      setDescriptionData(null);
    }
  };

  const handleEdit = () => {
    open();
    loadMovieDescription();
  };

  return (
    <>
      {checkIfAdmin(session.data?.user.role) && (
        <Button variant="link" className="h-7 p-0" onClick={handleEdit}>
          Edit
        </Button>
      )}

      {text.length < maxLength ? (
        <p className="sm:max-w-166">{text}</p>
      ) : (
        <p className="sm:max-w-166">
          {isExpanded ? text : `${text.slice(0, maxLength)}...`}

          {text.length > maxLength && (
            <button
              onClick={toggleExpand}
              className="text-form-ui-blue ml-1 inline cursor-pointer font-semibold hover:underline"
            >
              {isExpanded ? t("less") : t("more")}
            </button>
          )}
        </p>
      )}

      {isOpen && (
        <CustomModal isOpen={isOpen} onClose={close}>
          {descriptionData && (
            <EditMovieDescription
              movieKey={movieKey}
              descriptionData={descriptionData}
            />
          )}
        </CustomModal>
      )}
    </>
  );
};
