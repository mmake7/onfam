import type { Metadata } from 'next';
import { COMPANY_ADDRESS, COMPANY_PHONE, COMPANY_EMAIL, COMPANY_HOURS } from '@/lib/constants';

export const metadata: Metadata = {
  title: '문의/신청',
  description: '비온팜 도입 문의, 서비스 신청, 치유양봉 프로그램 참가 신청',
};

export default function ContactPage() {
  return (
    <>
      {/* Page Hero */}
      <section className="bg-bark-900 text-white py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 w-[30rem] h-[30rem] bg-honey-500/5 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative text-center">
          <p className="text-honey-400 font-semibold text-xs tracking-[0.2em] uppercase mb-4">Contact</p>
          <h1 className="text-4xl sm:text-5xl font-black leading-tight">
            문의 <span className="text-honey-400">& 신청</span>
          </h1>
          <p className="mt-4 text-bark-400 max-w-2xl mx-auto">
            비온팜 도입 문의, 서비스 신청, 치유양봉 프로그램 참가 등 무엇이든 물어보세요.
          </p>
        </div>
      </section>

      {/* Contact Form + Info */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Form */}
            <div>
              <h2 className="text-2xl font-extrabold text-bark-900 mb-8">문의하기</h2>
              <form className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-bark-700 mb-2">이름</label>
                    <input
                      type="text"
                      id="name"
                      placeholder="홍길동"
                      className="w-full px-4 py-3 rounded-xl border border-bark-200 focus:border-honey-400 focus:ring-2 focus:ring-honey-400/20 outline-none transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-bark-700 mb-2">연락처</label>
                    <input
                      type="tel"
                      id="phone"
                      placeholder="010-1234-5678"
                      className="w-full px-4 py-3 rounded-xl border border-bark-200 focus:border-honey-400 focus:ring-2 focus:ring-honey-400/20 outline-none transition-all text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-bark-700 mb-2">이메일</label>
                  <input
                    type="email"
                    id="email"
                    placeholder="example@email.com"
                    className="w-full px-4 py-3 rounded-xl border border-bark-200 focus:border-honey-400 focus:ring-2 focus:ring-honey-400/20 outline-none transition-all text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="type" className="block text-sm font-semibold text-bark-700 mb-2">문의 유형</label>
                  <select
                    id="type"
                    className="w-full px-4 py-3 rounded-xl border border-bark-200 focus:border-honey-400 focus:ring-2 focus:ring-honey-400/20 outline-none transition-all text-sm text-bark-600"
                  >
                    <option value="">선택하세요</option>
                    <option value="도입문의">도입 문의</option>
                    <option value="서비스신청">서비스 신청</option>
                    <option value="치유양봉">치유양봉 프로그램 참가</option>
                    <option value="기술지원">기술 지원</option>
                    <option value="기타">기타</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-bark-700 mb-2">문의 내용</label>
                  <textarea
                    id="message"
                    rows={5}
                    placeholder="문의 내용을 입력하세요..."
                    className="w-full px-4 py-3 rounded-xl border border-bark-200 focus:border-honey-400 focus:ring-2 focus:ring-honey-400/20 outline-none transition-all text-sm resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-8 py-4 text-base font-bold text-bark-900 bg-honey-400 rounded-full hover:bg-honey-300 transition-colors shadow-lg shadow-honey-200/50"
                >
                  문의하기
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-extrabold text-bark-900 mb-8">연락처 정보</h2>
              <div className="space-y-6">
                {[
                  { icon: 'location_on', title: '주소', value: COMPANY_ADDRESS },
                  { icon: 'phone', title: '전화', value: COMPANY_PHONE },
                  { icon: 'mail', title: '이메일', value: COMPANY_EMAIL },
                  { icon: 'schedule', title: '업무시간', value: COMPANY_HOURS },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-4 p-5 bg-bark-50 rounded-2xl border border-bark-200">
                    <div className="w-10 h-10 rounded-xl bg-honey-50 flex items-center justify-center shrink-0">
                      <span className="material-icons-outlined text-honey-600">{item.icon}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-bark-900 text-sm">{item.title}</h4>
                      <p className="text-sm text-bark-500 mt-1">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Map Placeholder */}
              <div className="mt-8 rounded-2xl overflow-hidden border border-bark-200">
                <img
                  src="https://placehold.co/600x300/E7E5E4/57534E?text=Map+Location&font=raleway"
                  alt="오시는 길"
                  className="w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
