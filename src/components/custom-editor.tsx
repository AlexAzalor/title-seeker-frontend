"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import type { KBQuestionAnswerOut } from "@/orval_api/model";
import type { Editor as TinyMCEEditor } from "tinymce";

const Editor = dynamic(
  () => import("@tinymce/tinymce-react").then((m) => m.Editor),
  {
    ssr: false,
  },
);

// https://www.tiny.cloud/docs/tinymce/latest/react-pm-host/

type Props = {
  data: KBQuestionAnswerOut;
};

export const CustomEditor = ({ data }: Props) => {
  const editorRef = useRef<TinyMCEEditor | null>(null);

  const submitbtn = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };

  return (
    <>
      <h1>{data.question}</h1>

      <Editor
        tinymceScriptSrc="/tinymce/tinymce.min.js"
        licenseKey="gpl"
        onInit={(_evt, editor) => (editorRef.current = editor)}
        initialValue={data.answer}
        init={{
          save_onsavecallback: () => {
            submitbtn();
          },
          height: 500,
          width: 854,
          menubar: true,
          plugins: [
            "save",
            "accordion",
            "emoticons",
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "preview",
            "help",
            "wordcount",
            "codesample",
          ],
          toolbar:
            "save | undo redo | blocks | " +
            "bold italic forecolor | link | image | table | code | codesample | accordion | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | help",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        }}
      />
    </>
  );
};
