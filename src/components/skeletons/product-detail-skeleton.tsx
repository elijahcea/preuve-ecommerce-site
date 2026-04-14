export default function ProductDetailSkeleton() {
  return (
    <div className="h-220 grid grid-cols-1 md:grid-cols-2 gap-2 items-start animate-pulse">
      <div className="h-full bg-gray-200 rounded"></div>
      <div className="flex flex-col gap-4 justify-start p-6">
        <div className="px-6 py-3 rounded bg-gray-200"></div>
        <div className="px-12 py-8 rounded bg-gray-200"></div>

        <div className="px-6 py-3 rounded bg-gray-200"></div>
        <div className="px-6 py-3 rounded bg-gray-200"></div>
      </div>
    </div>
  );
}
