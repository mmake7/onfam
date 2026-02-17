'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/context/LanguageContext';

/* ── Types ── */
interface UserItem {
  id: number;
  email: string;
  name: string;
  phone: string | null;
  role: 'admin' | 'user';
  created_at: string;
  updated_at: string;
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

type SortField = 'name' | 'email' | 'created_at';
type SortDir = 'asc' | 'desc';

/* ── Component ── */
export default function AdminUsersPage() {
  const { token } = useAuth();
  const { t } = useTranslation();

  const ROLE_LABELS: Record<string, { label: string; color: string }> = {
    admin: { label: t.admin.users.admin, color: 'bg-purple-100 text-purple-700' },
    user: { label: t.admin.users.user, color: 'bg-blue-100 text-blue-700' },
  };

  const [users, setUsers] = useState<UserItem[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [page, setPage] = useState(1);

  // Sorting (client-side)
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  // Role change modal
  const [roleModal, setRoleModal] = useState<{
    user: UserItem;
    newRole: 'admin' | 'user';
  } | null>(null);
  const [roleChanging, setRoleChanging] = useState(false);

  // Selected user detail
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  /* ── Fetch Users ── */
  const fetchUsers = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (roleFilter) params.set('role', roleFilter);
      params.set('page', String(page));
      params.set('limit', '20');

      const res = await fetch(
        `${getApiBase()}/api/admin/users?${params.toString()}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (!res.ok) throw new Error(t.admin.users.fetchError);
      const json = await res.json();
      setUsers(json.data);
      setPagination(json.pagination);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t.admin.common.errorOccurred);
    } finally {
      setLoading(false);
    }
  }, [token, search, roleFilter, page, t]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  /* ── Search handler ── */
  const handleSearch = () => {
    setPage(1);
    setSearch(searchInput);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
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

  const sortedUsers = [...users].sort((a, b) => {
    const dir = sortDir === 'asc' ? 1 : -1;
    if (sortField === 'name') return a.name.localeCompare(b.name, 'ko') * dir;
    if (sortField === 'email') return a.email.localeCompare(b.email) * dir;
    return (new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) * dir;
  });

  /* ── Role change ── */
  const handleRoleChange = async () => {
    if (!roleModal || !token) return;
    setRoleChanging(true);
    try {
      const res = await fetch(
        `${getApiBase()}/api/admin/users/${roleModal.user.id}/role`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ role: roleModal.newRole }),
        },
      );
      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: t.admin.users.roleChangeError }));
        throw new Error(errData.error || t.admin.users.roleChangeError);
      }
      setRoleModal(null);
      fetchUsers();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : t.admin.common.errorOccurred);
    } finally {
      setRoleChanging(false);
    }
  };

  /* ── Sort icon ── */
  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return (
        <span className="material-icons-outlined text-sm text-bark-300 ml-1">
          unfold_more
        </span>
      );
    }
    return (
      <span className="material-icons-outlined text-sm text-honey-600 ml-1">
        {sortDir === 'asc' ? 'expand_less' : 'expand_more'}
      </span>
    );
  };

  /* ── Pagination helpers ── */
  const pageNumbers: number[] = [];
  const maxVisible = 5;
  let startPage = Math.max(1, pagination.page - Math.floor(maxVisible / 2));
  const endPage = Math.min(pagination.totalPages, startPage + maxVisible - 1);
  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* ── Page Header ── */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-bark-900">{t.admin.users.title}</h1>
        <p className="text-sm text-bark-500 mt-1">
          {t.admin.users.description}
        </p>
      </div>

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
                placeholder={t.admin.common.searchByNameOrEmail}
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

          {/* Role filter */}
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 text-sm border border-bark-200 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-honey-400 bg-white
                       text-bark-700 min-w-[120px]"
          >
            <option value="">{t.admin.common.allRoles}</option>
            <option value="user">{t.admin.users.user}</option>
            <option value="admin">{t.admin.users.admin}</option>
          </select>
        </div>

        {/* Active filters */}
        {(search || roleFilter) && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-bark-100">
            <span className="text-xs text-bark-400">{t.admin.common.filter}</span>
            {search && (
              <span className="inline-flex items-center gap-1 text-xs bg-bark-100 text-bark-600 px-2 py-1 rounded-full">
                &quot;{search}&quot;
                <button
                  onClick={() => {
                    setSearch('');
                    setSearchInput('');
                    setPage(1);
                  }}
                  className="hover:text-bark-900"
                >
                  <span className="material-icons-outlined text-xs">close</span>
                </button>
              </span>
            )}
            {roleFilter && (
              <span className="inline-flex items-center gap-1 text-xs bg-bark-100 text-bark-600 px-2 py-1 rounded-full">
                {ROLE_LABELS[roleFilter]?.label}
                <button
                  onClick={() => {
                    setRoleFilter('');
                    setPage(1);
                  }}
                  className="hover:text-bark-900"
                >
                  <span className="material-icons-outlined text-xs">close</span>
                </button>
              </span>
            )}
            <button
              onClick={() => {
                setSearch('');
                setSearchInput('');
                setRoleFilter('');
                setPage(1);
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
          {t.admin.common.totalCount} <span className="font-semibold text-bark-800">{pagination.total}</span>{t.admin.common.members}
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
            onClick={() => { setError(''); fetchUsers(); }}
            className="ml-auto text-red-600 hover:text-red-800 font-medium"
          >
            {t.admin.common.retry}
          </button>
        </div>
      ) : users.length === 0 ? (
        <div className="bg-white rounded-xl border border-bark-200 p-12 text-center">
          <span className="material-icons-outlined text-5xl text-bark-300 mb-3 block">
            person_search
          </span>
          <p className="text-bark-500 text-sm">
            {search || roleFilter
              ? t.admin.users.noSearchUsers
              : t.admin.users.noUsers}
          </p>
        </div>
      ) : (
        <>
          {/* ── Table ── */}
          <div className="bg-white rounded-xl border border-bark-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-bark-50 border-b border-bark-200">
                    <th className="text-left px-5 py-3 font-semibold text-bark-600 whitespace-nowrap">
                      <button
                        onClick={() => handleSort('name')}
                        className="flex items-center hover:text-bark-900 transition-colors"
                      >
                        {t.admin.users.userInfo}
                        <SortIcon field="name" />
                      </button>
                    </th>
                    <th className="text-left px-5 py-3 font-semibold text-bark-600 whitespace-nowrap hidden md:table-cell">
                      <button
                        onClick={() => handleSort('email')}
                        className="flex items-center hover:text-bark-900 transition-colors"
                      >
                        {t.admin.users.email}
                        <SortIcon field="email" />
                      </button>
                    </th>
                    <th className="text-left px-5 py-3 font-semibold text-bark-600 whitespace-nowrap hidden lg:table-cell">
                      {t.admin.users.phone}
                    </th>
                    <th className="text-center px-5 py-3 font-semibold text-bark-600 whitespace-nowrap">
                      {t.admin.users.role}
                    </th>
                    <th className="text-left px-5 py-3 font-semibold text-bark-600 whitespace-nowrap hidden sm:table-cell">
                      <button
                        onClick={() => handleSort('created_at')}
                        className="flex items-center hover:text-bark-900 transition-colors"
                      >
                        {t.admin.users.joinDate}
                        <SortIcon field="created_at" />
                      </button>
                    </th>
                    <th className="text-center px-5 py-3 font-semibold text-bark-600 whitespace-nowrap">
                      {t.admin.common.detail}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-bark-100">
                  {sortedUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-bark-50 transition-colors"
                    >
                      {/* Name + email (mobile) */}
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                            <span className="material-icons-outlined text-base text-blue-500">
                              person
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-bark-800 truncate">
                              {user.name}
                            </p>
                            <p className="text-xs text-bark-400 truncate md:hidden">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Email (desktop) */}
                      <td className="px-5 py-3 text-bark-600 hidden md:table-cell">
                        <span className="truncate block max-w-[200px]">
                          {user.email}
                        </span>
                      </td>

                      {/* Phone */}
                      <td className="px-5 py-3 text-bark-600 hidden lg:table-cell">
                        {user.phone || '-'}
                      </td>

                      {/* Role */}
                      <td className="px-5 py-3 text-center">
                        <span
                          className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${
                            ROLE_LABELS[user.role]?.color ?? 'bg-bark-100 text-bark-600'
                          }`}
                        >
                          {ROLE_LABELS[user.role]?.label ?? user.role}
                        </span>
                      </td>

                      {/* Created at */}
                      <td className="px-5 py-3 text-bark-500 whitespace-nowrap hidden sm:table-cell">
                        {formatDate(user.created_at)}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3 text-center">
                        <button
                          onClick={() => setSelectedUserId(user.id)}
                          className="inline-flex items-center gap-1 text-xs text-honey-600 hover:text-honey-700
                                     font-medium px-2 py-1 rounded-md hover:bg-honey-50 transition-colors"
                        >
                          <span className="material-icons-outlined text-sm">
                            visibility
                          </span>
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
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-1 mt-4">
              <button
                onClick={() => setPage(1)}
                disabled={pagination.page === 1}
                className="p-1.5 rounded-md text-bark-400 hover:text-bark-700 hover:bg-bark-100
                           disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <span className="material-icons-outlined text-lg">first_page</span>
              </button>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={pagination.page === 1}
                className="p-1.5 rounded-md text-bark-400 hover:text-bark-700 hover:bg-bark-100
                           disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <span className="material-icons-outlined text-lg">chevron_left</span>
              </button>

              {pageNumbers.map((pn) => (
                <button
                  key={pn}
                  onClick={() => setPage(pn)}
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
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={pagination.page === pagination.totalPages}
                className="p-1.5 rounded-md text-bark-400 hover:text-bark-700 hover:bg-bark-100
                           disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <span className="material-icons-outlined text-lg">chevron_right</span>
              </button>
              <button
                onClick={() => setPage(pagination.totalPages)}
                disabled={pagination.page === pagination.totalPages}
                className="p-1.5 rounded-md text-bark-400 hover:text-bark-700 hover:bg-bark-100
                           disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <span className="material-icons-outlined text-lg">last_page</span>
              </button>
            </div>
          )}
        </>
      )}

      {/* ── User Detail Drawer ── */}
      {selectedUserId !== null && (
        <UserDetailDrawer
          userId={selectedUserId}
          token={token}
          onClose={() => setSelectedUserId(null)}
          onRoleChange={(user, newRole) => {
            setRoleModal({ user, newRole });
          }}
        />
      )}

      {/* ── Role Change Modal ── */}
      {roleModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => !roleChanging && setRoleModal(null)}
          />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="text-lg font-bold text-bark-900 mb-2">{t.admin.users.changeRole}</h3>
            <p className="text-sm text-bark-600 mb-4">
              <span className="font-semibold">{roleModal.user.name}</span>{t.admin.users.roleChangeConfirm}{' '}
              <span
                className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${
                  ROLE_LABELS[roleModal.newRole]?.color
                }`}
              >
                {ROLE_LABELS[roleModal.newRole]?.label}
              </span>
              {t.admin.common.confirmChange}
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRoleModal(null)}
                disabled={roleChanging}
                className="px-4 py-2 text-sm text-bark-600 hover:bg-bark-100 rounded-lg transition-colors"
              >
                {t.admin.common.cancel}
              </button>
              <button
                onClick={handleRoleChange}
                disabled={roleChanging}
                className="px-4 py-2 text-sm bg-bark-900 text-white font-medium rounded-lg
                           hover:bg-bark-800 disabled:opacity-50 transition-colors"
              >
                {roleChanging ? t.admin.common.changing : t.admin.common.change}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   User Detail Drawer Component
   ═══════════════════════════════════════════════ */

interface UserDetail {
  id: number;
  email: string;
  name: string;
  phone: string | null;
  role: 'admin' | 'user';
  created_at: string;
  updated_at: string;
  enrollments: EnrollmentItem[];
  payments: PaymentItem[];
}

interface EnrollmentItem {
  id: number;
  program_id: number;
  status: string;
  amount: number;
  payment_key: string | null;
  created_at: string;
  updated_at: string;
  program_title: string;
  program_title_en: string | null;
  program_start_date: string | null;
  program_end_date: string | null;
  program_status: string;
}

interface PaymentItem {
  id: number;
  enrollment_id: number;
  toss_payment_key: string | null;
  order_id: string;
  amount: number;
  method: string | null;
  status: string;
  approved_at: string | null;
  created_at: string;
  program_title: string;
  program_title_en: string | null;
}

function UserDetailDrawer({
  userId,
  token,
  onClose,
  onRoleChange,
}: {
  userId: number;
  token: string | null;
  onClose: () => void;
  onRoleChange: (user: UserItem, newRole: 'admin' | 'user') => void;
}) {
  const { t, locale } = useTranslation();

  const ROLE_LABELS: Record<string, { label: string; color: string }> = {
    admin: { label: t.admin.users.admin, color: 'bg-purple-100 text-purple-700' },
    user: { label: t.admin.users.user, color: 'bg-blue-100 text-blue-700' },
  };

  const ENROLLMENT_STATUS: Record<string, { label: string; color: string }> = {
    pending: { label: t.admin.status.pending, color: 'bg-yellow-100 text-yellow-700' },
    paid: { label: t.admin.status.paid, color: 'bg-green-100 text-green-700' },
    cancelled: { label: t.admin.status.cancelled, color: 'bg-red-100 text-red-700' },
    refunded: { label: t.admin.status.refunded, color: 'bg-gray-100 text-gray-600' },
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

  const [detail, setDetail] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'info' | 'enrollments' | 'payments'>('info');

  useEffect(() => {
    if (!token || !userId) return;
    let cancelled = false;

    const fetchDetail = async () => {
      try {
        const res = await fetch(`${getApiBase()}/api/admin/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(t.admin.users.fetchDetailError);
        const json = await res.json();
        if (!cancelled) {
          setDetail(json.data);
          setLoading(false);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : t.admin.common.errorOccurred);
          setLoading(false);
        }
      }
    };

    fetchDetail();
    return () => { cancelled = true; };
  }, [token, userId, t]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const tabs = [
    { key: 'info' as const, label: t.admin.users.basicInfo, icon: 'person' },
    {
      key: 'enrollments' as const,
      label: `${t.admin.users.enrollmentHistory} (${detail?.enrollments.length ?? 0})`,
      icon: 'how_to_reg',
    },
    {
      key: 'payments' as const,
      label: `${t.admin.users.paymentHistory} (${detail?.payments.length ?? 0})`,
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
          <h2 className="text-lg font-bold text-bark-900">{t.admin.users.userDetail}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-bark-100 text-bark-400 hover:text-bark-700 transition-colors"
          >
            <span className="material-icons-outlined">close</span>
          </button>
        </div>

        {loading ? (
          <div className="p-6 animate-pulse space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-bark-200 rounded-full" />
              <div className="space-y-2">
                <div className="h-5 w-32 bg-bark-200 rounded" />
                <div className="h-4 w-48 bg-bark-100 rounded" />
              </div>
            </div>
            <div className="h-px bg-bark-200 my-4" />
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 bg-bark-100 rounded" />
            ))}
          </div>
        ) : error ? (
          <div className="p-6">
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 flex items-center gap-2">
              <span className="material-icons-outlined text-lg">error</span>
              {error}
            </div>
          </div>
        ) : detail ? (
          <>
            {/* User profile card */}
            <div className="px-6 py-5 bg-bark-50">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <span className="material-icons-outlined text-2xl text-blue-500">
                    person
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-bark-900 truncate">
                      {detail.name}
                    </h3>
                    <span
                      className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${
                        ROLE_LABELS[detail.role]?.color
                      }`}
                    >
                      {ROLE_LABELS[detail.role]?.label}
                    </span>
                  </div>
                  <p className="text-sm text-bark-500 truncate">{detail.email}</p>
                </div>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="bg-white rounded-lg p-3 text-center border border-bark-200">
                  <p className="text-lg font-bold text-bark-900">{detail.enrollments.length}</p>
                  <p className="text-xs text-bark-500">{t.admin.users.totalApplications}</p>
                </div>
                <div className="bg-white rounded-lg p-3 text-center border border-bark-200">
                  <p className="text-lg font-bold text-green-600">
                    {detail.enrollments.filter((e) => e.status === 'paid').length}
                  </p>
                  <p className="text-xs text-bark-500">{t.admin.users.paidCompleted}</p>
                </div>
                <div className="bg-white rounded-lg p-3 text-center border border-bark-200">
                  <p className="text-lg font-bold text-bark-900">
                    {formatNumber(
                      detail.payments
                        .filter((p) => p.status === 'done')
                        .reduce((sum, p) => sum + p.amount, 0),
                    )}
                    <span className="text-xs font-normal text-bark-400">{t.admin.common.won}</span>
                  </p>
                  <p className="text-xs text-bark-500">{t.admin.users.totalPaidAmount}</p>
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
                  <InfoRow label={t.admin.users.name} value={detail.name} />
                  <InfoRow label={t.admin.users.email} value={detail.email} />
                  <InfoRow label={t.admin.users.phone} value={detail.phone || '-'} />
                  <InfoRow label={t.admin.users.joinDate} value={formatDateTime(detail.created_at)} />
                  <InfoRow
                    label={t.admin.users.lastModified}
                    value={formatDateTime(detail.updated_at)}
                  />
                  <InfoRow
                    label={t.admin.users.role}
                    value={
                      <span
                        className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${
                          ROLE_LABELS[detail.role]?.color
                        }`}
                      >
                        {ROLE_LABELS[detail.role]?.label}
                      </span>
                    }
                  />

                  {/* Role change button */}
                  <div className="pt-4 border-t border-bark-100">
                    <button
                      onClick={() =>
                        onRoleChange(
                          detail as UserItem,
                          detail.role === 'admin' ? 'user' : 'admin',
                        )
                      }
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium
                                 border border-bark-200 rounded-lg text-bark-700
                                 hover:bg-bark-50 hover:border-bark-300 transition-colors"
                    >
                      <span className="material-icons-outlined text-base">
                        manage_accounts
                      </span>
                      {detail.role === 'admin' ? t.admin.users.changeToUser : t.admin.users.changeToAdmin}
                    </button>
                  </div>
                </div>
              )}

              {/* Enrollments tab */}
              {activeTab === 'enrollments' && (
                <div>
                  {detail.enrollments.length === 0 ? (
                    <div className="text-center py-8">
                      <span className="material-icons-outlined text-4xl text-bark-300 block mb-2">
                        assignment
                      </span>
                      <p className="text-sm text-bark-400">{t.admin.users.noEnrollments}</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {detail.enrollments.map((enrollment) => (
                        <div
                          key={enrollment.id}
                          className="border border-bark-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-bark-800 text-sm truncate">
                                {enrollment.program_title}
                              </p>
                              {enrollment.program_start_date && (
                                <p className="text-xs text-bark-400 mt-0.5">
                                  {formatDate(enrollment.program_start_date)}
                                  {enrollment.program_end_date &&
                                    ` ~ ${formatDate(enrollment.program_end_date)}`}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-2 shrink-0 ml-3">
                              <span
                                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                  ENROLLMENT_STATUS[enrollment.status]?.color ??
                                  'bg-bark-100 text-bark-600'
                                }`}
                              >
                                {ENROLLMENT_STATUS[enrollment.status]?.label ??
                                  enrollment.status}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-xs text-bark-500">
                            <span>
                              {t.admin.users.applicationDate} {formatDate(enrollment.created_at)}
                            </span>
                            <div className="flex items-center gap-3">
                              <span
                                className={`font-medium px-1.5 py-0.5 rounded ${
                                  PROGRAM_STATUS[enrollment.program_status]?.color ??
                                  'bg-bark-100 text-bark-600'
                                }`}
                              >
                                {PROGRAM_STATUS[enrollment.program_status]?.label ??
                                  enrollment.program_status}
                              </span>
                              <span className="font-medium text-bark-700">
                                {formatNumber(enrollment.amount)}{t.admin.common.won}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Payments tab */}
              {activeTab === 'payments' && (
                <div>
                  {detail.payments.length === 0 ? (
                    <div className="text-center py-8">
                      <span className="material-icons-outlined text-4xl text-bark-300 block mb-2">
                        credit_card_off
                      </span>
                      <p className="text-sm text-bark-400">{t.admin.users.noPayments}</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {detail.payments.map((payment) => (
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
                                PAYMENT_STATUS[payment.status]?.color ??
                                'bg-bark-100 text-bark-600'
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
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        ) : null}
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
