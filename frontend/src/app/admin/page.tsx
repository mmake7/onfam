'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/context/LanguageContext';
import MiniLineChart from '@/components/admin/MiniLineChart';
import MiniBarChart from '@/components/admin/MiniBarChart';

/* ── Types ── */
interface StatsData {
  users: { total: number; monthlyNew: number };
  enrollments: {
    total: number;
    monthlyTotal: number;
    byStatus: Record<string, number>;
  };
  revenue: { total: number; monthly: number };
  programs: { byStatus: Record<string, number> };
  recentEnrollments: RecentEnrollment[];
  recentPayments: RecentPayment[];
}

interface RecentEnrollment {
  id: number;
  status: string;
  amount: number;
  created_at: string;
  user_name: string;
  user_email: string;
  program_title: string;
}

interface RecentPayment {
  id: number;
  order_id: string;
  amount: number;
  method: string;
  status: string;
  approved_at: string | null;
  created_at: string;
  user_name: string;
  user_email: string;
  program_title: string;
}

interface TrendPoint {
  date: string;
  count?: number;
  amount?: number;
}

interface TrendsData {
  days: number;
  users: TrendPoint[];
  enrollments: TrendPoint[];
  revenue: TrendPoint[];
}

/* ── Helpers ── */
function getApiBase() {
  return process.env.NEXT_PUBLIC_API_URL || '';
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

/* ── Component ── */
export default function AdminDashboardPage() {
  const { token } = useAuth();
  const { t, locale } = useTranslation();
  const [stats, setStats] = useState<StatsData | null>(null);
  const [trends, setTrends] = useState<TrendsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [trendDays, setTrendDays] = useState<7 | 30>(7);

  /* ── Locale-aware helpers ── */
  function formatNumber(n: number): string {
    return new Intl.NumberFormat(locale === 'ko' ? 'ko-KR' : 'en-US').format(n);
  }

  function formatCurrency(n: number): string {
    if (n >= 100000000) return `${(n / 100000000).toFixed(1)}${t.admin.format.hundredMillion}`;
    if (n >= 10000) return `${(n / 10000).toFixed(0)}${t.admin.format.tenThousand}`;
    return formatNumber(n);
  }

  function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return t.admin.timeAgo.justNow;
    if (mins < 60) return `${mins}${t.admin.timeAgo.minutesAgo}`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}${t.admin.timeAgo.hoursAgo}`;
    const days = Math.floor(hours / 24);
    return `${days}${t.admin.timeAgo.daysAgo}`;
  }

  /* ── Locale-aware STATUS_LABELS ── */
  const STATUS_LABELS: Record<string, { label: string; color: string }> = {
    pending: { label: t.admin.status.pending, color: 'bg-yellow-100 text-yellow-700' },
    paid: { label: t.admin.status.paid, color: 'bg-green-100 text-green-700' },
    cancelled: { label: t.admin.status.cancelled, color: 'bg-red-100 text-red-700' },
    refunded: { label: t.admin.status.refunded, color: 'bg-gray-100 text-gray-600' },
    ready: { label: t.admin.status.ready, color: 'bg-blue-100 text-blue-700' },
    done: { label: t.admin.status.done, color: 'bg-green-100 text-green-700' },
  };

  /* ── Locale-aware STAT_CARDS ── */
  const STAT_CARDS = [
    {
      key: 'totalUsers',
      label: t.admin.dashboard.totalUsers,
      icon: 'people',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-500',
      accentColor: 'text-blue-600',
    },
    {
      key: 'newUsers',
      label: t.admin.dashboard.newUsersMonthly,
      icon: 'person_add',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-500',
      accentColor: 'text-green-600',
    },
    {
      key: 'totalEnrollments',
      label: t.admin.dashboard.totalEnrollments,
      icon: 'how_to_reg',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-500',
      accentColor: 'text-purple-600',
    },
    {
      key: 'pendingEnrollments',
      label: t.admin.dashboard.pendingApproval,
      icon: 'pending_actions',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-500',
      accentColor: 'text-orange-600',
    },
  ] as const;

  const fetchStats = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${getApiBase()}/api/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(t.admin.dashboard.statsError);
      const json = await res.json();
      setStats(json.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t.admin.common.errorOccurred);
    } finally {
      setLoading(false);
    }
  }, [token, t]);

  const fetchTrends = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(
        `${getApiBase()}/api/admin/stats/trends?days=${trendDays}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (!res.ok) return;
      const json = await res.json();
      setTrends(json.data);
    } catch {
      // Trend data is non-critical, fail silently
    }
  }, [token, trendDays]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchTrends();
  }, [fetchTrends]);

  /* ── Derive stat values ── */
  function getStatValue(key: string): number {
    if (!stats) return 0;
    switch (key) {
      case 'totalUsers': return stats.users.total;
      case 'newUsers': return stats.users.monthlyNew;
      case 'totalEnrollments': return stats.enrollments.total;
      case 'pendingEnrollments': return stats.enrollments.byStatus?.pending ?? 0;
      default: return 0;
    }
  }

  /* ── Chart data transforms ── */
  function toChartData(items: TrendPoint[], valueKey: 'count' | 'amount') {
    return items.map((d) => ({
      label: formatDate(d.date),
      value: valueKey === 'count' ? (d.count ?? 0) : (d.amount ?? 0),
    }));
  }

  /* ── Today string ── */
  const today = new Date();
  const todayStr = `${today.getFullYear()}${t.admin.format.yearSuffix} ${today.getMonth() + 1}${t.admin.format.monthSuffix} ${today.getDate()}${t.admin.format.daySuffix}`;

  return (
    <div className="max-w-7xl mx-auto">
      {/* ── Page Header ── */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-bark-900">{t.admin.dashboard.title}</h1>
        <p className="text-sm text-bark-500 mt-1">{todayStr} {t.admin.common.asOf}</p>
      </div>

      {/* ── Loading ── */}
      {loading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-bark-200 p-5 animate-pulse"
              >
                <div className="h-4 w-24 bg-bark-200 rounded mb-3" />
                <div className="h-8 w-16 bg-bark-200 rounded" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-bark-200 p-6 animate-pulse"
              >
                <div className="h-4 w-32 bg-bark-200 rounded mb-4" />
                <div className="h-40 bg-bark-100 rounded" />
              </div>
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-2 text-sm text-red-700">
          <span className="material-icons-outlined text-lg">error</span>
          {error}
          <button
            onClick={() => { setError(''); setLoading(true); fetchStats(); }}
            className="ml-auto text-red-600 hover:text-red-800 font-medium"
          >
            {t.admin.common.retry}
          </button>
        </div>
      ) : stats ? (
        <>
          {/* ── Stat Cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
            {STAT_CARDS.map((card) => {
              const value = getStatValue(card.key);
              return (
                <div
                  key={card.key}
                  className="bg-white rounded-xl border border-bark-200 p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-bark-500">
                      {card.label}
                    </span>
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.bgColor}`}
                    >
                      <span
                        className={`material-icons-outlined text-xl ${card.iconColor}`}
                      >
                        {card.icon}
                      </span>
                    </div>
                  </div>
                  <p className={`text-2xl font-bold ${card.accentColor}`}>
                    {formatNumber(value)}
                    {card.key === 'pendingEnrollments' && value > 0 && (
                      <span className="text-xs font-medium text-orange-500 ml-2 bg-orange-50 px-1.5 py-0.5 rounded-full">
                        {t.admin.common.needsAction}
                      </span>
                    )}
                  </p>
                </div>
              );
            })}
          </div>

          {/* ── Revenue Cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-bark-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-bark-500">
                  {t.admin.dashboard.totalRevenue}
                </span>
                <div className="w-10 h-10 rounded-lg bg-honey-50 flex items-center justify-center">
                  <span className="material-icons-outlined text-xl text-honey-600">
                    payments
                  </span>
                </div>
              </div>
              <p className="text-2xl font-bold text-bark-900">
                {formatCurrency(stats.revenue.total)}
                <span className="text-base font-medium text-bark-400 ml-1">
                  {t.admin.common.won}
                </span>
              </p>
            </div>
            <div className="bg-white rounded-xl border border-bark-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-bark-500">
                  {t.admin.dashboard.monthlyRevenue}
                </span>
                <div className="w-10 h-10 rounded-lg bg-bee-50 flex items-center justify-center">
                  <span className="material-icons-outlined text-xl text-bee-600">
                    trending_up
                  </span>
                </div>
              </div>
              <p className="text-2xl font-bold text-bee-600">
                {formatCurrency(stats.revenue.monthly)}
                <span className="text-base font-medium text-bark-400 ml-1">
                  {t.admin.common.won}
                </span>
              </p>
            </div>
          </div>

          {/* ── Program Status Summary ── */}
          <div className="bg-white rounded-xl border border-bark-200 p-5 mb-6">
            <h2 className="text-sm font-semibold text-bark-700 mb-4">
              {t.admin.dashboard.programStatus}
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                {
                  label: t.admin.dashboard.recruiting,
                  value: stats.programs.byStatus?.open ?? 0,
                  color: 'text-green-600',
                  icon: 'event_available',
                },
                {
                  label: t.admin.dashboard.closed,
                  value: stats.programs.byStatus?.closed ?? 0,
                  color: 'text-red-500',
                  icon: 'event_busy',
                },
                {
                  label: t.admin.dashboard.completed,
                  value: stats.programs.byStatus?.completed ?? 0,
                  color: 'text-bark-500',
                  icon: 'check_circle',
                },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <span
                    className={`material-icons-outlined text-2xl ${item.color}`}
                  >
                    {item.icon}
                  </span>
                  <p className="text-xl font-bold text-bark-900 mt-1">
                    {item.value}
                  </p>
                  <p className="text-xs text-bark-500">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Trend Charts ── */}
          {trends && (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-bark-900">
                  {t.admin.dashboard.trendAnalysis}
                </h2>
                <div className="flex bg-bark-100 rounded-lg p-0.5">
                  {([7, 30] as const).map((d) => (
                    <button
                      key={d}
                      onClick={() => setTrendDays(d)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                        trendDays === d
                          ? 'bg-white text-bark-900 shadow-sm'
                          : 'text-bark-500 hover:text-bark-700'
                      }`}
                    >
                      {d}{t.admin.common.daysUnit}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                {/* User Registration Trend */}
                <div className="bg-white rounded-xl border border-bark-200 p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <h3 className="text-sm font-semibold text-bark-700">
                      {t.admin.dashboard.newRegistrations}
                    </h3>
                    <span className="text-xs text-bark-400 ml-auto">
                      {t.admin.common.recentDays.replace('{days}', String(trendDays))}
                    </span>
                  </div>
                  <MiniLineChart
                    data={toChartData(trends.users, 'count')}
                    color="#3B82F6"
                    height={180}
                  />
                </div>

                {/* Enrollment Trend */}
                <div className="bg-white rounded-xl border border-bark-200 p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                    <h3 className="text-sm font-semibold text-bark-700">
                      {t.admin.dashboard.enrollmentTrend}
                    </h3>
                    <span className="text-xs text-bark-400 ml-auto">
                      {t.admin.common.recentDays.replace('{days}', String(trendDays))}
                    </span>
                  </div>
                  <MiniLineChart
                    data={toChartData(trends.enrollments, 'count')}
                    color="#8B5CF6"
                    height={180}
                  />
                </div>
              </div>

              {/* Revenue Trend — full width */}
              <div className="bg-white rounded-xl border border-bark-200 p-5 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-honey-500" />
                  <h3 className="text-sm font-semibold text-bark-700">
                    {t.admin.dashboard.dailyRevenue}
                  </h3>
                  <span className="text-xs text-bark-400 ml-auto">
                    {t.admin.common.recentDays.replace('{days}', String(trendDays))}
                  </span>
                </div>
                <MiniBarChart
                  data={toChartData(trends.revenue, 'amount')}
                  color="#FFC72C"
                  height={200}
                />
              </div>
            </>
          )}

          {/* ── Recent Activity ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            {/* Recent Enrollments */}
            <div className="bg-white rounded-xl border border-bark-200">
              <div className="px-5 py-4 border-b border-bark-100 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-bark-800">
                  {t.admin.dashboard.recentEnrollments}
                </h3>
                <a
                  href="/admin/enrollments"
                  className="text-xs text-honey-600 hover:text-honey-700 font-medium"
                >
                  {t.admin.common.viewAll}
                </a>
              </div>
              <div className="divide-y divide-bark-100">
                {stats.recentEnrollments.length === 0 ? (
                  <div className="px-5 py-8 text-center text-sm text-bark-400">
                    {t.admin.dashboard.noRecentEnrollments}
                  </div>
                ) : (
                  stats.recentEnrollments.map((e) => (
                    <div
                      key={e.id}
                      className="px-5 py-3 flex items-center gap-3 hover:bg-bark-50 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                        <span className="material-icons-outlined text-sm text-purple-500">
                          person
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-bark-800 truncate">
                          {e.user_name}
                        </p>
                        <p className="text-xs text-bark-400 truncate">
                          {e.program_title}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span
                          className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${
                            STATUS_LABELS[e.status]?.color ?? 'bg-bark-100 text-bark-600'
                          }`}
                        >
                          {STATUS_LABELS[e.status]?.label ?? e.status}
                        </span>
                        <p className="text-xs text-bark-400 mt-0.5">
                          {timeAgo(e.created_at)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Recent Payments */}
            <div className="bg-white rounded-xl border border-bark-200">
              <div className="px-5 py-4 border-b border-bark-100 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-bark-800">
                  {t.admin.dashboard.recentPayments}
                </h3>
                <a
                  href="/admin/enrollments"
                  className="text-xs text-honey-600 hover:text-honey-700 font-medium"
                >
                  {t.admin.common.viewAll}
                </a>
              </div>
              <div className="divide-y divide-bark-100">
                {stats.recentPayments.length === 0 ? (
                  <div className="px-5 py-8 text-center text-sm text-bark-400">
                    {t.admin.dashboard.noRecentPayments}
                  </div>
                ) : (
                  stats.recentPayments.map((p) => (
                    <div
                      key={p.id}
                      className="px-5 py-3 flex items-center gap-3 hover:bg-bark-50 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-honey-100 flex items-center justify-center shrink-0">
                        <span className="material-icons-outlined text-sm text-honey-600">
                          credit_card
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-bark-800 truncate">
                          {p.user_name}
                        </p>
                        <p className="text-xs text-bark-400 truncate">
                          {p.program_title}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-semibold text-bark-800">
                          {formatNumber(p.amount)}
                          <span className="text-xs font-normal text-bark-400">{t.admin.common.won}</span>
                        </p>
                        <span
                          className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${
                            STATUS_LABELS[p.status]?.color ?? 'bg-bark-100 text-bark-600'
                          }`}
                        >
                          {STATUS_LABELS[p.status]?.label ?? p.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* ── Enrollment Status Breakdown ── */}
          <div className="bg-white rounded-xl border border-bark-200 p-5 mb-6">
            <h2 className="text-sm font-semibold text-bark-700 mb-4">
              {t.admin.dashboard.enrollmentStatusBreakdown}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                {
                  key: 'pending',
                  label: t.admin.status.pending,
                  icon: 'hourglass_empty',
                  color: 'text-yellow-600',
                  bg: 'bg-yellow-50',
                },
                {
                  key: 'paid',
                  label: t.admin.status.paid,
                  icon: 'check_circle',
                  color: 'text-green-600',
                  bg: 'bg-green-50',
                },
                {
                  key: 'cancelled',
                  label: t.admin.status.cancelled,
                  icon: 'cancel',
                  color: 'text-red-500',
                  bg: 'bg-red-50',
                },
                {
                  key: 'refunded',
                  label: t.admin.status.refunded,
                  icon: 'replay',
                  color: 'text-gray-600',
                  bg: 'bg-gray-50',
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className={`rounded-lg p-4 ${item.bg} text-center`}
                >
                  <span
                    className={`material-icons-outlined text-xl ${item.color}`}
                  >
                    {item.icon}
                  </span>
                  <p className="text-xl font-bold text-bark-900 mt-1">
                    {stats.enrollments.byStatus?.[item.key] ?? 0}
                  </p>
                  <p className="text-xs text-bark-500">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Quick Links ── */}
          <div>
            <h2 className="text-lg font-semibold text-bark-900 mb-4">
              {t.admin.dashboard.quickMenu}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                {
                  href: '/admin/users',
                  label: t.admin.dashboard.quickLinks.userMgmt,
                  desc: t.admin.dashboard.quickLinks.userMgmtDesc,
                  icon: 'people',
                  color: 'text-blue-500',
                },
                {
                  href: '/admin/contents',
                  label: t.admin.dashboard.quickLinks.contentMgmt,
                  desc: t.admin.dashboard.quickLinks.contentMgmtDesc,
                  icon: 'article',
                  color: 'text-green-500',
                },
                {
                  href: '/admin/programs',
                  label: t.admin.dashboard.quickLinks.programMgmt,
                  desc: t.admin.dashboard.quickLinks.programMgmtDesc,
                  icon: 'school',
                  color: 'text-purple-500',
                },
                {
                  href: '/admin/enrollments',
                  label: t.admin.dashboard.quickLinks.enrollmentStatus,
                  desc: t.admin.dashboard.quickLinks.enrollmentStatusDesc,
                  icon: 'receipt_long',
                  color: 'text-orange-500',
                },
                {
                  href: '/admin/stats',
                  label: t.admin.dashboard.quickLinks.statistics,
                  desc: t.admin.dashboard.quickLinks.statisticsDesc,
                  icon: 'bar_chart',
                  color: 'text-pink-500',
                },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="flex items-start gap-3 bg-white rounded-xl border border-bark-200 p-4 hover:shadow-md hover:border-honey-300 transition-all group"
                >
                  <span
                    className={`material-icons-outlined text-2xl mt-0.5 ${item.color}`}
                  >
                    {item.icon}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-bark-800 group-hover:text-honey-600 transition-colors">
                      {item.label}
                    </p>
                    <p className="text-xs text-bark-400 mt-0.5">{item.desc}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
