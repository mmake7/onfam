'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/context/LanguageContext';

/* ── Types ── */
interface ProgramItem {
  id: number;
  title_ko: string;
  title_en: string | null;
  description_ko: string | null;
  description_en: string | null;
  price: number;
  max_capacity: number;
  current_capacity: number;
  start_date: string | null;
  end_date: string | null;
  location: string | null;
  status: 'open' | 'closed' | 'completed';
  created_at: string;
  updated_at: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ProgramForm {
  title_ko: string;
  title_en: string;
  description_ko: string;
  description_en: string;
  price: number | '';
  max_capacity: number | '';
  start_date: string;
  end_date: string;
  location: string;
  status: 'open' | 'closed' | 'completed';
  image_url: string;
}

const EMPTY_FORM: ProgramForm = {
  title_ko: '',
  title_en: '',
  description_ko: '',
  description_en: '',
  price: '',
  max_capacity: '',
  start_date: '',
  end_date: '',
  location: '',
  status: 'open',
  image_url: '',
};

/* ── Helpers ── */
function getApiBase() {
  return process.env.NEXT_PUBLIC_API_URL || '';
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

function toInputDate(dateStr: string | null): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

type SortField = 'title' | 'start_date' | 'price' | 'capacity' | 'created_at';
type SortDir = 'asc' | 'desc';

/* ── Component ── */
export default function AdminProgramsPage() {
  const { token } = useAuth();
  const { t, locale } = useTranslation();

  const STATUS_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
    open: { label: t.admin.programs.statusOpen, color: 'bg-green-100 text-green-700', icon: 'campaign' },
    closed: { label: t.admin.programs.statusClosed, color: 'bg-red-100 text-red-700', icon: 'block' },
    completed: { label: t.admin.programs.statusCompleted, color: 'bg-gray-100 text-gray-600', icon: 'check_circle' },
  };

  const formatNumber = (n: number): string => {
    return new Intl.NumberFormat(locale === 'ko' ? 'ko-KR' : 'en-US').format(n);
  };

  const [programs, setPrograms] = useState<ProgramItem[]>([]);
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
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [page, setPage] = useState(1);

  // Sorting (client-side)
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  // Form drawer
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ProgramForm>(EMPTY_FORM);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // Image upload
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Status change modal
  const [statusModal, setStatusModal] = useState<{
    program: ProgramItem;
    newStatus: 'open' | 'closed' | 'completed';
  } | null>(null);
  const [statusChanging, setStatusChanging] = useState(false);

  // Detail view
  const [selectedProgram, setSelectedProgram] = useState<ProgramItem | null>(null);

  // Toast
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  /* ── Fetch Programs ── */
  const fetchPrograms = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);
      params.set('page', String(page));
      params.set('limit', '20');

      const res = await fetch(
        `${getApiBase()}/api/programs?${params.toString()}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (!res.ok) throw new Error(t.admin.programs.fetchError);
      const json = await res.json();
      setPrograms(json.data);
      setPagination(json.pagination);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t.admin.common.errorOccurred);
    } finally {
      setLoading(false);
    }
  }, [token, statusFilter, page, t]);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  /* ── Search & filter ── */
  const handleSearch = () => {
    setPage(1);
    setSearch(searchInput);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  // Client-side search filtering
  const filteredPrograms = programs.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      p.title_ko.toLowerCase().includes(q) ||
      (p.title_en && p.title_en.toLowerCase().includes(q)) ||
      (p.location && p.location.toLowerCase().includes(q)) ||
      (p.description_ko && p.description_ko.toLowerCase().includes(q))
    );
  });

  /* ── Sort ── */
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const sortedPrograms = [...filteredPrograms].sort((a, b) => {
    const dir = sortDir === 'asc' ? 1 : -1;
    if (sortField === 'title') return a.title_ko.localeCompare(b.title_ko, 'ko') * dir;
    if (sortField === 'start_date') {
      const aDate = a.start_date ? new Date(a.start_date).getTime() : 0;
      const bDate = b.start_date ? new Date(b.start_date).getTime() : 0;
      return (aDate - bDate) * dir;
    }
    if (sortField === 'price') return (a.price - b.price) * dir;
    if (sortField === 'capacity') return (a.current_capacity - b.current_capacity) * dir;
    return (new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) * dir;
  });

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

  /* ── Form handlers ── */
  const openCreateForm = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError('');
    setFormOpen(true);
  };

  const openEditForm = (program: ProgramItem) => {
    setEditingId(program.id);
    setForm({
      title_ko: program.title_ko,
      title_en: program.title_en || '',
      description_ko: program.description_ko || '',
      description_en: program.description_en || '',
      price: program.price,
      max_capacity: program.max_capacity,
      start_date: toInputDate(program.start_date),
      end_date: toInputDate(program.end_date),
      location: program.location || '',
      status: program.status,
      image_url: '',
    });
    setFormError('');
    setFormOpen(true);
  };

  const closeForm = () => {
    if (formLoading || uploading) return;
    setFormOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError('');
  };

  /* ── Image Upload ── */
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowed.includes(file.type)) {
      setFormError(t.admin.programs.imageFormatError);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setFormError(t.admin.programs.imageSizeError);
      return;
    }

    setUploading(true);
    setFormError('');
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`${getApiBase()}/api/admin/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: t.admin.programs.imageUploadError }));
        throw new Error(errData.error || t.admin.programs.imageUploadError);
      }
      const json = await res.json();
      setForm((prev) => ({ ...prev, image_url: json.data.url }));
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : t.admin.programs.imageUploadError);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  /* ── Submit form ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (!form.title_ko.trim()) {
      setFormError(t.admin.programs.titleRequired);
      return;
    }
    if (form.price !== '' && Number(form.price) < 0) {
      setFormError(t.admin.programs.priceMinZero);
      return;
    }
    if (form.max_capacity !== '' && Number(form.max_capacity) < 0) {
      setFormError(t.admin.programs.capacityMinZero);
      return;
    }
    if (form.start_date && form.end_date && new Date(form.end_date) < new Date(form.start_date)) {
      setFormError(t.admin.programs.endAfterStart);
      return;
    }

    setFormLoading(true);
    setFormError('');

    const body = {
      title_ko: form.title_ko.trim(),
      title_en: form.title_en.trim() || null,
      description_ko: form.description_ko.trim() || null,
      description_en: form.description_en.trim() || null,
      price: form.price === '' ? 0 : Number(form.price),
      max_capacity: form.max_capacity === '' ? 0 : Number(form.max_capacity),
      start_date: form.start_date || null,
      end_date: form.end_date || null,
      location: form.location.trim() || null,
      ...(!editingId && { status: form.status }),
    };

    try {
      const url = editingId
        ? `${getApiBase()}/api/admin/programs/${editingId}`
        : `${getApiBase()}/api/admin/programs`;
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: t.admin.programs.saveError }));
        throw new Error(errData.error || t.admin.programs.saveError);
      }

      closeForm();
      fetchPrograms();
      showToast(editingId ? t.admin.programs.programModified : t.admin.programs.programCreated);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : t.admin.common.errorOccurred);
    } finally {
      setFormLoading(false);
    }
  };

  /* ── Status change ── */
  const handleStatusChange = async () => {
    if (!statusModal || !token) return;
    setStatusChanging(true);
    try {
      const res = await fetch(
        `${getApiBase()}/api/admin/programs/${statusModal.program.id}/status`,
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
        const errData = await res.json().catch(() => ({ error: t.admin.programs.statusChangeError }));
        throw new Error(errData.error || t.admin.programs.statusChangeError);
      }
      setStatusModal(null);
      fetchPrograms();
      showToast(t.admin.programs.statusChanged);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : t.admin.common.errorOccurred);
    } finally {
      setStatusChanging(false);
    }
  };

  // Lock body scroll when drawer/modal is open
  useEffect(() => {
    if (formOpen || statusModal || selectedProgram) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [formOpen, statusModal, selectedProgram]);

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

  /* ── Stats summary ── */
  const stats = {
    total: pagination.total,
    open: programs.filter((p) => p.status === 'open').length,
    closed: programs.filter((p) => p.status === 'closed').length,
    completed: programs.filter((p) => p.status === 'completed').length,
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* ── Page Header ── */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-bark-900">{t.admin.programs.title}</h1>
          <p className="text-sm text-bark-500 mt-1">
            {t.admin.programs.description}
          </p>
        </div>
        <button
          onClick={openCreateForm}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-bark-900 text-white text-sm font-medium
                     rounded-lg hover:bg-bark-800 transition-colors shrink-0"
        >
          <span className="material-icons-outlined text-base">add</span>
          {t.admin.programs.newProgram}
        </button>
      </div>

      {/* ── Stats Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <div className="bg-white rounded-xl border border-bark-200 p-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="material-icons-outlined text-base text-bark-400">school</span>
            <span className="text-xs text-bark-500">{t.admin.programs.total}</span>
          </div>
          <p className="text-2xl font-bold text-bark-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl border border-bark-200 p-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="material-icons-outlined text-base text-green-500">campaign</span>
            <span className="text-xs text-bark-500">{t.admin.programs.statusOpen}</span>
          </div>
          <p className="text-2xl font-bold text-green-600">{stats.open}</p>
        </div>
        <div className="bg-white rounded-xl border border-bark-200 p-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="material-icons-outlined text-base text-red-500">block</span>
            <span className="text-xs text-bark-500">{t.admin.programs.statusClosed}</span>
          </div>
          <p className="text-2xl font-bold text-red-600">{stats.closed}</p>
        </div>
        <div className="bg-white rounded-xl border border-bark-200 p-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="material-icons-outlined text-base text-gray-500">check_circle</span>
            <span className="text-xs text-bark-500">{t.admin.programs.statusCompleted}</span>
          </div>
          <p className="text-2xl font-bold text-gray-600">{stats.completed}</p>
        </div>
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
                placeholder={t.admin.programs.searchPlaceholder}
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
            <option value="">{t.admin.common.allStatus}</option>
            <option value="open">{t.admin.programs.statusOpen}</option>
            <option value="closed">{t.admin.programs.statusClosed}</option>
            <option value="completed">{t.admin.programs.statusCompleted}</option>
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
            {statusFilter && (
              <span className="inline-flex items-center gap-1 text-xs bg-bark-100 text-bark-600 px-2 py-1 rounded-full">
                {STATUS_CONFIG[statusFilter]?.label}
                <button
                  onClick={() => {
                    setStatusFilter('');
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
                setStatusFilter('');
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
          {t.admin.common.totalCount} <span className="font-semibold text-bark-800">{sortedPrograms.length}</span>{t.admin.common.programs}
        </p>
      </div>

      {/* ── Loading ── */}
      {loading ? (
        <div className="bg-white rounded-xl border border-bark-200 overflow-hidden">
          <div className="animate-pulse">
            <div className="h-12 bg-bark-50 border-b border-bark-200" />
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-bark-100">
                <div className="w-10 h-10 bg-bark-200 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-40 bg-bark-200 rounded" />
                  <div className="h-3 w-64 bg-bark-100 rounded" />
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
            onClick={() => { setError(''); fetchPrograms(); }}
            className="ml-auto text-red-600 hover:text-red-800 font-medium"
          >
            {t.admin.common.retry}
          </button>
        </div>
      ) : sortedPrograms.length === 0 ? (
        <div className="bg-white rounded-xl border border-bark-200 p-12 text-center">
          <span className="material-icons-outlined text-5xl text-bark-300 mb-3 block">
            school
          </span>
          <p className="text-bark-500 text-sm mb-4">
            {search || statusFilter
              ? t.admin.programs.noSearchPrograms
              : t.admin.programs.noPrograms}
          </p>
          {!search && !statusFilter && (
            <button
              onClick={openCreateForm}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium
                         text-bark-700 border border-bark-200 rounded-lg
                         hover:bg-bark-50 transition-colors"
            >
              <span className="material-icons-outlined text-base">add</span>
              {t.admin.programs.firstProgram}
            </button>
          )}
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
                        onClick={() => handleSort('title')}
                        className="flex items-center hover:text-bark-900 transition-colors"
                      >
                        {t.admin.programs.programInfo}
                        <SortIcon field="title" />
                      </button>
                    </th>
                    <th className="text-left px-5 py-3 font-semibold text-bark-600 whitespace-nowrap hidden md:table-cell">
                      <button
                        onClick={() => handleSort('start_date')}
                        className="flex items-center hover:text-bark-900 transition-colors"
                      >
                        {t.admin.programs.schedule}
                        <SortIcon field="start_date" />
                      </button>
                    </th>
                    <th className="text-right px-5 py-3 font-semibold text-bark-600 whitespace-nowrap hidden lg:table-cell">
                      <button
                        onClick={() => handleSort('price')}
                        className="flex items-center justify-end hover:text-bark-900 transition-colors"
                      >
                        {t.admin.programs.price}
                        <SortIcon field="price" />
                      </button>
                    </th>
                    <th className="text-center px-5 py-3 font-semibold text-bark-600 whitespace-nowrap hidden sm:table-cell">
                      <button
                        onClick={() => handleSort('capacity')}
                        className="flex items-center justify-center hover:text-bark-900 transition-colors"
                      >
                        {t.admin.programs.capacity}
                        <SortIcon field="capacity" />
                      </button>
                    </th>
                    <th className="text-center px-5 py-3 font-semibold text-bark-600 whitespace-nowrap">
                      {t.admin.programs.status}
                    </th>
                    <th className="text-center px-5 py-3 font-semibold text-bark-600 whitespace-nowrap">
                      {t.admin.programs.manage}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-bark-100">
                  {sortedPrograms.map((program) => {
                    const capacityPercent = program.max_capacity > 0
                      ? Math.round((program.current_capacity / program.max_capacity) * 100)
                      : 0;
                    const isFull = program.max_capacity > 0 && program.current_capacity >= program.max_capacity;

                    return (
                      <tr
                        key={program.id}
                        className="hover:bg-bark-50 transition-colors"
                      >
                        {/* Program info */}
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-honey-100 flex items-center justify-center shrink-0">
                              <span className="material-icons-outlined text-base text-honey-600">
                                school
                              </span>
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-bark-800 truncate max-w-[260px]">
                                {program.title_ko}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                {program.location && (
                                  <span className="text-xs text-bark-400 flex items-center gap-0.5 truncate">
                                    <span className="material-icons-outlined text-xs">location_on</span>
                                    {program.location}
                                  </span>
                                )}
                                <span className="text-xs text-bark-300 hidden md:inline">
                                  #{program.id}
                                </span>
                              </div>
                              {/* Mobile: schedule + price */}
                              <div className="flex items-center gap-2 mt-0.5 md:hidden">
                                {program.start_date && (
                                  <span className="text-xs text-bark-400">
                                    {formatDate(program.start_date)}
                                    {program.end_date && ` ~ ${formatDate(program.end_date)}`}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Schedule */}
                        <td className="px-5 py-3 hidden md:table-cell">
                          {program.start_date ? (
                            <div>
                              <p className="text-bark-700 text-sm">
                                {formatDate(program.start_date)}
                              </p>
                              {program.end_date && (
                                <p className="text-xs text-bark-400">
                                  ~ {formatDate(program.end_date)}
                                </p>
                              )}
                            </div>
                          ) : (
                            <span className="text-bark-400">{t.admin.common.undetermined}</span>
                          )}
                        </td>

                        {/* Price */}
                        <td className="px-5 py-3 text-right hidden lg:table-cell">
                          {program.price > 0 ? (
                            <span className="font-medium text-bark-700">
                              {formatNumber(program.price)}
                              <span className="text-xs font-normal text-bark-400">{t.admin.common.won}</span>
                            </span>
                          ) : (
                            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded">
                              {t.admin.common.free}
                            </span>
                          )}
                        </td>

                        {/* Capacity */}
                        <td className="px-5 py-3 text-center hidden sm:table-cell">
                          <div className="inline-flex flex-col items-center">
                            <span className={`text-sm font-medium ${isFull ? 'text-red-600' : 'text-bark-700'}`}>
                              {program.current_capacity}/{program.max_capacity || '-'}
                            </span>
                            {program.max_capacity > 0 && (
                              <div className="w-16 h-1.5 bg-bark-100 rounded-full mt-1 overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all ${
                                    capacityPercent >= 100 ? 'bg-red-500' : capacityPercent >= 80 ? 'bg-yellow-500' : 'bg-green-500'
                                  }`}
                                  style={{ width: `${Math.min(capacityPercent, 100)}%` }}
                                />
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-3 text-center">
                          <StatusDropdown
                            program={program}
                            onStatusChange={(newStatus) => {
                              setStatusModal({ program, newStatus });
                            }}
                          />
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-3">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => setSelectedProgram(program)}
                              className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700
                                         font-medium px-2 py-1 rounded-md hover:bg-blue-50 transition-colors"
                              title={t.admin.common.detail}
                            >
                              <span className="material-icons-outlined text-sm">visibility</span>
                              <span className="hidden lg:inline">{t.admin.common.detail}</span>
                            </button>
                            <button
                              onClick={() => openEditForm(program)}
                              className="inline-flex items-center gap-1 text-xs text-honey-600 hover:text-honey-700
                                         font-medium px-2 py-1 rounded-md hover:bg-honey-50 transition-colors"
                              title={t.admin.common.edit}
                            >
                              <span className="material-icons-outlined text-sm">edit</span>
                              <span className="hidden lg:inline">{t.admin.common.edit}</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
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

      {/* ── Create/Edit Form Drawer ── */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={closeForm} />

          <div className="relative w-full max-w-2xl bg-white shadow-2xl overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-bark-200 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-lg font-bold text-bark-900">
                {editingId ? t.admin.programs.editProgram : t.admin.programs.createProgram}
              </h2>
              <button
                onClick={closeForm}
                className="p-1.5 rounded-md hover:bg-bark-100 text-bark-400 hover:text-bark-700 transition-colors"
              >
                <span className="material-icons-outlined">close</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
              {/* Error */}
              {formError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700 flex items-center gap-2">
                  <span className="material-icons-outlined text-base">error</span>
                  {formError}
                </div>
              )}

              {/* Title KO */}
              <div>
                <label className="block text-sm font-medium text-bark-700 mb-1.5">
                  {t.admin.programs.titleKo} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.title_ko}
                  onChange={(e) => setForm((prev) => ({ ...prev, title_ko: e.target.value }))}
                  placeholder={t.admin.programs.titleKoPlaceholder}
                  className="w-full px-3 py-2 text-sm border border-bark-200 rounded-lg
                             focus:outline-none focus:ring-2 focus:ring-honey-400
                             placeholder:text-bark-400"
                />
              </div>

              {/* Title EN */}
              <div>
                <label className="block text-sm font-medium text-bark-700 mb-1.5">
                  {t.admin.programs.titleEn}
                </label>
                <input
                  type="text"
                  value={form.title_en}
                  onChange={(e) => setForm((prev) => ({ ...prev, title_en: e.target.value }))}
                  placeholder={t.admin.programs.titleEnPlaceholder}
                  className="w-full px-3 py-2 text-sm border border-bark-200 rounded-lg
                             focus:outline-none focus:ring-2 focus:ring-honey-400
                             placeholder:text-bark-400"
                />
              </div>

              {/* Description KO */}
              <div>
                <label className="block text-sm font-medium text-bark-700 mb-1.5">
                  {t.admin.programs.descriptionKo}
                </label>
                <textarea
                  value={form.description_ko}
                  onChange={(e) => setForm((prev) => ({ ...prev, description_ko: e.target.value }))}
                  placeholder={t.admin.programs.descriptionKoPlaceholder}
                  rows={4}
                  className="w-full px-3 py-2 text-sm border border-bark-200 rounded-lg
                             focus:outline-none focus:ring-2 focus:ring-honey-400
                             placeholder:text-bark-400 resize-y"
                />
              </div>

              {/* Description EN */}
              <div>
                <label className="block text-sm font-medium text-bark-700 mb-1.5">
                  {t.admin.programs.descriptionEn}
                </label>
                <textarea
                  value={form.description_en}
                  onChange={(e) => setForm((prev) => ({ ...prev, description_en: e.target.value }))}
                  placeholder={t.admin.programs.descriptionEnPlaceholder}
                  rows={4}
                  className="w-full px-3 py-2 text-sm border border-bark-200 rounded-lg
                             focus:outline-none focus:ring-2 focus:ring-honey-400
                             placeholder:text-bark-400 resize-y"
                />
              </div>

              {/* Schedule */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-bark-700 mb-1.5">
                    {t.admin.programs.startDate}
                  </label>
                  <input
                    type="date"
                    value={form.start_date}
                    onChange={(e) => setForm((prev) => ({ ...prev, start_date: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-bark-200 rounded-lg
                               focus:outline-none focus:ring-2 focus:ring-honey-400 text-bark-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-bark-700 mb-1.5">
                    {t.admin.programs.endDate}
                  </label>
                  <input
                    type="date"
                    value={form.end_date}
                    onChange={(e) => setForm((prev) => ({ ...prev, end_date: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-bark-200 rounded-lg
                               focus:outline-none focus:ring-2 focus:ring-honey-400 text-bark-700"
                  />
                </div>
              </div>

              {/* Price & Capacity */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-bark-700 mb-1.5">
                    {t.admin.programs.priceWon}
                  </label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        price: e.target.value === '' ? '' : Number(e.target.value),
                      }))
                    }
                    placeholder={t.admin.programs.pricePlaceholder}
                    min={0}
                    className="w-full px-3 py-2 text-sm border border-bark-200 rounded-lg
                               focus:outline-none focus:ring-2 focus:ring-honey-400
                               placeholder:text-bark-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-bark-700 mb-1.5">
                    {t.admin.programs.capacityPeople}
                  </label>
                  <input
                    type="number"
                    value={form.max_capacity}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        max_capacity: e.target.value === '' ? '' : Number(e.target.value),
                      }))
                    }
                    placeholder={t.admin.programs.capacityPlaceholder}
                    min={0}
                    className="w-full px-3 py-2 text-sm border border-bark-200 rounded-lg
                               focus:outline-none focus:ring-2 focus:ring-honey-400
                               placeholder:text-bark-400"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-bark-700 mb-1.5">
                  {t.admin.programs.location}
                </label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
                  placeholder={t.admin.programs.locationPlaceholder}
                  className="w-full px-3 py-2 text-sm border border-bark-200 rounded-lg
                             focus:outline-none focus:ring-2 focus:ring-honey-400
                             placeholder:text-bark-400"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-bark-700 mb-1.5">
                  {t.admin.programs.programImage}
                </label>
                {form.image_url ? (
                  <div className="border border-bark-200 rounded-lg p-3">
                    <div className="flex items-start gap-3">
                      <div className="w-24 h-24 rounded-lg bg-bark-100 overflow-hidden shrink-0">
                        <img
                          src={form.image_url}
                          alt={t.admin.programs.programImage}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-bark-500 break-all mb-2">{form.image_url}</p>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-xs text-honey-600 hover:text-honey-700 font-medium
                                       px-2 py-1 rounded hover:bg-honey-50 transition-colors"
                          >
                            {t.admin.common.imageChange}
                          </button>
                          <button
                            type="button"
                            onClick={() => setForm((prev) => ({ ...prev, image_url: '' }))}
                            className="text-xs text-red-500 hover:text-red-600 font-medium
                                       px-2 py-1 rounded hover:bg-red-50 transition-colors"
                          >
                            {t.admin.common.imageDelete}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="w-full border-2 border-dashed border-bark-200 rounded-lg p-6
                               flex flex-col items-center justify-center gap-2
                               hover:border-honey-400 hover:bg-honey-50/30 transition-colors
                               disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? (
                      <>
                        <span className="w-6 h-6 border-2 border-honey-400/30 border-t-honey-400 rounded-full animate-spin" />
                        <span className="text-sm text-bark-500">{t.admin.common.uploading}</span>
                      </>
                    ) : (
                      <>
                        <span className="material-icons-outlined text-2xl text-bark-400">
                          cloud_upload
                        </span>
                        <span className="text-sm text-bark-500">
                          {t.admin.common.uploadImage}
                        </span>
                        <span className="text-xs text-bark-400">
                          {t.admin.common.uploadFormats}
                        </span>
                      </>
                    )}
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* Status (create only) */}
              {!editingId && (
                <div>
                  <label className="block text-sm font-medium text-bark-700 mb-1.5">
                    {t.admin.programs.initialStatus}
                  </label>
                  <div className="flex gap-2">
                    {(['open', 'closed', 'completed'] as const).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, status: s }))}
                        className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                          form.status === s
                            ? 'border-bark-900 bg-bark-900 text-white'
                            : 'border-bark-200 text-bark-600 hover:bg-bark-50'
                        }`}
                      >
                        <span className="material-icons-outlined text-sm">
                          {STATUS_CONFIG[s].icon}
                        </span>
                        {STATUS_CONFIG[s].label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Submit */}
              <div className="flex justify-end gap-3 pt-4 border-t border-bark-100">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={formLoading}
                  className="px-5 py-2.5 text-sm text-bark-600 hover:bg-bark-100 rounded-lg transition-colors"
                >
                  {t.admin.common.cancel}
                </button>
                <button
                  type="submit"
                  disabled={formLoading || uploading}
                  className="px-5 py-2.5 text-sm bg-bark-900 text-white font-medium rounded-lg
                             hover:bg-bark-800 disabled:opacity-50 transition-colors
                             flex items-center gap-2"
                >
                  {formLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {t.admin.common.saving}
                    </>
                  ) : (
                    <>
                      <span className="material-icons-outlined text-base">
                        {editingId ? 'save' : 'add'}
                      </span>
                      {editingId ? t.admin.common.edit : t.admin.common.create}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Program Detail Drawer ── */}
      {selectedProgram && (
        <ProgramDetailDrawer
          program={selectedProgram}
          onClose={() => setSelectedProgram(null)}
          onEdit={(p) => {
            setSelectedProgram(null);
            openEditForm(p);
          }}
          onStatusChange={(p, newStatus) => {
            setSelectedProgram(null);
            setStatusModal({ program: p, newStatus });
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
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-honey-100 mx-auto mb-4">
              <span className="material-icons-outlined text-honey-600 text-xl">
                {STATUS_CONFIG[statusModal.newStatus]?.icon}
              </span>
            </div>
            <h3 className="text-lg font-bold text-bark-900 text-center mb-2">{t.admin.programs.statusChange}</h3>
            <p className="text-sm text-bark-600 text-center mb-1">
              <span className="font-semibold">{statusModal.program.title_ko}</span>
            </p>
            <p className="text-sm text-bark-600 text-center mb-4">
              <span
                className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${
                  STATUS_CONFIG[statusModal.program.status]?.color
                }`}
              >
                {STATUS_CONFIG[statusModal.program.status]?.label}
              </span>
              <span className="mx-2 text-bark-400">&rarr;</span>
              <span
                className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${
                  STATUS_CONFIG[statusModal.newStatus]?.color
                }`}
              >
                {STATUS_CONFIG[statusModal.newStatus]?.label}
              </span>
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
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[70]
                        bg-bark-900 text-white px-5 py-3 rounded-lg shadow-lg
                        text-sm font-medium flex items-center gap-2
                        animate-[fade-up_0.3s_ease-out]">
          <span className="material-icons-outlined text-base text-green-400">check_circle</span>
          {toast}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Status Dropdown Component
   ═══════════════════════════════════════════════ */

function StatusDropdown({
  program,
  onStatusChange,
}: {
  program: ProgramItem;
  onStatusChange: (newStatus: 'open' | 'closed' | 'completed') => void;
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const STATUS_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
    open: { label: t.admin.programs.statusOpen, color: 'bg-green-100 text-green-700', icon: 'campaign' },
    closed: { label: t.admin.programs.statusClosed, color: 'bg-red-100 text-red-700', icon: 'block' },
    completed: { label: t.admin.programs.statusCompleted, color: 'bg-gray-100 text-gray-600', icon: 'check_circle' },
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const statuses: ('open' | 'closed' | 'completed')[] = ['open', 'closed', 'completed'];
  const otherStatuses = statuses.filter((s) => s !== program.status);

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full
                    cursor-pointer transition-colors ${STATUS_CONFIG[program.status]?.color}
                    hover:opacity-80`}
      >
        {STATUS_CONFIG[program.status]?.label}
        <span className="material-icons-outlined text-xs">
          {open ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 mt-1 bg-white border border-bark-200 rounded-lg shadow-lg py-1 z-20 min-w-[100px]">
          {otherStatuses.map((s) => (
            <button
              key={s}
              onClick={() => {
                setOpen(false);
                onStatusChange(s);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-bark-600 hover:bg-bark-50 transition-colors"
            >
              <span className="material-icons-outlined text-sm">
                {STATUS_CONFIG[s].icon}
              </span>
              {STATUS_CONFIG[s].label}{t.admin.programs.changeToStatus}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Program Detail Drawer Component
   ═══════════════════════════════════════════════ */

function ProgramDetailDrawer({
  program,
  onClose,
  onEdit,
  onStatusChange,
}: {
  program: ProgramItem;
  onClose: () => void;
  onEdit: (program: ProgramItem) => void;
  onStatusChange: (program: ProgramItem, newStatus: 'open' | 'closed' | 'completed') => void;
}) {
  const { t, locale } = useTranslation();

  const STATUS_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
    open: { label: t.admin.programs.statusOpen, color: 'bg-green-100 text-green-700', icon: 'campaign' },
    closed: { label: t.admin.programs.statusClosed, color: 'bg-red-100 text-red-700', icon: 'block' },
    completed: { label: t.admin.programs.statusCompleted, color: 'bg-gray-100 text-gray-600', icon: 'check_circle' },
  };

  const formatNumber = (n: number): string => {
    return new Intl.NumberFormat(locale === 'ko' ? 'ko-KR' : 'en-US').format(n);
  };

  const capacityPercent = program.max_capacity > 0
    ? Math.round((program.current_capacity / program.max_capacity) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white shadow-2xl overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-bark-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-lg font-bold text-bark-900">{t.admin.programs.programDetail}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-bark-100 text-bark-400 hover:text-bark-700 transition-colors"
          >
            <span className="material-icons-outlined">close</span>
          </button>
        </div>

        {/* Program Card */}
        <div className="px-6 py-5 bg-bark-50">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-honey-100 flex items-center justify-center shrink-0">
              <span className="material-icons-outlined text-2xl text-honey-600">school</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-bark-900 truncate">
                  {program.title_ko}
                </h3>
                <span
                  className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${
                    STATUS_CONFIG[program.status]?.color
                  }`}
                >
                  {STATUS_CONFIG[program.status]?.label}
                </span>
              </div>
              {program.title_en && (
                <p className="text-sm text-bark-500 truncate mt-0.5">{program.title_en}</p>
              )}
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="bg-white rounded-lg p-3 text-center border border-bark-200">
              <p className="text-lg font-bold text-bark-900">
                {program.price > 0 ? formatNumber(program.price) : t.admin.common.free}
              </p>
              <p className="text-xs text-bark-500">{program.price > 0 ? t.admin.common.won : t.admin.programs.price}</p>
            </div>
            <div className="bg-white rounded-lg p-3 text-center border border-bark-200">
              <p className="text-lg font-bold text-bark-900">
                {program.current_capacity}
                <span className="text-xs font-normal text-bark-400">/{program.max_capacity || '-'}</span>
              </p>
              <p className="text-xs text-bark-500">{t.admin.programs.applicationCapacity}</p>
            </div>
            <div className="bg-white rounded-lg p-3 text-center border border-bark-200">
              <p className="text-lg font-bold text-bark-900">
                {program.max_capacity > 0 ? `${capacityPercent}%` : '-'}
              </p>
              <p className="text-xs text-bark-500">{t.admin.programs.fillRate}</p>
            </div>
          </div>
        </div>

        {/* Detail Info */}
        <div className="px-6 py-5 space-y-4">
          <DetailRow
            icon="calendar_today"
            label={t.admin.programs.schedule}
            value={
              program.start_date
                ? `${formatDate(program.start_date)}${program.end_date ? ` ~ ${formatDate(program.end_date)}` : ''}`
                : t.admin.common.undetermined
            }
          />
          <DetailRow
            icon="location_on"
            label={t.admin.programs.location}
            value={program.location || t.admin.common.undetermined}
          />
          <DetailRow
            icon="payments"
            label={t.admin.programs.price}
            value={program.price > 0 ? `${formatNumber(program.price)}${t.admin.common.won}` : t.admin.common.free}
          />
          <DetailRow
            icon="groups"
            label={t.admin.programs.capacity}
            value={
              program.max_capacity > 0
                ? `${program.current_capacity}/${program.max_capacity}${t.admin.common.people} (${capacityPercent}%)`
                : `${program.current_capacity}${t.admin.common.people} (${t.admin.common.unlimited})`
            }
          />
          <DetailRow
            icon="schedule"
            label={t.admin.programs.registeredDate}
            value={formatDate(program.created_at)}
          />
          <DetailRow
            icon="update"
            label={t.admin.programs.modifiedDate}
            value={formatDate(program.updated_at)}
          />

          {/* Descriptions */}
          {program.description_ko && (
            <div className="pt-4 border-t border-bark-100">
              <h4 className="text-sm font-medium text-bark-700 mb-2 flex items-center gap-1.5">
                <span className="material-icons-outlined text-sm text-bark-400">description</span>
                {t.admin.programs.descriptionLabel}
              </h4>
              <p className="text-sm text-bark-600 whitespace-pre-wrap leading-relaxed">
                {program.description_ko}
              </p>
            </div>
          )}

          {program.description_en && (
            <div className="pt-3">
              <h4 className="text-sm font-medium text-bark-700 mb-2 flex items-center gap-1.5">
                <span className="material-icons-outlined text-sm text-bark-400">translate</span>
                {t.admin.programs.descriptionEn2}
              </h4>
              <p className="text-sm text-bark-600 whitespace-pre-wrap leading-relaxed">
                {program.description_en}
              </p>
            </div>
          )}

          {/* Status change */}
          <div className="pt-4 border-t border-bark-100">
            <h4 className="text-sm font-medium text-bark-700 mb-3">{t.admin.programs.statusChange}</h4>
            <div className="flex gap-2">
              {(['open', 'closed', 'completed'] as const).map((s) => (
                <button
                  key={s}
                  disabled={program.status === s}
                  onClick={() => onStatusChange(program, s)}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${
                    program.status === s
                      ? 'border-bark-300 bg-bark-100 text-bark-400 cursor-not-allowed'
                      : 'border-bark-200 text-bark-600 hover:bg-bark-50 cursor-pointer'
                  }`}
                >
                  <span className="material-icons-outlined text-sm">
                    {STATUS_CONFIG[s].icon}
                  </span>
                  {STATUS_CONFIG[s].label}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-bark-100">
            <button
              onClick={() => onEdit(program)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium
                         border border-bark-200 rounded-lg text-bark-700
                         hover:bg-bark-50 hover:border-bark-300 transition-colors"
            >
              <span className="material-icons-outlined text-base">edit</span>
              {t.admin.programs.editProgram}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Detail Row helper ── */
function DetailRow({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center py-1.5">
      <div className="flex items-center gap-2 w-24 shrink-0">
        <span className="material-icons-outlined text-sm text-bark-400">{icon}</span>
        <span className="text-sm text-bark-500">{label}</span>
      </div>
      <span className="text-sm text-bark-800 flex-1">{value}</span>
    </div>
  );
}
