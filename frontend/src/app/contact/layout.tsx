import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '문의/신청',
  description: '비온팜 도입 문의, 서비스 신청, 치유양봉 프로그램 참가 신청',
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
