"use client";

import { useState } from "react";

const MAX_LENGTH = 256;

type Props = {
  text: string;
  maxLength?: number;
};

export const ExpandableText = ({ text, maxLength = MAX_LENGTH }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  if (text.length < maxLength) {
    return <p>{text}</p>;
  }

  return (
    <p>
      {isExpanded ? text : `${text.slice(0, maxLength)}...`}

      {text.length > maxLength && (
        <button
          onClick={toggleExpand}
          className="ml-1 inline cursor-pointer font-semibold text-blue-500 hover:underline"
        >
          {isExpanded ? "Less" : "More"}
        </button>
      )}
    </p>
  );
};
