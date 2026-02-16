'use client';

import { useState, FormEvent, useRef } from 'react';
import Link from 'next/link';
import { COMPANY_ADDRESS, COMPANY_PHONE, COMPANY_EMAIL, COMPANY_HOURS } from '@/lib/constants';
import { useScrollAnimation } from '@/lib/useScrollAnimation';
import { useTranslation } from '@/context/LanguageContext';

/* ── Form types ── */
type InquiryType = '' | 'adoption' | 'service' | 'healing' | 'techSupport' | 'other';
type ProgramType = '' | 'beginner' | 'practical' | 'smart' | 'healing' | 'other';

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
function SuccessScreen({ type, onReset, t }: { type: 'inquiry' | 'apply'; onReset: () => void; t: ReturnType<typeof import('@/context/LanguageContext').useTranslation>['t'] }) {
  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-bee-100 flex items-center justify-center">
        <span className="material-icons-outlined text-4xl text-bee-600">check_circle</span>
      </div>
      <h3 className="text-2xl font-bold text-bark-900 mb-3">
        {type === 'inquiry' ? t.contact.form.success.inquiryTitle : t.contact.form.success.applyTitle}
      </h3>
      <p className="text-bark-500 mb-2 max-w-md mx-auto">
        {type === 'inquiry'
          ? t.contact.form.success.inquiryDesc
          : t.contact.form.success.applyDesc}
      </p>
      <p className="text-bark-400 text-sm mb-8">{t.contact.form.success.responseTime}</p>
      <button
        onClick={onReset}
        className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-bark-700 bg-bark-100 rounded-full hover:bg-bark-200 transition-colors"
      >
        <span className="material-icons-outlined text-base">refresh</span>
        {type === 'inquiry' ? t.contact.form.success.newInquiry : t.contact.form.success.newApply}
      </button>
    </div>
  );
}

export default function ContactPage() {
  const { t } = useTranslation();

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
    if (!inquiryForm.name.trim()) errors.name = t.contact.form.validation.nameRequired;
    if (!inquiryForm.phone.trim()) errors.phone = t.contact.form.validation.phoneRequired;
    else if (!validatePhone(inquiryForm.phone)) errors.phone = t.contact.form.validation.phoneInvalid;
    if (!inquiryForm.email.trim()) errors.email = t.contact.form.validation.emailRequired;
    else if (!validateEmail(inquiryForm.email)) errors.email = t.contact.form.validation.emailInvalid;
    if (!inquiryForm.type) errors.type = t.contact.form.validation.typeRequired;
    if (!inquiryForm.message.trim()) errors.message = t.contact.form.validation.messageRequired;
    if (!inquiryForm.privacy) errors.privacy = t.contact.form.validation.privacyRequired;
    setInquiryErrors(errors);
    return Object.keys(errors).length === 0;
  }

  /* ── Validate application form ── */
  function validateApply(): boolean {
    const errors: FormErrors = {};
    if (!applyForm.name.trim()) errors.name = t.contact.form.validation.nameRequired;
    if (!applyForm.phone.trim()) errors.phone = t.contact.form.validation.phoneRequired;
    else if (!validatePhone(applyForm.phone)) errors.phone = t.contact.form.validation.phoneInvalid;
    if (!applyForm.email.trim()) errors.email = t.contact.form.validation.emailRequired;
    else if (!validateEmail(applyForm.email)) errors.email = t.contact.form.validation.emailInvalid;
    if (!applyForm.program) errors.program = t.contact.form.validation.programRequired;
    if (!applyForm.privacy) errors.privacy = t.contact.form.validation.privacyRequired;
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
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-[18rem] sm:w-[30rem] h-[18rem] sm:h-[30rem] bg-honey-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-[20rem] sm:w-[40rem] h-[20rem] sm:h-[40rem] bg-bee-400/[0.08] rounded-full blur-3xl" />
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
            {t.contact.hero.badge}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
            {t.contact.hero.title} <span className="text-honey-400">{t.contact.hero.titleHighlight}</span>
          </h1>
          <p className="text-bark-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            {t.contact.hero.description}
          </p>
          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <a
              href={`tel:${COMPANY_PHONE}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-honey-400 text-bark-900 font-bold rounded-full hover:bg-honey-300 transition-colors text-sm"
            >
              <span className="material-icons-outlined text-lg">phone</span>
              {t.contact.hero.quickPhone}
            </a>
            <a
              href={`mailto:${COMPANY_EMAIL}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/20 text-white font-bold rounded-full hover:bg-white/20 transition-colors text-sm"
            >
              <span className="material-icons-outlined text-lg">mail</span>
              {t.contact.hero.quickEmail}
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
              <p className="text-honey-600 font-semibold text-xs tracking-[0.2em] uppercase mb-4">{t.contact.form.subtitle}</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-bark-900 leading-tight">
                {t.contact.form.title} <span className="text-honey-600">{t.contact.form.titleHighlight}</span>
              </h2>
              <p className="mt-4 text-bark-500 max-w-2xl mx-auto">
                {t.contact.form.description}
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
                  {t.contact.form.tabInquiry}
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
                  {t.contact.form.tabApply}
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
                    <SuccessScreen type="inquiry" onReset={resetInquiry} t={t} />
                  ) : (
                    <>
                      <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-honey-100 flex items-center justify-center">
                          <span className="material-icons-outlined text-honey-600">help_outline</span>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-bark-900">{t.contact.form.inquiry.title}</h3>
                          <p className="text-xs text-bark-400">{t.contact.form.inquiry.subtitle}</p>
                        </div>
                      </div>
                      <form onSubmit={handleInquirySubmit} noValidate className="space-y-5">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <InputField
                            id="inq-name"
                            label={t.contact.form.inquiry.fields.name}
                            icon="person"
                            placeholder={t.contact.form.namePlaceholder}
                            value={inquiryForm.name}
                            error={inquiryErrors.name}
                            required
                            onChange={(v) => setInquiryForm({ ...inquiryForm, name: v })}
                          />
                          <InputField
                            id="inq-phone"
                            label={t.contact.form.inquiry.fields.phone}
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
                          label={t.contact.form.inquiry.fields.email}
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
                            {t.contact.form.inquiry.fields.inquiryType}
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
                            <option value="">{t.contact.form.inquiry.typeOptions.select}</option>
                            <option value="adoption">{t.contact.form.inquiry.typeOptions.adoption}</option>
                            <option value="service">{t.contact.form.inquiry.typeOptions.service}</option>
                            <option value="healing">{t.contact.form.inquiry.typeOptions.healing}</option>
                            <option value="techSupport">{t.contact.form.inquiry.typeOptions.techSupport}</option>
                            <option value="other">{t.contact.form.inquiry.typeOptions.other}</option>
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
                            {t.contact.form.inquiry.fields.message}
                            <span className="text-red-500 text-xs">*</span>
                          </label>
                          <textarea
                            id="inq-message"
                            rows={5}
                            value={inquiryForm.message}
                            onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                            placeholder={t.contact.form.inquiry.messagePlaceholder}
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
                              <span className="font-semibold text-bark-700">{t.contact.form.privacy.title}</span>{t.contact.form.privacy.agree}
                              <span className="text-bark-400 block text-xs mt-0.5">
                                {t.contact.form.privacy.inquiryNote}
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
                          {t.contact.form.inquiry.submit}
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
                    <SuccessScreen type="apply" onReset={resetApply} t={t} />
                  ) : (
                    <>
                      <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-bee-100 flex items-center justify-center">
                          <span className="material-icons-outlined text-bee-600">assignment</span>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-bark-900">{t.contact.form.apply.title}</h3>
                          <p className="text-xs text-bark-400">{t.contact.form.apply.subtitle}</p>
                        </div>
                      </div>
                      <form onSubmit={handleApplySubmit} noValidate className="space-y-5">
                        {/* Program select */}
                        <div>
                          <label htmlFor="app-program" className="flex items-center gap-1.5 text-sm font-semibold text-bark-700 mb-2">
                            <span className="material-icons-outlined text-base text-bark-400">school</span>
                            {t.contact.form.apply.fields.program}
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
                            <option value="">{t.contact.form.apply.programOptions.select}</option>
                            <option value="beginner">{t.contact.form.apply.programOptions.beginner}</option>
                            <option value="practical">{t.contact.form.apply.programOptions.practical}</option>
                            <option value="smart">{t.contact.form.apply.programOptions.smart}</option>
                            <option value="healing">{t.contact.form.apply.programOptions.healing}</option>
                            <option value="other">{t.contact.form.apply.programOptions.other}</option>
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
                            label={t.contact.form.apply.fields.name}
                            icon="person"
                            placeholder={t.contact.form.namePlaceholder}
                            value={applyForm.name}
                            error={applyErrors.name}
                            required
                            onChange={(v) => setApplyForm({ ...applyForm, name: v })}
                          />
                          <InputField
                            id="app-phone"
                            label={t.contact.form.apply.fields.phone}
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
                          label={t.contact.form.apply.fields.email}
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
                          label={t.contact.form.apply.fields.org}
                          icon="business"
                          placeholder={t.contact.form.apply.orgPlaceholder}
                          value={applyForm.org}
                          onChange={(v) => setApplyForm({ ...applyForm, org: v })}
                        />
                        {/* Motivation (optional) */}
                        <div>
                          <label htmlFor="app-motivation" className="flex items-center gap-1.5 text-sm font-semibold text-bark-700 mb-2">
                            <span className="material-icons-outlined text-base text-bark-400">edit_note</span>
                            {t.contact.form.apply.fields.motivation}
                          </label>
                          <textarea
                            id="app-motivation"
                            rows={4}
                            value={applyForm.motivation}
                            onChange={(e) => setApplyForm({ ...applyForm, motivation: e.target.value })}
                            placeholder={t.contact.form.apply.motivationPlaceholder}
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
                              <span className="font-semibold text-bark-700">{t.contact.form.privacy.title}</span>{t.contact.form.privacy.agree}
                              <span className="text-bark-400 block text-xs mt-0.5">
                                {t.contact.form.privacy.applyNote}
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
                          {t.contact.form.apply.submit}
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
                  {t.contact.contactInfo.title}
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      icon: 'location_on',
                      title: t.contact.contactInfo.address,
                      value: COMPANY_ADDRESS,
                      bgClass: 'bg-honey-50',
                      iconClass: 'text-honey-600',
                      action: `https://map.naver.com/p/search/${encodeURIComponent(COMPANY_ADDRESS)}`,
                      actionLabel: t.contact.contactInfo.directions,
                    },
                    {
                      icon: 'phone',
                      title: t.contact.contactInfo.phone,
                      value: COMPANY_PHONE,
                      bgClass: 'bg-bee-50',
                      iconClass: 'text-bee-600',
                      action: `tel:${COMPANY_PHONE}`,
                      actionLabel: t.contact.contactInfo.call,
                    },
                    {
                      icon: 'mail',
                      title: t.contact.contactInfo.email,
                      value: COMPANY_EMAIL,
                      bgClass: 'bg-farm-50',
                      iconClass: 'text-farm-600',
                      action: `mailto:${COMPANY_EMAIL}`,
                      actionLabel: t.contact.contactInfo.sendEmail,
                    },
                    {
                      icon: 'schedule',
                      title: t.contact.contactInfo.hours,
                      value: COMPANY_HOURS,
                      bgClass: 'bg-bark-100',
                      iconClass: 'text-bark-600',
                      sub: t.contact.contactInfo.hoursDetail,
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
                    {t.contact.faq.title}
                  </h4>
                  <ul className="space-y-2">
                    {(t.contact.faq.items as string[]).map((q: string) => (
                      <li key={q}>
                        <Link href="/community" className="flex items-start gap-2 text-sm text-bark-600 hover:text-honey-600 transition-colors">
                          <span className="material-icons-outlined text-base text-bark-400 mt-0.5">chevron_right</span>
                          {q}
                        </Link>
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
              <p className="text-honey-600 font-semibold text-xs tracking-[0.2em] uppercase mb-4">{t.contact.map.subtitle}</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-bark-900 leading-tight">
                {t.contact.map.title} <span className="text-honey-600">{t.contact.map.titleHighlight}</span>
              </h2>
              <p className="mt-4 text-bark-500 max-w-xl mx-auto">
                {t.contact.map.description}
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Map iframe */}
              <div className="lg:col-span-2 rounded-3xl overflow-hidden border border-bark-200 shadow-sm bg-white">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3224.5!2d127.15!3d35.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z7KCE67aB67Sk7KO864-EIOyyoOq4sCDso7zqsIA!5e0!3m2!1sko!2skr!4v1"
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={t.contact.map.mapTitle}
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
                      <h3 className="font-bold text-bark-900">{t.common.siteName}</h3>
                      <p className="text-xs text-bark-400">{t.common.companyName}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <span className="material-icons-outlined text-bark-400 text-lg mt-0.5">location_on</span>
                      <div>
                        <p className="text-sm text-bark-700 font-medium">{t.contact.map.addressLine1}</p>
                        <p className="text-sm text-bark-500">{t.contact.map.addressLine2}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="material-icons-outlined text-bark-400 text-lg mt-0.5">directions_car</span>
                      <div>
                        <p className="text-sm text-bark-700 font-medium">{t.contact.map.transportTitle}</p>
                        <p className="text-sm text-bark-500">{t.contact.map.transportDesc}</p>
                        <p className="text-sm text-bark-500">{t.contact.map.parking}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="material-icons-outlined text-bark-400 text-lg mt-0.5">schedule</span>
                      <div>
                        <p className="text-sm text-bark-700 font-medium">{t.contact.map.visitTitle}</p>
                        <p className="text-sm text-bark-500">{COMPANY_HOURS}</p>
                        <p className="text-xs text-bark-400 mt-0.5">{t.contact.map.visitNote}</p>
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
                    {t.contact.map.callButton}
                  </a>
                  <a
                    href={`https://map.naver.com/p/search/${encodeURIComponent(COMPANY_ADDRESS)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-bark-100 text-bark-700 font-bold rounded-xl hover:bg-bark-200 transition-colors text-sm"
                  >
                    <span className="material-icons-outlined text-lg">directions</span>
                    {t.contact.map.directionsButton}
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
            {t.contact.cta.title}
          </h2>
          <p className="text-bark-400 mb-8 max-w-xl mx-auto leading-relaxed">
            {t.contact.cta.description}
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
              {t.contact.cta.sendEmail}
            </a>
          </div>
        </AnimatedSection>
      </section>
    </>
  );
}
