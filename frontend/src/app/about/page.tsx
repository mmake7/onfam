import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '회사소개',
  description: '농업회사법인 ㈜온팜 회사 소개 — 비전, 연혁, 파트너십',
};

export default function AboutPage() {
  return (
    <>
      {/* Page Hero */}
      <section className="bg-bark-900 text-white py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-[30rem] h-[30rem] bg-honey-500/5 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative text-center">
          <p className="text-honey-400 font-semibold text-xs tracking-[0.2em] uppercase mb-4">About Us</p>
          <h1 className="text-4xl sm:text-5xl font-black leading-tight">
            비온팜 <span className="text-honey-400">소개</span>
          </h1>
          <p className="mt-4 text-bark-400 max-w-2xl mx-auto">
            농업회사법인 ㈜온팜의 비전, 연혁, 그리고 파트너십을 소개합니다.
          </p>
        </div>
      </section>

      {/* Vision */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1">
              <div className="relative">
                <img
                  src="https://placehold.co/640x480/1C1917/FFC72C?text=Our+Vision&font=raleway"
                  alt="비온팜 비전"
                  className="w-full rounded-3xl shadow-2xl object-cover aspect-[4/3]"
                />
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-honey-100 rounded-2xl -z-10" />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-honey-600 font-semibold text-xs tracking-[0.2em] uppercase mb-4">Our Vision</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-bark-900 leading-tight">
                기술로 연결하는 <span className="text-honey-600">지속가능한 양봉</span>
              </h2>
              <p className="mt-6 text-bark-500 leading-relaxed">
                비온팜(BeeOnFarm)은 농업회사법인 ㈜온팜이 개발한 디지털 양봉 플랫폼입니다. IoT 센서,
                인공지능 분석, 모바일 원격제어 기술을 결합하여 양봉 농가의 생산성을 높이고, 소비자에게는
                투명한 꿀 생산 이력을 제공합니다.
              </p>
              <p className="mt-4 text-bark-500 leading-relaxed">
                우리는 꿀벌이 건강한 생태계의 핵심이라고 믿습니다. 첨단 기술을 통해 양봉 농가를 지원하고,
                꿀벌의 건강을 지키며, 소비자에게 안전하고 투명한 꿀을 제공하는 것이 비온팜의 사명입니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 lg:py-32 bg-bark-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-honey-600 font-semibold text-xs tracking-[0.2em] uppercase mb-4">History</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-bark-900">회사 <span className="text-honey-600">연혁</span></h2>
          </div>
          <div className="space-y-8">
            {[
              { year: '2026', items: ['IoT 센서 3.0 전국 배포', 'AI 예측 모델 고도화', '밀원지도 전국 서비스'] },
              { year: '2025', items: ['치유양봉 프로그램 8개 지역 운영', '모바일 앱 v4.0 출시', '등록 농가 500개 돌파'] },
              { year: '2024', items: ['비온팜 플랫폼 정식 출시', '퓨르메재단 협약 체결', 'IoT 센서 2.0 개발'] },
              { year: '2023', items: ['농업회사법인 ㈜온팜 설립', '디지털 양봉 시스템 R&D 착수'] },
            ].map((timeline) => (
              <div key={timeline.year} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-honey-400 flex items-center justify-center text-bark-900 font-black text-sm shrink-0">
                    {timeline.year.slice(2)}
                  </div>
                  <div className="w-0.5 flex-1 bg-bark-200 mt-2" />
                </div>
                <div className="pb-8">
                  <h3 className="text-xl font-bold text-bark-900 mb-3">{timeline.year}</h3>
                  <ul className="space-y-2">
                    {timeline.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-bark-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-honey-400 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-honey-600 font-semibold text-xs tracking-[0.2em] uppercase mb-4">Partners</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-bark-900">
            함께하는 <span className="text-honey-600">파트너</span>
          </h2>
          <p className="mt-4 text-bark-500 max-w-2xl mx-auto">
            비온팜은 다양한 기관 및 단체와 협력하여 양봉 산업의 발전에 기여하고 있습니다.
          </p>
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
            {['퓨르메재단', '농림축산식품부', '한국양봉협회', '전북테크노파크'].map((partner) => (
              <div
                key={partner}
                className="bg-bark-50 rounded-2xl p-8 flex items-center justify-center border border-bark-200 hover:border-honey-300 hover:shadow-md transition-all"
              >
                <span className="text-bark-600 font-bold text-sm">{partner}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
