import { backendURL } from "@/lib/constants";
import { getKnowledgeBase } from "@/orval_api/knowledge-base/knowledge-base";
import Link from "next/link";
import type { PropsWithChildren } from "react";
import { ArrowRight, HelpCircle } from "lucide-react";
import { AddNewQuestionForm } from "@/components/knowledge-base/forms/add-new-question";

type PageProps = {
  params: Promise<{ categoryKey: string; technologyKey: string }>;
};

export default async function KBQuestionsPage({
  params,
}: PropsWithChildren<PageProps>) {
  const { categoryKey, technologyKey } = await params;
  const { aPIGetTechnologyQuestions } = getKnowledgeBase();
  const { data } = await aPIGetTechnologyQuestions(technologyKey, backendURL);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="mb-4 flex items-center">
          <HelpCircle className="mr-3 h-8 w-8 text-blue-600 dark:text-blue-400" />
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl dark:text-white">
            Questions & Answers
          </h1>
        </div>
        <AddNewQuestionForm technologyKey={technologyKey} />
        <p className="text-gray-600 dark:text-gray-300">
          Explore commonly asked questions about{" "}
          {technologyKey
            .replace("-", " ")
            .replace(/\b\w/g, (l) => l.toUpperCase())}
        </p>
      </div>

      {/* Questions Grid */}
      {data.questions.length > 0 ? (
        <div className="max-w-[1072px] space-y-6">
          {data.questions.map((question, index) => (
            <div
              key={question.id}
              className="group rounded-xl border border-gray-200 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-3 flex items-start">
                    <div className="mr-3 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/50">
                      <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                        {index + 1}
                      </span>
                    </div>

                    <Link
                      href={`/knowledge-base/${categoryKey}/${technologyKey}/${question.id}`}
                      className="group/link inline-flex items-center text-lg leading-tight font-semibold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400"
                    >
                      {question.question}
                      <ArrowRight className="ml-1 h-4 w-4 transform transition-transform group-hover/link:translate-x-1" />
                    </Link>
                  </div>

                  <div className="ml-11">
                    <div>{4}</div>
                    <p className="mb-4 leading-relaxed text-gray-600 dark:text-gray-300">
                      {question.short_answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-16 text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <HelpCircle className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="mb-2 text-xl font-semibold text-gray-600 dark:text-gray-300">
            No questions available
          </h3>
          <p className="mx-auto max-w-md text-gray-500 dark:text-gray-400">
            There are currently no questions for this technology. Check back
            later for new content.
          </p>
        </div>
      )}
    </div>
  );
}
