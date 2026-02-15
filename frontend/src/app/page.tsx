export default function HomePage() {
  return (
    <>
      {/* ── Hero Section ── */}
      <header className="relative overflow-hidden bg-bark-900 text-white min-h-screen flex items-center">
        {/* Animated Background Blobs */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-[30rem] h-[30rem] bg-honey-500/10 rounded-full blur-3xl animate-pulse-glow" />
          <div
            className="absolute bottom-10 right-10 w-[40rem] h-[40rem] bg-honey-400/[0.08] rounded-full blur-3xl animate-pulse-glow"
            style={{ animationDelay: '1s' }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[50rem] bg-farm-500/5 rounded-full blur-3xl animate-pulse-glow"
            style={{ animationDelay: '2s' }}
          />
        </div>

        {/* Honeycomb Pattern */}
        <div className="absolute inset-0 opacity-[0.04]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="honeycomb"
                x="0"
                y="0"
                width="56"
                height="100"
                patternUnits="userSpaceOnUse"
                patternTransform="scale(2)"
              >
                <path
                  d="M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100"
                  fill="none"
                  stroke="#FFC72C"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#honeycomb)" />
          </svg>
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-bark-900/50 via-transparent to-bark-900/80" />

        {/* Particle dots */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[20%] left-[15%] w-1 h-1 bg-honey-400/60 rounded-full animate-float" />
          <div className="absolute top-[40%] left-[80%] w-1.5 h-1.5 bg-honey-300/40 rounded-full animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute top-[70%] left-[25%] w-1 h-1 bg-farm-400/50 rounded-full animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute top-[30%] left-[60%] w-1 h-1 bg-honey-400/30 rounded-full animate-float" style={{ animationDelay: '0.5s' }} />
          <div className="absolute top-[80%] left-[70%] w-1.5 h-1.5 bg-bee-400/40 rounded-full animate-float" style={{ animationDelay: '1.5s' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-32 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Hero Text */}
            <div className="flex-1 text-center lg:text-left">
              <p className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-honey-500/30 text-honey-400 text-xs font-semibold tracking-wider uppercase mb-8 animate-fade-in">
                <span className="w-2 h-2 rounded-full bg-honey-400 animate-pulse" />
                Digital Beekeeping System
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.08] tracking-tight animate-fade-up">
                생산자와 소비자를
                <br />위한{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-honey-300 via-honey-400 to-farm-400">
                  디지털 양봉
                </span>
                <br />시스템
              </h1>
              <p
                className="mt-6 text-base sm:text-lg text-bark-300 leading-relaxed max-w-xl mx-auto lg:mx-0 animate-fade-up"
                style={{ animationDelay: '0.2s' }}
              >
                IoT 센서 기반 실시간 모니터링부터 AI 꿀 수확 예측, 밀원지도, 치유양봉까지 —
                비온팜이 지속가능한 양봉의 미래를 열어갑니다.
              </p>
              <div
                className="mt-10 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start animate-fade-up"
                style={{ animationDelay: '0.4s' }}
              >
                <a
                  href="/solutions"
                  className="w-full sm:w-auto px-8 py-4 text-base font-bold text-bark-900 bg-gradient-to-r from-honey-400 to-honey-500 rounded-full hover:from-honey-300 hover:to-honey-400 transition-all shadow-lg shadow-honey-500/20 text-center"
                >
                  주요 기능 둘러보기
                </a>
                <a
                  href="/about"
                  className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-white border border-bark-600 rounded-full hover:border-honey-500/50 hover:text-honey-400 transition-all text-center"
                >
                  비온팜 알아보기
                </a>
              </div>
              {/* Stats */}
              <div
                className="mt-14 grid grid-cols-3 gap-8 max-w-md mx-auto lg:mx-0 animate-fade-up"
                style={{ animationDelay: '0.6s' }}
              >
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-honey-400">500+</p>
                  <p className="text-xs text-bark-400 mt-1">등록 농가</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-honey-400">24/7</p>
                  <p className="text-xs text-bark-400 mt-1">실시간 모니터링</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-honey-400">98%</p>
                  <p className="text-xs text-bark-400 mt-1">데이터 정확도</p>
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="flex-1 flex items-center justify-center animate-scale-in" style={{ animationDelay: '0.3s' }}>
              <div className="relative w-72 h-72 sm:w-96 sm:h-96 lg:w-[28rem] lg:h-[28rem]">
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-honey-500/20 animate-spin-slow" />
                <div className="absolute inset-8 rounded-full border border-honey-500/15 animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '20s' }} />
                <div className="absolute inset-16 rounded-full bg-gradient-to-br from-honey-500/20 to-farm-500/10 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center">
                    <span className="material-icons-outlined text-7xl sm:text-8xl text-honey-400">hive</span>
                    <p className="text-honey-300 text-xs mt-2 font-medium tracking-wider">BeeOnFarm</p>
                  </div>
                </div>
                {/* Orbiting Icons */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-bark-800 border border-honey-500/30 flex items-center justify-center shadow-lg animate-float">
                  <span className="material-icons-outlined text-honey-400 text-xl">thermostat</span>
                </div>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-bark-800 border border-bee-500/30 flex items-center justify-center shadow-lg animate-float" style={{ animationDelay: '1s' }}>
                  <span className="material-icons-outlined text-bee-400 text-xl">water_drop</span>
                </div>
                <div className="absolute top-1/2 -translate-y-1/2 left-0 w-12 h-12 rounded-full bg-bark-800 border border-farm-500/30 flex items-center justify-center shadow-lg animate-float" style={{ animationDelay: '0.5s' }}>
                  <span className="material-icons-outlined text-farm-400 text-xl">map</span>
                </div>
                <div className="absolute top-1/2 -translate-y-1/2 right-0 w-12 h-12 rounded-full bg-bark-800 border border-honey-500/30 flex items-center justify-center shadow-lg animate-float" style={{ animationDelay: '1.5s' }}>
                  <span className="material-icons-outlined text-honey-400 text-xl">co2</span>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-bark-500 animate-bounce">
            <span className="text-xs tracking-widest uppercase">Scroll</span>
            <span className="material-icons-outlined text-lg">keyboard_arrow_down</span>
          </div>
        </div>
      </header>

      {/* ── About Preview ── */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1">
              <div className="relative">
                <img
                  src="https://placehold.co/640x480/1C1917/FFC72C?text=BeeOnFarm+IoT+System&font=raleway"
                  alt="비온팜 시스템 소개"
                  className="w-full rounded-3xl shadow-2xl object-cover aspect-[4/3]"
                />
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-honey-100 rounded-2xl -z-10" />
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-bee-100 rounded-2xl -z-10" />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-honey-600 font-semibold text-xs tracking-[0.2em] uppercase mb-4">About BeeOnFarm</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-bark-900 leading-tight">
                지속가능한 양봉을 위한
                <br />
                <span className="text-honey-600">비온팜 시스템</span>
              </h2>
              <p className="mt-6 text-bark-500 leading-relaxed">
                비온팜(BeeOnFarm)은 농업회사법인 ㈜온팜이 개발한 디지털 양봉 플랫폼입니다. IoT 센서,
                인공지능 분석, 모바일 원격제어 기술을 결합하여 양봉 농가의 생산성을 높이고, 소비자에게는
                투명한 꿀 생산 이력을 제공합니다.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  { icon: 'sensors', color: 'honey', title: 'IoT 센서 기반 실시간 데이터 수집', desc: '온도, 습도, CO₂, 소음, 무게 등 봉군 환경을 24시간 모니터링합니다.' },
                  { icon: 'psychology', color: 'bee', title: 'AI 기반 예측 분석', desc: '축적된 데이터를 AI가 분석하여 꿀 수확 시기, 봉세 변화를 예측합니다.' },
                  { icon: 'verified_user', color: 'farm', title: '투명한 생산 이력 관리', desc: '생산부터 유통까지 전 과정을 블록체인으로 기록하여 신뢰를 제공합니다.' },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg bg-${item.color}-50 flex items-center justify-center shrink-0 mt-0.5`}>
                      <span className={`material-icons-outlined text-${item.color}-600 text-lg`}>{item.icon}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-bark-900 text-sm">{item.title}</h4>
                      <p className="text-sm text-bark-500 mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <a
                href="/about"
                className="inline-flex items-center gap-2 mt-10 px-6 py-3 text-sm font-bold text-bark-900 bg-honey-400 rounded-full hover:bg-honey-300 transition-colors"
              >
                자세히 알아보기
                <span className="material-icons-outlined text-lg">arrow_forward</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2026 Roadmap ── */}
      <section className="py-24 lg:py-32 bg-bark-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-honey-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-farm-500/5 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center mb-16">
            <p className="text-honey-400 font-semibold text-xs tracking-[0.2em] uppercase mb-4">Roadmap 2026</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">
              2026 비온팜 <span className="text-honey-400">주요 계획</span>
            </h2>
            <p className="mt-4 text-bark-400 max-w-2xl mx-auto">
              올해 비온팜이 추진하는 핵심 프로젝트와 혁신 과제를 소개합니다.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { quarter: 'Q1', icon: 'hub', color: 'honey', title: 'IoT 센서 3.0 배포', desc: '차세대 소형 센서 모듈 개발 및 전국 500개 농가 배포 완료를 목표합니다.' },
              { quarter: 'Q2', icon: 'smart_toy', color: 'bee', title: 'AI 예측 모델 고도화', desc: '딥러닝 기반 꿀 수확량 예측 정확도 95% 이상 달성을 위한 모델 업그레이드.' },
              { quarter: 'Q3', icon: 'public', color: 'farm', title: '밀원지도 전국 확대', desc: '위성 데이터와 드론 촬영을 결합한 정밀 밀원지도 서비스 전국 확대.' },
              { quarter: 'Q4', icon: 'favorite', color: 'honey', title: '치유양봉 프로그램 확대', desc: '퓨르메재단과 연계한 치유양봉 프로그램을 전국 10개 지역으로 확대 운영.' },
            ].map((plan) => (
              <div
                key={plan.quarter}
                className="group relative bg-bark-800 rounded-2xl p-8 border border-bark-700 hover:border-honey-500/50 transition-all overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-honey-400 to-honey-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                <div className={`w-12 h-12 rounded-xl bg-${plan.color}-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <span className={`material-icons-outlined text-${plan.color}-400 text-2xl`}>{plan.icon}</span>
                </div>
                <span className={`text-${plan.color}-400 text-xs font-bold tracking-wider uppercase`}>{plan.quarter}</span>
                <h3 className="text-lg font-bold mt-2 mb-3">{plan.title}</h3>
                <p className="text-sm text-bark-400 leading-relaxed">{plan.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="py-24 lg:py-32 bg-gradient-to-r from-honey-400 via-honey-500 to-farm-400 text-bark-900 relative overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-bark-900/10 rotate-12 rounded-2xl" />
        <div className="absolute bottom-10 right-10 w-40 h-40 border-2 border-bark-900/10 -rotate-12 rounded-2xl" />
        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <span className="material-icons-outlined text-6xl text-bark-900/20 mb-6">hive</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight">
            지금, 디지털 양봉의 미래를
            <br />
            비온팜과 함께 시작하세요
          </h2>
          <p className="mt-6 text-bark-800/70 text-lg max-w-2xl mx-auto leading-relaxed">
            500개 이상의 양봉 농가가 이미 비온팜으로 스마트 양봉을 실현하고 있습니다. 무료 체험으로
            시작해보세요.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/contact"
              className="w-full sm:w-auto px-8 py-4 text-base font-bold text-honey-500 bg-bark-900 rounded-full hover:bg-bark-800 transition-colors text-center shadow-lg"
            >
              무료 체험 시작하기
            </a>
            <a
              href="/contact"
              className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-bark-900 border-2 border-bark-900/30 rounded-full hover:bg-bark-900/10 transition-colors text-center"
            >
              도입 문의하기
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
