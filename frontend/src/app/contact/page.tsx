'use client';

import { useState, FormEvent, useRef } from 'react';
import { COMPANY_ADDRESS, COMPANY_PHONE, COMPANY_EMAIL, COMPANY_HOURS } from '@/lib/constants';
import { useScrollAnimation } from '@/lib/useScrollAnimation';

/* ── Form types ── */
type InquiryType = '' | '도입문의' | '서비스신청' | '치유양봉' | '기술지원' | '기타';
type ProgramType = '' | '양봉입문' | '실전양봉' | '스마트양봉' | '치유양봉체험' | '기타';

interface FormErrors {
  [key: string]: string;
}

/* ── Reusable animated section wrapper ── */
const animationClassMap: Record<string, string> = {
  'fade-up': 'animate-fade-up',
  'fade-in': 'animate-fade-in',
  'scale-in': 'animate-scale-in',
  'slide-left': 'animate-slide-left',
  'slide-right': 'animate-slide-right',
};

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
      className={`${className} ${isVisible ? (animationClassMap[animation] || 'animate-fade-up') : 'opacity-0'}`}
      style={isVisible ? { animationDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}

/* ── Helpers ── */
function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone: string): boolean {
  return /^[\d\-+() ]{9,}$/.test(phone.trim());
}

/* ── Input field component (must be outside main component) ── */
function InputField({
  id,
  label,
  icon,
  type = 'text',
  placeholder,
  value,
  error,
  required = false,
  onChange,
}: {
  id: string;
  label: string;
  icon: string;
  type?: string;
  placeholder: string;
  value: string;
  error?: string;
  required?: boolean;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="flex items-center gap-1.5 text-sm font-semibold text-bark-700 mb-2">
        <span className="material-icons-outlined text-base text-bark-400">{icon}</span>
        {label}
        {required && <span className="text-red-500 text-xs">*</span>}
      </label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-xl border ${
          error ? 'border-red-400 ring-2 ring-red-100' : 'border-bark-200'
        } focus:border-honey-400 focus:ring-2 focus:ring-honey-400/20 outline-none transition-all text-sm`}
      />
      {error && (
        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
          <span className="material-icons-outlined text-sm">error</span>
          {error}
        </p>
      )}
    </div>
  );
}

/* ── Success screen component (must be outside main component) ── */
function SuccessScreen({ type, onReset }: { type: 'inquiry' | 'apply'; onReset: () => void }) {
  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-bee-100 flex items-center justify-center">
        <span className="material-icons-outlined text-4xl text-bee-600">check_circle</span>
      </div>
      <h3 className="text-2xl font-bold text-bark-900 mb-3">
        {type === 'inquiry' ? '문의가 접수되었습니다!' : '신청이 완료되었습니다!'}
      </h3>
      <p className="text-bark-500 mb-2 max-w-md mx-auto">
        {type === 'inquiry'
          ? '담당자가 확인 후 빠른 시일 내에 연락드리겠습니다.'
          : '프로그램 담당자가 확인 후 상세 안내를 보내드리겠습니다.'}
      </p>
      <p className="text-bark-400 text-sm mb-8">영업일 기준 1~2일 이내 회신됩니다.</p>
      <button
        onClick={onReset}
        className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-bark-700 bg-bark-100 rounded-full hover:bg-bark-200 transition-colors"
      >
        <span className="material-icons-outlined text-base">refresh</span>
        새로운 {type === 'inquiry' ? '문의' : '신청'}하기
      </button>
    </div>
  );
}

export default function ContactPage() {
  /* ── Active tab ── */
  const [activeTab, setActiveTab] = useState<'inquiry' | 'apply'>('inquiry');

  /* ── Inquiry form state ── */
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    phone: '',
    email: '',
    type: '' as InquiryType,
    message: '',
    privacy: false,
  });
  const [inquiryErrors, setInquiryErrors] = useState<FormErrors>({});
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  /* ── Application form state ── */
  const [applyForm, setApplyForm] = useState({
    name: '',
    phone: '',
    email: '',
    program: '' as ProgramType,
    org: '',
    motivation: '',
    privacy: false,
  });
  const [applyErrors, setApplyErrors] = useState<FormErrors>({});
  const [applySubmitted, setApplySubmitted] = useState(false);

  /* ── Tab ref for smooth scroll ── */
  const formRef = useRef<HTMLDivElement>(null);

  /* ── Validate inquiry form ── */
  function validateInquiry(): boolean {
    const errors: FormErrors = {};
    if (!inquiryForm.name.trim()) errors.name = '이름을 입력해주세요.';
    if (!inquiryForm.phone.trim()) errors.phone = '연락처를 입력해주세요.';
    else if (!validatePhone(inquiryForm.phone)) errors.phone = '올바른 연락처 형식이 아닙니다.';
    if (!inquiryForm.email.trim()) errors.email = '이메일을 입력해주세요.';
    else if (!validateEmail(inquiryForm.email)) errors.email = '올바른 이메일 형식이 아닙니다.';
    if (!inquiryForm.type) errors.type = '문의 유형을 선택해주세요.';
    if (!inquiryForm.message.trim()) errors.message = '문의 내용을 입력해주세요.';
    if (!inquiryForm.privacy) errors.privacy = '개인정보 수집에 동의해주세요.';
    setInquiryErrors(errors);
    return Object.keys(errors).length === 0;
  }

  /* ── Validate application form ── */
  function validateApply(): boolean {
    const errors: FormErrors = {};
    if (!applyForm.name.trim()) errors.name = '이름을 입력해주세요.';
    if (!applyForm.phone.trim()) errors.phone = '연락처를 입력해주세요.';
    else if (!validatePhone(applyForm.phone)) errors.phone = '올바른 연락처 형식이 아닙니다.';
    if (!applyForm.email.trim()) errors.email = '이메일을 입력해주세요.';
    else if (!validateEmail(applyForm.email)) errors.email = '올바른 이메일 형식이 아닙니다.';
    if (!applyForm.program) errors.program = '프로그램을 선택해주세요.';
    if (!applyForm.privacy) errors.privacy = '개인정보 수집에 동의해주세요.';
    setApplyErrors(errors);
    return Object.keys(errors).length === 0;
  }

  /* ── Form submit handlers ── */
  function handleInquirySubmit(e: FormEvent) {
    e.preventDefault();
    if (validateInquiry()) {
      setInquirySubmitted(true);
    }
  }

  function handleApplySubmit(e: FormEvent) {
    e.preventDefault();
    if (validateApply()) {
      setApplySubmitted(true);
    }
  }

  /* ── Reset handlers ── */
  function resetInquiry() {
    setInquiryForm({ name: '', phone: '', email: '', type: '', message: '', privacy: false });
    setInquiryErrors({});
    setInquirySubmitted(false);
  }

  function resetApply() {
    setApplyForm({ name: '', phone: '', email: '', program: '', org: '', motivation: '', privacy: false });
    setApplyErrors({});
    setApplySubmitted(false);
  }

  return (
    <>
      {/* ━━━ Hero Section ━━━ */}
      <section className="bg-bark-900 text-white py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-[30rem] h-[30rem] bg-honey-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-[40rem] h-[40rem] bg-bee-400/[0.08] rounded-full blur-3xl" />
        </div>
        {/* Honeycomb Pattern */}
        <div className="absolute inset-0 opacity-[0.04]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="honeycomb-contact" x="0" y="0" width="56" height="100" patternUnits="userSpaceOnUse" patternTransform="scale(2)">
                <path d="M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100" fill="none" stroke="#FFC72C" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#honeycomb-contact)" />
          </svg>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-honey-500/10 border border-honey-500/20 rounded-full text-honey-400 text-sm font-medium mb-6">
            <span className="material-icons-outlined text-base">mail</span>
            Contact & Apply
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
            문의 <span className="text-honey-400">& 신청</span>
          </h1>
          <p className="text-bark-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            비온팜 도입 문의, 서비스 신청, 치유양봉 프로그램 참가 등<br className="hidden sm:block" />
            무엇이든 편하게 문의해주세요.
          </p>
          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <a
              href={`tel:${COMPANY_PHONE}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-honey-400 text-bark-900 font-bold rounded-full hover:bg-honey-300 transition-colors text-sm"
            >
              <span className="material-icons-outlined text-lg">phone</span>
              전화 문의
            </a>
            <a
              href={`mailto:${COMPANY_EMAIL}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/20 text-white font-bold rounded-full hover:bg-white/20 transition-colors text-sm"
            >
              <span className="material-icons-outlined text-lg">mail</span>
              이메일 문의
            </a>
          </div>
        </div>
      </section>

      {/* ━━━ Form Section (Tab-based: Inquiry / Apply) ━━━ */}
      <section className="py-24 lg:py-32 bg-white" ref={formRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <AnimatedSection animation="fade-up">
            {/* Section Header */}
            <div className="text-center mb-12">
              <p className="text-honey-600 font-semibold text-xs tracking-[0.2em] uppercase mb-4">Get in Touch</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-bark-900 leading-tight">
                문의 & <span className="text-honey-600">신청하기</span>
              </h2>
              <p className="mt-4 text-bark-500 max-w-2xl mx-auto">
                아래 탭을 선택하여 문의 또는 프로그램 신청을 진행해주세요.
              </p>
            </div>

            {/* Tab Switcher */}
            <div className="flex justify-center mb-12">
              <div className="inline-flex bg-bark-100 rounded-2xl p-1.5">
                <button
                  onClick={() => setActiveTab('inquiry')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                    activeTab === 'inquiry'
                      ? 'bg-white text-bark-900 shadow-md'
                      : 'text-bark-500 hover:text-bark-700'
                  }`}
                >
                  <span className="material-icons-outlined text-lg">help_outline</span>
                  문의하기
                </button>
                <button
                  onClick={() => setActiveTab('apply')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                    activeTab === 'apply'
                      ? 'bg-white text-bark-900 shadow-md'
                      : 'text-bark-500 hover:text-bark-700'
                  }`}
                >
                  <span className="material-icons-outlined text-lg">assignment</span>
                  프로그램 신청
                </button>
              </div>
            </div>
          </AnimatedSection>

          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
            {/* ── Form Column (3/5 width) ── */}
            <div className="lg:col-span-3">
              {/* ── Inquiry Form ── */}
              {activeTab === 'inquiry' && (
                <div>
                  {inquirySubmitted ? (
                    <SuccessScreen type="inquiry" onReset={resetInquiry} />
                  ) : (
                    <>
                      <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-honey-100 flex items-center justify-center">
                          <span className="material-icons-outlined text-honey-600">help_outline</span>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-bark-900">문의하기</h3>
                          <p className="text-xs text-bark-400">도입 문의, 기술 지원, 기타 문의를 남겨주세요.</p>
                        </div>
                      </div>
                      <form onSubmit={handleInquirySubmit} noValidate className="space-y-5">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <InputField
                            id="inq-name"
                            label="이름"
                            icon="person"
                            placeholder="홍길동"
                            value={inquiryForm.name}
                            error={inquiryErrors.name}
                            required
                            onChange={(v) => setInquiryForm({ ...inquiryForm, name: v })}
                          />
                          <InputField
                            id="inq-phone"
                            label="연락처"
                            icon="phone"
                            type="tel"
                            placeholder="010-1234-5678"
                            value={inquiryForm.phone}
                            error={inquiryErrors.phone}
                            required
                            onChange={(v) => setInquiryForm({ ...inquiryForm, phone: v })}
                          />
                        </div>
                        <InputField
                          id="inq-email"
                          label="이메일"
                          icon="mail"
                          type="email"
                          placeholder="example@email.com"
                          value={inquiryForm.email}
                          error={inquiryErrors.email}
                          required
                          onChange={(v) => setInquiryForm({ ...inquiryForm, email: v })}
                        />
                        {/* Inquiry type select */}
                        <div>
                          <label htmlFor="inq-type" className="flex items-center gap-1.5 text-sm font-semibold text-bark-700 mb-2">
                            <span className="material-icons-outlined text-base text-bark-400">category</span>
                            문의 유형
                            <span className="text-red-500 text-xs">*</span>
                          </label>
                          <select
                            id="inq-type"
                            value={inquiryForm.type}
                            onChange={(e) => setInquiryForm({ ...inquiryForm, type: e.target.value as InquiryType })}
                            className={`w-full px-4 py-3 rounded-xl border ${
                              inquiryErrors.type ? 'border-red-400 ring-2 ring-red-100' : 'border-bark-200'
                            } focus:border-honey-400 focus:ring-2 focus:ring-honey-400/20 outline-none transition-all text-sm text-bark-600`}
                          >
                            <option value="">선택하세요</option>
                            <option value="도입문의">도입 문의</option>
                            <option value="서비스신청">서비스 신청</option>
                            <option value="치유양봉">치유양봉 프로그램</option>
                            <option value="기술지원">기술 지원</option>
                            <option value="기타">기타</option>
                          </select>
                          {inquiryErrors.type && (
                            <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                              <span className="material-icons-outlined text-sm">error</span>
                              {inquiryErrors.type}
                            </p>
                          )}
                        </div>
                        {/* Message textarea */}
                        <div>
                          <label htmlFor="inq-message" className="flex items-center gap-1.5 text-sm font-semibold text-bark-700 mb-2">
                            <span className="material-icons-outlined text-base text-bark-400">chat</span>
                            문의 내용
                            <span className="text-red-500 text-xs">*</span>
                          </label>
                          <textarea
                            id="inq-message"
                            rows={5}
                            value={inquiryForm.message}
                            onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                            placeholder="문의 내용을 상세히 입력해주세요..."
                            className={`w-full px-4 py-3 rounded-xl border ${
                              inquiryErrors.message ? 'border-red-400 ring-2 ring-red-100' : 'border-bark-200'
                            } focus:border-honey-400 focus:ring-2 focus:ring-honey-400/20 outline-none transition-all text-sm resize-none`}
                          />
                          {inquiryErrors.message && (
                            <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                              <span className="material-icons-outlined text-sm">error</span>
                              {inquiryErrors.message}
                            </p>
                          )}
                        </div>
                        {/* Privacy consent */}
                        <div>
                          <label className="flex items-start gap-3 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={inquiryForm.privacy}
                              onChange={(e) => setInquiryForm({ ...inquiryForm, privacy: e.target.checked })}
                              className="mt-0.5 w-5 h-5 rounded border-bark-300 text-honey-500 focus:ring-honey-400 accent-honey-500"
                            />
                            <span className="text-sm text-bark-600 leading-relaxed">
                              <span className="font-semibold text-bark-700">개인정보 수집 및 이용</span>에 동의합니다.
                              <span className="text-bark-400 block text-xs mt-0.5">
                                수집된 정보는 문의 답변 목적으로만 사용됩니다.
                              </span>
                            </span>
                          </label>
                          {inquiryErrors.privacy && (
                            <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                              <span className="material-icons-outlined text-sm">error</span>
                              {inquiryErrors.privacy}
                            </p>
                          )}
                        </div>
                        {/* Submit */}
                        <button
                          type="submit"
                          className="w-full px-8 py-4 text-base font-bold text-bark-900 bg-honey-400 rounded-full hover:bg-honey-300 active:scale-[0.98] transition-all shadow-lg shadow-honey-200/50 flex items-center justify-center gap-2"
                        >
                          <span className="material-icons-outlined text-lg">send</span>
                          문의 보내기
                        </button>
                      </form>
                    </>
                  )}
                </div>
              )}

              {/* ── Application Form ── */}
              {activeTab === 'apply' && (
                <div>
                  {applySubmitted ? (
                    <SuccessScreen type="apply" onReset={resetApply} />
                  ) : (
                    <>
                      <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-bee-100 flex items-center justify-center">
                          <span className="material-icons-outlined text-bee-600">assignment</span>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-bark-900">프로그램 신청</h3>
                          <p className="text-xs text-bark-400">양봉 교육 및 치유양봉 프로그램에 참여해보세요.</p>
                        </div>
                      </div>
                      <form onSubmit={handleApplySubmit} noValidate className="space-y-5">
                        {/* Program select */}
                        <div>
                          <label htmlFor="app-program" className="flex items-center gap-1.5 text-sm font-semibold text-bark-700 mb-2">
                            <span className="material-icons-outlined text-base text-bark-400">school</span>
                            프로그램 선택
                            <span className="text-red-500 text-xs">*</span>
                          </label>
                          <select
                            id="app-program"
                            value={applyForm.program}
                            onChange={(e) => setApplyForm({ ...applyForm, program: e.target.value as ProgramType })}
                            className={`w-full px-4 py-3 rounded-xl border ${
                              applyErrors.program ? 'border-red-400 ring-2 ring-red-100' : 'border-bark-200'
                            } focus:border-honey-400 focus:ring-2 focus:ring-honey-400/20 outline-none transition-all text-sm text-bark-600`}
                          >
                            <option value="">선택하세요</option>
                            <option value="양봉입문">양봉 입문 과정 (4주)</option>
                            <option value="실전양봉">실전 양봉 과정 (8주)</option>
                            <option value="스마트양봉">스마트 양봉 전문가 (12주)</option>
                            <option value="치유양봉체험">치유양봉 체험 프로그램</option>
                            <option value="기타">기타 문의</option>
                          </select>
                          {applyErrors.program && (
                            <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                              <span className="material-icons-outlined text-sm">error</span>
                              {applyErrors.program}
                            </p>
                          )}
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <InputField
                            id="app-name"
                            label="이름"
                            icon="person"
                            placeholder="홍길동"
                            value={applyForm.name}
                            error={applyErrors.name}
                            required
                            onChange={(v) => setApplyForm({ ...applyForm, name: v })}
                          />
                          <InputField
                            id="app-phone"
                            label="연락처"
                            icon="phone"
                            type="tel"
                            placeholder="010-1234-5678"
                            value={applyForm.phone}
                            error={applyErrors.phone}
                            required
                            onChange={(v) => setApplyForm({ ...applyForm, phone: v })}
                          />
                        </div>
                        <InputField
                          id="app-email"
                          label="이메일"
                          icon="mail"
                          type="email"
                          placeholder="example@email.com"
                          value={applyForm.email}
                          error={applyErrors.email}
                          required
                          onChange={(v) => setApplyForm({ ...applyForm, email: v })}
                        />
                        {/* Organization (optional) */}
                        <InputField
                          id="app-org"
                          label="소속 (선택)"
                          icon="business"
                          placeholder="회사명 또는 단체명"
                          value={applyForm.org}
                          onChange={(v) => setApplyForm({ ...applyForm, org: v })}
                        />
                        {/* Motivation (optional) */}
                        <div>
                          <label htmlFor="app-motivation" className="flex items-center gap-1.5 text-sm font-semibold text-bark-700 mb-2">
                            <span className="material-icons-outlined text-base text-bark-400">edit_note</span>
                            참여 동기 (선택)
                          </label>
                          <textarea
                            id="app-motivation"
                            rows={4}
                            value={applyForm.motivation}
                            onChange={(e) => setApplyForm({ ...applyForm, motivation: e.target.value })}
                            placeholder="참여 동기나 기대하시는 점을 자유롭게 작성해주세요..."
                            className="w-full px-4 py-3 rounded-xl border border-bark-200 focus:border-honey-400 focus:ring-2 focus:ring-honey-400/20 outline-none transition-all text-sm resize-none"
                          />
                        </div>
                        {/* Privacy consent */}
                        <div>
                          <label className="flex items-start gap-3 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={applyForm.privacy}
                              onChange={(e) => setApplyForm({ ...applyForm, privacy: e.target.checked })}
                              className="mt-0.5 w-5 h-5 rounded border-bark-300 text-honey-500 focus:ring-honey-400 accent-honey-500"
                            />
                            <span className="text-sm text-bark-600 leading-relaxed">
                              <span className="font-semibold text-bark-700">개인정보 수집 및 이용</span>에 동의합니다.
                              <span className="text-bark-400 block text-xs mt-0.5">
                                수집된 정보는 프로그램 안내 및 참가 확인 목적으로만 사용됩니다.
                              </span>
                            </span>
                          </label>
                          {applyErrors.privacy && (
                            <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                              <span className="material-icons-outlined text-sm">error</span>
                              {applyErrors.privacy}
                            </p>
                          )}
                        </div>
                        {/* Submit */}
                        <button
                          type="submit"
                          className="w-full px-8 py-4 text-base font-bold text-white bg-bee-600 rounded-full hover:bg-bee-500 active:scale-[0.98] transition-all shadow-lg shadow-bee-200/50 flex items-center justify-center gap-2"
                        >
                          <span className="material-icons-outlined text-lg">how_to_reg</span>
                          프로그램 신청하기
                        </button>
                      </form>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* ── Contact Info Column (2/5 width) ── */}
            <AnimatedSection className="lg:col-span-2" animation="slide-left">
              <div>
                <h3 className="text-xl font-bold text-bark-900 mb-6 flex items-center gap-2">
                  <span className="material-icons-outlined text-honey-600">contact_phone</span>
                  연락처 정보
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      icon: 'location_on',
                      title: '주소',
                      value: COMPANY_ADDRESS,
                      bgClass: 'bg-honey-50',
                      iconClass: 'text-honey-600',
                      action: `https://map.naver.com/p/search/${encodeURIComponent(COMPANY_ADDRESS)}`,
                      actionLabel: '길찾기',
                    },
                    {
                      icon: 'phone',
                      title: '전화',
                      value: COMPANY_PHONE,
                      bgClass: 'bg-bee-50',
                      iconClass: 'text-bee-600',
                      action: `tel:${COMPANY_PHONE}`,
                      actionLabel: '전화걸기',
                    },
                    {
                      icon: 'mail',
                      title: '이메일',
                      value: COMPANY_EMAIL,
                      bgClass: 'bg-farm-50',
                      iconClass: 'text-farm-600',
                      action: `mailto:${COMPANY_EMAIL}`,
                      actionLabel: '메일보내기',
                    },
                    {
                      icon: 'schedule',
                      title: '업무시간',
                      value: COMPANY_HOURS,
                      bgClass: 'bg-bark-100',
                      iconClass: 'text-bark-600',
                      sub: '주말 및 공휴일 휴무',
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="flex items-start gap-4 p-5 bg-bark-50 rounded-2xl border border-bark-200 hover:border-honey-300 hover:shadow-sm transition-all group"
                    >
                      <div className={`w-10 h-10 rounded-xl ${item.bgClass} flex items-center justify-center shrink-0`}>
                        <span className={`material-icons-outlined ${item.iconClass}`}>{item.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-bark-900 text-sm">{item.title}</h4>
                        <p className="text-sm text-bark-500 mt-0.5 break-words">{item.value}</p>
                        {item.sub && <p className="text-xs text-bark-400 mt-0.5">{item.sub}</p>}
                        {item.action && (
                          <a
                            href={item.action}
                            className="inline-flex items-center gap-1 text-xs text-honey-600 font-semibold mt-2 hover:text-honey-500 transition-colors"
                          >
                            {item.actionLabel}
                            <span className="material-icons-outlined text-sm">arrow_forward</span>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* FAQ Quick Links */}
                <div className="mt-8 p-5 bg-honey-50 rounded-2xl border border-honey-200">
                  <h4 className="font-bold text-bark-900 text-sm flex items-center gap-2 mb-3">
                    <span className="material-icons-outlined text-honey-600 text-lg">lightbulb</span>
                    자주 묻는 질문
                  </h4>
                  <ul className="space-y-2">
                    {[
                      '비온팜 서비스 도입 절차가 궁금해요.',
                      '치유양봉 프로그램은 누구나 참여 가능한가요?',
                      '교육 프로그램 일정은 어떻게 되나요?',
                    ].map((q) => (
                      <li key={q}>
                        <a href="/community" className="flex items-start gap-2 text-sm text-bark-600 hover:text-honey-600 transition-colors">
                          <span className="material-icons-outlined text-base text-bark-400 mt-0.5">chevron_right</span>
                          {q}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ━━━ Map Section ━━━ */}
      <section className="py-20 lg:py-28 bg-bark-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <AnimatedSection animation="fade-up">
            <div className="text-center mb-12">
              <p className="text-honey-600 font-semibold text-xs tracking-[0.2em] uppercase mb-4">Location</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-bark-900 leading-tight">
                오시는 <span className="text-honey-600">길</span>
              </h2>
              <p className="mt-4 text-bark-500 max-w-xl mx-auto">
                전북 완주군 봉동읍 완주산단6로 224에 위치하고 있습니다.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Map iframe */}
              <div className="lg:col-span-2 rounded-3xl overflow-hidden border border-bark-200 shadow-sm bg-white">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3224.5!2d127.15!3d35.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z7KCE67aB67Sk7KO864-EIOuyuOq4sCDso7zqsIA!5e0!3m2!1sko!2skr!4v1"
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="비온팜 위치 지도"
                  className="w-full"
                />
              </div>

              {/* Location details card */}
              <div className="bg-white rounded-3xl border border-bark-200 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-honey-100 flex items-center justify-center">
                      <span className="material-icons-outlined text-2xl text-honey-600">hive</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-bark-900">비온팜(BeeOnFarm)</h3>
                      <p className="text-xs text-bark-400">농업회사법인 ㈜온팜</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <span className="material-icons-outlined text-bark-400 text-lg mt-0.5">location_on</span>
                      <div>
                        <p className="text-sm text-bark-700 font-medium">전북 완주군 봉동읍</p>
                        <p className="text-sm text-bark-500">완주산단6로 224 연구동 118호</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="material-icons-outlined text-bark-400 text-lg mt-0.5">directions_car</span>
                      <div>
                        <p className="text-sm text-bark-700 font-medium">교통안내</p>
                        <p className="text-sm text-bark-500">전주IC에서 차량 약 15분</p>
                        <p className="text-sm text-bark-500">무료 주차장 이용 가능</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="material-icons-outlined text-bark-400 text-lg mt-0.5">schedule</span>
                      <div>
                        <p className="text-sm text-bark-700 font-medium">방문 시간</p>
                        <p className="text-sm text-bark-500">{COMPANY_HOURS}</p>
                        <p className="text-xs text-bark-400 mt-0.5">※ 방문 전 사전 연락 부탁드립니다.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex gap-3">
                  <a
                    href={`tel:${COMPANY_PHONE}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-honey-400 text-bark-900 font-bold rounded-xl hover:bg-honey-300 transition-colors text-sm"
                  >
                    <span className="material-icons-outlined text-lg">phone</span>
                    전화
                  </a>
                  <a
                    href={`https://map.naver.com/p/search/${encodeURIComponent(COMPANY_ADDRESS)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-bark-100 text-bark-700 font-bold rounded-xl hover:bg-bark-200 transition-colors text-sm"
                  >
                    <span className="material-icons-outlined text-lg">directions</span>
                    길찾기
                  </a>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ━━━ CTA Section ━━━ */}
      <section className="py-20 bg-bark-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[30rem] h-[30rem] bg-honey-500/5 rounded-full blur-3xl" />
        </div>
        <AnimatedSection className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative" animation="fade-up">
          <span className="material-icons-outlined text-5xl text-honey-400 mb-4 block">support_agent</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
            더 궁금한 점이 있으신가요?
          </h2>
          <p className="text-bark-400 mb-8 max-w-xl mx-auto leading-relaxed">
            전문 상담원이 친절하게 안내해드리겠습니다.<br />
            전화 또는 이메일로 편하게 문의해주세요.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={`tel:${COMPANY_PHONE}`}
              className="inline-flex items-center gap-2 px-8 py-4 text-base font-bold text-bark-900 bg-honey-400 rounded-full hover:bg-honey-300 transition-colors"
            >
              <span className="material-icons-outlined text-lg">phone</span>
              {COMPANY_PHONE}
            </a>
            <a
              href={`mailto:${COMPANY_EMAIL}`}
              className="inline-flex items-center gap-2 px-8 py-4 text-base font-bold text-white border-2 border-white/20 rounded-full hover:bg-white/10 transition-colors"
            >
              <span className="material-icons-outlined text-lg">mail</span>
              이메일 보내기
            </a>
          </div>
        </AnimatedSection>
      </section>
    </>
  );
}
