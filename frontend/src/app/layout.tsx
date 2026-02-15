import type { Metadata } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import { Header, Footer } from '@/components/layout';
import './globals.css';

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-noto-sans-kr',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: '%s — 비온팜(BeeOnFarm)',
    default: '비온팜(BeeOnFarm) — 생산자와 소비자를 위한 디지털 양봉 시스템',
  },
  description:
    'IoT 센서 기반 실시간 모니터링부터 AI 꿀 수확 예측, 밀원지도, 치유양봉까지 — 비온팜이 지속가능한 양봉의 미래를 열어갑니다.',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={notoSansKR.variable}>
      <head>
        {/* Material Icons for icon font usage across components */}
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined"
          rel="stylesheet"
        />
      </head>
      <body className="bg-bark-50 text-bark-800 antialiased">
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
