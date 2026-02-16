import type { Metadata } from 'next';
import Link from 'next/link';
import { COMPANY_NAME, COMPANY_EMAIL } from '@/lib/constants';

export const metadata: Metadata = {
  title: '이용약관',
  description: '비온팜(BeeOnFarm) 서비스 이용약관',
};

const sections = [
  {
    title: '제1조 (목적)',
    content: `이 약관은 ${COMPANY_NAME}(이하 "회사")이 제공하는 비온팜(BeeOnFarm) 서비스(이하 "서비스")의 이용에 관한 조건 및 절차, 회사와 이용자의 권리·의무·책임사항 등을 규정함을 목적으로 합니다.`,
  },
  {
    title: '제2조 (정의)',
    items: [
      '"서비스"란 회사가 제공하는 비온팜 디지털 양봉 시스템 관련 모든 서비스를 의미합니다.',
      '"이용자"란 이 약관에 따라 회사가 제공하는 서비스를 이용하는 회원 및 비회원을 말합니다.',
      '"회원"이란 회사에 개인정보를 제공하여 회원등록을 한 사람으로, 회사의 서비스를 지속적으로 이용할 수 있는 자를 말합니다.',
      '"콘텐츠"란 회사가 서비스를 통해 제공하는 양봉 관련 데이터, 교육 자료, 분석 리포트 등 일체의 정보를 말합니다.',
    ],
  },
  {
    title: '제3조 (약관의 효력 및 변경)',
    items: [
      '이 약관은 서비스 화면에 게시하거나 기타의 방법으로 이용자에게 공지함으로써 효력이 발생합니다.',
      '회사는 관련 법령을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.',
      '약관이 변경될 경우 회사는 변경 내용을 시행일 7일 전부터 서비스 공지사항을 통해 게시합니다.',
    ],
  },
  {
    title: '제4조 (서비스의 제공)',
    content: '회사는 다음과 같은 서비스를 제공합니다.',
    items: [
      'IoT 센서 기반 봉군 실시간 모니터링 서비스',
      'AI 기반 꿀 수확 예측 및 분석 서비스',
      '밀원지도 및 이동경로 추천 서비스',
      '모바일 앱 기반 원격 관리 서비스',
      '양봉 교육센터 및 치유양봉 프로그램',
      '커뮤니티 및 정보 공유 서비스',
      '기타 회사가 정하는 서비스',
    ],
  },
  {
    title: '제5조 (서비스의 변경 및 중단)',
    items: [
      '회사는 상당한 이유가 있는 경우에 운영상, 기술상의 필요에 따라 제공하고 있는 서비스를 변경할 수 있습니다.',
      '회사는 정보통신설비의 보수점검, 교체 및 고장, 통신두절 등의 사유가 발생한 경우에는 서비스의 제공을 일시적으로 중단할 수 있습니다.',
      '서비스 중단의 경우 회사는 사전에 공지합니다. 다만, 사전에 통지할 수 없는 부득이한 사유가 있는 경우 사후에 통지할 수 있습니다.',
    ],
  },
  {
    title: '제6조 (회원가입)',
    items: [
      '이용자는 회사가 정한 양식에 따라 정보를 기입한 후 이 약관에 동의한다는 의사표시를 함으로써 회원가입을 신청합니다.',
      '회사는 전항에 따른 회원가입 신청에 대하여 특별한 사유가 없는 한 승낙합니다.',
    ],
  },
  {
    title: '제7조 (이용자의 의무)',
    items: [
      '이용자는 서비스 이용 시 관계 법령, 약관, 이용안내 및 주의사항을 준수하여야 합니다.',
      '이용자는 타인의 개인정보를 도용하여 서비스에 가입하거나 이용하여서는 안 됩니다.',
      '이용자는 서비스를 이용하여 얻은 정보를 회사의 사전 승인 없이 복제, 배포, 방송 등 상업적으로 이용하여서는 안 됩니다.',
      '이용자는 서비스의 안정적인 운영을 방해하는 행위를 하여서는 안 됩니다.',
    ],
  },
  {
    title: '제8조 (회사의 의무)',
    items: [
      '회사는 관련 법령과 이 약관이 금지하거나 미풍양속에 반하는 행위를 하지 않으며, 지속적이고 안정적으로 서비스를 제공하기 위하여 최선을 다합니다.',
      '회사는 이용자의 개인정보를 보호하기 위해 보안시스템을 갖추며, 개인정보처리방침을 공시하고 준수합니다.',
      '회사는 서비스 이용과 관련하여 이용자로부터 제기된 의견이나 불만이 정당하다고 인정할 경우 이를 처리하여야 합니다.',
    ],
  },
  {
    title: '제9조 (지적재산권)',
    items: [
      '서비스에 포함된 콘텐츠에 대한 지적재산권은 회사에 귀속됩니다.',
      '이용자는 서비스를 통해 얻은 정보를 회사의 사전 서면 동의 없이 상업적 목적으로 이용하거나 제3자에게 제공할 수 없습니다.',
    ],
  },
  {
    title: '제10조 (면책조항)',
    items: [
      '회사는 천재지변, 불가항력 등 회사의 귀책사유 없이 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.',
      '회사는 이용자의 귀책사유로 인한 서비스 이용의 장애에 대하여 책임을 지지 않습니다.',
      '회사는 이용자가 게재한 정보, 자료, 사실의 신뢰도, 정확성에 대해서는 책임을 지지 않습니다.',
    ],
  },
  {
    title: '제11조 (분쟁해결)',
    content: '이 약관에 명시되지 아니한 사항과 이 약관의 해석에 관하여는 관계 법령 및 상관례에 따릅니다. 서비스 이용으로 발생한 분쟁에 대해 소송이 제기될 경우 회사의 본사 소재지를 관할하는 법원을 관할 법원으로 합니다.',
  },
  {
    title: '부칙',
    content: '이 약관은 2026년 1월 1일부터 시행합니다.',
  },
];

export default function TermsPage() {
  return (
    <>
      <section className="bg-bark-900 text-white py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-[18rem] sm:w-[30rem] h-[18rem] sm:h-[30rem] bg-honey-500/5 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative text-center">
          <p className="text-honey-400 font-semibold text-xs tracking-[0.2em] uppercase mb-4">Terms of Service</p>
          <h1 className="text-4xl sm:text-5xl font-black leading-tight">
            이용<span className="text-honey-400">약관</span>
          </h1>
          <p className="mt-4 text-bark-400 max-w-2xl mx-auto">
            비온팜(BeeOnFarm) 서비스 이용에 관한 약관입니다.
          </p>
        </div>
      </section>

      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="space-y-10">
            {sections.map((section, idx) => (
              <article key={idx}>
                <h2 className="text-lg font-bold text-bark-900 mb-3 flex items-start gap-2">
                  <span className="material-icons-outlined text-honey-500 text-xl mt-0.5 shrink-0">gavel</span>
                  {section.title}
                </h2>
                {section.content && (
                  <p className="text-sm text-bark-600 leading-relaxed mb-3">{section.content}</p>
                )}
                {section.items && section.items.length > 0 && (
                  <ol className="space-y-2 pl-1">
                    {section.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-bark-500">
                        <span className="text-honey-500 font-bold text-xs mt-0.5 shrink-0 w-5 text-center">{i + 1}.</span>
                        {item}
                      </li>
                    ))}
                  </ol>
                )}
              </article>
            ))}
          </div>

          <div className="mt-16 p-6 bg-bark-50 rounded-2xl border border-bark-200 text-center">
            <p className="text-sm text-bark-500 mb-4">
              이용약관에 대해 궁금한 점이 있으시면 언제든 문의해 주세요.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-bark-900 bg-honey-400 rounded-full hover:bg-honey-300 transition-colors"
              >
                문의하기
                <span className="material-icons-outlined text-lg">arrow_forward</span>
              </Link>
              <a
                href={`mailto:${COMPANY_EMAIL}`}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-bark-600 border border-bark-200 rounded-full hover:border-honey-300 transition-colors"
              >
                <span className="material-icons-outlined text-base">mail</span>
                {COMPANY_EMAIL}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
