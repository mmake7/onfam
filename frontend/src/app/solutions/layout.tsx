import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '솔루션(제품소개)',
  description: '비온팜 디지털 양봉 시스템 — IoT 센서, AI 분석, 모바일 원격 제어, 밀원지도, 봉군 모니터링 솔루션',
};

export default function SolutionsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
