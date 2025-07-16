import type { PageProps } from "@/types/general";

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;
  return (
    <div className="min-h-screen">
      <h1 className="p-5 text-3xl">Series: {slug}</h1>
    </div>
  );
}
