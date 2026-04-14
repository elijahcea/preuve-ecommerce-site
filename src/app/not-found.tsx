import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="m-auto">
      <h2 className="text-2xl md:text-3xl font-semibold">
        404 | Page Not Found
      </h2>
      <Link href="/" className="flex items-center justify-center gap-2 mt-8">
        Home
        <ArrowRightIcon className="size-4" aria-disabled />
      </Link>
    </div>
  );
}
