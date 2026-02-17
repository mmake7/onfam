'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/context/LanguageContext';

/* ── Types ── */
interface EnrollmentItem {
  id: number;
  user_id: number;
  program_id: number;
  status: string;
  amount: number;
  payment_key: string | null;
  created_at: string;
  updated_at: string;
  user_name: string;
  user_email: string;
  user_phone: string | null;
  program_title: string;
  program_title_en: string | null;
  program_start_date: string | null;
  program_end_date: string | null;
  program_status: string;
}

interface PaymentItem {
  id: number;
  enrollment_id: number;
  user_id: number;
  toss_payment_key: string | null;
  order_id: string;
  amount: number;
  method: string | null;
  status: string;
  approved_at: string | null;
  created_at: string;
  user_name: string;
  user_email: string;
  program_id: number;
  program_title: string;
  program_title_en: string | null;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/* ── Helpers ── */
function getApiBase() {
  return process.env.NEXT_PUBLIC_API_URL || '';
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

function formatDateTime(dateStr: string): string {
  const d = new Date(dateStr);
  return `${formatDate(dateStr)} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

type SortField = 'user_name' | 'program_title' | 'created_at' | 'amount';
type SortDir = 'asc' | 'desc';

type ViewMode = 'enrollments' | 'payments';

/* ── Component ── */
export default function AdminEnrollmentsPage() {
  const { token } = useAuth();
  const { t, locale } = useTranslation();

  const ENROLLMENT_STATUS: Record<string, { label: string; color: string; icon: string }> = {
    pending: { label: t.admin.status.pending, color: 'bg-yellow-100 text-yellow-700', icon: 'schedule' },
    paid: { label: t.admin.status.paid, color: 'bg-green-100 text-green-700', icon: 'check_circle' },
    cancelled: { label: t.admin.status.cancelled, color: 'bg-red-100 text-red-700', icon: 'cancel' },
    refunded: { label: t.admin.status.refunded, color: 'bg-gray-100 text-gray-600', icon: 'replay' },
  };

  const PAYMENT_STATUS: Record<string, { label: string; color: string }> = {
    ready: { label: t.admin.status.ready, color: 'bg-blue-100 text-blue-700' },
    done: { label: t.admin.status.done, color: 'bg-green-100 text-green-700' },
    cancelled: { label: t.admin.status.cancelled, color: 'bg-red-100 text-red-700' },
    refunded: { label: t.admin.status.refunded, color: 'bg-gray-100 text-gray-600' },
  };

  const formatNumber = (n: number): string => {
    return new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'ko-KR').format(n);
  };

  const [viewMode, setViewMode] = useState<ViewMode>('enrollments');

  // Enrollment state
  const [enrollments, setEnrollments] = useState<EnrollmentItem[]>([]);
  const [enrollPagination, setEnrollPagination] = useState<Pagination>({
    page: 1, limit: 20, total: 0, totalPages: 0,
  });

  // Payment state
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [paymentPagination, setPaymentPagination] = useState<Pagination>({
    page: 1, limit: 20, total: 0, totalPages: 0,
  });
  const [paymentSummary, setPaymentSummary] = useState({ totalAmount: 0, paidAmount: 0 });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [page, setPage] = useState(1);

  // Sorting (client-side)
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  // Detail drawer
  const [selectedEnrollment, setSelectedEnrollment] = useState<EnrollmentItem | null>(null);

  // Status change modal
  const [statusModal, setStatusModal] = useState<{
    enrollment: EnrollmentItem;
    newStatus: string;
  } | null>(null);
  const [statusChanging, setStatusChanging] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  /* ── Fetch Enrollments ── */
  const fetchEnrollments = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);
      params.set('page', String(page));
      params.set('limit', '20');

      const res = await fetch(
        `${getApiBase()}/api/admin/enrollments?${params.toString()}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (!res.ok) throw new Error(t.admin.enrollments.fetchEnrollError);
      const json = await res.json();
      setEnrollments(json.data);
      setEnrollPagination(json.pagination);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t.admin.common.errorOccurred);
    } finally {
      setLoading(false);
    }
  }, [token, search, statusFilter, page, t]);

  /* ── Fetch Payments ── */
  const fetchPayments = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);
      params.set('page', String(page));
      params.set('limit', '20');

      const res = await fetch(
        `${getApiBase()}/api/admin/payments?${params.toString()}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (!res.ok) throw new Error(t.admin.enrollments.fetchPaymentError);
      const json = await res.json();
      setPayments(json.data);
      setPaymentPagination(json.pagination);
      setPaymentSummary(json.summary || { totalAmount: 0, paidAmount: 0 });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t.admin.common.errorOccurred);
    } finally {
      setLoading(false);
    }
  }, [token, search, statusFilter, page, t]);

  useEffect(() => {
    if (viewMode === 'enrollments') {
      fetchEnrollments();
    } else {
      fetchPayments();
    }
  }, [viewMode, fetchEnrollments, fetchPayments]);

  /* ── Search handler ── */
  const handleSearch = () => {
    setPage(1);
    setSearch(searchInput);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  /* ── View mode change ── */
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    setStatusFilter('');
    setSearch('');
    setSearchInput('');
    setPage(1);
  };

  /* ── Sort handler ── */
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const sortedEnrollments = [...enrollments].sort((a, b) => {
    const dir = sortDir === 'asc' ? 1 : -1;
    if (sortField === 'user_name') return a.user_name.localeCompare(b.user_name, 'ko') * dir;
    if (sortField === 'program_title') return a.program_title.localeCompare(b.program_title, 'ko') * dir;
    if (sortField === 'amount') return (a.amount - b.amount) * dir;
    return (new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) * dir;
  });

  /* ── Status Change ── */
  const handleStatusChange = async () => {
    if (!statusModal || !token) return;
    setStatusChanging(true);
    try {
      const res = await fetch(
        `${getApiBase()}/api/admin/enrollments/${statusModal.enrollment.id}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: statusModal.newStatus }),
        },
      );
      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: t.admin.enrollments.statusChangeError }));
        throw new Error(errData.error || t.admin.enrollments.statusChangeError);
      }
      setStatusModal(null);
      showToast(t.admin.enrollments.statusChanged);

      // Update selected enrollment if open
      if (selectedEnrollment?.id === statusModal.enrollment.id) {
        setSelectedEnrollment({ ...selectedEnrollment, status: statusModal.newStatus });
      }

      fetchEnrollments();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : t.admin.common.errorOccurred, 'error');
    } finally {
      setStatusChanging(false);
    }
  };

  /* ── Sort icon ── */
  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return (
        <span className="material-icons-outlined text-sm text-bark-300 ml-1">unfold_more</span>
      );
    }
    return (
      <span className="material-icons-outlined text-sm text-honey-600 ml-1">
        {sortDir === 'asc' ? 'expand_less' : 'expand_more'}
      </span>
    );
  };

  /* ── Pagination helpers ── */
  const currentPagination = viewMode === 'enrollments' ? enrollPagination : paymentPagination;
  const pageNumbers: number[] = [];
  const maxVisible = 5;
  let startPage = Math.max(1, currentPagination.page - Math.floor(maxVisible / 2));
  const endPage = Math.min(currentPagination.totalPages, startPage + maxVisible - 1);
  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  /* ── Status counts for enrollment summary ── */
  const statusCounts = {
    total: enrollPagination.total,
    paid: enrollments.filter((e) => e.status === 'paid').length,
    pending: enrollments.filter((e) => e.status === 'pending').length,
    cancelled: enrollments.filter((e) => e.status === 'cancelled').length,
    refunded: enrollments.filter((e) => e.status === 'refunded').length,
  };

  const statusFilterOptions = viewMode === 'enrollments'
    ? [
      { value: '', label: t.admin.common.allStatus },
      { value: 'paid', label: t.admin.status.paid },
      { value: 'pending', label: t.admin.status.pending },
      { value: 'cancelled', label: t.admin.status.cancelled },
      { value: 'refunded', label: t.admin.status.refunded },
    ]
    : [
      { value: '', label: t.admin.common.allStatus },
      { value: 'done', label: t.admin.status.done },
      { value: 'ready', label: t.admin.status.ready },
      { value: 'cancelled', label: t.admin.status.cancelled },
      { value: 'refunded', label: t.admin.status.refunded },
    ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* ── Page Header ── */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-bark-900">{t.admin.enrollments.title}</h1>
        <p className="text-sm text-bark-500 mt-1">
          {t.admin.enrollments.description}
        </p>
      </div>

      {/* ── View Mode Tabs ── */}
      <div className="flex gap-1 bg-bark-100 rounded-lg p-1 mb-4 w-fit">
        <button
          onClick={() => handleViewModeChange('enrollments')}
          className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            viewMode === 'enrollments'
              ? 'bg-white text-bark-900 shadow-sm'
              : 'text-bark-500 hover:text-bark-700'
          }`}
        >
          <span className="material-icons-outlined text-base">how_to_reg</span>
          {t.admin.enrollments.enrollmentTab}
        </button>
        <button
          onClick={() => handleViewModeChange('payments')}
          className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            viewMode === 'payments'
              ? 'bg-white text-bark-900 shadow-sm'
              : 'text-bark-500 hover:text-bark-700'
          }`}
        >
          <span className="material-icons-outlined text-base">credit_card</span>
          {t.admin.enrollments.paymentTab}
        </button>
      </div>

      {/* ── Summary Cards ── */}
      {viewMode === 'enrollments' ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <div className="bg-white rounded-xl border border-bark-200 p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="material-icons-outlined text-base text-bark-400">assignment</span>
              <span className="text-xs text-bark-500">{t.admin.enrollments.totalEnrollments}</span>
            </div>
            <p className="text-xl font-bold text-bark-900">{formatNumber(enrollPagination.total)}</p>
          </div>
          <div className="bg-white rounded-xl border border-bark-200 p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="material-icons-outlined text-base text-green-500">check_circle</span>
              <span className="text-xs text-bark-500">{t.admin.enrollments.paidCompleted}</span>
            </div>
            <p className="text-xl font-bold text-green-600">{formatNumber(statusCounts.paid)}</p>
          </div>
          <div className="bg-white rounded-xl border border-bark-200 p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="material-icons-outlined text-base text-yellow-500">schedule</span>
              <span className="text-xs text-bark-500">{t.admin.enrollments.pending}</span>
            </div>
            <p className="text-xl font-bold text-yellow-600">{formatNumber(statusCounts.pending)}</p>
          </div>
          <div className="bg-white rounded-xl border border-bark-200 p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="material-icons-outlined text-base text-red-500">cancel</span>
              <span className="text-xs text-bark-500">{t.admin.enrollments.cancelledRefunded}</span>
            </div>
            <p className="text-xl font-bold text-red-600">
              {formatNumber(statusCounts.cancelled + statusCounts.refunded)}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
          <div className="bg-white rounded-xl border border-bark-200 p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="material-icons-outlined text-base text-bark-400">receipt</span>
              <span className="text-xs text-bark-500">{t.admin.enrollments.totalPayments}</span>
            </div>
            <p className="text-xl font-bold text-bark-900">{formatNumber(paymentPagination.total)}<span className="text-xs font-normal text-bark-400">{t.admin.common.cases}</span></p>
          </div>
          <div className="bg-white rounded-xl border border-bark-200 p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="material-icons-outlined text-base text-green-500">paid</span>
              <span className="text-xs text-bark-500">{t.admin.enrollments.paidAmount}</span>
            </div>
            <p className="text-xl font-bold text-green-600">{formatNumber(paymentSummary.paidAmount)}<span className="text-xs font-normal text-bark-400">{t.admin.common.won}</span></p>
          </div>
          <div className="bg-white rounded-xl border border-bark-200 p-4 col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="material-icons-outlined text-base text-blue-500">account_balance</span>
              <span className="text-xs text-bark-500">{t.admin.enrollments.totalTransactionAmount}</span>
            </div>
            <p className="text-xl font-bold text-bark-900">{formatNumber(paymentSummary.totalAmount)}<span className="text-xs font-normal text-bark-400">{t.admin.common.won}</span></p>
          </div>
        </div>
      )}

      {/* ── Filters ── */}
      <div className="bg-white rounded-xl border border-bark-200 p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <span className="material-icons-outlined text-bark-400 absolute left-3 top-1/2 -translate-y-1/2 text-lg">
                search
              </span>
              <input
                type="text"
                placeholder={viewMode === 'enrollments' ? t.admin.enrollments.enrollmentSearchPlaceholder : t.admin.enrollments.paymentSearchPlaceholder}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="w-full pl-10 pr-4 py-2 text-sm border border-bark-200 rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-honey-400 focus:border-transparent
                           placeholder:text-bark-400"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-bark-900 text-white text-sm font-medium rounded-lg
                         hover:bg-bark-800 transition-colors shrink-0"
            >
              {t.admin.common.search}
            </button>
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 text-sm border border-bark-200 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-honey-400 bg-white
                       text-bark-700 min-w-[120px]"
          >
            {statusFilterOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Active filters */}
        {(search || statusFilter) && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-bark-100">
            <span className="text-xs text-bark-400">{t.admin.common.filter}</span>
            {search && (
              <span className="inline-flex items-center gap-1 text-xs bg-bark-100 text-bark-600 px-2 py-1 rounded-full">
                &quot;{search}&quot;
                <button
                  onClick={() => { setSearch(''); setSearchInput(''); setPage(1); }}
                  className="hover:text-bark-900"
                >
                  <span className="material-icons-outlined text-xs">close</span>
                </button>
              </span>
            )}
            {statusFilter && (
              <span className="inline-flex items-center gap-1 text-xs bg-bark-100 text-bark-600 px-2 py-1 rounded-full">
                {statusFilterOptions.find((o) => o.value === statusFilter)?.label}
                <button
                  onClick={() => { setStatusFilter(''); setPage(1); }}
                  className="hover:text-bark-900"
                >
                  <span className="material-icons-outlined text-xs">close</span>
                </button>
              </span>
            )}
            <button
              onClick={() => {
                setSearch(''); setSearchInput(''); setStatusFilter(''); setPage(1);
              }}
              className="text-xs text-bark-400 hover:text-bark-700 ml-auto"
            >
              {t.admin.common.clearAll}
            </button>
          </div>
        )}
      </div>

      {/* ── Stats summary ── */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-bark-500">
          {t.admin.common.totalCount} <span className="font-semibold text-bark-800">{formatNumber(currentPagination.total)}</span>{t.admin.common.cases}
        </p>
      </div>

      {/* ── Loading ── */}
      {loading ? (
        <div className="bg-white rounded-xl border border-bark-200 overflow-hidden">
          <div className="animate-pulse">
            <div className="h-12 bg-bark-50 border-b border-bark-200" />
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-bark-100">
                <div className="w-8 h-8 bg-bark-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 bg-bark-200 rounded" />
                  <div className="h-3 w-48 bg-bark-100 rounded" />
                </div>
                <div className="h-5 w-16 bg-bark-200 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-2 text-sm text-red-700">
          <span className="material-icons-outlined text-lg">error</span>
          {error}
          <button
            onClick={() => {
              setError('');
              if (viewMode === 'enrollments') { fetchEnrollments(); } else { fetchPayments(); }
            }}
            className="ml-auto text-red-600 hover:text-red-800 font-medium"
          >
            {t.admin.common.retry}
          </button>
        </div>
      ) : viewMode === 'enrollments' && enrollments.length === 0 ? (
        <div className="bg-white rounded-xl border border-bark-200 p-12 text-center">
          <span className="material-icons-outlined text-5xl text-bark-300 mb-3 block">
            assignment
          </span>
          <p className="text-bark-500 text-sm">
            {search || statusFilter
              ? t.admin.enrollments.noSearchEnrollments
              : t.admin.enrollments.noEnrollments}
          </p>
        </div>
      ) : viewMode === 'payments' && payments.length === 0 ? (
        <div className="bg-white rounded-xl border border-bark-200 p-12 text-center">
          <span className="material-icons-outlined text-5xl text-bark-300 mb-3 block">
            credit_card_off
          </span>
          <p className="text-bark-500 text-sm">
            {search || statusFilter
              ? t.admin.enrollments.noSearchPayments
              : t.admin.enrollments.noPayments}
          </p>
        </div>
      ) : viewMode === 'enrollments' ? (
        <>
          {/* ── Enrollments Table ── */}
          <div className="bg-white rounded-xl border border-bark-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-bark-50 border-b border-bark-200">
                    <th className="text-left px-5 py-3 font-semibold text-bark-600 whitespace-nowrap">
                      <button
                        onClick={() => handleSort('user_name')}
                        className="flex items-center hover:text-bark-900 transition-colors"
                      >
                        {t.admin.enrollments.applicant}
                        <SortIcon field="user_name" />
                      </button>
                    </th>
                    <th className="text-left px-5 py-3 font-semibold text-bark-600 whitespace-nowrap">
                      <button
                        onClick={() => handleSort('program_title')}
                        className="flex items-center hover:text-bark-900 transition-colors"
                      >
                        {t.admin.enrollments.program}
                        <SortIcon field="program_title" />
                      </button>
                    </th>
                    <th className="text-left px-5 py-3 font-semibold text-bark-600 whitespace-nowrap hidden lg:table-cell">
                      <button
                        onClick={() => handleSort('created_at')}
                        className="flex items-center hover:text-bark-900 transition-colors"
                      >
                        {t.admin.enrollments.applicationDate}
                        <SortIcon field="created_at" />
                      </button>
                    </th>
                    <th className="text-right px-5 py-3 font-semibold text-bark-600 whitespace-nowrap hidden md:table-cell">
                      <button
                        onClick={() => handleSort('amount')}
                        className="flex items-center justify-end hover:text-bark-900 transition-colors"
                      >
                        {t.admin.enrollments.amount}
                        <SortIcon field="amount" />
                      </button>
                    </th>
                    <th className="text-center px-5 py-3 font-semibold text-bark-600 whitespace-nowrap">
                      {t.admin.enrollments.paymentStatus}
                    </th>
                    <th className="text-center px-5 py-3 font-semibold text-bark-600 whitespace-nowrap">
                      {t.admin.common.detail}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-bark-100">
                  {sortedEnrollments.map((enrollment) => (
                    <tr
                      key={enrollment.id}
                      className="hover:bg-bark-50 transition-colors"
                    >
                      {/* User info */}
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-honey-100 flex items-center justify-center shrink-0">
                            <span className="material-icons-outlined text-base text-honey-600">
                              person
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-bark-800 truncate">
                              {enrollment.user_name}
                            </p>
                            <p className="text-xs text-bark-400 truncate">
                              {enrollment.user_email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Program */}
                      <td className="px-5 py-3">
                        <div className="min-w-0">
                          <p className="text-bark-800 truncate max-w-[200px]">
                            {enrollment.program_title}
                          </p>
                          {enrollment.program_start_date && (
                            <p className="text-xs text-bark-400 mt-0.5">
                              {formatDate(enrollment.program_start_date)}
                              {enrollment.program_end_date && ` ~ ${formatDate(enrollment.program_end_date)}`}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Created at */}
                      <td className="px-5 py-3 text-bark-500 whitespace-nowrap hidden lg:table-cell">
                        {formatDate(enrollment.created_at)}
                      </td>

                      {/* Amount */}
                      <td className="px-5 py-3 text-right text-bark-700 font-medium whitespace-nowrap hidden md:table-cell">
                        {formatNumber(enrollment.amount)}{t.admin.common.won}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3 text-center">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${
                            ENROLLMENT_STATUS[enrollment.status]?.color ?? 'bg-bark-100 text-bark-600'
                          }`}
                        >
                          <span className="material-icons-outlined text-xs">
                            {ENROLLMENT_STATUS[enrollment.status]?.icon ?? 'help'}
                          </span>
                          {ENROLLMENT_STATUS[enrollment.status]?.label ?? enrollment.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3 text-center">
                        <button
                          onClick={() => setSelectedEnrollment(enrollment)}
                          className="inline-flex items-center gap-1 text-xs text-honey-600 hover:text-honey-700
                                     font-medium px-2 py-1 rounded-md hover:bg-honey-50 transition-colors"
                        >
                          <span className="material-icons-outlined text-sm">visibility</span>
                          <span className="hidden sm:inline">{t.admin.common.detail}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Pagination ── */}
          {enrollPagination.totalPages > 1 && (
            <PaginationBar
              pagination={enrollPagination}
              pageNumbers={pageNumbers}
              onPageChange={setPage}
            />
          )}
        </>
      ) : (
        <>
          {/* ── Payments Table ── */}
          <div className="bg-white rounded-xl border border-bark-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-bark-50 border-b border-bark-200">
                    <th className="text-left px-5 py-3 font-semibold text-bark-600 whitespace-nowrap">
                      {t.admin.enrollments.payer}
                    </th>
                    <th className="text-left px-5 py-3 font-semibold text-bark-600 whitespace-nowrap">
                      {t.admin.enrollments.program}
                    </th>
                    <th className="text-left px-5 py-3 font-semibold text-bark-600 whitespace-nowrap hidden lg:table-cell">
                      {t.admin.enrollments.orderNumber}
                    </th>
                    <th className="text-left px-5 py-3 font-semibold text-bark-600 whitespace-nowrap hidden md:table-cell">
                      {t.admin.enrollments.paymentMethod}
                    </th>
                    <th className="text-right px-5 py-3 font-semibold text-bark-600 whitespace-nowrap">
                      {t.admin.enrollments.amount}
                    </th>
                    <th className="text-center px-5 py-3 font-semibold text-bark-600 whitespace-nowrap">
                      {t.admin.enrollments.paymentStatus}
                    </th>
                    <th className="text-left px-5 py-3 font-semibold text-bark-600 whitespace-nowrap hidden sm:table-cell">
                      {t.admin.enrollments.dateTime}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-bark-100">
                  {payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-bark-50 transition-colors">
                      {/* User */}
                      <td className="px-5 py-3">
                        <div className="min-w-0">
                          <p className="font-medium text-bark-800 truncate">{payment.user_name}</p>
                          <p className="text-xs text-bark-400 truncate">{payment.user_email}</p>
                        </div>
                      </td>

                      {/* Program */}
                      <td className="px-5 py-3">
                        <p className="text-bark-800 truncate max-w-[180px]">{payment.program_title}</p>
                      </td>

                      {/* Order ID */}
                      <td className="px-5 py-3 text-bark-500 hidden lg:table-cell">
                        <span className="font-mono text-xs truncate block max-w-[150px]">{payment.order_id}</span>
                      </td>

                      {/* Method */}
                      <td className="px-5 py-3 text-bark-600 hidden md:table-cell">
                        {payment.method || '-'}
                      </td>

                      {/* Amount */}
                      <td className="px-5 py-3 text-right text-bark-700 font-medium whitespace-nowrap">
                        {formatNumber(payment.amount)}{t.admin.common.won}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3 text-center">
                        <span
                          className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${
                            PAYMENT_STATUS[payment.status]?.color ?? 'bg-bark-100 text-bark-600'
                          }`}
                        >
                          {PAYMENT_STATUS[payment.status]?.label ?? payment.status}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-3 text-bark-500 whitespace-nowrap text-xs hidden sm:table-cell">
                        {payment.approved_at
                          ? formatDateTime(payment.approved_at)
                          : formatDate(payment.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Pagination ── */}
          {paymentPagination.totalPages > 1 && (
            <PaginationBar
              pagination={paymentPagination}
              pageNumbers={pageNumbers}
              onPageChange={setPage}
            />
          )}
        </>
      )}

      {/* ── Enrollment Detail Drawer ── */}
      {selectedEnrollment && (
        <EnrollmentDetailDrawer
          enrollment={selectedEnrollment}
          token={token}
          onClose={() => setSelectedEnrollment(null)}
          onStatusChange={(enrollment, newStatus) => {
            setStatusModal({ enrollment, newStatus });
          }}
        />
      )}

      {/* ── Status Change Modal ── */}
      {statusModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => !statusChanging && setStatusModal(null)}
          />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="text-lg font-bold text-bark-900 mb-2">{t.admin.enrollments.statusChangeTitle}</h3>
            <p className="text-sm text-bark-600 mb-1">
              <span className="font-semibold">{statusModal.enrollment.user_name}</span>{t.admin.enrollments.statusChangeDesc}
            </p>
            <p className="text-sm text-bark-600 mb-3">
              <span className="font-medium">{statusModal.enrollment.program_title}</span> {t.admin.enrollments.statusChangeTarget}
            </p>
            <div className="flex items-center gap-2 mb-4">
              <span
                className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${
                  ENROLLMENT_STATUS[statusModal.enrollment.status]?.color ?? 'bg-bark-100 text-bark-600'
                }`}
              >
                {ENROLLMENT_STATUS[statusModal.enrollment.status]?.label ?? statusModal.enrollment.status}
              </span>
              <span className="material-icons-outlined text-bark-400 text-sm">arrow_forward</span>
              <span
                className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${
                  ENROLLMENT_STATUS[statusModal.newStatus]?.color ?? 'bg-bark-100 text-bark-600'
                }`}
              >
                {ENROLLMENT_STATUS[statusModal.newStatus]?.label ?? statusModal.newStatus}
              </span>
            </div>
            <p className="text-xs text-bark-400 mb-4">
              {t.admin.common.confirmChange}
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setStatusModal(null)}
                disabled={statusChanging}
                className="px-4 py-2 text-sm text-bark-600 hover:bg-bark-100 rounded-lg transition-colors"
              >
                {t.admin.common.cancel}
              </button>
              <button
                onClick={handleStatusChange}
                disabled={statusChanging}
                className="px-4 py-2 text-sm bg-bark-900 text-white font-medium rounded-lg
                           hover:bg-bark-800 disabled:opacity-50 transition-colors"
              >
                {statusChanging ? t.admin.common.changing : t.admin.common.change}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[70]">
          <div
            className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${
              toast.type === 'success'
                ? 'bg-bark-900 text-white'
                : 'bg-red-600 text-white'
            }`}
          >
            <span className="material-icons-outlined text-base">
              {toast.type === 'success' ? 'check_circle' : 'error'}
            </span>
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Pagination Bar Component
   ═══════════════════════════════════════════════ */

function PaginationBar({
  pagination,
  pageNumbers,
  onPageChange,
}: {
  pagination: Pagination;
  pageNumbers: number[];
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-1 mt-4">
      <button
        onClick={() => onPageChange(1)}
        disabled={pagination.page === 1}
        className="p-1.5 rounded-md text-bark-400 hover:text-bark-700 hover:bg-bark-100
                   disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <span className="material-icons-outlined text-lg">first_page</span>
      </button>
      <button
        onClick={() => onPageChange(Math.max(1, pagination.page - 1))}
        disabled={pagination.page === 1}
        className="p-1.5 rounded-md text-bark-400 hover:text-bark-700 hover:bg-bark-100
                   disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <span className="material-icons-outlined text-lg">chevron_left</span>
      </button>

      {pageNumbers.map((pn) => (
        <button
          key={pn}
          onClick={() => onPageChange(pn)}
          className={`min-w-[32px] h-8 rounded-md text-sm font-medium transition-colors ${
            pn === pagination.page
              ? 'bg-bark-900 text-white'
              : 'text-bark-500 hover:bg-bark-100 hover:text-bark-700'
          }`}
        >
          {pn}
        </button>
      ))}

      <button
        onClick={() => onPageChange(Math.min(pagination.totalPages, pagination.page + 1))}
        disabled={pagination.page === pagination.totalPages}
        className="p-1.5 rounded-md text-bark-400 hover:text-bark-700 hover:bg-bark-100
                   disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <span className="material-icons-outlined text-lg">chevron_right</span>
      </button>
      <button
        onClick={() => onPageChange(pagination.totalPages)}
        disabled={pagination.page === pagination.totalPages}
        className="p-1.5 rounded-md text-bark-400 hover:text-bark-700 hover:bg-bark-100
                   disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <span className="material-icons-outlined text-lg">last_page</span>
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Enrollment Detail Drawer Component
   ═══════════════════════════════════════════════ */

function EnrollmentDetailDrawer({
  enrollment,
  token,
  onClose,
  onStatusChange,
}: {
  enrollment: EnrollmentItem;
  token: string | null;
  onClose: () => void;
  onStatusChange: (enrollment: EnrollmentItem, newStatus: string) => void;
}) {
  const { t, locale } = useTranslation();

  const ENROLLMENT_STATUS: Record<string, { label: string; color: string; icon: string }> = {
    pending: { label: t.admin.status.pending, color: 'bg-yellow-100 text-yellow-700', icon: 'schedule' },
    paid: { label: t.admin.status.paid, color: 'bg-green-100 text-green-700', icon: 'check_circle' },
    cancelled: { label: t.admin.status.cancelled, color: 'bg-red-100 text-red-700', icon: 'cancel' },
    refunded: { label: t.admin.status.refunded, color: 'bg-gray-100 text-gray-600', icon: 'replay' },
  };

  const PAYMENT_STATUS: Record<string, { label: string; color: string }> = {
    ready: { label: t.admin.status.ready, color: 'bg-blue-100 text-blue-700' },
    done: { label: t.admin.status.done, color: 'bg-green-100 text-green-700' },
    cancelled: { label: t.admin.status.cancelled, color: 'bg-red-100 text-red-700' },
    refunded: { label: t.admin.status.refunded, color: 'bg-gray-100 text-gray-600' },
  };

  const PROGRAM_STATUS: Record<string, { label: string; color: string }> = {
    open: { label: t.admin.status.open, color: 'bg-green-100 text-green-700' },
    closed: { label: t.admin.status.closed, color: 'bg-red-100 text-red-700' },
    completed: { label: t.admin.status.completed, color: 'bg-gray-100 text-gray-600' },
  };

  const formatNumber = (n: number): string => {
    return new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'ko-KR').format(n);
  };

  const [relatedPayments, setRelatedPayments] = useState<PaymentItem[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(true);
  const [activeTab, setActiveTab] = useState<'info' | 'payments'>('info');

  // Fetch related payments for this enrollment
  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    const fetchPayments = async () => {
      try {
        const res = await fetch(
          `${getApiBase()}/api/admin/payments?search=${encodeURIComponent(enrollment.user_email)}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        if (!res.ok) throw new Error();
        const json = await res.json();
        // Filter payments for this enrollment
        const filtered = (json.data || []).filter(
          (p: PaymentItem) => p.enrollment_id === enrollment.id,
        );
        if (!cancelled) {
          setRelatedPayments(filtered);
          setLoadingPayments(false);
        }
      } catch {
        if (!cancelled) setLoadingPayments(false);
      }
    };

    fetchPayments();
    return () => { cancelled = true; };
  }, [token, enrollment.id, enrollment.user_email]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const validTransitions: Record<string, string[]> = {
    pending: ['paid', 'cancelled'],
    paid: ['refunded'],
    cancelled: ['pending'],
    refunded: [],
  };

  const availableTransitions = validTransitions[enrollment.status] || [];

  const tabs = [
    { key: 'info' as const, label: t.admin.enrollments.enrollmentInfo, icon: 'info' },
    {
      key: 'payments' as const,
      label: `${t.admin.enrollments.paymentHistoryTab} (${relatedPayments.length})`,
      icon: 'credit_card',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Drawer */}
      <div className="relative w-full max-w-lg bg-white shadow-2xl overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-bark-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-lg font-bold text-bark-900">{t.admin.enrollments.enrollmentDetail}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-bark-100 text-bark-400 hover:text-bark-700 transition-colors"
          >
            <span className="material-icons-outlined">close</span>
          </button>
        </div>

        {/* Profile card */}
        <div className="px-6 py-5 bg-bark-50">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-honey-100 flex items-center justify-center shrink-0">
              <span className="material-icons-outlined text-2xl text-honey-600">person</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-bark-900 truncate">
                  {enrollment.user_name}
                </h3>
                <span
                  className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                    ENROLLMENT_STATUS[enrollment.status]?.color ?? 'bg-bark-100 text-bark-600'
                  }`}
                >
                  <span className="material-icons-outlined text-xs">
                    {ENROLLMENT_STATUS[enrollment.status]?.icon ?? 'help'}
                  </span>
                  {ENROLLMENT_STATUS[enrollment.status]?.label ?? enrollment.status}
                </span>
              </div>
              <p className="text-sm text-bark-500 truncate">{enrollment.user_email}</p>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-white rounded-lg p-3 text-center border border-bark-200">
              <p className="text-lg font-bold text-bark-900">
                {formatNumber(enrollment.amount)}
                <span className="text-xs font-normal text-bark-400">{t.admin.common.won}</span>
              </p>
              <p className="text-xs text-bark-500">{t.admin.enrollments.applicationAmount2}</p>
            </div>
            <div className="bg-white rounded-lg p-3 text-center border border-bark-200">
              <span
                className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${
                  PROGRAM_STATUS[enrollment.program_status]?.color ?? 'bg-bark-100 text-bark-600'
                }`}
              >
                {PROGRAM_STATUS[enrollment.program_status]?.label ?? enrollment.program_status}
              </span>
              <p className="text-xs text-bark-500 mt-1">{t.admin.enrollments.programStatus}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-bark-200 px-6">
          <div className="flex gap-0">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? 'border-bark-900 text-bark-900'
                    : 'border-transparent text-bark-400 hover:text-bark-600'
                }`}
              >
                <span className="material-icons-outlined text-base">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="px-6 py-5">
          {/* Info tab */}
          {activeTab === 'info' && (
            <div className="space-y-4">
              <InfoRow label={t.admin.enrollments.applicantName} value={enrollment.user_name} />
              <InfoRow label={t.admin.users.email} value={enrollment.user_email} />
              <InfoRow label={t.admin.enrollments.contact} value={enrollment.user_phone || '-'} />
              <div className="h-px bg-bark-100 my-2" />
              <InfoRow label={t.admin.enrollments.program} value={enrollment.program_title} />
              {enrollment.program_start_date && (
                <InfoRow
                  label={t.admin.enrollments.educationPeriod}
                  value={`${formatDate(enrollment.program_start_date)}${
                    enrollment.program_end_date ? ` ~ ${formatDate(enrollment.program_end_date)}` : ''
                  }`}
                />
              )}
              <InfoRow label={t.admin.enrollments.applicationAmount} value={`${formatNumber(enrollment.amount)}${t.admin.common.won}`} />
              <InfoRow label={t.admin.enrollments.applicationDate} value={formatDateTime(enrollment.created_at)} />
              <InfoRow label={t.admin.enrollments.lastModified} value={formatDateTime(enrollment.updated_at)} />
              <InfoRow
                label={t.admin.enrollments.paymentStatus}
                value={
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${
                      ENROLLMENT_STATUS[enrollment.status]?.color ?? 'bg-bark-100 text-bark-600'
                    }`}
                  >
                    <span className="material-icons-outlined text-xs">
                      {ENROLLMENT_STATUS[enrollment.status]?.icon ?? 'help'}
                    </span>
                    {ENROLLMENT_STATUS[enrollment.status]?.label ?? enrollment.status}
                  </span>
                }
              />
              {enrollment.payment_key && (
                <InfoRow
                  label={t.admin.enrollments.paymentKey}
                  value={
                    <span className="font-mono text-xs break-all">{enrollment.payment_key}</span>
                  }
                />
              )}

              {/* Status change buttons */}
              {availableTransitions.length > 0 && (
                <div className="pt-4 border-t border-bark-100">
                  <p className="text-xs text-bark-400 mb-3">{t.admin.enrollments.statusChangeTitle}</p>
                  <div className="flex flex-wrap gap-2">
                    {availableTransitions.map((newStatus) => (
                      <button
                        key={newStatus}
                        onClick={() => onStatusChange(enrollment, newStatus)}
                        className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg
                                    border transition-colors ${
                          newStatus === 'paid'
                            ? 'border-green-200 text-green-700 hover:bg-green-50'
                            : newStatus === 'cancelled'
                              ? 'border-red-200 text-red-700 hover:bg-red-50'
                              : newStatus === 'refunded'
                                ? 'border-gray-200 text-gray-700 hover:bg-gray-50'
                                : 'border-yellow-200 text-yellow-700 hover:bg-yellow-50'
                        }`}
                      >
                        <span className="material-icons-outlined text-sm">
                          {ENROLLMENT_STATUS[newStatus]?.icon ?? 'help'}
                        </span>
                        {ENROLLMENT_STATUS[newStatus]?.label}{t.admin.enrollments.changeToStatus}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Payments tab */}
          {activeTab === 'payments' && (
            <div>
              {loadingPayments ? (
                <div className="animate-pulse space-y-3">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="h-24 bg-bark-100 rounded-lg" />
                  ))}
                </div>
              ) : relatedPayments.length === 0 ? (
                <div className="text-center py-8">
                  <span className="material-icons-outlined text-4xl text-bark-300 block mb-2">
                    credit_card_off
                  </span>
                  <p className="text-sm text-bark-400">{t.admin.enrollments.noPaymentHistory}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {relatedPayments.map((payment) => (
                    <div
                      key={payment.id}
                      className="border border-bark-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-bark-800 text-sm truncate">
                            {payment.program_title}
                          </p>
                          <p className="text-xs text-bark-400 mt-0.5 font-mono">
                            {payment.order_id}
                          </p>
                        </div>
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ml-3 ${
                            PAYMENT_STATUS[payment.status]?.color ?? 'bg-bark-100 text-bark-600'
                          }`}
                        >
                          {PAYMENT_STATUS[payment.status]?.label ?? payment.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-bark-500">
                        <span>
                          {payment.approved_at
                            ? `${t.admin.common.approved} ${formatDateTime(payment.approved_at)}`
                            : `${t.admin.common.requested} ${formatDate(payment.created_at)}`}
                        </span>
                        <div className="flex items-center gap-3">
                          {payment.method && (
                            <span className="text-bark-400">{payment.method}</span>
                          )}
                          <span className="font-semibold text-bark-800">
                            {formatNumber(payment.amount)}{t.admin.common.won}
                          </span>
                        </div>
                      </div>
                      {payment.toss_payment_key && (
                        <div className="mt-2 pt-2 border-t border-bark-100">
                          <p className="text-xs text-bark-400">
                            <span className="text-bark-500">{t.admin.enrollments.paymentKeyLabel}</span>
                            <span className="font-mono break-all">{payment.toss_payment_key}</span>
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Info Row helper ── */
function InfoRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center py-2">
      <span className="text-sm text-bark-500 w-24 shrink-0">{label}</span>
      <span className="text-sm text-bark-800 flex-1">{value}</span>
    </div>
  );
}
