import { backendURL } from "@/lib/constants";
import { getKnowledgeBase } from "@/orval_api/knowledge-base/knowledge-base";
import Link from "next/link";
import type { PropsWithChildren } from "react";

type PageProps = {
  params: Promise<{ technologyKey: string; categoryKey: string }>;
};

export default async function KBQuestionAnswerLayout({
  params,
  children,
}: PropsWithChildren<PageProps>) {
  const { technologyKey, categoryKey } = await params;
  const { aPIGetKbRandomQuestions } = getKnowledgeBase();
  const { data } = await aPIGetKbRandomQuestions(technologyKey, backendURL);

  return (
    <>
      {children}

      <div>
        <h2 className="mt-12 mb-6 text-2xl font-bold text-gray-900 dark:text-white">
          Questions with low scrores
        </h2>
        <div className="flex flex-col gap-2">
          {data.questions.map((question) => (
            <Link
              href={`/knowledge-base/${categoryKey}/${technologyKey}/${question.id}`}
              key={question.id}
            >
              <div className="group rounded-xl border border-gray-200 bg-white p-1 shadow-lg transition-all duration-300 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800">
                <div className="flex items-start justify-between px-3">
                  <div className="flex-1">
                    <div className="mb-1 flex items-start">
                      <h3
                        title={question.question}
                        className="text-lg leading-tight font-semibold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400"
                      >
                        {question.question.slice(0, 60)}...
                      </h3>
                    </div>

                    {question.score}

                    {question.short_answer && (
                      <div className="">
                        <p
                          title={question.short_answer}
                          className="mb-1 leading-relaxed text-gray-600 dark:text-gray-300"
                        >
                          {question.short_answer.slice(0, 30)}...
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
