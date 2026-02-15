import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '솔루션(제품소개)',
  description: '비온팜 디지털 양봉 시스템의 주요 기능과 솔루션을 소개합니다.',
};

const FEATURES = [
  { icon: 'thermostat', gradient: 'from-red-400 to-farm-500', shadow: 'shadow-farm-200/50', title: '온도 모니터링', desc: '봉군 내부 온도를 0.1도 단위로 실시간 측정합니다. 이상 온도 감지 시 즉시 알림을 발송하여 봉군 손실을 예방합니다.' },
  { icon: 'water_drop', gradient: 'from-blue-400 to-blue-600', shadow: 'shadow-blue-200/50', title: '습도 모니터링', desc: '봉군 습도를 정밀 측정하여 꿀의 수분 함량을 관리합니다. 최적 습도 유지로 고품질 꿀 생산을 돕습니다.' },
  { icon: 'co2', gradient: 'from-bark-500 to-bark-700', shadow: 'shadow-bark-200/50', title: 'CO₂ 모니터링', desc: '이산화탄소 농도 변화를 통해 봉군의 활동량과 건강 상태를 파악합니다. 비정상 패턴 감지 시 조기 경보합니다.' },
  { icon: 'analytics', gradient: 'from-honey-400 to-honey-600', shadow: 'shadow-honey-200/50', title: '꿀 수확 예측', desc: '무게 센서와 AI 알고리즘으로 꿀 축적량을 분석하고 최적의 수확 시기를 예측합니다. 수확량을 최대 30% 향상시킵니다.' },
  { icon: 'hive', gradient: 'from-bee-400 to-bee-600', shadow: 'shadow-bee-200/50', title: '봉세 유지 관리', desc: '소리 분석과 활동 패턴으로 봉군의 세력을 실시간 진단합니다. 분봉 징후, 여왕벌 이상 등을 자동으로 감지합니다.' },
  { icon: 'dashboard', gradient: 'from-violet-400 to-violet-600', shadow: 'shadow-violet-200/50', title: '통합 대시보드', desc: '모든 봉군 데이터를 한 화면에서 직관적으로 확인합니다. 그래프, 차트, 지도 뷰로 농장 전체 현황을 한눈에 파악합니다.' },
];

export default function SolutionsPage() {
  return (
    <>
      {/* Page Hero */}
      <section className="bg-bark-900 text-white py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute bottom-0 left-10 w-[30rem] h-[30rem] bg-honey-500/5 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative text-center">
          <p className="text-honey-400 font-semibold text-xs tracking-[0.2em] uppercase mb-4">Solutions</p>
          <h1 className="text-4xl sm:text-5xl font-black leading-tight">
            솔루션 <span className="text-honey-400">제품소개</span>
          </h1>
          <p className="mt-4 text-bark-400 max-w-2xl mx-auto">
            첨단 IoT 센서와 AI 분석으로 양봉 농가의 생산성과 효율성을 극대화하는 핵심 기능입니다.
          </p>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-honey-600 font-semibold text-xs tracking-[0.2em] uppercase mb-4">Core Features</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-bark-900 leading-tight">
              비온팜의 <span className="text-honey-600">주요 기능</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="group bg-bark-50 rounded-3xl p-8 hover:bg-white hover:shadow-xl hover:shadow-honey-100/50 border border-transparent hover:border-honey-200 transition-all duration-300"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-6 shadow-lg ${f.shadow} group-hover:scale-110 transition-transform`}>
                  <span className="material-icons-outlined text-white text-3xl">{f.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-bark-900 mb-3">{f.title}</h3>
                <p className="text-sm text-bark-500 leading-relaxed">{f.desc}</p>
                <div className="mt-6 flex items-center gap-2 text-honey-600 text-sm font-semibold group-hover:gap-3 transition-all">
                  <span>자세히 보기</span>
                  <span className="material-icons-outlined text-lg">arrow_forward</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile Control */}
      <section className="py-24 lg:py-32 bg-bark-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Phone Mockup */}
            <div className="flex-1 flex justify-center">
              <div className="relative">
                <div className="w-64 sm:w-72 bg-bark-900 rounded-[2.5rem] p-3 shadow-2xl">
                  <div className="bg-bark-800 rounded-[2rem] overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-2 text-white text-[10px]">
                      <span>9:41</span>
                      <div className="flex items-center gap-1">
                        <span className="material-icons-outlined text-xs">signal_cellular_alt</span>
                        <span className="material-icons-outlined text-xs">wifi</span>
                        <span className="material-icons-outlined text-xs">battery_full</span>
                      </div>
                    </div>
                    <div className="px-4 pb-6">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="material-icons-outlined text-honey-400 text-xl">hexagon</span>
                        <span className="text-white text-sm font-bold">BeeOnFarm</span>
                      </div>
                      <div className="bg-bark-700/50 rounded-xl p-4 mb-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-bark-400 text-[10px]">봉군 #A-12 온도</span>
                          <span className="text-bee-400 text-[10px] font-bold">정상</span>
                        </div>
                        <div className="flex items-end gap-1">
                          <span className="text-3xl font-black text-white">34.8</span>
                          <span className="text-bark-400 text-sm mb-1">°C</span>
                        </div>
                        <div className="mt-3 h-1 bg-bark-600 rounded-full overflow-hidden">
                          <div className="h-full w-3/4 bg-gradient-to-r from-bee-400 to-honey-400 rounded-full" />
                        </div>
                      </div>
                      <div className="bg-bark-700/50 rounded-xl p-4 mb-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white text-xs font-bold">자동 온도 조절</p>
                            <p className="text-bark-400 text-[10px] mt-0.5">목표: 34-36°C 유지</p>
                          </div>
                          <div className="w-10 h-6 bg-honey-500 rounded-full flex items-center justify-end px-0.5">
                            <div className="w-5 h-5 bg-white rounded-full shadow" />
                          </div>
                        </div>
                      </div>
                      <div className="bg-bark-700/50 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white text-xs font-bold">자동 사양 관리</p>
                            <p className="text-bark-400 text-[10px] mt-0.5">다음 급이: 오후 3:00</p>
                          </div>
                          <div className="w-10 h-6 bg-honey-500 rounded-full flex items-center justify-end px-0.5">
                            <div className="w-5 h-5 bg-white rounded-full shadow" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 px-4 py-2 bg-honey-400 text-bark-900 text-xs font-bold rounded-full shadow-lg animate-float">
                  실시간 제어
                </div>
                <div className="absolute -bottom-4 -left-4 px-4 py-2 bg-bee-500 text-white text-xs font-bold rounded-full shadow-lg animate-float" style={{ animationDelay: '2s' }}>
                  자동화 ON
                </div>
              </div>
            </div>

            {/* Text */}
            <div className="flex-1">
              <p className="text-honey-600 font-semibold text-xs tracking-[0.2em] uppercase mb-4">Mobile Control</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-bark-900 leading-tight">
                모바일 <span className="text-honey-600">자동온도조절</span> 및
                <br />
                <span className="text-honey-600">자동사양관리</span>
              </h2>
              <p className="mt-6 text-bark-500 leading-relaxed">
                스마트폰 하나로 언제 어디서든 봉군의 온도를 자동으로 조절하고, 사양(먹이 공급) 스케줄을
                관리할 수 있습니다.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                {[
                  { icon: 'thermostat_auto', color: 'farm', title: '자동 온도 조절', desc: '설정 범위 이탈 시 자동으로 환기/가열 장치를 작동합니다.' },
                  { icon: 'schedule', color: 'honey', title: '자동 사양 관리', desc: '시간·날씨 기반으로 최적의 급이 스케줄을 자동 실행합니다.' },
                  { icon: 'notifications_active', color: 'bee', title: '실시간 알림', desc: '이상 상황 발생 시 즉시 푸시 알림을 받습니다.' },
                  { icon: 'history', color: 'violet', title: '이력 관리', desc: '모든 제어 이력과 환경 변화를 기록·분석합니다.' },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="bg-white rounded-2xl p-5 border border-bark-200 hover:border-honey-300 hover:shadow-md transition-all"
                  >
                    <span className={`material-icons-outlined text-${item.color}-500 text-2xl mb-3`}>{item.icon}</span>
                    <h4 className="font-bold text-bark-900 text-sm">{item.title}</h4>
                    <p className="text-xs text-bark-500 mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nectar Map */}
      <section id="nectar" className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
            <div className="flex-1">
              <div className="relative bg-bee-50 rounded-3xl p-8 overflow-hidden">
                <img
                  src="https://placehold.co/600x400/166534/DCFCE7?text=Nectar+Source+Map&font=raleway"
                  alt="밀원지도 서비스"
                  className="w-full rounded-2xl shadow-lg"
                />
                <div className="absolute top-16 left-16 flex items-center gap-2 bg-white rounded-full pl-1 pr-3 py-1 shadow-lg animate-float">
                  <div className="w-6 h-6 rounded-full bg-honey-400 flex items-center justify-center">
                    <span className="material-icons-outlined text-white text-sm">hive</span>
                  </div>
                  <span className="text-xs font-bold text-bark-900">아카시아 밀원</span>
                </div>
                <div className="absolute bottom-16 right-16 flex items-center gap-2 bg-white rounded-full pl-1 pr-3 py-1 shadow-lg animate-float" style={{ animationDelay: '1s' }}>
                  <div className="w-6 h-6 rounded-full bg-bee-500 flex items-center justify-center">
                    <span className="material-icons-outlined text-white text-sm">location_on</span>
                  </div>
                  <span className="text-xs font-bold text-bark-900">양봉농가 12곳</span>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-honey-600 font-semibold text-xs tracking-[0.2em] uppercase mb-4">Location Service</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-bark-900 leading-tight">
                <span className="text-honey-600">밀원정보</span> 및
                <br />
                양봉농가 <span className="text-honey-600">위치 서비스</span>
              </h2>
              <p className="mt-6 text-bark-500 leading-relaxed">
                전국의 밀원 식생 분포와 개화 시기를 지도 위에 시각화합니다. 가까운 양봉농가 위치, 밀원까지의
                거리, 실시간 개화 상태를 확인하여 최적의 이동 양봉 전략을 수립할 수 있습니다.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  { icon: 'satellite_alt', color: 'honey', title: '위성 기반 밀원 분석', desc: '위성 영상으로 밀원 식생 분포를 정밀 분석합니다.' },
                  { icon: 'local_florist', color: 'bee', title: '개화 시기 예측', desc: '기상 데이터 기반 밀원 개화 시기를 7일 전 예측합니다.' },
                  { icon: 'share_location', color: 'farm', title: '농가 네트워크', desc: '인근 양봉농가와 밀원 정보를 공유하고 협력합니다.' },
                ].map((item) => (
                  <div key={item.title} className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl bg-${item.color}-50 flex items-center justify-center shrink-0`}>
                      <span className={`material-icons-outlined text-${item.color}-600`}>{item.icon}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-bark-900 text-sm">{item.title}</h4>
                      <p className="text-xs text-bark-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Healing Beekeeping */}
      <section id="healing" className="py-24 lg:py-32 bg-gradient-to-br from-bee-800 via-bee-900 to-bark-900 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="honeycomb2" x="0" y="0" width="56" height="100" patternUnits="userSpaceOnUse" patternTransform="scale(3)">
                <path d="M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100" fill="none" stroke="#86EFAC" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#honeycomb2)" />
          </svg>
        </div>
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1">
              <p className="text-bee-300 font-semibold text-xs tracking-[0.2em] uppercase mb-4">Healing Beekeeping</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">
                <span className="text-honey-400">치유양봉</span> 프로그램
              </h2>
              <p className="mt-2 text-bee-200 text-sm font-medium">퓨르메재단과 함께하는 사회공헌 프로젝트</p>
              <p className="mt-6 text-bee-100/80 leading-relaxed">
                양봉 활동을 통해 장애인, 고령자, 청소년 등 사회적 약자에게 치유와 자립의 기회를 제공합니다.
              </p>
              <div className="mt-8 grid grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-black text-honey-400">150+</p>
                  <p className="text-xs text-bee-200 mt-1">참여자 수</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-black text-honey-400">8</p>
                  <p className="text-xs text-bee-200 mt-1">운영 지역</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-black text-honey-400">95%</p>
                  <p className="text-xs text-bee-200 mt-1">만족도</p>
                </div>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                {['장애인 치유 프로그램', '고령자 사회활동', '청소년 진로체험', '퓨르메재단 연계'].map((tag) => (
                  <span key={tag} className="px-3 py-1.5 text-xs font-medium bg-bee-700/50 border border-bee-600/30 rounded-full text-bee-200">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex-1">
              <div className="relative">
                <img
                  src="https://placehold.co/600x450/14532D/86EFAC?text=Healing+Beekeeping&font=raleway"
                  alt="치유양봉 프로그램"
                  className="w-full rounded-3xl shadow-2xl"
                />
                <div className="absolute -bottom-4 left-8 right-8 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-honey-400 flex items-center justify-center shrink-0">
                      <span className="material-icons-outlined text-bark-900">favorite</span>
                    </div>
                    <div>
                      <p className="text-white text-sm font-bold">&ldquo;양봉이 저에게 새로운 삶을 선물했습니다&rdquo;</p>
                      <p className="text-bee-200 text-xs mt-0.5">— 2025 치유양봉 참여자 김OO님</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
