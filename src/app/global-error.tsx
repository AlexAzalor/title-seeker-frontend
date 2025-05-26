"use client";
import { signOut } from "next-auth/react";

// Error boundaries must be Client Components

// TODO: Style this error page
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
      <body>
        <h2>Something went wrong!</h2>
        <button onClick={() => reset()}>Try again</button>
        <p>OR</p>
        <h3>Sign out</h3>
        <button onClick={() => signOut({ redirectTo: "/" })}>Sign out</button>
      </body>
    </html>
  );
}
