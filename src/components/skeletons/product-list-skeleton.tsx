export default function ProductListSkeleton() {
  const cards = [];
  for (let i = 0; i < 8; i++) {
    cards.push(<li key={i} className="h-50 md:h-95 rounded bg-gray-200"></li>);
  }
  return (
    <div className="animate-pulse">
      <div className="bg-gray-200 rounded py-9"></div>
      <ul className="grid grid-cols-2 md:grid-cols-4 auto-rows-auto gap-x-2 gap-y-4 py-4">
        {cards.map((card) => card)}
      </ul>
    </div>
  );
}
