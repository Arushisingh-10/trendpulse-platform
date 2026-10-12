export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-48 animate-pulse rounded-2xl bg-gray-100" />
        ))}
      </div>
    </div>
  );
}