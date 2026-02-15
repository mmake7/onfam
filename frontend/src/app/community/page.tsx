'use client';

import { useState, useMemo } from 'react';
import { useScrollAnimation } from '@/lib/useScrollAnimation';

/* ─────────────────────────────────────────────
   Mock Data — will be replaced by API later
   ───────────────────────────────────────────── */
type BoardType = 'notice' | 'gallery' | 'qna' | 'news';

interface Post {
  id: number;
  title: string;
  author: string;
  date: string;
  views: number;
  comments: number;
  pinned?: boolean;
  badge?: string;
  isNew?: boolean;
}

interface GalleryItem {
  id: number;
  title: string;
  author: string;
  date: string;
  likes: number;
  photoCount?: number;
}

interface QnaItem {
  id: number;
  title: string;
  preview: string;
  author: string;
  date: string;
  views: number;
  comments: number;
  answered: boolean;
  category: string;
  answer?: { author: string; preview: string };
}

interface NewsItem {
  id: number;
  title: string;
  preview: string;
  category: string;
  categoryColor: string;
  author: string;
  date: string;
  views: number;
  likes?: number;
  featured?: boolean;
}

const BOARDS: { key: BoardType; icon: string; label: string; desc: string; count: number; color: string }[] = [
  { key: 'notice', icon: 'campaign', label: '공지사항', desc: '비온팜의 최신 소식과 공지사항', count: 128, color: 'honey' },
  { key: 'gallery', icon: 'photo_library', label: '갤러리', desc: '양봉 현장 사진과 영상 모음', count: 256, color: 'bee' },
  { key: 'qna', icon: 'help_outline', label: 'Q&A', desc: '양봉 관련 질문과 답변', count: 89, color: 'farm' },
  { key: 'news', icon: 'newspaper', label: '양봉뉴스', desc: '국내외 양봉 산업 뉴스', count: 64, color: 'honey' },
];

const NOTICE_POSTS: Post[] = [
  { id: 0, title: '[필독] 2026년 양봉 교육 일정 안내', author: '관리자', date: '2026.02.14', views: 1247, comments: 3, pinned: true, badge: '중요' },
  { id: -1, title: '사이트 이용 가이드 및 커뮤니티 규칙', author: '관리자', date: '2026.01.10', views: 3582, comments: 0, pinned: true, badge: '필독' },
  { id: 128, title: '3월 밀원식물 관리 팁 공유', author: '김양봉', date: '2026.02.15', views: 89, comments: 5, isNew: true },
  { id: 127, title: '스마트 벌통 모니터링 시스템 업데이트 v2.5', author: '온팜기술팀', date: '2026.02.13', views: 214, comments: 2 },
  { id: 126, title: '2월 정기 양봉 세미나 후기', author: '박꿀벌', date: '2026.02.12', views: 156, comments: 0 },
  { id: 125, title: '신규 회원 가입 이벤트 안내', author: '관리자', date: '2026.02.10', views: 432, comments: 8 },
  { id: 124, title: '겨울철 벌통 관리 체크리스트', author: '이봉농', date: '2026.02.08', views: 678, comments: 12 },
  { id: 123, title: '꿀 수확량 데이터 분석 보고서 공유', author: '데이터팀', date: '2026.02.05', views: 301, comments: 0 },
  { id: 122, title: '치유양봉 프로그램 3기 모집', author: '관리자', date: '2026.02.01', views: 892, comments: 15 },
  { id: 121, title: '양봉 IoT 센서 설치 가이드 업데이트', author: '기술팀', date: '2026.01.28', views: 445, comments: 7 },
];

const GALLERY_ITEMS: GalleryItem[] = [
  { id: 1, title: '봄꽃 피는 양봉장 풍경', author: '김양봉', date: '2026.02.15', likes: 24 },
  { id: 2, title: '벌꿀 채밀 과정 기록', author: '박꿀벌', date: '2026.02.13', likes: 0, photoCount: 8 },
  { id: 3, title: '치유양봉 체험 프로그램 현장', author: '온팜', date: '2026.02.10', likes: 56 },
  { id: 4, title: '스마트 벌통 설치 현장', author: '기술팀', date: '2026.02.08', likes: 0, photoCount: 12 },
  { id: 5, title: '여왕벌 관찰 일지', author: '이봉농', date: '2026.02.05', likes: 38 },
  { id: 6, title: '밀원지도 현장 조사', author: '조사팀', date: '2026.02.01', likes: 0, photoCount: 5 },
  { id: 7, title: '교육센터 수업 풍경', author: '교육팀', date: '2026.01.28', likes: 19 },
  { id: 8, title: '겨울 양봉장 전경', author: '김양봉', date: '2026.01.25', likes: 42 },
];

const QNA_ITEMS: QnaItem[] = [
  { id: 1, title: '초보 양봉인입니다. 봄철 분봉 방지 방법이 궁금합니다.', preview: '안녕하세요, 올해 처음 양봉을 시작한 초보입니다. 봄이 되면 분봉이 잦다고 들었는데, 어떤 방법으로 예방할 수 있을까요?', author: '초보양봉가', date: '2026.02.14', views: 234, comments: 3, answered: true, category: '양봉기술', answer: { author: '온팜 전문가', preview: '봄철 분봉을 방지하려면 여왕벌의 상태를 주기적으로 확인하고, 봉군의 밀도가 높아지지 않도록 적절한 시기에 계상을 올려주시는 것이 중요합니다...' } },
  { id: 2, title: '스마트 벌통 센서 오류 코드 E-04가 계속 뜹니다', preview: '최근 설치한 온습도 센서에서 E-04 에러가 반복적으로 발생합니다. 펌웨어 업데이트도 해봤는데 해결이 안 되네요.', author: '기술문의자', date: '2026.02.15', views: 45, comments: 0, answered: false, category: '장비/도구' },
  { id: 3, title: '아카시아꿀과 잡화꿀의 수분 함량 차이는 어느 정도인가요?', preview: '꿀의 품질 관리를 위해 수분 함량을 측정하고 있는데, 꿀 종류별 기준치가 궁금합니다.', author: '꿀품질관리', date: '2026.02.12', views: 178, comments: 5, answered: true, category: '벌꿀/생산물' },
  { id: 4, title: '치유양봉 전문가 과정 수료 후 자격증이 발급되나요?', preview: '치유양봉 프로그램에 관심이 있는데, 수료 후 어떤 자격이 부여되는지 궁금합니다.', author: '예비양봉인', date: '2026.02.11', views: 92, comments: 1, answered: false, category: '교육/자격' },
];

const NEWS_ITEMS: NewsItem[] = [
  { id: 1, title: '2026년 양봉 산업 전망: AI 기반 스마트 양봉이 이끄는 혁신', preview: '인공지능과 IoT 기술이 접목된 스마트 양봉 시스템이 빠르게 확산되고 있습니다. 올해 양봉 산업의 주요 트렌드와 기술 동향을 살펴봅니다.', category: '산업동향', categoryColor: 'honey', author: '온팜 에디터', date: '2026.02.15', views: 1892, likes: 67, featured: true },
  { id: 2, title: '드론을 활용한 밀원식물 분포 모니터링 기술', preview: '드론과 위성 이미지를 결합하여 밀원식물의 개화 시기와 분포를 정밀하게 파악하는 새로운 기술이 주목받고 있습니다.', category: '기술뉴스', categoryColor: 'bee', author: '기술팀', date: '2026.02.13', views: 542 },
  { id: 3, title: '정부, 스마트 양봉 확산 지원사업 예산 30% 확대', preview: '농림축산식품부가 올해 스마트 양봉 관련 지원 예산을 대폭 늘리며 디지털 전환을 가속화합니다.', category: '정책/제도', categoryColor: 'honey', author: '정책팀', date: '2026.02.10', views: 876 },
  { id: 4, title: '뉴질랜드 마누카꿀 인증 시스템 개편, 국내 영향은?', preview: '뉴질랜드가 마누카꿀 인증 기준을 강화하면서 국내 수입 시장에도 변화가 예상됩니다.', category: '해외소식', categoryColor: 'farm', author: '국제팀', date: '2026.02.08', views: 324 },
  { id: 5, title: '치유양봉 산업의 성장과 농촌 관광의 미래', preview: '치유양봉이 농촌 관광의 새로운 성장 동력으로 주목받으며, 전국적으로 체험 프로그램이 확대되고 있습니다.', category: '산업동향', categoryColor: 'honey', author: '에디터', date: '2026.02.05', views: 651 },
];

// Post detail sample data
const SAMPLE_POST = {
  category: '공지사항',
  badge: '중요',
  title: '[필독] 2026년 양봉 교육 일정 안내',
  author: '관리자',
  authorRole: 'ADMIN',
  date: '2026.02.14 14:30',
  views: 1247,
  comments: 3,
  likes: 24,
  content: `<p>안녕하세요, 농업회사법인 ㈜온팜입니다.</p>
<p class="mt-4">2026년도 양봉 교육 센터 프로그램 일정을 안내드립니다. 올해는 기초과정부터 전문가 과정까지 더욱 풍성한 커리큘럼으로 준비했습니다.</p>
<h3 class="text-base sm:text-lg font-bold text-bark-900 mt-6 mb-3">1. 기초 양봉 과정 (3월~5월)</h3>
<ul class="list-disc list-inside space-y-1 text-bark-600">
  <li>교육 기간: 2026년 3월 4일 ~ 5월 30일 (매주 토요일)</li>
  <li>교육 장소: 온팜 교육센터 (완주)</li>
  <li>수강 인원: 20명 (선착순)</li>
  <li>수강료: 300,000원 (재료비 포함)</li>
</ul>
<h3 class="text-base sm:text-lg font-bold text-bark-900 mt-6 mb-3">2. 치유양봉 전문가 과정 (6월~8월)</h3>
<ul class="list-disc list-inside space-y-1 text-bark-600">
  <li>교육 기간: 2026년 6월 1일 ~ 8월 29일</li>
  <li>퓨르메재단 협력 프로그램</li>
  <li>수강 인원: 15명</li>
</ul>
<p class="mt-6 text-bark-500">자세한 내용은 교육센터 페이지를 참조해 주시고, 문의사항은 Q&A 게시판 또는 전화(02-363-4999)로 연락 주세요.</p>`,
  attachments: [
    { name: '2026_양봉교육_일정표.pdf', size: '1.2 MB' },
    { name: '수강신청서_양식.hwp', size: '245 KB' },
  ],
  commentList: [
    { author: '김양봉', date: '2026.02.14 16:22', text: '기초과정 신청하고 싶습니다! 선착순이면 빨리 신청해야겠네요.' },
    { author: '이봉농', date: '2026.02.14 17:45', text: '치유양봉 과정 작년에 참여했는데 정말 좋았습니다. 올해 전문가 과정도 기대됩니다!' },
  ],
  adminReply: { author: '관리자', date: '2026.02.14 18:10', text: '관심 감사합니다! 수강 신청은 3월 1일부터 홈페이지에서 가능합니다.' },
};

/* ─────────────────────────────────────────────
   Color helpers — avoids Tailwind dynamic class purge issues
   ───────────────────────────────────────────── */
const boardColorMap: Record<string, { bg: string; text: string; border: string; activeBorder: string; badgeBg: string; badgeText: string }> = {
  honey: { bg: 'bg-honey-100', text: 'text-honey-600', border: 'hover:border-honey-300', activeBorder: 'border-honey-300', badgeBg: 'bg-honey-100', badgeText: 'text-honey-800' },
  bee: { bg: 'bg-bee-100', text: 'text-bee-600', border: 'hover:border-bee-300', activeBorder: 'border-bee-300', badgeBg: 'bg-bee-100', badgeText: 'text-bee-800' },
  farm: { bg: 'bg-farm-100', text: 'text-farm-600', border: 'hover:border-farm-300', activeBorder: 'border-farm-300', badgeBg: 'bg-farm-100', badgeText: 'text-farm-800' },
};

const categoryColorMap: Record<string, string> = {
  honey: 'text-honey-600',
  bee: 'text-bee-600',
  farm: 'text-farm-600',
};

/* ─────────────────────────────────────────────
   Sub-components
   ───────────────────────────────────────────── */

function Pagination({ current, total, onPageChange }: { current: number; total: number; onPageChange: (p: number) => void }) {
  const pages = useMemo(() => {
    const arr: (number | '...')[] = [];
    if (total <= 7) {
      for (let i = 1; i <= total; i++) arr.push(i);
    } else {
      arr.push(1);
      if (current > 3) arr.push('...');
      const start = Math.max(2, current - 1);
      const end = Math.min(total - 1, current + 1);
      for (let i = start; i <= end; i++) arr.push(i);
      if (current < total - 2) arr.push('...');
      arr.push(total);
    }
    return arr;
  }, [current, total]);

  return (
    <nav className="flex items-center justify-center gap-1 mt-8" aria-label="페이지 네비게이션">
      <button
        className="w-10 h-10 flex items-center justify-center rounded-lg text-bark-400 hover:bg-bark-100 transition-colors disabled:opacity-30"
        disabled={current === 1}
        onClick={() => onPageChange(current - 1)}
        aria-label="이전 페이지"
      >
        <span className="material-icons-outlined text-xl">chevron_left</span>
      </button>
      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`dots-${i}`} className="w-10 h-10 flex items-center justify-center text-bark-400 text-sm">...</span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            aria-current={p === current ? 'page' : undefined}
            className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
              p === current ? 'bg-honey-400 text-bark-900 font-bold' : 'text-bark-600 hover:bg-bark-100'
            }`}
          >
            {p}
          </button>
        ),
      )}
      <button
        className="w-10 h-10 flex items-center justify-center rounded-lg text-bark-400 hover:bg-bark-100 transition-colors disabled:opacity-30"
        disabled={current === total}
        onClick={() => onPageChange(current + 1)}
        aria-label="다음 페이지"
      >
        <span className="material-icons-outlined text-xl">chevron_right</span>
      </button>
    </nav>
  );
}

/* ─────────────────────────────────────────────
   View: Notice Board (Table List)
   ───────────────────────────────────────────── */
function NoticeBoard({ onViewPost }: { onViewPost: () => void }) {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div>
      {/* Search & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xl sm:text-2xl font-bold text-bark-900">공지사항</h2>
          <span className="text-xs font-semibold bg-honey-100 text-honey-800 px-2.5 py-1 rounded-full">총 128건</span>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none sm:w-72">
            <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-bark-400 text-xl">search</span>
            <input
              type="text"
              placeholder="검색어를 입력하세요"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-bark-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-honey-400 focus:border-transparent"
            />
          </div>
          <select className="px-3 py-2.5 bg-white border border-bark-200 rounded-xl text-sm text-bark-600 focus:outline-none focus:ring-2 focus:ring-honey-400">
            <option>전체</option>
            <option>제목</option>
            <option>내용</option>
            <option>작성자</option>
          </select>
          <button className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 bg-honey-400 text-bark-900 text-sm font-semibold rounded-xl hover:bg-honey-300 transition-colors">
            <span className="material-icons-outlined text-base">edit</span>
            글쓰기
          </button>
        </div>
      </div>

      {/* Post Table */}
      <div className="bg-white rounded-2xl border border-bark-200 overflow-hidden">
        {/* Table Header */}
        <div className="hidden sm:grid sm:grid-cols-[80px_1fr_120px_100px_80px] gap-4 px-6 py-3 bg-bark-50 border-b border-bark-200 text-xs font-semibold text-bark-500 uppercase tracking-wider">
          <span className="text-center">번호</span>
          <span>제목</span>
          <span className="text-center">작성자</span>
          <span className="text-center">날짜</span>
          <span className="text-center">조회</span>
        </div>

        {NOTICE_POSTS.map((post) => (
          <button
            key={post.id}
            onClick={onViewPost}
            className={`w-full grid sm:grid-cols-[80px_1fr_120px_100px_80px] gap-2 sm:gap-4 px-4 sm:px-6 py-4 border-b border-bark-100 items-center text-left transition-colors ${
              post.pinned ? 'bg-honey-50/60 hover:bg-honey-50' : 'hover:bg-bark-50'
            }`}
          >
            <span className="hidden sm:flex justify-center">
              {post.pinned ? (
                <span className="material-icons-outlined text-honey-500 text-lg">push_pin</span>
              ) : (
                <span className="text-sm text-bark-400">{post.id}</span>
              )}
            </span>
            <div className="flex items-center gap-2">
              {post.pinned && (
                <span className="inline-flex sm:hidden items-center px-1.5 py-0.5 bg-honey-400 text-bark-900 text-[10px] font-bold rounded">공지</span>
              )}
              <span className={`${post.pinned ? 'font-semibold text-bark-900' : 'font-medium text-bark-800'} text-sm line-clamp-1`}>
                {post.title}
              </span>
              {post.comments > 0 && <span className="text-bee-600 text-xs font-bold">[{post.comments}]</span>}
              {post.isNew && <span className="inline-flex items-center px-1.5 py-0.5 bg-bee-50 text-bee-700 text-[10px] font-bold rounded">NEW</span>}
              {post.badge && <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 bg-honey-100 text-honey-700 text-[10px] font-bold rounded">{post.badge}</span>}
            </div>
            <span className="hidden sm:block text-center text-sm text-bark-500">{post.author}</span>
            <span className="hidden sm:block text-center text-sm text-bark-400">{post.date}</span>
            <span className="hidden sm:block text-center text-sm text-bark-400">{post.views.toLocaleString()}</span>
          </button>
        ))}
      </div>

      <Pagination current={page} total={13} onPageChange={setPage} />

      {/* Mobile FAB */}
      <div className="fixed bottom-6 right-6 sm:hidden z-30">
        <button className="w-14 h-14 bg-honey-400 rounded-full flex items-center justify-center shadow-lg shadow-honey-400/30 hover:bg-honey-300 transition-colors" aria-label="글쓰기">
          <span className="material-icons-outlined text-bark-900 text-2xl">edit</span>
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   View: Gallery Board (Image Grid)
   ───────────────────────────────────────────── */
function GalleryBoard({ onViewGallery }: { onViewGallery: () => void }) {
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xl sm:text-2xl font-bold text-bark-900">갤러리</h2>
          <span className="text-xs font-semibold bg-bee-100 text-bee-800 px-2.5 py-1 rounded-full">총 256건</span>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-bark-100 text-bark-700' : 'text-bark-400 hover:bg-bark-100'}`}
            aria-label="그리드 보기"
          >
            <span className="material-icons-outlined text-xl">grid_view</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-bark-100 text-bark-700' : 'text-bark-400 hover:bg-bark-100'}`}
            aria-label="리스트 보기"
          >
            <span className="material-icons-outlined text-xl">view_list</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {GALLERY_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={onViewGallery}
            className="group relative rounded-2xl overflow-hidden bg-bark-200 aspect-square text-left"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-bark-900/80 via-bark-900/20 to-transparent z-10" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="material-icons-outlined text-bark-300 text-6xl">image</span>
            </div>
            <div className="absolute inset-0 bg-honey-500/0 group-hover:bg-honey-500/10 transition-colors z-10" />
            <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 z-20">
              <p className="text-white text-xs sm:text-sm font-semibold line-clamp-2">{item.title}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-bark-300 text-[10px] sm:text-xs">{item.author}</span>
                <span className="text-bark-400 text-[10px]">·</span>
                <span className="text-bark-400 text-[10px] sm:text-xs">{item.date}</span>
              </div>
            </div>
            <div className="absolute top-3 right-3 flex items-center gap-1 bg-bark-900/60 backdrop-blur-sm px-2 py-1 rounded-full z-20">
              <span className="material-icons-outlined text-white text-xs">{item.photoCount ? 'photo_library' : 'favorite'}</span>
              <span className="text-white text-[10px] font-medium">{item.photoCount || item.likes}</span>
            </div>
          </button>
        ))}
      </div>

      <Pagination current={page} total={32} onPageChange={setPage} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   View: Q&A Board
   ───────────────────────────────────────────── */
function QnaBoard({ onViewPost }: { onViewPost: () => void }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-bark-900">Q&A</h2>
        <span className="text-xs font-semibold bg-farm-100 text-farm-800 px-2.5 py-1 rounded-full">총 89건</span>
      </div>

      <div className="space-y-3">
        {QNA_ITEMS.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl border border-bark-200 overflow-hidden hover:border-bark-300 transition-colors">
            <button onClick={onViewPost} className="block w-full p-4 sm:p-6 text-left">
              <div className="flex items-start gap-3 sm:gap-4">
                <span
                  className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-bold text-sm sm:text-base ${
                    item.answered ? 'bg-bee-100 text-bee-700' : 'bg-farm-100 text-farm-700'
                  }`}
                >
                  {item.answered ? 'A' : 'Q'}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 text-[10px] sm:text-xs font-bold rounded-full ${
                        item.answered ? 'bg-bee-100 text-bee-700' : 'bg-farm-100 text-farm-700'
                      }`}
                    >
                      {item.answered ? '답변완료' : '답변대기'}
                    </span>
                    <span className="text-bark-400 text-xs">{item.category}</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-bark-900 line-clamp-2 mb-2">{item.title}</h3>
                  <p className="text-bark-500 text-xs sm:text-sm line-clamp-2 mb-3">{item.preview}</p>
                  <div className="flex items-center gap-4 text-xs text-bark-400">
                    <span className="flex items-center gap-1"><span className="material-icons-outlined text-sm">person</span>{item.author}</span>
                    <span className="flex items-center gap-1"><span className="material-icons-outlined text-sm">schedule</span>{item.date}</span>
                    <span className="flex items-center gap-1"><span className="material-icons-outlined text-sm">visibility</span>{item.views}</span>
                    <span className="flex items-center gap-1"><span className="material-icons-outlined text-sm">chat_bubble_outline</span>{item.comments}</span>
                  </div>
                </div>
              </div>
            </button>
            {item.answer && (
              <div className="border-t border-bark-100 bg-bark-50/50 px-4 sm:px-6 py-3 sm:py-4">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-honey-100 text-honey-700 rounded-lg flex items-center justify-center">
                    <span className="material-icons-outlined text-sm">verified</span>
                  </span>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-bark-800">{item.answer.author}</span>
                      <span className="inline-flex items-center px-1.5 py-0.5 bg-honey-100 text-honey-700 text-[10px] font-bold rounded">EXPERT</span>
                    </div>
                    <p className="text-bark-600 text-xs sm:text-sm line-clamp-2">{item.answer.preview}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <Pagination current={1} total={9} onPageChange={() => {}} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   View: News Board (Blog Cards)
   ───────────────────────────────────────────── */
function NewsBoard({ onViewPost }: { onViewPost: () => void }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-bark-900">양봉뉴스</h2>
        <span className="text-xs font-semibold bg-honey-100 text-honey-800 px-2.5 py-1 rounded-full">총 64건</span>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {NEWS_ITEMS.map((item, idx) => (
          <button
            key={item.id}
            onClick={onViewPost}
            className={`${
              idx === 0 ? 'sm:col-span-2 lg:col-span-2' : ''
            } group bg-white rounded-2xl border border-bark-200 overflow-hidden hover:border-bark-300 hover:shadow-lg transition-all text-left`}
          >
            {idx === 0 ? (
              /* Featured card — horizontal layout */
              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-2/5 aspect-video sm:aspect-auto bg-bark-200 flex items-center justify-center relative min-h-[200px]">
                  <span className="material-icons-outlined text-bark-300 text-7xl">image</span>
                  <span className="absolute top-3 left-3 inline-flex items-center px-2.5 py-1 bg-honey-400 text-bark-900 text-xs font-bold rounded-lg">HOT</span>
                </div>
                <div className="sm:w-3/5 p-5 sm:p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs font-semibold ${categoryColorMap[item.categoryColor] || 'text-honey-600'}`}>{item.category}</span>
                      <span className="text-bark-300">·</span>
                      <span className="text-xs text-bark-400">{item.date}</span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-bark-900 line-clamp-2 mb-2 group-hover:text-honey-700 transition-colors">{item.title}</h3>
                    <p className="text-bark-500 text-sm line-clamp-3">{item.preview}</p>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-bark-200 rounded-full flex items-center justify-center">
                        <span className="material-icons-outlined text-bark-400 text-sm">person</span>
                      </div>
                      <span className="text-xs font-medium text-bark-600">{item.author}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-bark-400">
                      <span className="flex items-center gap-1"><span className="material-icons-outlined text-sm">visibility</span>{item.views.toLocaleString()}</span>
                      {item.likes && <span className="flex items-center gap-1"><span className="material-icons-outlined text-sm">favorite</span>{item.likes}</span>}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Regular card — vertical layout */
              <>
                <div className="aspect-video bg-bark-200 flex items-center justify-center">
                  <span className="material-icons-outlined text-bark-300 text-6xl">image</span>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-semibold ${categoryColorMap[item.categoryColor] || 'text-honey-600'}`}>{item.category}</span>
                    <span className="text-bark-300">·</span>
                    <span className="text-xs text-bark-400">{item.date}</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-bark-900 line-clamp-2 mb-2 group-hover:text-honey-700 transition-colors">{item.title}</h3>
                  <p className="text-bark-500 text-xs sm:text-sm line-clamp-2">{item.preview}</p>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-bark-200 rounded-full flex items-center justify-center">
                        <span className="material-icons-outlined text-bark-400 text-xs">person</span>
                      </div>
                      <span className="text-xs text-bark-600">{item.author}</span>
                    </div>
                    <span className="flex items-center gap-1 text-xs text-bark-400">
                      <span className="material-icons-outlined text-sm">visibility</span>{item.views}
                    </span>
                  </div>
                </div>
              </>
            )}
          </button>
        ))}
      </div>

      <Pagination current={1} total={7} onPageChange={() => {}} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   View: Post Detail
   ───────────────────────────────────────────── */
function PostDetail({ onBack }: { onBack: () => void }) {
  const [liked, setLiked] = useState(false);
  const [commentText, setCommentText] = useState('');

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl border border-bark-200 overflow-hidden">
        {/* Post Header */}
        <div className="px-5 sm:px-8 pt-6 sm:pt-8 pb-4 border-b border-bark-100">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center px-2.5 py-1 bg-honey-100 text-honey-700 text-xs font-bold rounded-lg">{SAMPLE_POST.category}</span>
            <span className="inline-flex items-center px-2 py-0.5 bg-honey-50 text-honey-600 text-[10px] font-bold rounded">{SAMPLE_POST.badge}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-bark-900 mb-4">{SAMPLE_POST.title}</h1>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-bark-200 rounded-full flex items-center justify-center">
                <span className="material-icons-outlined text-bark-400">person</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-bark-800">{SAMPLE_POST.author}</span>
                  <span className="inline-flex items-center px-1.5 py-0.5 bg-bark-800 text-white text-[10px] font-bold rounded">{SAMPLE_POST.authorRole}</span>
                </div>
                <span className="text-xs text-bark-400">{SAMPLE_POST.date}</span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-bark-400">
              <span className="flex items-center gap-1"><span className="material-icons-outlined text-sm">visibility</span>조회 {SAMPLE_POST.views.toLocaleString()}</span>
              <span className="flex items-center gap-1"><span className="material-icons-outlined text-sm">chat_bubble_outline</span>댓글 {SAMPLE_POST.comments}</span>
            </div>
          </div>
        </div>

        {/* Post Content */}
        <div className="px-5 sm:px-8 py-6 sm:py-8">
          <div
            className="prose prose-bark max-w-none text-sm sm:text-base leading-relaxed text-bark-700"
            dangerouslySetInnerHTML={{ __html: SAMPLE_POST.content }}
          />

          {/* Attachments */}
          <div className="mt-8 p-4 bg-bark-50 rounded-xl border border-bark-200">
            <h4 className="text-sm font-semibold text-bark-700 mb-3 flex items-center gap-2">
              <span className="material-icons-outlined text-base">attach_file</span>
              첨부파일 ({SAMPLE_POST.attachments.length})
            </h4>
            <div className="space-y-2">
              {SAMPLE_POST.attachments.map((file) => (
                <button key={file.name} className="w-full flex items-center gap-3 px-3 py-2 bg-white rounded-lg border border-bark-200 hover:border-honey-300 transition-colors group text-left">
                  <span className="material-icons-outlined text-bark-400 group-hover:text-honey-500 text-xl">description</span>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm text-bark-700 truncate block">{file.name}</span>
                    <span className="text-xs text-bark-400">{file.size}</span>
                  </div>
                  <span className="material-icons-outlined text-bark-300 group-hover:text-honey-500 text-lg">download</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Post Actions */}
        <div className="px-5 sm:px-8 py-4 border-t border-bark-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLiked(!liked)}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg transition-colors ${
                liked ? 'text-honey-600 bg-honey-50' : 'text-bark-500 hover:text-honey-600 hover:bg-honey-50'
              }`}
            >
              <span className="material-icons-outlined text-lg">{liked ? 'favorite' : 'favorite_border'}</span>
              <span>좋아요 {SAMPLE_POST.likes + (liked ? 1 : 0)}</span>
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 text-sm text-bark-500 hover:text-bark-700 hover:bg-bark-100 rounded-lg transition-colors">
              <span className="material-icons-outlined text-lg">share</span>
              <span className="hidden sm:inline">공유</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-2 text-sm text-bark-500 hover:text-bark-700 hover:bg-bark-100 rounded-lg transition-colors">
              <span className="material-icons-outlined text-lg">edit</span>
              <span className="hidden sm:inline">수정</span>
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 text-sm text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors">
              <span className="material-icons-outlined text-lg">delete_outline</span>
              <span className="hidden sm:inline">삭제</span>
            </button>
          </div>
        </div>

        {/* Comments Section */}
        <div className="px-5 sm:px-8 py-6 border-t border-bark-200 bg-bark-50/30">
          <h3 className="text-base font-bold text-bark-900 mb-4 flex items-center gap-2">
            <span className="material-icons-outlined text-lg">chat_bubble_outline</span>
            댓글 {SAMPLE_POST.comments}
          </h3>

          <div className="space-y-4">
            {SAMPLE_POST.commentList.map((comment, idx) => (
              <div key={idx} className="flex gap-3">
                <div className="w-8 h-8 bg-bark-200 rounded-full flex-shrink-0 flex items-center justify-center">
                  <span className="material-icons-outlined text-bark-400 text-sm">person</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-bark-800">{comment.author}</span>
                    <span className="text-xs text-bark-400">{comment.date}</span>
                  </div>
                  <p className="text-sm text-bark-600 leading-relaxed">{comment.text}</p>
                  <button className="text-xs text-bark-400 hover:text-bark-600 mt-1">답글</button>
                </div>
              </div>
            ))}

            {/* Admin Reply */}
            <div className="flex gap-3 ml-8 sm:ml-11">
              <div className="w-8 h-8 bg-honey-100 rounded-full flex-shrink-0 flex items-center justify-center">
                <span className="material-icons-outlined text-honey-600 text-sm">verified</span>
              </div>
              <div className="flex-1 bg-honey-50/50 border border-honey-100 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-bark-800">{SAMPLE_POST.adminReply.author}</span>
                  <span className="inline-flex items-center px-1.5 py-0.5 bg-bark-800 text-white text-[10px] font-bold rounded">ADMIN</span>
                  <span className="text-xs text-bark-400">{SAMPLE_POST.adminReply.date}</span>
                </div>
                <p className="text-sm text-bark-600 leading-relaxed">{SAMPLE_POST.adminReply.text}</p>
              </div>
            </div>
          </div>

          {/* Comment Input */}
          <div className="mt-6 flex gap-3">
            <div className="w-8 h-8 bg-bark-200 rounded-full flex-shrink-0 flex items-center justify-center">
              <span className="material-icons-outlined text-bark-400 text-sm">person</span>
            </div>
            <div className="flex-1">
              <textarea
                rows={3}
                placeholder="댓글을 작성하세요..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-bark-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-honey-400 focus:border-transparent"
              />
              <div className="flex justify-end mt-2">
                <button className="px-4 py-2 bg-honey-400 text-bark-900 text-sm font-semibold rounded-lg hover:bg-honey-300 transition-colors">
                  등록
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Post Navigation */}
      <div className="mt-4 bg-white rounded-2xl border border-bark-200 overflow-hidden">
        <button className="w-full flex items-center gap-3 px-5 sm:px-8 py-4 border-b border-bark-100 hover:bg-bark-50 transition-colors text-left">
          <span className="material-icons-outlined text-bark-400">expand_less</span>
          <span className="text-xs text-bark-400 flex-shrink-0 w-16">이전글</span>
          <span className="text-sm text-bark-700 truncate">사이트 이용 가이드 및 커뮤니티 규칙</span>
        </button>
        <button className="w-full flex items-center gap-3 px-5 sm:px-8 py-4 hover:bg-bark-50 transition-colors text-left">
          <span className="material-icons-outlined text-bark-400">expand_more</span>
          <span className="text-xs text-bark-400 flex-shrink-0 w-16">다음글</span>
          <span className="text-sm text-bark-700 truncate">3월 밀원식물 관리 팁 공유</span>
        </button>
      </div>

      {/* Back to List */}
      <div className="flex justify-center mt-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-6 py-3 bg-bark-800 text-white text-sm font-semibold rounded-xl hover:bg-bark-700 transition-colors"
        >
          <span className="material-icons-outlined text-lg">list</span>
          목록으로
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   View: Gallery Viewer (Lightbox)
   ───────────────────────────────────────────── */
function GalleryViewer({ onClose }: { onClose: () => void }) {
  const [currentIdx, setCurrentIdx] = useState(2);
  const totalImages = 8;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-bark-900 rounded-2xl overflow-hidden">
        {/* Viewer Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-bark-700/50">
          <div>
            <h3 className="text-white text-sm sm:text-base font-semibold">봄꽃 피는 양봉장 풍경</h3>
            <span className="text-bark-400 text-xs">김양봉 · 2026.02.15</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-bark-400 text-xs">{currentIdx + 1} / {totalImages}</span>
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center text-bark-400 hover:text-white rounded-lg hover:bg-bark-700 transition-colors"
              aria-label="닫기"
            >
              <span className="material-icons-outlined text-xl">close</span>
            </button>
          </div>
        </div>

        {/* Image Display */}
        <div className="relative flex items-center justify-center min-h-[300px] sm:min-h-[400px] lg:min-h-[500px] bg-bark-800">
          <button
            onClick={() => setCurrentIdx((p) => Math.max(0, p - 1))}
            disabled={currentIdx === 0}
            className="absolute left-2 sm:left-4 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-bark-900/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-bark-900/80 transition-colors disabled:opacity-30"
            aria-label="이전 이미지"
          >
            <span className="material-icons-outlined text-xl sm:text-2xl">chevron_left</span>
          </button>
          <div className="flex items-center justify-center px-16">
            <span className="material-icons-outlined text-bark-600 text-[120px]">image</span>
          </div>
          <button
            onClick={() => setCurrentIdx((p) => Math.min(totalImages - 1, p + 1))}
            disabled={currentIdx === totalImages - 1}
            className="absolute right-2 sm:right-4 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-bark-900/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-bark-900/80 transition-colors disabled:opacity-30"
            aria-label="다음 이미지"
          >
            <span className="material-icons-outlined text-xl sm:text-2xl">chevron_right</span>
          </button>
        </div>

        {/* Thumbnails */}
        <div className="flex items-center gap-2 px-4 sm:px-6 py-4 overflow-x-auto scrollbar-hide">
          {Array.from({ length: totalImages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIdx(i)}
              className={`flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-bark-700 flex items-center justify-center transition-all ${
                i === currentIdx ? 'ring-2 ring-honey-400 opacity-100' : 'opacity-60 hover:opacity-100 hover:ring-2 hover:ring-bark-400'
              }`}
            >
              <span className="material-icons-outlined text-bark-400 text-2xl">image</span>
            </button>
          ))}
        </div>
      </div>

      {/* Back */}
      <div className="flex justify-center mt-6">
        <button
          onClick={onClose}
          className="inline-flex items-center gap-2 px-6 py-3 bg-bark-800 text-white text-sm font-semibold rounded-xl hover:bg-bark-700 transition-colors"
        >
          <span className="material-icons-outlined text-lg">arrow_back</span>
          갤러리로 돌아가기
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Community Page
   ───────────────────────────────────────────── */
export default function CommunityPage() {
  const [activeBoard, setActiveBoard] = useState<BoardType>('notice');
  const [view, setView] = useState<'list' | 'detail' | 'gallery-viewer'>('list');
  const heroAnim = useScrollAnimation();

  const openPostDetail = () => {
    setView('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openGalleryViewer = () => {
    setView('gallery-viewer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const backToList = () => {
    setView('list');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* ─── Page Hero ─── */}
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
        <div
          ref={heroAnim.ref}
          className={`relative max-w-7xl mx-auto px-4 sm:px-6 text-center transition-all duration-700 ${
            heroAnim.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
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

      {/* ─── Board Category Cards ─── */}
      {view === 'list' && (
        <section className="py-12 lg:py-16 bg-white border-b border-bark-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {BOARDS.map((board) => {
                const colors = boardColorMap[board.color] || boardColorMap.honey;
                return (
                  <button
                    key={board.key}
                    onClick={() => { setActiveBoard(board.key); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
                    className={`group p-6 bg-bark-50 rounded-2xl border text-left transition-all duration-300 cursor-pointer hover:-translate-y-0.5 hover:shadow-lg ${
                      activeBoard === board.key ? `${colors.activeBorder} shadow-md` : `border-bark-200 ${colors.border}`
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <span className={`material-icons-outlined ${colors.text} text-2xl`}>{board.icon}</span>
                    </div>
                    <h3 className="font-bold text-bark-900 text-lg mb-1">{board.label}</h3>
                    <p className="text-sm text-bark-500 mb-3">{board.desc}</p>
                    <p className="text-xs text-bark-400">게시글 {board.count}개</p>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ─── Sticky Board Tabs ─── */}
      <div className="sticky top-[56px] sm:top-[64px] z-40 bg-white/90 backdrop-blur-lg border-b border-bark-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-hide" role="tablist">
            {view !== 'list' && (
              <button
                onClick={backToList}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-bark-500 hover:text-bark-800 hover:bg-bark-100 rounded-lg transition-colors whitespace-nowrap min-h-[44px] mr-1"
              >
                <span className="material-icons-outlined text-base">arrow_back</span>
                <span>목록</span>
              </button>
            )}
            {BOARDS.map((board) => (
              <button
                key={board.key}
                role="tab"
                aria-selected={activeBoard === board.key}
                onClick={() => { setActiveBoard(board.key); setView('list'); }}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg whitespace-nowrap min-h-[44px] transition-colors ${
                  activeBoard === board.key
                    ? 'bg-honey-400 text-bark-900 font-semibold'
                    : 'text-bark-500 hover:text-bark-800 hover:bg-bark-100'
                }`}
              >
                <span className="material-icons-outlined text-base">{board.icon}</span>
                <span>{board.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Board Content ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {view === 'detail' && <PostDetail onBack={backToList} />}
        {view === 'gallery-viewer' && <GalleryViewer onClose={backToList} />}
        {view === 'list' && activeBoard === 'notice' && <NoticeBoard onViewPost={openPostDetail} />}
        {view === 'list' && activeBoard === 'gallery' && <GalleryBoard onViewGallery={openGalleryViewer} />}
        {view === 'list' && activeBoard === 'qna' && <QnaBoard onViewPost={openPostDetail} />}
        {view === 'list' && activeBoard === 'news' && <NewsBoard onViewPost={openPostDetail} />}
      </section>
    </>
  );
}
