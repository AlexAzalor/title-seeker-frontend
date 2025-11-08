"use client";

import type { KBTechnologyOut } from "@/orval_api/model";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Code, ChevronRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { MasteryProgress } from "./mastery-progress";

type Props = {
  categoryKey: string;
  technologies: KBTechnologyOut[];
  children?: React.ReactNode;
};

export const Technologies = ({
  technologies,
  categoryKey,
  children,
}: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  // Check if we're on a specific technology page
  // const selectedTech = pathname.split("/").pop();

  const isOnTechPage =
    pathname.startsWith(`/knowledge-base/${categoryKey}/`) &&
    pathname.split("/").length > 3;

  return (
    <>
      {/* Centered Tiles View - shown when no technology is selected */}
      {!isOnTechPage && (
        <div className="mb-12 text-center">
          <div className="mb-6 flex items-center justify-center">
            <Code className="mr-3 h-10 w-10 text-blue-600 dark:text-blue-400" />
            <h1 className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-3xl font-bold text-transparent md:text-4xl dark:from-blue-400 dark:to-indigo-400">
              Technologies
            </h1>
          </div>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            Select a technology to explore questions and answers
          </p>

          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {technologies.map((tech) => {
              return (
                <Link
                  key={tech.key}
                  href={`/knowledge-base/${categoryKey}/${tech.key}`}
                  className="group"
                >
                  <div className="h-full transform rounded-xl border border-gray-200 bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 transition-transform duration-300 group-hover:scale-110">
                        <Code className="h-8 w-8 text-white" />
                      </div>

                      <h3 className="mb-2 text-xl font-semibold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                        {tech.name}
                      </h3>

                      <MasteryProgress progress={tech.mastery_progress} />

                      <p className="mb-4 flex-1 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                        {tech.description}
                      </p>

                      <div className="flex items-center font-medium text-blue-600 transition-colors group-hover:text-blue-700 dark:text-blue-400 dark:group-hover:text-blue-300">
                        <span className="text-sm">Explore</span>
                        <ChevronRight className="ml-1 h-4 w-4 transform transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
      <div
        className={cn(
          "grid grid-cols-[minmax(200px,auto)_1fr] justify-items-center gap-2 px-4 py-8",
          pathname.split("/").length > 4 &&
            "grid-cols-[minmax(200px,auto)_1fr_minmax(200px,auto)]",
        )}
      >
        {/* Sidebar View - shown when a technology is selected */}
        {isOnTechPage && (
          <div className="flex gap-8">
            <div className="sticky top-8 h-fit w-80 rounded-xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Technologies
                </h2>
                <div
                  onClick={() => router.back()}
                  className="flex cursor-pointer items-center text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <ArrowLeft className="mr-1 h-4 w-4" />
                  <span className="text-sm">Back</span>
                </div>
              </div>

              <div className="space-y-3">
                {technologies.map((tech) => {
                  const isSelected = pathname.split("/")[3] === tech.key;

                  return (
                    <Link
                      key={tech.key}
                      href={`/knowledge-base/${categoryKey}/${tech.key}`}
                      className={`block rounded-lg p-3 transition-all duration-200 ${
                        isSelected
                          ? "border-2 border-blue-200 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/30"
                          : "border-2 border-transparent bg-gray-50 hover:border-gray-200 hover:bg-gray-100 dark:bg-gray-700/50 dark:hover:border-gray-600 dark:hover:bg-gray-700"
                      }`}
                    >
                      <div className="flex items-center">
                        <div
                          className={`mr-3 flex h-10 w-10 items-center justify-center rounded-lg ${
                            isSelected
                              ? "bg-blue-500 text-white"
                              : "bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300"
                          }`}
                        >
                          <Code className="h-5 w-5" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p
                            className={`mb-2 text-lg font-medium ${
                              isSelected
                                ? "text-blue-700 dark:text-blue-300"
                                : "text-gray-900 dark:text-white"
                            }`}
                          >
                            {tech.name}
                          </p>
                          <MasteryProgress
                            progress={tech.mastery_progress}
                            size="compact"
                          />
                        </div>

                        {isSelected && (
                          <ChevronRight className="h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="flex-1">
              {/* Questions content will be rendered here */}
            </div>
          </div>
        )}
        {children}
      </div>
    </>
  );
};
