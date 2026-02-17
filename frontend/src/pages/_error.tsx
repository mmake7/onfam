import type { NextPageContext } from 'next';
import Link from 'next/link';

function Error({ statusCode }: { statusCode?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', background: '#1C1917', color: '#fff' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '4rem', fontWeight: 900, color: '#FFC72C', margin: 0 }}>
          {statusCode || 'Error'}
        </h1>
        <p style={{ color: '#A8A29E', marginTop: '1rem' }}>
          {statusCode === 404 ? '페이지를 찾을 수 없습니다.' : '오류가 발생했습니다.'}
        </p>
        <Link href="/" style={{ display: 'inline-block', marginTop: '2rem', padding: '0.75rem 2rem', background: '#FFC72C', color: '#1C1917', borderRadius: '9999px', textDecoration: 'none', fontWeight: 600 }}>
          홈으로
        </Link>
      </div>
    </div>
  );
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
