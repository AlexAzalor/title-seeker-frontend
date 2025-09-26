"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import type { KBQuestionAnswerOut } from "@/orval_api/model";
import type { Editor as TinyMCEEditor } from "tinymce";
import { updateAnswer } from "@/app/(knowledge-base)/api/actions";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";

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
  const shortAnswerRef = useRef<string | null>(null);

  const submitbtn = async () => {
    if (!shortAnswerRef.current && !data.short_answer) {
      toast.error("Short answer ref not found");
      return;
    }
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }

    await updateAnswer({
      id: data.id,
      question: data.question,
      answer: editorRef.current ? editorRef.current.getContent() : data.answer,
      score: data.score,
      technology_key: "react",
      short_answer: shortAnswerRef.current || data.short_answer,
    });
    toast.success("Answer updated");
  };

  return (
    <>
      <h1>{data.question}</h1>

      <Textarea
        onChange={(e) => (shortAnswerRef.current = e.target.value)}
        defaultValue={data.short_answer || ""}
      />

      <Editor
        tinymceScriptSrc="/tinymce/tinymce.min.js"
        licenseKey="gpl"
        onInit={(_evt, editor) => (editorRef.current = editor)}
        initialValue={data.answer || ""}
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
