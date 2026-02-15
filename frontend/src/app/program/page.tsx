import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '프로그램',
  description: '비온팜 교육센터와 치유양봉 프로그램 안내',
};

export default function ProgramPage() {
  return (
    <>
      {/* Page Hero */}
      <section className="bg-bark-900 text-white py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-[30rem] h-[30rem] bg-honey-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-[40rem] h-[40rem] bg-bee-400/[0.08] rounded-full blur-3xl" />
        </div>
        <div className="absolute inset-0 opacity-[0.04]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="honeycomb-program" x="0" y="0" width="56" height="100" patternUnits="userSpaceOnUse" patternTransform="scale(2)">
                <path d="M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100" fill="none" stroke="#FFC72C" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#honeycomb-program)" />
          </svg>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-honey-500/10 border border-honey-500/20 rounded-full text-honey-400 text-sm font-medium mb-6">
            <span className="material-icons-outlined text-base">school</span>
            교육 & 치유
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
            교육센터 & <span className="text-honey-400">치유양봉</span>
          </h1>
          <p className="text-bark-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            양봉 입문부터 전문가 과정까지, 그리고 치유양봉 프로그램을 만나보세요.
          </p>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <p className="text-honey-600 font-semibold text-xs tracking-[0.2em] uppercase mb-4">Programs</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-bark-900 leading-tight">
              교육 <span className="text-honey-600">프로그램</span>
            </h2>
            <p className="mt-4 text-bark-500 max-w-2xl mx-auto">
              비온팜 교육센터에서 제공하는 양봉 교육 프로그램을 소개합니다.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { badge: '입문', badgeColor: 'honey', icon: 'eco', title: '양봉 입문 과정', duration: '4주 과정', capacity: '정원 20명', desc: '양봉의 기초 이론부터 실습까지, 초보자를 위한 단계별 교육 프로그램입니다.' },
              { badge: '실전', badgeColor: 'bee', icon: 'hive', title: '실전 양봉 과정', duration: '8주 과정', capacity: '정원 15명', desc: '현장 실습 중심의 실전 양봉 기술을 배우는 중급자 과정입니다.' },
              { badge: '전문가', badgeColor: 'farm', icon: 'hub', title: '스마트 양봉 전문가', duration: '12주 과정', capacity: '정원 12명', desc: 'IoT 센서, AI 데이터 분석, 모바일 관리 등 첨단 디지털 양봉 기술을 마스터합니다.' },
            ].map((program) => (
              <div
                key={program.title}
                className="group bg-white rounded-3xl overflow-hidden border border-bark-200 hover:border-honey-300 hover:shadow-2xl hover:shadow-honey-100/50 transition-all duration-500 hover:-translate-y-1"
              >
                <div className={`h-48 bg-gradient-to-br from-${program.badgeColor}-50 to-${program.badgeColor}-100 flex items-center justify-center`}>
                  <span className={`material-icons-outlined text-6xl text-${program.badgeColor}-400 group-hover:scale-110 transition-transform duration-500`}>
                    {program.icon}
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-3 py-1 text-xs font-bold bg-${program.badgeColor}-100 text-${program.badgeColor}-700 rounded-full`}>
                      {program.badge}
                    </span>
                    <span className="text-xs text-bark-400 flex items-center gap-1">
                      <span className="material-icons-outlined text-sm">schedule</span>
                      {program.duration}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-bark-900 mb-2">{program.title}</h3>
                  <p className="text-sm text-bark-500 leading-relaxed mb-4">{program.desc}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-bark-100">
                    <div className="flex items-center gap-1 text-bark-400 text-xs">
                      <span className="material-icons-outlined text-sm">people</span>
                      {program.capacity}
                    </div>
                    <a href="/contact" className="text-honey-600 text-sm font-bold hover:text-honey-500 transition-colors flex items-center gap-1">
                      신청하기 <span className="material-icons-outlined text-base">arrow_forward</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-bark-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-bark-900 mb-4">
            프로그램에 참여하고 싶으신가요?
          </h2>
          <p className="text-bark-500 mb-8 max-w-xl mx-auto">
            교육 프로그램 및 치유양봉 참가 신청은 문의/신청 페이지에서 가능합니다.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 text-base font-bold text-bark-900 bg-honey-400 rounded-full hover:bg-honey-300 transition-colors"
          >
            참여 신청하기
            <span className="material-icons-outlined text-lg">arrow_forward</span>
          </a>
        </div>
      </section>
    </>
  );
}
