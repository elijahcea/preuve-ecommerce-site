"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button className="cursor-pointer" onClick={() => reset()}>
        Try again
      </button>
    </div>
  );
}
