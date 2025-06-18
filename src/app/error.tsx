"use client"; // Error boundaries must be Client Components

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-100">
      <div className="flex flex-col items-center gap-6 rounded-lg bg-white p-8 shadow-lg">
        <h1 className="text-danger text-5xl font-extrabold">500</h1>
        <h2 className="text-2xl font-bold text-gray-800">
          Internal Server Error
        </h2>
        <p className="mb-4 text-lg text-gray-600">
          Sorry, something went wrong on our end.
          <br />
          {error?.message && (
            <span className="mt-2 block text-sm text-gray-400">
              {error.message}
            </span>
          )}
        </p>
        <button
          onClick={reset}
          className="rounded bg-blue-500 px-6 py-2 font-semibold text-white transition hover:bg-blue-600"
          aria-label="Try again"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
