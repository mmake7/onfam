'use client';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ko">
      <body className="bg-neutral-900 text-white">
        <section className="min-h-screen flex items-center justify-center">
          <div className="max-w-md mx-auto px-4 text-center">
            <h1 className="text-6xl font-black text-amber-400 mb-4">500</h1>
            <h2 className="text-2xl font-bold mb-4">오류가 발생했습니다</h2>
            <p className="text-neutral-400 mb-8">
              잠시 후 다시 시도해 주세요.
            </p>
            <button
              onClick={() => reset()}
              className="px-8 py-3 font-semibold text-neutral-900 bg-amber-400 rounded-full hover:bg-amber-300 transition-colors"
            >
              다시 시도
            </button>
          </div>
        </section>
      </body>
    </html>
  );
}
