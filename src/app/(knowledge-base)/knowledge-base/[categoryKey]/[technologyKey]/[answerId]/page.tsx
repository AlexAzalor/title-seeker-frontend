import { QuestionAnswer } from "@/components/question-answer";
import { backendURL } from "@/lib/constants";
import { getKnowledgeBase } from "@/orval_api/knowledge-base/knowledge-base";

type PageProps = {
  params: Promise<{ answerId: number }>;
};

export default async function KBQuestionAnswerPage({ params }: PageProps) {
  const { answerId } = await params;

  const answerIdNum = Number(answerId);
  if (isNaN(answerIdNum)) {
    return <div>Invalid answer ID</div>;
  }

  const { aPIGetQuestionAnswer } = getKnowledgeBase();
  const { data } = await aPIGetQuestionAnswer(answerIdNum, backendURL);

  return <div className="text-center">{<QuestionAnswer data={data} />}</div>;
}
