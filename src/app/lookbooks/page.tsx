import { ArrowLongRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function Lookbooks() {
  return (
    <main className="m-auto flex flex-col gap-4">
      <h1 className="font-semibold">Coming soon</h1>
      <p>Lookbooks in progress. Stay tuned.</p>
      <Link href="/" className="inline-flex items-center gap-1 mx-auto">
        Home <ArrowLongRightIcon className="size-4" />
      </Link>
    </main>
  );
}
