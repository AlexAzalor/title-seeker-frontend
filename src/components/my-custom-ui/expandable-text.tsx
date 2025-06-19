"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

const MAX_LENGTH = 256;

type Props = {
  text: string;
  maxLength?: number;
};

export const ExpandableText = ({ text, maxLength = MAX_LENGTH }: Props) => {
  const t = useTranslations("Other");
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  if (text.length < maxLength) {
    return <p className="sm:max-w-166">{text}</p>;
  }

  return (
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
  );
};
