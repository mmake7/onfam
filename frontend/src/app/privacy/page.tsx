import type { Metadata } from 'next';
import Link from 'next/link';
import { COMPANY_NAME, COMPANY_EMAIL, COMPANY_PHONE } from '@/lib/constants';

export const metadata: Metadata = {
  title: '개인정보처리방침',
  description: '비온팜(BeeOnFarm) 개인정보처리방침',
};

const sections = [
  {
    title: '제1조 (개인정보의 처리 목적)',
    content: `${COMPANY_NAME}(이하 "회사")은 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.`,
    items: [
      '서비스 제공: 비온팜(BeeOnFarm) 디지털 양봉 시스템 서비스 제공, 콘텐츠 제공, 맞춤 서비스 제공',
      '회원 가입 및 관리: 회원제 서비스 이용에 따른 본인확인, 개인식별, 불량 회원의 부정이용 방지, 각종 고지·통지',
      '문의·상담 처리: 민원인의 신원확인, 문의사항 확인, 사실조사를 위한 연락·통지, 처리 결과 통보',
      '교육 프로그램 운영: 양봉 교육센터 및 치유양봉 프로그램 참가 신청·관리',
      '마케팅 및 광고 활용: 신규 서비스 개발, 이벤트·광고성 정보 제공(선택 동의 시)',
    ],
  },
  {
    title: '제2조 (개인정보의 처리 및 보유기간)',
    content: '회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시 동의 받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.',
    items: [
      '서비스 이용 관련 기록: 회원 탈퇴 시까지 (단, 관계 법령에 의해 보존할 필요가 있는 경우 해당 법령에서 정한 기간)',
      '문의·상담 기록: 3년 (전자상거래 등에서의 소비자보호에 관한 법률)',
      '교육 프로그램 참가 기록: 프로그램 종료 후 1년',
      '전자금융거래에 관한 기록: 5년 (전자금융거래법)',
      '표시·광고에 관한 기록: 6개월 (전자상거래법)',
    ],
  },
  {
    title: '제3조 (처리하는 개인정보의 항목)',
    content: '회사는 다음의 개인정보 항목을 처리하고 있습니다.',
    items: [
      '필수 항목: 이름, 연락처(전화번호), 이메일 주소',
      '선택 항목: 소속(회사명/단체명), 참여 동기',
      '자동 수집 항목: 접속 IP, 쿠키, 서비스 이용 기록, 접속 로그, 방문 일시',
    ],
  },
  {
    title: '제4조 (개인정보의 제3자 제공)',
    content: '회사는 정보주체의 개인정보를 제1조에서 명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.',
    items: [],
  },
  {
    title: '제5조 (개인정보의 파기)',
    content: '회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.',
    items: [
      '전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제합니다.',
      '종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각을 통하여 파기합니다.',
    ],
  },
  {
    title: '제6조 (정보주체의 권리·의무 및 행사방법)',
    content: '정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.',
    items: [
      '개인정보 열람 요구',
      '오류 등이 있을 경우 정정 요구',
      '삭제 요구',
      '처리정지 요구',
    ],
  },
  {
    title: '제7조 (개인정보의 안전성 확보조치)',
    content: '회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.',
    items: [
      '관리적 조치: 내부관리계획 수립·시행, 정기적 직원 교육',
      '기술적 조치: 개인정보처리시스템 접근 통제, 접속기록 보관, 보안프로그램 설치, 개인정보 암호화',
      '물리적 조치: 서버실, 자료보관실 등 접근 통제',
    ],
  },
  {
    title: '제8조 (개인정보 보호책임자)',
    content: '회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.',
    items: [
      `담당부서: ${COMPANY_NAME} 개인정보보호팀`,
      `이메일: ${COMPANY_EMAIL}`,
      `전화: ${COMPANY_PHONE}`,
    ],
  },
  {
    title: '제9조 (개인정보 처리방침 변경)',
    content: '이 개인정보처리방침은 2026년 1월 1일부터 적용됩니다. 이전의 개인정보처리방침은 아래에서 확인하실 수 있습니다. 변경 사항이 있을 경우 웹사이트를 통하여 공지할 예정입니다.',
    items: [],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <section className="bg-bark-900 text-white py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-[18rem] sm:w-[30rem] h-[18rem] sm:h-[30rem] bg-honey-500/5 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative text-center">
          <p className="text-honey-400 font-semibold text-xs tracking-[0.2em] uppercase mb-4">Privacy Policy</p>
          <h1 className="text-4xl sm:text-5xl font-black leading-tight">
            개인정보<span className="text-honey-400">처리방침</span>
          </h1>
          <p className="mt-4 text-bark-400 max-w-2xl mx-auto">
            {COMPANY_NAME}은 이용자의 개인정보를 중요시하며, 관련 법규를 준수합니다.
          </p>
        </div>
      </section>

      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="space-y-10">
            {sections.map((section, idx) => (
              <article key={idx}>
                <h2 className="text-lg font-bold text-bark-900 mb-3 flex items-start gap-2">
                  <span className="material-icons-outlined text-honey-500 text-xl mt-0.5 shrink-0">article</span>
                  {section.title}
                </h2>
                <p className="text-sm text-bark-600 leading-relaxed mb-3">{section.content}</p>
                {section.items.length > 0 && (
                  <ul className="space-y-2 pl-1">
                    {section.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-bark-500">
                        <span className="material-icons-outlined text-xs text-bark-300 mt-1 shrink-0">circle</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>

          <div className="mt-16 p-6 bg-bark-50 rounded-2xl border border-bark-200 text-center">
            <p className="text-sm text-bark-500 mb-4">
              개인정보처리방침에 대해 궁금한 점이 있으시면 언제든 문의해 주세요.
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
