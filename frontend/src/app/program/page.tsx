'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useScrollAnimation, useCountUp } from '@/lib/useScrollAnimation';

/* ─────────────────────────── Animated Section Wrapper ─────────────────────────── */
function AnimatedSection({
  children,
  className = '',
  animation = 'fade-up',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  animation?: string;
  delay?: number;
}) {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? 'none'
          : animation === 'fade-up'
            ? 'translateY(40px)'
            : animation === 'slide-left'
              ? 'translateX(60px)'
              : animation === 'slide-right'
                ? 'translateX(-60px)'
                : animation === 'scale-in'
                  ? 'scale(0.92)'
                  : 'translateY(40px)',
        transition: `opacity 0.7s ease-out ${delay}s, transform 0.7s ease-out ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/* ─────────────────────────── Counter Stat Component ─────────────────────────── */
function CounterStat({ value, label, icon, suffix = '' }: { value: number; label: string; icon: string; suffix?: string }) {
  const { ref, isVisible } = useScrollAnimation();
  const count = useCountUp(value, isVisible);
  return (
    <div ref={ref} className="text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-honey-50 mb-3">
        <span className="material-icons-outlined text-honey-600 text-xl">{icon}</span>
      </div>
      <p className="text-2xl sm:text-3xl font-black text-bark-900">
        {count.toLocaleString()}{suffix}
      </p>
      <p className="text-sm text-bark-500 mt-1">{label}</p>
    </div>
  );
}

/* ─────────────────────────── Data ─────────────────────────── */

const educationPrograms = [
  {
    id: 'beginner',
    badge: '입문',
    badgeColor: 'honey' as const,
    icon: 'eco',
    title: '양봉 입문 과정',
    subtitle: 'Beekeeping Basics',
    duration: '4주 과정 (주 1회, 3시간)',
    capacity: '정원 20명',
    schedule: '매월 첫째 주 개강',
    price: '무료 (정부 지원)',
    desc: '양봉의 기초 이론부터 실습까지, 초보자를 위한 단계별 교육 프로그램입니다. 꿀벌의 생태, 봉군 관리 기초, 장비 사용법 등을 배웁니다.',
    curriculum: ['꿀벌 생태 이해', '양봉 장비 소개', '봉군 기초 관리', '실습: 내검 체험'],
    detailedCurriculum: [
      { week: '1주차', title: '꿀벌 생태 이해', topics: ['꿀벌의 종류와 생태계 역할', '벌통 구조와 봉군 생태', '꿀벌 의사소통 (8자 춤)'] },
      { week: '2주차', title: '양봉 장비 실습', topics: ['보호복, 훈연기, 벌통 조립', '양봉 도구 사용법 실습', '안전 수칙과 응급처치'] },
      { week: '3주차', title: '봉군 기초 관리', topics: ['봉판 읽기와 봉군 상태 파악', '먹이 공급과 급수 관리', '계절별 관리 포인트'] },
      { week: '4주차', title: '내검 실습 & 수료', topics: ['실제 벌통 내검 체험', '봉군 상태 기록법', '수료식 및 네트워크 안내'] },
    ],
    outcomes: ['양봉 기초 이론 습득', '봉군 관리 기본기 체득', '비온팜 입문 수료증 발급', '수료생 커뮤니티 가입'],
    targetAudience: '양봉에 관심 있는 누구나 (경험 불문)',
    location: '비온팜 교육센터 (전북 완주)',
    nextSession: '2026년 3월 첫째 주',
  },
  {
    id: 'intermediate',
    badge: '실전',
    badgeColor: 'bee' as const,
    icon: 'hive',
    title: '실전 양봉 과정',
    subtitle: 'Practical Beekeeping',
    duration: '8주 과정 (주 2회, 3시간)',
    capacity: '정원 15명',
    schedule: '분기별 개강',
    price: '30만원',
    desc: '현장 실습 중심의 실전 양봉 기술을 배우는 중급자 과정입니다. 계절별 봉군 관리, 채밀, 질병 예방 등 실무 역량을 키웁니다.',
    curriculum: ['계절별 봉군 관리', '채밀 기술 실습', '질병 예방·치료', '여왕벌 관리'],
    detailedCurriculum: [
      { week: '1-2주차', title: '봉군 심화 관리', topics: ['봉군 강세·약세 판별법', '합봉과 분봉 기술', '여왕벌 인공 양성'] },
      { week: '3-4주차', title: '계절별 관리 전략', topics: ['봄철 봉군 증식 전략', '여름 더위·장마 대비', '가을 월동 준비'] },
      { week: '5-6주차', title: '채밀 & 생산물 관리', topics: ['최적 채밀 시기 판단', '채밀 장비 운용 실습', '꿀 가공 및 품질 관리'] },
      { week: '7-8주차', title: '질병 예방 & 실전 종합', topics: ['주요 질병 진단·치료', '해충(말벌, 꿀벌응애) 방제', '종합 실전 시험 & 수료'] },
    ],
    outcomes: ['계절별 봉군 관리 능력', '채밀 기술 체득', '질병 예방·관리 역량', '비온팜 실전 인증서 발급'],
    targetAudience: '입문 과정 수료자 또는 양봉 1년 이상 경험자',
    location: '비온팜 교육센터 (전북 완주)',
    nextSession: '2026년 4월 분기 개강',
  },
  {
    id: 'expert',
    badge: '전문가',
    badgeColor: 'farm' as const,
    icon: 'hub',
    title: '스마트 양봉 전문가',
    subtitle: 'Smart Beekeeping Expert',
    duration: '12주 과정 (주 2회, 4시간)',
    capacity: '정원 12명',
    schedule: '연 2회 (3월, 9월)',
    price: '50만원',
    desc: 'IoT 센서, AI 데이터 분석, 모바일 관리 등 첨단 디지털 양봉 기술을 마스터합니다. 수료 후 비온팜 인증 전문가로 활동할 수 있습니다.',
    curriculum: ['IoT 센서 설치·운용', 'AI 데이터 분석', '모바일 원격 관리', '비온팜 인증 평가'],
    detailedCurriculum: [
      { week: '1-3주차', title: 'IoT 센서 시스템', topics: ['온습도·중량 센서 설치', '센서 데이터 수집 체계', '게이트웨이 설정 및 운용'] },
      { week: '4-6주차', title: 'AI 데이터 분석', topics: ['벌통 데이터 시각화', 'AI 기반 봉군 상태 예측', '이상 징후 알림 설정'] },
      { week: '7-9주차', title: '스마트 양봉장 운영', topics: ['모바일 앱 원격 관리', '자동 먹이·온도 제어', '밀원 지도 활용 전략'] },
      { week: '10-12주차', title: '인증 평가 & 실전', topics: ['스마트 양봉장 구축 프로젝트', '비온팜 전문가 인증 시험', '파트너 양봉가 등록 & 네트워킹'] },
    ],
    outcomes: ['IoT 스마트 양봉 시스템 운용 능력', 'AI 데이터 분석 역량', '비온팜 전문가 인증서 발급', '파트너 양봉가 자격 취득'],
    targetAudience: '실전 과정 수료자 또는 양봉 3년 이상 경험자',
    location: '비온팜 교육센터 & 스마트 양봉장 (전북 완주)',
    nextSession: '2026년 3월 개강 (접수 중)',
  },
];

const healingPrograms = [
  {
    id: 'disabled',
    icon: 'accessibility_new',
    title: '발달장애인 치유양봉',
    target: '발달장애 청소년·성인',
    duration: '주 2회 / 12주',
    capacity: '회당 10명',
    desc: '꿀벌 관찰, 밀랍 공예, 꿀 채밀 체험 등을 통해 집중력 향상과 정서적 안정을 도모합니다. 전문 치유사가 1:3 비율로 함께합니다.',
    tags: ['감각 자극', '소근육 발달', '사회성 향상', '자존감 형성'],
    activities: ['벌통 관찰 일기 쓰기', '밀랍초 만들기', '꿀 채밀 체험', '허브 가드닝', '자연 산책 명상'],
    effects: ['집중력 평균 35% 향상', '사회적 상호작용 증가', '감각 통합 발달 촉진', '자존감 및 성취감 증진'],
  },
  {
    id: 'elderly',
    icon: 'elderly',
    title: '어르신 치유양봉',
    target: '65세 이상 어르신',
    duration: '주 1회 / 8주',
    capacity: '회당 15명',
    desc: '자연 속에서 봉군을 돌보며 신체 활동과 정서적 교류를 경험합니다. 인지 기능 유지와 우울감 해소에 효과적인 프로그램입니다.',
    tags: ['인지 활동', '신체 활동', '정서 안정', '사회 교류'],
    activities: ['봉군 돌보기', '텃밭 가꾸기', '꿀 시식 & 요리', '자연 물감 그림 그리기', '추억 나눔 시간'],
    effects: ['인지 기능 유지 효과', '우울감 42% 감소', '사회적 고립감 해소', '신체 활동량 증가'],
  },
  {
    id: 'family',
    icon: 'family_restroom',
    title: '가족 체험 프로그램',
    target: '가족 단위 (자녀 만 5세 이상)',
    duration: '1일 체험 (4시간)',
    capacity: '가족 10팀',
    desc: '부모와 아이가 함께하는 양봉 체험 프로그램입니다. 꿀벌 관찰, 꿀 시식, 밀랍초 만들기 등 다양한 활동을 즐깁니다.',
    tags: ['가족 유대', '자연 교육', '생태 체험', '추억 만들기'],
    activities: ['꿀벌 생태 교실', '보호복 착용 & 내검 체험', '밀랍초 만들기', '꿀 시식 & 간식', '가족 기념 사진 촬영'],
    effects: ['부모-자녀 유대감 강화', '자연 감수성 발달', '생태계 인식 향상', '가족 추억 형성'],
  },
  {
    id: 'corporate',
    icon: 'groups',
    title: '기업·단체 연수 프로그램',
    target: '기업, 학교, 단체',
    duration: '1~2일 과정 (맞춤)',
    capacity: '최대 30명',
    desc: '팀빌딩과 ESG 활동을 결합한 기업 연수 프로그램입니다. 양봉 체험, 꿀 수확, 환경 교육을 통해 지속가능한 가치를 경험합니다.',
    tags: ['팀빌딩', 'ESG 활동', '환경 교육', '사회 공헌'],
    activities: ['팀별 봉군 관리 미션', '꿀 채밀 & 시식 대회', 'ESG 특강 & 토론', '벌통 후원 프로그램', '단체 기념 촬영'],
    effects: ['팀워크 향상', 'ESG 경영 체험', '직원 만족도 증가', '사회적 가치 인식 제고'],
  },
];

const healingAgriculturePrograms = [
  {
    icon: 'local_florist',
    title: '치유 텃밭 가꾸기',
    desc: '허브, 채소, 꽃을 직접 심고 가꾸며 자연의 치유력을 경험합니다. 원예치료 전문가와 함께하는 프로그램입니다.',
    duration: '주 1회 / 10주',
    color: 'bee',
  },
  {
    icon: 'spa',
    title: '아로마 & 허브 테라피',
    desc: '직접 재배한 허브로 아로마 오일, 비누, 차를 만들어봅니다. 오감을 활용한 감각 치유 프로그램입니다.',
    duration: '주 1회 / 6주',
    color: 'honey',
  },
  {
    icon: 'nature_people',
    title: '숲 치유 프로그램',
    desc: '양봉장 인근 숲에서 진행하는 산림 치유 활동입니다. 숲 산책, 명상, 자연 공예 활동으로 구성됩니다.',
    duration: '주 1회 / 8주',
    color: 'bee',
  },
  {
    icon: 'restaurant',
    title: '꿀벌 식탁 요리교실',
    desc: '꿀과 봉산물, 텃밭 채소를 활용한 건강 요리를 함께 만들며 식문화를 배우는 프로그램입니다.',
    duration: '월 2회 / 6개월',
    color: 'farm',
  },
];

const processSteps = [
  { step: '01', icon: 'search', title: '프로그램 탐색', desc: '관심 있는 프로그램을 살펴보세요' },
  { step: '02', icon: 'edit_note', title: '온라인 신청', desc: '문의/신청 페이지에서 간편 접수' },
  { step: '03', icon: 'how_to_reg', title: '접수 확인', desc: '담당자가 연락드려 일정 확정' },
  { step: '04', icon: 'celebration', title: '프로그램 참여', desc: '교육장에서 실제 프로그램 참여' },
];

const instructors = [
  {
    name: '김양봉',
    role: '수석 교육 강사',
    career: '양봉 경력 25년',
    speciality: '봉군 관리 · 채밀 기술',
    icon: 'person',
    certifications: ['한국양봉협회 인증 전문가', '농촌진흥청 양봉 기술 강사'],
  },
  {
    name: '이스마트',
    role: 'IoT 교육 강사',
    career: 'ICT 융합 농업 10년',
    speciality: 'IoT 센서 · AI 분석',
    icon: 'engineering',
    certifications: ['스마트팜 전문가 자격', '정보처리기사'],
  },
  {
    name: '박치유',
    role: '치유양봉 프로그램 디렉터',
    career: '원예치료사 15년',
    speciality: '치유농업 · 원예치료',
    icon: 'psychology',
    certifications: ['원예치료사 1급', '사회복지사 1급'],
  },
  {
    name: '최자연',
    role: '체험 프로그램 강사',
    career: '환경교육 전문가 12년',
    speciality: '생태교육 · 가족 프로그램',
    icon: 'nature',
    certifications: ['환경교육 전문가', '숲해설가 1급'],
  },
];

const testimonials = [
  {
    name: '김OO 님',
    program: '양봉 입문 과정',
    text: '전혀 모르는 상태에서 시작했는데, 4주 만에 혼자 내검할 수 있게 되었어요. 강사님이 정말 친절하시고 체계적이에요.',
    rating: 5,
  },
  {
    name: '이OO 님 가족',
    program: '가족 체험 프로그램',
    text: '아이가 벌을 무서워했는데, 체험 후에는 벌에게 관심을 갖게 되었어요. 온 가족이 특별한 경험을 했습니다.',
    rating: 5,
  },
  {
    name: '(주)그린테크',
    program: '기업 연수 프로그램',
    text: 'ESG 활동과 팀빌딩을 동시에 할 수 있어서 직원들의 만족도가 매우 높았습니다. 다음 분기에도 신청 예정입니다.',
    rating: 5,
  },
  {
    name: '박OO 님 (보호자)',
    program: '발달장애인 치유양봉',
    text: '아이가 밀랍 공예에 큰 흥미를 보이며 집중력이 눈에 띄게 좋아졌습니다. 치유사 선생님들이 정말 전문적이세요.',
    rating: 5,
  },
];

const upcomingSchedules = [
  { date: '2026.03.02', program: '양봉 입문 과정', status: '접수중', color: 'honey', spots: '5석 남음' },
  { date: '2026.03.15', program: '가족 체험 프로그램', status: '접수중', color: 'bee', spots: '3팀 남음' },
  { date: '2026.04.01', program: '실전 양봉 과정', status: '접수 예정', color: 'bee', spots: '15석' },
  { date: '2026.03.08', program: '어르신 치유양봉', status: '접수중', color: 'farm', spots: '7석 남음' },
  { date: '2026.03.22', program: '치유 텃밭 가꾸기', status: '접수중', color: 'bee', spots: '10석 남음' },
  { date: '2026.09.01', program: '스마트 양봉 전문가', status: '접수 예정', color: 'farm', spots: '12석' },
];

const colorMap = {
  honey: {
    gradient: 'bg-gradient-to-br from-honey-50 to-honey-100',
    blob: 'bg-honey-200/40',
    icon: 'text-honey-400',
    iconBg: 'bg-honey-50',
    badge: 'bg-honey-100 text-honey-700',
    dot: 'bg-honey-400',
    button: 'bg-honey-50 text-honey-700 hover:bg-honey-100',
    buttonSolid: 'bg-honey-500 text-white hover:bg-honey-600',
    border: 'border-honey-200',
    ring: 'ring-honey-400',
    text: 'text-honey-600',
    lightBg: 'bg-honey-50',
    statusBg: 'bg-honey-100 text-honey-700',
  },
  bee: {
    gradient: 'bg-gradient-to-br from-bee-50 to-bee-100',
    blob: 'bg-bee-200/40',
    icon: 'text-bee-400',
    iconBg: 'bg-bee-50',
    badge: 'bg-bee-100 text-bee-700',
    dot: 'bg-bee-400',
    button: 'bg-bee-50 text-bee-700 hover:bg-bee-100',
    buttonSolid: 'bg-bee-500 text-white hover:bg-bee-600',
    border: 'border-bee-200',
    ring: 'ring-bee-400',
    text: 'text-bee-600',
    lightBg: 'bg-bee-50',
    statusBg: 'bg-bee-100 text-bee-700',
  },
  farm: {
    gradient: 'bg-gradient-to-br from-farm-50 to-farm-100',
    blob: 'bg-farm-200/40',
    icon: 'text-farm-400',
    iconBg: 'bg-farm-50',
    badge: 'bg-farm-100 text-farm-700',
    dot: 'bg-farm-400',
    button: 'bg-farm-50 text-farm-700 hover:bg-farm-100',
    buttonSolid: 'bg-farm-500 text-white hover:bg-farm-600',
    border: 'border-farm-200',
    ring: 'ring-farm-400',
    text: 'text-farm-600',
    lightBg: 'bg-farm-50',
    statusBg: 'bg-farm-100 text-farm-700',
  },
};

type TabType = 'education' | 'healing';

/* ═══════════════════════════ PROGRAM PAGE ═══════════════════════════ */
export default function ProgramPage() {
  const [activeTab, setActiveTab] = useState<TabType>('education');
  const [expandedProgram, setExpandedProgram] = useState<string | null>(null);
  const [expandedHealing, setExpandedHealing] = useState<string | null>(null);

  const toggleProgram = useCallback((id: string) => {
    setExpandedProgram(prev => prev === id ? null : id);
  }, []);

  const toggleHealing = useCallback((id: string) => {
    setExpandedHealing(prev => prev === id ? null : id);
  }, []);

  return (
    <>
      {/* ────────────── HERO SECTION ────────────── */}
      <section className="bg-bark-900 text-white py-20 lg:py-28 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-[20rem] sm:w-[30rem] h-[20rem] sm:h-[30rem] bg-honey-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-[20rem] sm:w-[40rem] h-[20rem] sm:h-[40rem] bg-bee-400/[0.08] rounded-full blur-3xl" />
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
          <AnimatedSection>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-honey-500/10 border border-honey-500/20 rounded-full text-honey-400 text-sm font-medium mb-6">
              <span className="material-icons-outlined text-base">school</span>
              교육 &amp; 치유농업
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
              교육센터 &amp; <span className="text-honey-400">치유농업</span> 프로그램
            </h1>
            <p className="text-bark-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-10">
              양봉 입문부터 스마트양봉 전문가 과정까지 체계적인 교육 커리큘럼과,
              <br className="hidden sm:block" />
              자연과 꿀벌을 통해 마음을 치유하는 치유농업 프로그램을 만나보세요.
            </p>
          </AnimatedSection>

          {/* Main Tab Switcher */}
          <AnimatedSection delay={0.1}>
            <div className="inline-flex items-center bg-bark-800/80 backdrop-blur-sm rounded-full p-1.5 border border-bark-700">
              <button
                onClick={() => setActiveTab('education')}
                className={`inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-full transition-all duration-300 ${
                  activeTab === 'education'
                    ? 'bg-honey-500 text-bark-900 shadow-lg shadow-honey-500/30'
                    : 'text-bark-400 hover:text-white'
                }`}
              >
                <span className="material-icons-outlined text-base">school</span>
                교육센터
              </button>
              <button
                onClick={() => setActiveTab('healing')}
                className={`inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-full transition-all duration-300 ${
                  activeTab === 'healing'
                    ? 'bg-bee-500 text-white shadow-lg shadow-bee-500/30'
                    : 'text-bark-400 hover:text-white'
                }`}
              >
                <span className="material-icons-outlined text-base">favorite</span>
                치유농업
              </button>
            </div>
          </AnimatedSection>

          {/* Section quick-nav */}
          <AnimatedSection delay={0.2} className="mt-6">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href="#programs"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-bark-400 border border-bark-700 rounded-full hover:border-bark-500 hover:text-bark-300 transition-colors"
              >
                <span className="material-icons-outlined text-sm">list</span>
                프로그램 목록
              </a>
              <a
                href="#schedule"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-bark-400 border border-bark-700 rounded-full hover:border-bark-500 hover:text-bark-300 transition-colors"
              >
                <span className="material-icons-outlined text-sm">calendar_today</span>
                일정 안내
              </a>
              <a
                href="#instructors"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-bark-400 border border-bark-700 rounded-full hover:border-bark-500 hover:text-bark-300 transition-colors"
              >
                <span className="material-icons-outlined text-sm">people</span>
                강사진 소개
              </a>
              <a
                href="#process"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-bark-400 border border-bark-700 rounded-full hover:border-bark-500 hover:text-bark-300 transition-colors"
              >
                <span className="material-icons-outlined text-sm">route</span>
                참여 방법
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ────────────── IMPACT STATS BAND ────────────── */}
      <section className="py-12 bg-white border-b border-bark-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <CounterStat value={1200} label="교육 수료자" icon="school" suffix="+" />
            <CounterStat value={300} label="치유농업 참여자" icon="favorite" suffix="+" />
            <CounterStat value={96} label="만족도" icon="thumb_up" suffix="%" />
            <CounterStat value={15} label="운영 지역" icon="location_on" suffix="개" />
          </div>
        </div>
      </section>

      {/* ────────────── STICKY TAB BAR ────────────── */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-bark-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-1 py-2 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveTab('education')}
              className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                activeTab === 'education'
                  ? 'bg-honey-500 text-bark-900 shadow-md'
                  : 'text-bark-500 hover:bg-bark-100 hover:text-bark-700'
              }`}
            >
              <span className="material-icons-outlined text-sm align-middle mr-1">school</span>
              교육센터 프로그램
            </button>
            <button
              onClick={() => setActiveTab('healing')}
              className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                activeTab === 'healing'
                  ? 'bg-bee-500 text-white shadow-md'
                  : 'text-bark-500 hover:bg-bark-100 hover:text-bark-700'
              }`}
            >
              <span className="material-icons-outlined text-sm align-middle mr-1">favorite</span>
              치유농업
            </button>
            <div className="flex-1" />
            <a
              href="#schedule"
              className="hidden sm:inline-flex items-center gap-1 px-4 py-2 text-xs font-medium text-bark-500 hover:text-bark-700 transition-colors"
            >
              <span className="material-icons-outlined text-sm">calendar_today</span>
              일정
            </a>
            <a
              href="#process"
              className="hidden sm:inline-flex items-center gap-1 px-4 py-2 text-xs font-medium text-bark-500 hover:text-bark-700 transition-colors"
            >
              <span className="material-icons-outlined text-sm">route</span>
              참여방법
            </a>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          EDUCATION CENTER TAB
          ════════════════════════════════════════════════════════════════ */}
      {activeTab === 'education' && (
        <>
          {/* ────────────── EDUCATION PROGRAMS SECTION ────────────── */}
          <section id="programs" className="py-24 lg:py-32 bg-white scroll-mt-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <AnimatedSection className="text-center mb-16">
                <p className="text-honey-600 font-semibold text-xs tracking-[0.2em] uppercase mb-4">Education Center</p>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-bark-900 leading-tight">
                  양봉 교육 <span className="text-honey-600">프로그램</span>
                </h2>
                <p className="mt-4 text-bark-500 max-w-2xl mx-auto">
                  비온팜 교육센터에서 초보자부터 전문가까지 체계적인 커리큘럼으로
                  양봉 기술을 교육합니다. 단계별 과정을 선택해 보세요.
                </p>
              </AnimatedSection>

              {/* Level indicator */}
              <AnimatedSection className="mb-12" delay={0.05}>
                <div className="flex items-center justify-center gap-2 sm:gap-4">
                  {educationPrograms.map((p, idx) => {
                    const colors = colorMap[p.badgeColor];
                    return (
                      <div key={p.id} className="flex items-center gap-2 sm:gap-4">
                        <div className="text-center">
                          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${colors.lightBg} flex items-center justify-center mx-auto mb-1`}>
                            <span className={`material-icons-outlined ${colors.text} text-lg sm:text-xl`}>{p.icon}</span>
                          </div>
                          <span className={`text-xs font-bold ${colors.text}`}>{p.badge}</span>
                        </div>
                        {idx < educationPrograms.length - 1 && (
                          <div className="w-8 sm:w-16 h-px bg-bark-200 relative top-[-8px]">
                            <span className="material-icons-outlined text-bark-300 text-sm absolute -right-1 -top-[7px]">chevron_right</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </AnimatedSection>

              {/* Program Cards */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {educationPrograms.map((program, idx) => {
                  const colors = colorMap[program.badgeColor];
                  const isExpanded = expandedProgram === program.id;
                  return (
                    <AnimatedSection key={program.id} delay={idx * 0.1}>
                      <div className={`group bg-white rounded-3xl overflow-hidden border hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 flex flex-col ${
                        isExpanded ? `${colors.border} shadow-xl` : 'border-bark-200 hover:border-honey-300 hover:shadow-honey-100/50'
                      }`}>
                        {/* Card Header with Icon */}
                        <div className={`h-44 flex items-center justify-center relative overflow-hidden ${colors.gradient}`}>
                          <div className={`absolute top-0 right-0 w-32 h-32 rounded-full -translate-y-1/2 translate-x-1/2 ${colors.blob}`} />
                          <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full translate-y-1/2 -translate-x-1/3 opacity-30 bg-white/20" />
                          <span className={`material-icons-outlined text-6xl group-hover:scale-110 transition-transform duration-500 ${colors.icon}`}>
                            {program.icon}
                          </span>
                          {/* Next session badge */}
                          <div className="absolute top-3 right-3">
                            <span className="px-2.5 py-1 text-[10px] font-bold bg-white/90 text-bark-700 rounded-full shadow-sm">
                              {program.nextSession}
                            </span>
                          </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-6 flex flex-col flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`px-3 py-1 text-xs font-bold rounded-full ${colors.badge}`}>
                              {program.badge}
                            </span>
                            <span className="text-xs text-bark-400 flex items-center gap-1">
                              <span className="material-icons-outlined text-sm">schedule</span>
                              {program.duration}
                            </span>
                          </div>
                          <p className="text-[11px] text-bark-400 mb-3">{program.subtitle}</p>
                          <h3 className="text-xl font-bold text-bark-900 mb-2">{program.title}</h3>
                          <p className="text-sm text-bark-500 leading-relaxed mb-5">{program.desc}</p>

                          {/* Curriculum preview */}
                          <div className="mb-5 flex-1">
                            <p className="text-xs font-bold text-bark-700 uppercase tracking-wider mb-2">주요 커리큘럼</p>
                            <ul className="space-y-1.5">
                              {program.curriculum.map((item) => (
                                <li key={item} className="flex items-center gap-2 text-sm text-bark-500">
                                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${colors.dot}`} />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Meta Info */}
                          <div className="space-y-2 mb-5 text-xs text-bark-400">
                            <div className="flex items-center gap-1.5">
                              <span className="material-icons-outlined text-sm">calendar_today</span>
                              {program.schedule}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="material-icons-outlined text-sm">people</span>
                              {program.capacity}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="material-icons-outlined text-sm">payments</span>
                              {program.price}
                            </div>
                          </div>

                          {/* Expandable Detail */}
                          <button
                            onClick={() => toggleProgram(program.id)}
                            className={`w-full flex items-center justify-center gap-1 px-4 py-2 text-xs font-medium rounded-lg transition-colors mb-3 ${colors.button}`}
                          >
                            <span className="material-icons-outlined text-sm" style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}>
                              expand_more
                            </span>
                            {isExpanded ? '상세 정보 접기' : '상세 커리큘럼 보기'}
                          </button>

                          {/* Expanded Content */}
                          <div
                            className="overflow-hidden transition-all duration-500"
                            style={{ maxHeight: isExpanded ? '800px' : '0px', opacity: isExpanded ? 1 : 0 }}
                          >
                            <div className="space-y-4 pt-3 border-t border-bark-100">
                              {/* Detailed Curriculum */}
                              <div>
                                <p className="text-xs font-bold text-bark-700 uppercase tracking-wider mb-3">주차별 상세 커리큘럼</p>
                                <div className="space-y-3">
                                  {program.detailedCurriculum.map((week) => (
                                    <div key={week.week} className={`p-3 rounded-xl ${colors.lightBg}`}>
                                      <div className="flex items-center gap-2 mb-1.5">
                                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${colors.badge}`}>{week.week}</span>
                                        <span className="text-sm font-semibold text-bark-800">{week.title}</span>
                                      </div>
                                      <ul className="space-y-1">
                                        {week.topics.map((topic) => (
                                          <li key={topic} className="flex items-center gap-1.5 text-xs text-bark-500">
                                            <span className={`w-1 h-1 rounded-full ${colors.dot}`} />
                                            {topic}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Outcomes */}
                              <div>
                                <p className="text-xs font-bold text-bark-700 uppercase tracking-wider mb-2">수료 후 기대 효과</p>
                                <div className="flex flex-wrap gap-1.5">
                                  {program.outcomes.map((outcome) => (
                                    <span key={outcome} className="inline-flex items-center gap-1 px-2.5 py-1 text-xs bg-bark-50 text-bark-600 rounded-full border border-bark-200">
                                      <span className="material-icons-outlined text-xs text-bark-400">check_circle</span>
                                      {outcome}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {/* Extra Info */}
                              <div className="text-xs text-bark-400 space-y-1">
                                <p><strong className="text-bark-600">대상:</strong> {program.targetAudience}</p>
                                <p><strong className="text-bark-600">장소:</strong> {program.location}</p>
                              </div>
                            </div>
                          </div>

                          {/* Action */}
                          <div className="pt-4 border-t border-bark-100 mt-auto">
                            <Link
                              href="/contact"
                              className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold rounded-xl transition-all ${colors.buttonSolid}`}
                            >
                              신청하기
                              <span className="material-icons-outlined text-base">arrow_forward</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </AnimatedSection>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ────────────── PROGRAM FEATURES ────────────── */}
          <section className="py-24 lg:py-32 bg-bark-900 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03]">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="honeycomb-features" x="0" y="0" width="56" height="100" patternUnits="userSpaceOnUse" patternTransform="scale(1.5)">
                    <path d="M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100" fill="none" stroke="#FFC72C" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#honeycomb-features)" />
              </svg>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
              <AnimatedSection className="text-center mb-16">
                <p className="text-honey-400 font-semibold text-xs tracking-[0.2em] uppercase mb-4">Why BeeOnFarm</p>
                <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">
                  비온팜 교육이 <span className="text-honey-400">특별한 이유</span>
                </h2>
              </AnimatedSection>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { icon: 'precision_manufacturing', title: '첨단 IoT 실습 환경', desc: '비온팜의 IoT 센서, AI 분석 장비를 직접 체험하며 실무 역량을 키웁니다.' },
                  { icon: 'person', title: '현장 전문가 강사진', desc: '10년 이상 경력의 양봉 전문가와 치유사가 직접 교육을 진행합니다.' },
                  { icon: 'workspace_premium', title: '인증서 발급', desc: '과정 수료 시 비온팜 공식 인증서를 발급하며, 전문가 네트워크에 참여할 수 있습니다.' },
                  { icon: 'nature', title: '자연 속 교육장', desc: '전북 완주의 쾌적한 자연환경에서 이론과 실습을 병행합니다.' },
                  { icon: 'support_agent', title: '수료 후 지속 지원', desc: '수료생 커뮤니티, 장비 할인, 기술 상담 등 지속적인 사후 지원을 제공합니다.' },
                  { icon: 'trending_up', title: '높은 취업·창업 연계율', desc: '수료생 중 38%가 양봉 관련 창업 또는 취업에 성공했습니다.' },
                ].map((item, idx) => (
                  <AnimatedSection key={item.title} delay={idx * 0.08}>
                    <div className="group bg-bark-800 rounded-2xl p-6 border border-bark-700 hover:border-honey-500/40 transition-all h-full">
                      <div className="w-11 h-11 rounded-xl bg-honey-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <span className="material-icons-outlined text-honey-400 text-xl">{item.icon}</span>
                      </div>
                      <h3 className="text-base font-bold mb-2">{item.title}</h3>
                      <p className="text-sm text-bark-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* ════════════════════════════════════════════════════════════════
          HEALING AGRICULTURE TAB
          ════════════════════════════════════════════════════════════════ */}
      {activeTab === 'healing' && (
        <>
          {/* ────────────── HEALING BEEKEEPING INTRO ────────────── */}
          <section id="programs" className="py-24 lg:py-32 bg-white scroll-mt-32 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-bee-100/40 rounded-full translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-honey-100/30 rounded-full -translate-x-1/3 translate-y-1/3" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
              <div className="flex flex-col lg:flex-row items-center gap-16 mb-20">
                {/* Text */}
                <AnimatedSection className="flex-1" animation="slide-right">
                  <p className="text-bee-600 font-semibold text-xs tracking-[0.2em] uppercase mb-4">Healing Agriculture</p>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-bark-900 leading-tight">
                    자연으로 치유하는
                    <br />
                    <span className="text-bee-600">치유농업</span> 프로그램
                  </h2>
                  <p className="mt-6 text-bark-500 leading-relaxed">
                    퓨르메재단과 함께하는 치유농업 프로그램은 자연과 꿀벌, 텃밭, 숲을 통해
                    심리적 안정과 사회적 연결을 경험하는 특별한 프로그램입니다.
                    발달장애인, 어르신, 가족 등 다양한 참여자에게 맞춤형 치유 경험을 제공합니다.
                  </p>
                  <div className="mt-8 space-y-4">
                    {[
                      { icon: 'spa', title: '자연 기반 치유', desc: '꿀벌과 자연환경을 활용한 오감 자극 활동으로 심신 안정을 도모합니다.', iconColor: 'text-bee-600', bgColor: 'bg-bee-50' },
                      { icon: 'psychology', title: '전문 치유사 동행', desc: '원예치료사, 사회복지사 등 전문 인력이 프로그램을 진행합니다.', iconColor: 'text-honey-600', bgColor: 'bg-honey-50' },
                      { icon: 'handshake', title: '퓨르메재단 연계', desc: '장애인 복지 전문 기관인 퓨르메재단과 협력하여 운영합니다.', iconColor: 'text-farm-600', bgColor: 'bg-farm-50' },
                    ].map((item) => (
                      <div key={item.title} className="flex items-start gap-3">
                        <div className={`w-9 h-9 rounded-lg ${item.bgColor} flex items-center justify-center shrink-0 mt-0.5`}>
                          <span className={`material-icons-outlined ${item.iconColor} text-lg`}>{item.icon}</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-bark-900 text-sm">{item.title}</h4>
                          <p className="text-sm text-bark-500 mt-1">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </AnimatedSection>

                {/* Visual — Effect Stats */}
                <AnimatedSection className="flex-1 w-full" animation="slide-left">
                  <div className="relative">
                    <div className="bg-gradient-to-br from-bee-900 to-bee-800 rounded-3xl p-8 lg:p-10 text-white">
                      <div className="text-center mb-8">
                        <span className="material-icons-outlined text-6xl text-bee-300/80">favorite</span>
                        <h3 className="text-2xl font-bold mt-4">치유농업의 효과</h3>
                        <p className="text-bee-200/70 text-sm mt-2">참여자 설문 기반 (2025년 결과)</p>
                      </div>
                      <div className="space-y-4">
                        {[
                          { label: '정서적 안정감 향상', value: 94 },
                          { label: '사회적 교류 증가', value: 89 },
                          { label: '자존감·자신감 향상', value: 87 },
                          { label: '신체 활동량 증가', value: 82 },
                          { label: '삶의 질 만족도', value: 91 },
                        ].map((item) => (
                          <div key={item.label}>
                            <div className="flex items-center justify-between text-sm mb-1.5">
                              <span className="text-bee-100">{item.label}</span>
                              <span className="font-bold text-bee-300">{item.value}%</span>
                            </div>
                            <div className="h-2 bg-bee-800/50 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-bee-400 to-bee-300 rounded-full transition-all duration-1000"
                                style={{ width: `${item.value}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-bee-100 rounded-2xl -z-10 hidden sm:block" />
                    <div className="absolute -top-4 -left-4 w-16 h-16 bg-honey-100 rounded-2xl -z-10 hidden sm:block" />
                  </div>
                </AnimatedSection>
              </div>

              {/* ── Healing Beekeeping Programs Grid ── */}
              <AnimatedSection className="text-center mb-12">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-bark-900">
                  치유양봉 <span className="text-bee-600">세부 프로그램</span>
                </h3>
                <p className="mt-3 text-bark-500 max-w-xl mx-auto">
                  참여 대상과 목적에 맞는 다양한 치유양봉 프로그램을 운영합니다.
                </p>
              </AnimatedSection>

              <div className="grid sm:grid-cols-2 gap-6">
                {healingPrograms.map((program, idx) => {
                  const isExpanded = expandedHealing === program.id;
                  return (
                    <AnimatedSection key={program.id} delay={idx * 0.1}>
                      <div className={`group bg-white rounded-2xl p-6 lg:p-8 border transition-all duration-500 h-full ${
                        isExpanded ? 'border-bee-300 shadow-xl shadow-bee-100/30' : 'border-bark-200 hover:border-bee-300 hover:shadow-xl hover:shadow-bee-100/30'
                      }`}>
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-bee-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <span className="material-icons-outlined text-bee-600 text-2xl">{program.icon}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-lg font-bold text-bark-900 mb-1">{program.title}</h4>
                            <p className="text-xs text-bee-600 font-medium">{program.target}</p>
                          </div>
                        </div>

                        <p className="mt-4 text-sm text-bark-500 leading-relaxed">{program.desc}</p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5 mt-4">
                          {program.tags.map((tag) => (
                            <span key={tag} className="px-2.5 py-1 text-xs font-medium bg-bee-50 text-bee-700 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Expand toggle */}
                        <button
                          onClick={() => toggleHealing(program.id)}
                          className="w-full flex items-center justify-center gap-1 px-4 py-2 text-xs font-medium text-bee-700 bg-bee-50 hover:bg-bee-100 rounded-lg transition-colors mt-4"
                        >
                          <span className="material-icons-outlined text-sm" style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}>
                            expand_more
                          </span>
                          {isExpanded ? '접기' : '활동 내용 & 효과 보기'}
                        </button>

                        {/* Expanded Detail */}
                        <div
                          className="overflow-hidden transition-all duration-500"
                          style={{ maxHeight: isExpanded ? '500px' : '0px', opacity: isExpanded ? 1 : 0 }}
                        >
                          <div className="pt-4 space-y-4">
                            {/* Activities */}
                            <div>
                              <p className="text-xs font-bold text-bark-700 uppercase tracking-wider mb-2">주요 활동</p>
                              <div className="grid grid-cols-2 gap-2">
                                {program.activities.map((activity) => (
                                  <div key={activity} className="flex items-center gap-1.5 text-xs text-bark-600 bg-bark-50 p-2 rounded-lg">
                                    <span className="material-icons-outlined text-bee-500 text-xs">check</span>
                                    {activity}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Effects */}
                            <div>
                              <p className="text-xs font-bold text-bark-700 uppercase tracking-wider mb-2">기대 효과</p>
                              <div className="space-y-1.5">
                                {program.effects.map((effect) => (
                                  <div key={effect} className="flex items-center gap-2 text-xs text-bark-600">
                                    <span className="w-4 h-4 rounded-full bg-bee-100 flex items-center justify-center shrink-0">
                                      <span className="material-icons-outlined text-bee-600 text-[10px]">trending_up</span>
                                    </span>
                                    {effect}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Meta */}
                        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-bark-100 text-xs text-bark-400">
                          <span className="flex items-center gap-1">
                            <span className="material-icons-outlined text-sm">schedule</span>
                            {program.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="material-icons-outlined text-sm">people</span>
                            {program.capacity}
                          </span>
                          <Link
                            href="/contact"
                            className="ml-auto inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-bee-700 bg-bee-50 hover:bg-bee-100 rounded-full transition-colors"
                          >
                            신청하기
                            <span className="material-icons-outlined text-xs">arrow_forward</span>
                          </Link>
                        </div>
                      </div>
                    </AnimatedSection>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ────────────── HEALING AGRICULTURE (FARMING) SECTION ────────────── */}
          <section className="py-24 lg:py-32 bg-bark-50 relative overflow-hidden">
            <div className="absolute top-1/2 left-0 w-72 h-72 bg-bee-100/20 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
              <AnimatedSection className="text-center mb-16">
                <p className="text-bee-600 font-semibold text-xs tracking-[0.2em] uppercase mb-4">Healing Farm</p>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-bark-900 leading-tight">
                  치유농업 <span className="text-bee-600">체험 프로그램</span>
                </h2>
                <p className="mt-4 text-bark-500 max-w-2xl mx-auto">
                  양봉 외에도 텃밭 가꾸기, 허브 테라피, 숲 치유 등 다양한 치유농업 프로그램을 운영합니다.
                </p>
              </AnimatedSection>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {healingAgriculturePrograms.map((program, idx) => {
                  const colors = colorMap[program.color as keyof typeof colorMap];
                  return (
                    <AnimatedSection key={program.title} delay={idx * 0.1}>
                      <div className="bg-white rounded-2xl p-6 border border-bark-200 hover:border-bee-300 hover:shadow-lg transition-all h-full flex flex-col group">
                        <div className={`w-14 h-14 rounded-2xl ${colors.lightBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                          <span className={`material-icons-outlined ${colors.text} text-2xl`}>{program.icon}</span>
                        </div>
                        <h4 className="text-base font-bold text-bark-900 mb-2">{program.title}</h4>
                        <p className="text-sm text-bark-500 leading-relaxed mb-4 flex-1">{program.desc}</p>
                        <div className="flex items-center justify-between pt-3 border-t border-bark-100">
                          <span className="flex items-center gap-1 text-xs text-bark-400">
                            <span className="material-icons-outlined text-sm">schedule</span>
                            {program.duration}
                          </span>
                          <Link
                            href="/contact"
                            className={`text-xs font-bold ${colors.text} hover:underline`}
                          >
                            문의하기 &rarr;
                          </Link>
                        </div>
                      </div>
                    </AnimatedSection>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ────────────── HEALING PHILOSOPHY ────────────── */}
          <section className="py-24 lg:py-32 bg-gradient-to-br from-bee-900 to-bee-800 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.04]">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="leaf-pattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                    <path d="M40 0C40 22.09 22.09 40 0 40C22.09 40 40 57.91 40 80C40 57.91 57.91 40 80 40C57.91 40 40 22.09 40 0Z" fill="none" stroke="#22C55E" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#leaf-pattern)" />
              </svg>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
              <AnimatedSection className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">
                  비온팜 치유농업의 <span className="text-bee-300">철학</span>
                </h2>
              </AnimatedSection>

              <div className="grid sm:grid-cols-3 gap-8">
                {[
                  {
                    icon: 'psychology',
                    title: '마음의 치유',
                    desc: '자연과의 교감을 통해 스트레스를 해소하고 정서적 안정을 되찾습니다. 오감을 활용한 활동으로 내면의 평화를 경험합니다.',
                  },
                  {
                    icon: 'diversity_3',
                    title: '관계의 회복',
                    desc: '함께 땀 흘리고 수확하는 과정에서 사회적 유대감을 형성합니다. 고립에서 벗어나 따뜻한 공동체를 경험합니다.',
                  },
                  {
                    icon: 'self_improvement',
                    title: '성장의 기쁨',
                    desc: '식물과 꿀벌을 돌보며 책임감과 성취감을 느낍니다. 작은 성공 경험이 쌓여 자존감과 삶의 의미를 찾게 됩니다.',
                  },
                ].map((item, idx) => (
                  <AnimatedSection key={item.title} delay={idx * 0.12}>
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-bee-700/50 border border-bee-600/30 flex items-center justify-center mx-auto mb-5">
                        <span className="material-icons-outlined text-bee-300 text-3xl">{item.icon}</span>
                      </div>
                      <h3 className="text-lg font-bold mb-3">{item.title}</h3>
                      <p className="text-sm text-bee-200/80 leading-relaxed">{item.desc}</p>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* ════════════════════════════════════════════════════════════════
          COMMON SECTIONS (Both tabs)
          ════════════════════════════════════════════════════════════════ */}

      {/* ────────────── UPCOMING SCHEDULE ────────────── */}
      <section id="schedule" className="py-24 lg:py-32 bg-white scroll-mt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <AnimatedSection className="text-center mb-16">
            <p className="text-honey-600 font-semibold text-xs tracking-[0.2em] uppercase mb-4">Schedule</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-bark-900 leading-tight">
              다가오는 <span className="text-honey-600">일정</span>
            </h2>
            <p className="mt-4 text-bark-500 max-w-2xl mx-auto">
              현재 접수 중인 프로그램과 예정된 일정을 확인하세요.
            </p>
          </AnimatedSection>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-3">
              {upcomingSchedules.map((schedule, idx) => {
                const colors = colorMap[schedule.color as keyof typeof colorMap];
                return (
                  <AnimatedSection key={idx} delay={idx * 0.06}>
                    <div className="flex items-center gap-4 p-4 sm:p-5 bg-white border border-bark-200 rounded-2xl hover:shadow-lg hover:border-bark-300 transition-all group">
                      {/* Date */}
                      <div className="hidden sm:flex flex-col items-center justify-center w-16 shrink-0">
                        <span className="text-xs text-bark-400 font-medium">{schedule.date.split('.')[0]}.{schedule.date.split('.')[1]}</span>
                        <span className="text-2xl font-black text-bark-900">{schedule.date.split('.')[2]}</span>
                      </div>
                      <div className="sm:hidden shrink-0">
                        <span className="text-xs text-bark-500 font-medium">{schedule.date}</span>
                      </div>

                      {/* Divider */}
                      <div className="hidden sm:block w-px h-10 bg-bark-200" />

                      {/* Program Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-bark-900 text-sm sm:text-base truncate">{schedule.program}</h4>
                        <p className="text-xs text-bark-400 mt-0.5">{schedule.spots}</p>
                      </div>

                      {/* Status Badge */}
                      <span className={`hidden sm:inline-flex px-3 py-1 text-xs font-bold rounded-full ${colors.statusBg}`}>
                        {schedule.status}
                      </span>

                      {/* Action */}
                      <Link
                        href="/contact"
                        className="inline-flex items-center gap-1 px-4 py-2 text-xs font-bold text-white bg-bark-900 rounded-full hover:bg-bark-800 transition-colors shrink-0"
                      >
                        신청
                        <span className="material-icons-outlined text-sm">arrow_forward</span>
                      </Link>
                    </div>
                  </AnimatedSection>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ────────────── INSTRUCTORS ────────────── */}
      <section id="instructors" className="py-24 lg:py-32 bg-bark-50 scroll-mt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <AnimatedSection className="text-center mb-16">
            <p className="text-honey-600 font-semibold text-xs tracking-[0.2em] uppercase mb-4">Instructors</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-bark-900 leading-tight">
              전문 <span className="text-honey-600">강사진</span>
            </h2>
            <p className="mt-4 text-bark-500 max-w-2xl mx-auto">
              각 분야의 전문가들이 최고의 교육을 제공합니다.
            </p>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {instructors.map((instructor, idx) => (
              <AnimatedSection key={instructor.name} delay={idx * 0.1}>
                <div className="bg-white rounded-2xl p-6 border border-bark-200 hover:border-honey-300 hover:shadow-xl transition-all text-center group h-full flex flex-col">
                  {/* Avatar */}
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-honey-100 to-honey-200 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <span className="material-icons-outlined text-honey-600 text-3xl">{instructor.icon}</span>
                  </div>
                  <h4 className="text-lg font-bold text-bark-900">{instructor.name}</h4>
                  <p className="text-sm text-honey-600 font-medium mt-1">{instructor.role}</p>
                  <p className="text-xs text-bark-400 mt-1">{instructor.career}</p>

                  <div className="mt-3 pt-3 border-t border-bark-100 flex-1">
                    <p className="text-xs text-bark-500 mb-2">
                      <strong className="text-bark-700">전문 분야:</strong> {instructor.speciality}
                    </p>
                    <div className="space-y-1">
                      {instructor.certifications.map((cert) => (
                        <div key={cert} className="flex items-center gap-1 text-[11px] text-bark-400">
                          <span className="material-icons-outlined text-honey-500 text-xs">verified</span>
                          {cert}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────── TESTIMONIALS ────────────── */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <AnimatedSection className="text-center mb-16">
            <p className="text-honey-600 font-semibold text-xs tracking-[0.2em] uppercase mb-4">Testimonials</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-bark-900 leading-tight">
              참여자 <span className="text-honey-600">후기</span>
            </h2>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial, idx) => (
              <AnimatedSection key={idx} delay={idx * 0.08}>
                <div className="bg-bark-50 rounded-2xl p-6 border border-bark-200 h-full flex flex-col">
                  {/* Stars */}
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <span key={i} className="material-icons-outlined text-honey-500 text-sm">star</span>
                    ))}
                  </div>
                  {/* Quote */}
                  <p className="text-sm text-bark-600 leading-relaxed flex-1">&ldquo;{testimonial.text}&rdquo;</p>
                  {/* Author */}
                  <div className="mt-4 pt-3 border-t border-bark-200">
                    <p className="text-sm font-bold text-bark-900">{testimonial.name}</p>
                    <p className="text-xs text-honey-600">{testimonial.program}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────── HOW TO PARTICIPATE ────────────── */}
      <section id="process" className="py-24 lg:py-32 bg-bark-50 scroll-mt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <AnimatedSection className="text-center mb-16">
            <p className="text-honey-600 font-semibold text-xs tracking-[0.2em] uppercase mb-4">How to Join</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-bark-900 leading-tight">
              참여 <span className="text-honey-600">방법</span>
            </h2>
            <p className="mt-4 text-bark-500 max-w-2xl mx-auto">
              간단한 4단계로 비온팜 프로그램에 참여하실 수 있습니다.
            </p>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, idx) => (
              <AnimatedSection key={step.step} delay={idx * 0.12}>
                <div className="relative text-center group">
                  {/* Connector line */}
                  {idx < processSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-10 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-px bg-bark-200" />
                  )}
                  <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-honey-50 border-2 border-honey-200 mb-6 group-hover:border-honey-400 group-hover:shadow-lg group-hover:shadow-honey-100 transition-all">
                    <span className="material-icons-outlined text-honey-600 text-2xl">{step.icon}</span>
                    <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-honey-500 text-white text-xs font-bold flex items-center justify-center">
                      {step.step}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-bark-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-bark-500">{step.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────── FAQ SECTION ────────────── */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <AnimatedSection className="text-center mb-16">
            <p className="text-honey-600 font-semibold text-xs tracking-[0.2em] uppercase mb-4">FAQ</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-bark-900 leading-tight">
              자주 묻는 <span className="text-honey-600">질문</span>
            </h2>
          </AnimatedSection>

          <div className="space-y-4">
            {[
              {
                q: '양봉 경험이 전혀 없어도 교육 프로그램에 참여할 수 있나요?',
                a: '네, 입문 과정은 양봉 경험이 전혀 없는 초보자를 대상으로 설계되었습니다. 기초 이론부터 차근차근 알려드리며, 전문 강사가 1:1로 도와드립니다.',
              },
              {
                q: '치유양봉·치유농업 프로그램은 무료인가요?',
                a: '발달장애인, 어르신 대상 치유 프로그램은 정부 지원과 퓨르메재단 후원으로 무료로 운영됩니다. 가족 체험 및 기업 연수 프로그램은 별도 비용이 발생합니다.',
              },
              {
                q: '교육장은 어디에 있나요?',
                a: '전북 완주군 봉동읍 완주산단6로 224에 위치한 비온팜 교육센터에서 진행됩니다. 주차장이 완비되어 있으며, 전주역에서 셔틀버스도 운행합니다.',
              },
              {
                q: '수료 후 어떤 혜택이 있나요?',
                a: '비온팜 공식 인증서 발급, 수료생 전용 커뮤니티 가입, IoT 장비 특별 할인, 기술 상담 서비스 등 다양한 혜택을 제공합니다. 전문가 과정 수료 시 비온팜 파트너 양봉가로 활동할 수 있습니다.',
              },
              {
                q: '치유농업과 치유양봉의 차이는 무엇인가요?',
                a: '치유양봉은 꿀벌과의 교감을 중심으로 한 프로그램이고, 치유농업은 텃밭 가꾸기, 허브 테라피, 숲 치유 등 더 넓은 농업 활동을 포함합니다. 두 프로그램 모두 자연을 통한 심신 치유를 목표로 합니다.',
              },
              {
                q: '단체(기업, 학교) 맞춤형 프로그램도 가능한가요?',
                a: '네, 단체의 목적과 인원, 일정에 맞게 맞춤형 프로그램을 설계해 드립니다. 문의/신청 페이지에서 단체 프로그램 문의를 해주시면 담당자가 연락드립니다.',
              },
            ].map((faq, idx) => (
              <AnimatedSection key={idx} delay={idx * 0.08}>
                <div className="bg-bark-50 rounded-2xl p-6 border border-bark-200 hover:border-bark-300 transition-colors">
                  <div className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-lg bg-honey-100 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-honey-700 text-sm font-bold">Q</span>
                    </span>
                    <div>
                      <h4 className="font-bold text-bark-900">{faq.q}</h4>
                      <p className="mt-2 text-sm text-bark-500 leading-relaxed">{faq.a}</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────── CTA ────────────── */}
      <section className="py-24 lg:py-32 bg-gradient-to-r from-honey-400 via-honey-500 to-farm-400 text-bark-900 relative overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-bark-900/10 rotate-12 rounded-2xl hidden sm:block" />
        <div className="absolute bottom-10 right-10 w-40 h-40 border-2 border-bark-900/10 -rotate-12 rounded-2xl hidden sm:block" />

        <AnimatedSection className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative" animation="scale-in">
          <span className="material-icons-outlined text-5xl text-bark-900/20 mb-4 block">hive</span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight">
            프로그램에 참여하고 싶으신가요?
          </h2>
          <p className="text-bark-800/70 mt-4 mb-8 max-w-xl mx-auto">
            교육 프로그램 및 치유농업 참가 신청은 문의/신청 페이지에서 가능합니다.
            <br className="hidden sm:block" />
            궁금한 점이 있으시면 언제든 문의해주세요.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-honey-500 bg-bark-900 rounded-full hover:bg-bark-800 transition-colors shadow-lg"
            >
              참여 신청하기
              <span className="material-icons-outlined text-lg">arrow_forward</span>
            </Link>
            <a
              href="tel:02-363-4999"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-bark-900 border-2 border-bark-900/30 rounded-full hover:bg-bark-900/10 transition-colors"
            >
              <span className="material-icons-outlined text-lg">phone</span>
              전화 문의 02-363-4999
            </a>
          </div>
        </AnimatedSection>
      </section>
    </>
  );
}
