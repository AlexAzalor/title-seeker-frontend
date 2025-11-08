import { backendURL } from "@/lib/constants";
import { getKnowledgeBase } from "@/orval_api/knowledge-base/knowledge-base";
import Link from "next/link";
import { BookOpen, ArrowRight, Lightbulb } from "lucide-react";
import { AddNewCategoryForm } from "@/components/knowledge-base/forms/add-new-category";

// Need?
export const dynamic = "force-dynamic";

export default async function KnowledgeBasePage() {
  const { aPIGetKbCategories } = getKnowledgeBase();
  const { data } = await aPIGetKbCategories(backendURL);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <div className="mb-4 flex items-center justify-center">
            <BookOpen className="mr-3 h-12 w-12 text-blue-600 dark:text-blue-400" />
            <h1 className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-4xl font-bold text-transparent md:text-5xl dark:from-blue-400 dark:to-indigo-400">
              Knowledge Base
            </h1>
          </div>
          <p className="mx-auto max-w-2xl text-xl text-gray-600 dark:text-gray-300">
            Explore our comprehensive collection of guides, tutorials, and
            resources
          </p>
        </div>
        <AddNewCategoryForm />

        {/* Categories Grid */}
        <div className="flex flex-wrap justify-center gap-3">
          {data.categories.map((category) => (
            <Link
              href={`/knowledge-base/${category.key}`}
              key={category.key}
              className="group block w-100"
            >
              <div className="transform overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl dark:border-gray-700 dark:bg-gray-800">
                {/* Card Header */}
                <div className="p-6 pb-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900/50">
                      <Lightbulb className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <ArrowRight className="h-5 w-5 transform text-gray-400 transition-all duration-300 group-hover:translate-x-1 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                  </div>

                  <h3 className="mb-2 text-xl font-semibold text-gray-900 transition-colors duration-300 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                    {category.name}
                  </h3>

                  <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                    {category.description}
                  </p>
                </div>

                {/* Card Footer */}
                <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-600 dark:bg-gray-700/50">
                  <span className="text-sm font-medium text-blue-600 transition-colors duration-300 group-hover:text-blue-700 dark:text-blue-400 dark:group-hover:text-blue-300">
                    Explore Category →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        {/* Empty State */}
        {data.categories.length === 0 && (
          <div className="py-16 text-center">
            <BookOpen className="mx-auto mb-4 h-16 w-16 text-gray-400" />
            <h3 className="mb-2 text-xl font-semibold text-gray-600 dark:text-gray-300">
              No categories available
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Check back later for new knowledge base content
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
