import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '개인정보처리방침',
  description: '비온팜(BeeOnFarm) 개인정보처리방침',
};

export default function PrivacyPage() {
  return (
    <>
      <section className="bg-bark-900 text-white py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-[18rem] sm:w-[30rem] h-[18rem] sm:h-[30rem] bg-honey-500/5 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative text-center">
          <p className="text-honey-400 font-semibold text-xs tracking-[0.2em] uppercase mb-4">Privacy Policy</p>
          <h1 className="text-4xl sm:text-5xl font-black leading-tight">
            개인정보<span className="text-honey-400">처리방침</span>
          </h1>
        </div>
      </section>

      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="prose prose-bark max-w-none">
            <div className="bg-bark-50 rounded-2xl p-8 border border-bark-200 text-center">
              <span className="material-icons-outlined text-5xl text-bark-300 mb-4 block">shield</span>
              <h2 className="text-xl font-bold text-bark-900 mb-2">개인정보처리방침 준비 중</h2>
              <p className="text-bark-500 text-sm">
                개인정보처리방침 페이지가 현재 준비 중입니다. 자세한 내용은 문의해 주세요.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 mt-6 px-6 py-3 text-sm font-bold text-bark-900 bg-honey-400 rounded-full hover:bg-honey-300 transition-colors"
              >
                문의하기
                <span className="material-icons-outlined text-lg">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
