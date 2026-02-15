/** Site-wide constants */
export const SITE_NAME = '비온팜(BeeOnFarm)';
export const SITE_DESCRIPTION = '생산자와 소비자를 위한 디지털 양봉 시스템';
export const COMPANY_NAME = '농업회사법인 ㈜온팜';
export const COMPANY_ADDRESS = '전북 완주군 봉동읍 완주산단6로 224';
export const COMPANY_PHONE = '02-363-4999';
export const COMPANY_EMAIL = 'onfarm@onfarm.co.kr';
export const COMPANY_HOURS = '평일 09:00 - 18:00';

/** Navigation links used in the header */
export const NAV_LINKS = [
  { href: '/', label: '홈', icon: 'home' },
  { href: '/about', label: '비온팜 소개', icon: 'info' },
  { href: '/program', label: '프로그램', icon: 'school' },
  { href: '/solutions', label: '솔루션', icon: 'hub' },
  { href: '/community', label: '커뮤니티', icon: 'forum' },
  { href: '/contact', label: '문의/신청', icon: 'mail' },
] as const;

/** Footer — service links */
export const FOOTER_SERVICE_LINKS = [
  { href: '/about', label: '비온팜 소개' },
  { href: '/solutions', label: '주요 기능' },
  { href: '/solutions#nectar', label: '밀원지도' },
  { href: '/solutions#healing', label: '치유양봉' },
  { href: '/program', label: '교육 프로그램' },
] as const;

/** Footer — support links */
export const FOOTER_SUPPORT_LINKS = [
  { href: '/community', label: '공지사항' },
  { href: '/community', label: 'Q&A' },
  { href: '/community', label: '자주 묻는 질문' },
  { href: '/contact', label: '도입 문의' },
  { href: '#', label: '이용약관' },
] as const;

/** Social links for footer */
export const SOCIAL_LINKS = [
  { href: `mailto:${COMPANY_EMAIL}`, icon: 'mail', label: '이메일' },
  { href: `tel:${COMPANY_PHONE}`, icon: 'phone', label: '전화' },
  { href: '#', icon: 'chat', label: '카카오톡' },
] as const;
