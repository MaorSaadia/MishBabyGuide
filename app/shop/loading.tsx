export default function ShopLoading() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.18),_transparent_38%),linear-gradient(to_bottom,_#f8fafc,_#ffffff)] dark:bg-[radial-gradient(circle_at_top,_rgba(6,182,212,0.2),_transparent_30%),linear-gradient(to_bottom,_#0f172a,_#020617)]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-cyan-100/80 bg-white/80 p-8 shadow-xl shadow-cyan-950/5 dark:border-cyan-950/60 dark:bg-gray-900/70">
          <div className="h-4 w-28 animate-pulse rounded-full bg-cyan-100 dark:bg-cyan-950/60" />
          <div className="mt-5 h-12 w-3/4 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />
          <div className="mt-4 h-20 animate-pulse rounded-3xl bg-gray-100 dark:bg-gray-800" />
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="h-[31rem] animate-pulse rounded-3xl border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
