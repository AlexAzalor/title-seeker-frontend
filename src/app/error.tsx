"use client"; // Error boundaries must be Client Components

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h1>Error 500</h1>
      <h2>Something went wrong! - see backend logs.</h2>
    </div>
  );
}
