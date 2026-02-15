import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '커뮤니티',
  description: '양봉인들의 소통 공간 — 공지사항, 갤러리, Q&A, 양봉뉴스',
};

export default function CommunityPage() {
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
              <pattern id="honeycomb-community" x="0" y="0" width="56" height="100" patternUnits="userSpaceOnUse" patternTransform="scale(2)">
                <path d="M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100" fill="none" stroke="#FFC72C" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#honeycomb-community)" />
          </svg>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-honey-500/10 border border-honey-500/20 rounded-full text-honey-400 text-sm font-medium mb-6">
            <span className="material-icons-outlined text-base">forum</span>
            커뮤니티
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
            양봉인들의 <span className="text-honey-400">소통 공간</span>
          </h1>
          <p className="text-bark-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            공지사항, 갤러리, Q&A, 양봉뉴스까지 — 양봉에 관한 모든 이야기를 나눠보세요.
          </p>
        </div>
      </section>

      {/* Board Tabs + Content */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Board Categories */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              { icon: 'campaign', title: '공지사항', desc: '비온팜의 최신 소식과 공지사항', count: 24, color: 'honey' },
              { icon: 'photo_library', title: '갤러리', desc: '양봉 현장 사진과 영상 모음', count: 56, color: 'bee' },
              { icon: 'help_outline', title: 'Q&A', desc: '양봉 관련 질문과 답변', count: 128, color: 'farm' },
              { icon: 'newspaper', title: '양봉뉴스', desc: '국내외 양봉 산업 뉴스', count: 42, color: 'honey' },
            ].map((board) => (
              <div
                key={board.title}
                className={`group p-6 bg-bark-50 rounded-2xl border border-bark-200 hover:border-${board.color}-300 hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-0.5`}
              >
                <div className={`w-12 h-12 rounded-xl bg-${board.color}-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <span className={`material-icons-outlined text-${board.color}-600 text-2xl`}>{board.icon}</span>
                </div>
                <h3 className="font-bold text-bark-900 text-lg mb-1">{board.title}</h3>
                <p className="text-sm text-bark-500 mb-3">{board.desc}</p>
                <p className="text-xs text-bark-400">게시글 {board.count}개</p>
              </div>
            ))}
          </div>

          {/* Recent Posts */}
          <div>
            <h2 className="text-2xl font-bold text-bark-900 mb-8 flex items-center gap-2">
              <span className="material-icons-outlined text-honey-500">whatshot</span>
              최근 게시글
            </h2>
            <div className="space-y-4">
              {[
                { category: '공지', title: '2026년 상반기 교육 프로그램 일정 안내', date: '2026.02.15', views: 342 },
                { category: '뉴스', title: '국내 양봉 산업 디지털 전환 가속화 — IoT 기반 스마트 양봉 확대', date: '2026.02.14', views: 218 },
                { category: 'Q&A', title: '초보 양봉가입니다. 봄철 봉군 관리 팁이 있을까요?', date: '2026.02.13', views: 156 },
                { category: '갤러리', title: '완주 봉동 양봉장 봄꽃 개화 현장 사진', date: '2026.02.12', views: 284 },
                { category: '공지', title: '비온팜 앱 v3.2 업데이트 안내', date: '2026.02.10', views: 198 },
              ].map((post, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-4 bg-bark-50 rounded-xl border border-bark-200 hover:border-honey-300 hover:bg-honey-50/30 transition-all cursor-pointer group"
                >
                  <span className="shrink-0 px-2.5 py-1 text-xs font-bold bg-honey-100 text-honey-700 rounded-full">
                    {post.category}
                  </span>
                  <h4 className="flex-1 font-medium text-bark-900 text-sm group-hover:text-honey-600 transition-colors truncate">
                    {post.title}
                  </h4>
                  <span className="shrink-0 text-xs text-bark-400 hidden sm:block">{post.date}</span>
                  <span className="shrink-0 text-xs text-bark-400 hidden sm:flex items-center gap-1">
                    <span className="material-icons-outlined text-xs">visibility</span>
                    {post.views}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
