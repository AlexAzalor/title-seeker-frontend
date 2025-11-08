"use client";

import type { KBQuestionAnswerOut } from "@/orval_api/model";
import { CustomEditor } from "./custom-editor";
import { useEffect, useState } from "react";

import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css"; // Enable Prism.js default theme
// Additional language support
import "prismjs/components/prism-python";
import "prismjs/components/prism-typescript";
import { useSession } from "next-auth/react";
import { checkIfOwner } from "@/middleware";
import { StarRating } from "./layout/star-rating";

type Props = {
  data: KBQuestionAnswerOut;
};

export const QuestionAnswer = ({ data }: Props) => {
  const session = useSession();
  const [openEditor, setOpenEditor] = useState(false);

  useEffect(() => {
    Prism.highlightAll();
  }, [openEditor]);

  return (
    <>
      {checkIfOwner(session.data?.user.role) && (
        <div className="flex">
          <button
            className="mx-auto rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
            onClick={() => setOpenEditor((p) => !p)}
          >
            {!openEditor ? "Edit Answer" : "Close Editor"}
          </button>
        </div>
      )}

      {openEditor && <CustomEditor data={data} />}

      {!openEditor && (
        <div className="prose w-[854px]">
          <h1 className="my-3 text-center">{data.question}</h1>
          <StarRating score={data.score} readonly />
          <div dangerouslySetInnerHTML={{ __html: data.answer || "" }} />
        </div>
      )}
    </>
  );
};
