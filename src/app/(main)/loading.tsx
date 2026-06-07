export default function MainLoading() {
  return (
    <main className="mx-auto min-h-[60vh] max-w-6xl space-y-5 px-4 py-8">
      <div className="h-8 w-48 animate-pulse rounded-lg bg-muted" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-40 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    </main>
  );
}
