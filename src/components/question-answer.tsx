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

type Props = {
  data: KBQuestionAnswerOut;
};

export const QuestionAnswer = ({ data }: Props) => {
  const [openEditor, setOpenEditor] = useState(false);

  useEffect(() => {
    Prism.highlightAll();
  }, [openEditor]);

  return (
    <>
      <button
        className="rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
        onClick={() => setOpenEditor((p) => !p)}
      >
        {!openEditor ? "Edit Answer1" : "Close Editor"}
      </button>

      {openEditor && <CustomEditor data={data} />}

      {!openEditor && (
        <div className="prose w-[854px]">
          <h1>{data.question}</h1>
          <div>{data.score}</div>
          <div dangerouslySetInnerHTML={{ __html: data.answer }} />
        </div>
      )}
    </>
  );
};
