"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import type { KBQuestionAnswerOut } from "@/orval_api/model";
import type { Editor as TinyMCEEditor } from "tinymce";
import { updateAnswer } from "@/app/(knowledge-base)/api/actions";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { StarRating } from "./layout/star-rating";
import { Input } from "../ui/input";

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
  const questionRef = useRef<string | null>(null);
  const scoreRef = useRef<number | null>(null);

  const router = useRouter();

  const submitbtn = async () => {
    if (!shortAnswerRef.current && !data.short_answer) {
      toast.error("Short answer ref not found");
      return;
    }
    if (!questionRef.current && !data.question) {
      toast.error("Question ref not found");
      return;
    }

    await updateAnswer({
      id: data.id,
      question: questionRef.current || data.question,
      answer: editorRef.current
        ? editorRef.current.getContent()
        : data.answer || "",
      score: scoreRef.current ? scoreRef.current : data.score,
      technology_key: "react",
      short_answer: shortAnswerRef.current || data.short_answer || "",
    });
    toast.success("Answer updated");

    router.refresh();
  };

  // const changeBackgroundColor = () => {
  //   if (editorRef.current) {
  //     editorRef.current.getBody().style.backgroundColor = "#182131";
  //     editorRef.current.getBody().style.color = "#FFFFFF";
  //   }
  // };

  return (
    <>
      <h1 className="my-3 text-center">{data.question}</h1>

      <StarRating score={data.score} scoreRef={scoreRef} />

      <span className="text-sm text-gray-400">Question</span>
      <Input
        className="mb-4"
        onChange={(e) => (questionRef.current = e.target.value)}
        defaultValue={data.question || ""}
      />
      <span className="text-sm text-gray-400">Short answer</span>
      <Textarea
        className="mb-4"
        onChange={(e) => (shortAnswerRef.current = e.target.value)}
        defaultValue={data.short_answer || ""}
      />

      {/* <Button onClick={changeBackgroundColor}>Change color</Button> */}

      <Editor
        // ?
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
          toolbar_mode: "wrap",
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
            "bold italic forecolor | fontsize | backcolor | link | image | table | code | codesample | accordion | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | help",
          content_style: "body { font-family:Helvetica,Arial,sans-serif;}",
        }}
      />
    </>
  );
};
