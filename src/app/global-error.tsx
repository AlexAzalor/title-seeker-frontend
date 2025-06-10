"use client";
import { signOut } from "next-auth/react";

// Error boundaries must be Client Components

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    // global-error must include html and body tags
    <html>
      <body className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-100 text-gray-900">
        <h1 className="mb-4 text-4xl font-bold">Something went wrong</h1>
        <p className="mb-4">{error.message}</p>
        <button
          onClick={() => {
            reset();
          }}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Try again
        </button>
        <p>OR</p>
        <button onClick={() => signOut({ redirectTo: "/" })}>Sign out</button>
      </body>
    </html>
  );
}
