import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <h1 className="text-danger mb-4 text-6xl font-bold">404</h1>
      <p className="mb-6 text-xl text-gray-700 dark:text-gray-300">
        Page Not Found
      </p>
      <Link href="/" className="text-blue-500 hover:underline">
        Go back to Home
      </Link>
    </div>
  );
}
