'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/context/LanguageContext';

/* ── Types ── */
interface ContentItem {
  id: number;
  page_key: string;
  section_key: string;
  title_ko: string | null;
  title_en: string | null;
  body_ko: string | null;
  body_en: string | null;
  image_url: string | null;
  sort_order: number;
  is_published: boolean;
  updated_by: number | null;
  created_at: string;
  updated_at: string;
}

interface ContentForm {
  page_key: string;
  section_key: string;
  title_ko: string;
  title_en: string;
  body_ko: string;
  body_en: string;
  image_url: string;
  sort_order: number | '';
  is_published: boolean;
}

const EMPTY_FORM: ContentForm = {
  page_key: '',
  section_key: '',
  title_ko: '',
  title_en: '',
  body_ko: '',
  body_en: '',
  image_url: '',
  sort_order: '',
  is_published: true,
};

/* ── Helpers ── */
function getApiBase() {
  return process.env.NEXT_PUBLIC_API_URL || '';
}

function formatDateTime(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

/* ── Component ── */
export default function AdminContentsPage() {
  const { token } = useAuth();
  const { t, locale } = useTranslation();

  /* ── Translated lookup tables (inside component so they react to locale changes) ── */
  const PAGE_KEY_OPTIONS = [
    { value: '', label: t.admin.contents.pageLabels.allPages },
    { value: 'home', label: t.admin.contents.pageLabels.home },
    { value: 'about', label: t.admin.contents.pageLabels.about },
    { value: 'solutions', label: t.admin.contents.pageLabels.solutions },
    { value: 'program', label: t.admin.contents.pageLabels.program },
    { value: 'community', label: t.admin.contents.pageLabels.community },
    { value: 'contact', label: t.admin.contents.pageLabels.contact },
  ];

  const PAGE_KEY_LABELS: Record<string, string> = {
    home: t.admin.contents.pageLabels.home,
    about: t.admin.contents.pageLabels.about,
    solutions: t.admin.contents.pageLabels.solutions,
    program: t.admin.contents.pageLabels.program,
    community: t.admin.contents.pageLabels.community,
    contact: t.admin.contents.pageLabels.contact,
  };

  const [contents, setContents] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [pageFilter, setPageFilter] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [publishedFilter, setPublishedFilter] = useState<string>('');

  // Form modal
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ContentForm>(EMPTY_FORM);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // Image upload
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState<ContentItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Success toast
  const [toast, setToast] = useState('');

  /* ── Fetch Contents ── */
  const fetchContents = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (pageFilter) params.set('page', pageFilter);

      const res = await fetch(
        `${getApiBase()}/api/admin/contents?${params.toString()}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (!res.ok) throw new Error(t.admin.contents.fetchError);
      const json = await res.json();
      setContents(json.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t.admin.common.errorOccurred);
    } finally {
      setLoading(false);
    }
  }, [token, pageFilter, t]);

  useEffect(() => {
    fetchContents();
  }, [fetchContents]);

  /* ── Filtered contents ── */
  const filteredContents = contents.filter((item) => {
    if (publishedFilter === 'published' && !item.is_published) return false;
    if (publishedFilter === 'draft' && item.is_published) return false;
    if (search) {
      const q = search.toLowerCase();
      const matchTitle =
        item.title_ko?.toLowerCase().includes(q) ||
        item.title_en?.toLowerCase().includes(q);
      const matchKey =
        item.page_key.toLowerCase().includes(q) ||
        item.section_key.toLowerCase().includes(q);
      const matchBody =
        item.body_ko?.toLowerCase().includes(q) ||
        item.body_en?.toLowerCase().includes(q);
      if (!matchTitle && !matchKey && !matchBody) return false;
    }
    return true;
  });

  /* ── Search ── */
  const handleSearch = () => {
    setSearch(searchInput);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  /* ── Toast ── */
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  /* ── Open create form ── */
  const openCreateForm = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError('');
    setFormOpen(true);
  };

  /* ── Open edit form ── */
  const openEditForm = (item: ContentItem) => {
    setEditingId(item.id);
    setForm({
      page_key: item.page_key,
      section_key: item.section_key,
      title_ko: item.title_ko || '',
      title_en: item.title_en || '',
      body_ko: item.body_ko || '',
      body_en: item.body_en || '',
      image_url: item.image_url || '',
      sort_order: item.sort_order,
      is_published: item.is_published,
    });
    setFormError('');
    setFormOpen(true);
  };

  /* ── Close form ── */
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

    // Validate file type
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowed.includes(file.type)) {
      setFormError(t.admin.common.uploadFormats);
      return;
    }
    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setFormError(t.admin.common.uploadFormats);
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
        const errData = await res.json().catch(() => ({ error: t.admin.contents.saveError }));
        throw new Error(errData.error || t.admin.contents.saveError);
      }
      const json = await res.json();
      setForm((prev) => ({ ...prev, image_url: json.data.url }));
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : t.admin.common.errorOccurred);
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  /* ── Remove image ── */
  const handleRemoveImage = () => {
    setForm((prev) => ({ ...prev, image_url: '' }));
  };

  /* ── Submit form (create/update) ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    // Validation
    if (!form.page_key.trim()) {
      setFormError(t.admin.contents.pageKeyRequired);
      return;
    }
    if (!form.section_key.trim()) {
      setFormError(t.admin.contents.sectionKeyRequired);
      return;
    }

    setFormLoading(true);
    setFormError('');

    const body = {
      page_key: form.page_key.trim(),
      section_key: form.section_key.trim(),
      title_ko: form.title_ko.trim() || null,
      title_en: form.title_en.trim() || null,
      body_ko: form.body_ko.trim() || null,
      body_en: form.body_en.trim() || null,
      image_url: form.image_url.trim() || null,
      sort_order: form.sort_order === '' ? undefined : Number(form.sort_order),
      is_published: form.is_published,
    };

    try {
      const url = editingId
        ? `${getApiBase()}/api/admin/contents/${editingId}`
        : `${getApiBase()}/api/admin/contents`;
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
        const errData = await res.json().catch(() => ({ error: t.admin.contents.saveError }));
        throw new Error(errData.error || t.admin.contents.saveError);
      }

      closeForm();
      fetchContents();
      showToast(editingId ? t.admin.contents.contentModified : t.admin.contents.contentCreated);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : t.admin.common.errorOccurred);
    } finally {
      setFormLoading(false);
    }
  };

  /* ── Delete ── */
  const handleDelete = async () => {
    if (!deleteTarget || !token) return;
    setDeleting(true);
    try {
      const res = await fetch(
        `${getApiBase()}/api/admin/contents/${deleteTarget.id}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: t.admin.contents.deleteError }));
        throw new Error(errData.error || t.admin.contents.deleteError);
      }
      setDeleteTarget(null);
      fetchContents();
      showToast(t.admin.contents.contentDeleted);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : t.admin.common.errorOccurred);
    } finally {
      setDeleting(false);
    }
  };

  /* ── Toggle publish ── */
  const handleTogglePublish = async (item: ContentItem) => {
    if (!token) return;
    try {
      const res = await fetch(
        `${getApiBase()}/api/admin/contents/${item.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ is_published: !item.is_published }),
        },
      );
      if (!res.ok) throw new Error(t.admin.contents.statusChangeError);
      fetchContents();
      showToast(item.is_published ? t.admin.contents.madePrivate : t.admin.contents.madePublic);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : t.admin.common.errorOccurred);
    }
  };

  // Lock body scroll when form/modal is open
  useEffect(() => {
    if (formOpen || deleteTarget) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [formOpen, deleteTarget]);

  return (
    <div className="max-w-7xl mx-auto">
      {/* ── Page Header ── */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-bark-900">{t.admin.contents.title}</h1>
          <p className="text-sm text-bark-500 mt-1">
            {t.admin.contents.description}
          </p>
        </div>
        <button
          onClick={openCreateForm}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-bark-900 text-white text-sm font-medium
                     rounded-lg hover:bg-bark-800 transition-colors shrink-0"
        >
          <span className="material-icons-outlined text-base">add</span>
          {t.admin.contents.newContent}
        </button>
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
                placeholder={t.admin.contents.searchPlaceholder}
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

          {/* Page filter */}
          <select
            value={pageFilter}
            onChange={(e) => setPageFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-bark-200 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-honey-400 bg-white
                       text-bark-700 min-w-[120px]"
          >
            {PAGE_KEY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Published filter */}
          <select
            value={publishedFilter}
            onChange={(e) => setPublishedFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-bark-200 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-honey-400 bg-white
                       text-bark-700 min-w-[100px]"
          >
            <option value="">{t.admin.common.allStatus}</option>
            <option value="published">{t.admin.common.published}</option>
            <option value="draft">{t.admin.common.draft}</option>
          </select>
        </div>

        {/* Active filters */}
        {(search || pageFilter || publishedFilter) && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-bark-100">
            <span className="text-xs text-bark-400">{t.admin.common.filter}:</span>
            {search && (
              <span className="inline-flex items-center gap-1 text-xs bg-bark-100 text-bark-600 px-2 py-1 rounded-full">
                &quot;{search}&quot;
                <button
                  onClick={() => { setSearch(''); setSearchInput(''); }}
                  className="hover:text-bark-900"
                >
                  <span className="material-icons-outlined text-xs">close</span>
                </button>
              </span>
            )}
            {pageFilter && (
              <span className="inline-flex items-center gap-1 text-xs bg-bark-100 text-bark-600 px-2 py-1 rounded-full">
                {PAGE_KEY_LABELS[pageFilter] || pageFilter}
                <button
                  onClick={() => setPageFilter('')}
                  className="hover:text-bark-900"
                >
                  <span className="material-icons-outlined text-xs">close</span>
                </button>
              </span>
            )}
            {publishedFilter && (
              <span className="inline-flex items-center gap-1 text-xs bg-bark-100 text-bark-600 px-2 py-1 rounded-full">
                {publishedFilter === 'published' ? t.admin.common.published : t.admin.common.draft}
                <button
                  onClick={() => setPublishedFilter('')}
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
                setPageFilter('');
                setPublishedFilter('');
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
          {t.admin.common.totalCount} <span className="font-semibold text-bark-800">{filteredContents.length}</span>{t.admin.common.contents}
        </p>
      </div>

      {/* ── Loading ── */}
      {loading ? (
        <div className="bg-white rounded-xl border border-bark-200 overflow-hidden">
          <div className="animate-pulse">
            <div className="h-12 bg-bark-50 border-b border-bark-200" />
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-bark-100">
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-40 bg-bark-200 rounded" />
                  <div className="h-3 w-64 bg-bark-100 rounded" />
                </div>
                <div className="h-5 w-14 bg-bark-200 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-2 text-sm text-red-700">
          <span className="material-icons-outlined text-lg">error</span>
          {error}
          <button
            onClick={() => { setError(''); fetchContents(); }}
            className="ml-auto text-red-600 hover:text-red-800 font-medium"
          >
            {t.admin.common.retry}
          </button>
        </div>
      ) : filteredContents.length === 0 ? (
        <div className="bg-white rounded-xl border border-bark-200 p-12 text-center">
          <span className="material-icons-outlined text-5xl text-bark-300 mb-3 block">
            article
          </span>
          <p className="text-bark-500 text-sm mb-4">
            {search || pageFilter || publishedFilter
              ? t.admin.contents.noSearchContents
              : t.admin.contents.noContents}
          </p>
          {!search && !pageFilter && !publishedFilter && (
            <button
              onClick={openCreateForm}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium
                         text-bark-700 border border-bark-200 rounded-lg
                         hover:bg-bark-50 transition-colors"
            >
              <span className="material-icons-outlined text-base">add</span>
              {t.admin.contents.firstContent}
            </button>
          )}
        </div>
      ) : (
        /* ── Table ── */
        <div className="bg-white rounded-xl border border-bark-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-bark-50 border-b border-bark-200">
                  <th className="text-left px-5 py-3 font-semibold text-bark-600 whitespace-nowrap">
                    {t.admin.contents.contentInfo}
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-bark-600 whitespace-nowrap hidden md:table-cell">
                    {t.admin.contents.pageSection}
                  </th>
                  <th className="text-center px-5 py-3 font-semibold text-bark-600 whitespace-nowrap hidden lg:table-cell">
                    {t.admin.contents.order}
                  </th>
                  <th className="text-center px-5 py-3 font-semibold text-bark-600 whitespace-nowrap">
                    {t.admin.contents.publishStatus}
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-bark-600 whitespace-nowrap hidden sm:table-cell">
                    {t.admin.contents.modifiedDate}
                  </th>
                  <th className="text-center px-5 py-3 font-semibold text-bark-600 whitespace-nowrap">
                    {t.admin.common.edit}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bark-100">
                {filteredContents.map((item) => (
                  <tr key={item.id} className="hover:bg-bark-50 transition-colors">
                    {/* Content info */}
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {item.image_url ? (
                          <div className="w-10 h-10 rounded-lg bg-bark-100 overflow-hidden shrink-0">
                            <img
                              src={item.image_url}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-bark-100 flex items-center justify-center shrink-0">
                            <span className="material-icons-outlined text-base text-bark-400">
                              article
                            </span>
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-medium text-bark-800 truncate max-w-[240px]">
                            {(locale === 'ko' ? (item.title_ko || item.title_en) : (item.title_en || item.title_ko)) || t.admin.common.noTitle}
                          </p>
                          <p className="text-xs text-bark-400 truncate max-w-[240px] md:hidden">
                            {PAGE_KEY_LABELS[item.page_key] || item.page_key} / {item.section_key}
                          </p>
                          {(locale === 'ko' ? item.body_ko : item.body_en) && (
                            <p className="text-xs text-bark-400 truncate max-w-[240px] hidden sm:block">
                              {(locale === 'ko' ? item.body_ko : item.body_en)!.slice(0, 60)}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Page / Section */}
                    <td className="px-5 py-3 hidden md:table-cell">
                      <div className="flex items-center gap-1.5">
                        <span className="inline-block text-xs font-medium px-2 py-0.5 rounded bg-honey-100 text-honey-700">
                          {PAGE_KEY_LABELS[item.page_key] || item.page_key}
                        </span>
                        <span className="text-bark-400">/</span>
                        <span className="text-xs text-bark-600">{item.section_key}</span>
                      </div>
                    </td>

                    {/* Sort order */}
                    <td className="px-5 py-3 text-center text-bark-500 hidden lg:table-cell">
                      {item.sort_order}
                    </td>

                    {/* Published */}
                    <td className="px-5 py-3 text-center">
                      <button
                        onClick={() => handleTogglePublish(item)}
                        className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full cursor-pointer transition-colors ${
                          item.is_published
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-bark-100 text-bark-500 hover:bg-bark-200'
                        }`}
                      >
                        {item.is_published ? t.admin.common.published : t.admin.common.draft}
                      </button>
                    </td>

                    {/* Updated at */}
                    <td className="px-5 py-3 text-bark-500 whitespace-nowrap hidden sm:table-cell">
                      {formatDateTime(item.updated_at)}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => openEditForm(item)}
                          className="inline-flex items-center gap-1 text-xs text-honey-600 hover:text-honey-700
                                     font-medium px-2 py-1 rounded-md hover:bg-honey-50 transition-colors"
                          title={t.admin.common.edit}
                        >
                          <span className="material-icons-outlined text-sm">edit</span>
                          <span className="hidden sm:inline">{t.admin.common.edit}</span>
                        </button>
                        <button
                          onClick={() => setDeleteTarget(item)}
                          className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-600
                                     font-medium px-2 py-1 rounded-md hover:bg-red-50 transition-colors"
                          title={t.admin.common.delete}
                        >
                          <span className="material-icons-outlined text-sm">delete</span>
                          <span className="hidden sm:inline">{t.admin.common.delete}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Create/Edit Form Modal ── */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40" onClick={closeForm} />

          {/* Drawer */}
          <div className="relative w-full max-w-2xl bg-white shadow-2xl overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-bark-200 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-lg font-bold text-bark-900">
                {editingId ? t.admin.contents.editContent : t.admin.contents.createContent}
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

              {/* Page Key & Section Key */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-bark-700 mb-1.5">
                    {t.admin.contents.pageKey} <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.page_key}
                    onChange={(e) => setForm((prev) => ({ ...prev, page_key: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-bark-200 rounded-lg
                               focus:outline-none focus:ring-2 focus:ring-honey-400 bg-white text-bark-700"
                  >
                    <option value="">{t.admin.contents.selectPage}</option>
                    {PAGE_KEY_OPTIONS.filter((o) => o.value).map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label} ({opt.value})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-bark-700 mb-1.5">
                    {t.admin.contents.sectionKey} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.section_key}
                    onChange={(e) => setForm((prev) => ({ ...prev, section_key: e.target.value }))}
                    placeholder={t.admin.contents.sectionKeyPlaceholder}
                    className="w-full px-3 py-2 text-sm border border-bark-200 rounded-lg
                               focus:outline-none focus:ring-2 focus:ring-honey-400
                               placeholder:text-bark-400"
                  />
                </div>
              </div>

              {/* Title KO */}
              <div>
                <label className="block text-sm font-medium text-bark-700 mb-1.5">
                  {t.admin.contents.titleKo}
                </label>
                <input
                  type="text"
                  value={form.title_ko}
                  onChange={(e) => setForm((prev) => ({ ...prev, title_ko: e.target.value }))}
                  placeholder={t.admin.contents.titleKoPlaceholder}
                  className="w-full px-3 py-2 text-sm border border-bark-200 rounded-lg
                             focus:outline-none focus:ring-2 focus:ring-honey-400
                             placeholder:text-bark-400"
                />
              </div>

              {/* Title EN */}
              <div>
                <label className="block text-sm font-medium text-bark-700 mb-1.5">
                  {t.admin.contents.titleEn}
                </label>
                <input
                  type="text"
                  value={form.title_en}
                  onChange={(e) => setForm((prev) => ({ ...prev, title_en: e.target.value }))}
                  placeholder={t.admin.contents.titleEnPlaceholder}
                  className="w-full px-3 py-2 text-sm border border-bark-200 rounded-lg
                             focus:outline-none focus:ring-2 focus:ring-honey-400
                             placeholder:text-bark-400"
                />
              </div>

              {/* Body KO */}
              <div>
                <label className="block text-sm font-medium text-bark-700 mb-1.5">
                  {t.admin.contents.bodyKo}
                </label>
                <textarea
                  value={form.body_ko}
                  onChange={(e) => setForm((prev) => ({ ...prev, body_ko: e.target.value }))}
                  placeholder={t.admin.contents.bodyKoPlaceholder}
                  rows={4}
                  className="w-full px-3 py-2 text-sm border border-bark-200 rounded-lg
                             focus:outline-none focus:ring-2 focus:ring-honey-400
                             placeholder:text-bark-400 resize-y"
                />
              </div>

              {/* Body EN */}
              <div>
                <label className="block text-sm font-medium text-bark-700 mb-1.5">
                  {t.admin.contents.bodyEn}
                </label>
                <textarea
                  value={form.body_en}
                  onChange={(e) => setForm((prev) => ({ ...prev, body_en: e.target.value }))}
                  placeholder={t.admin.contents.bodyEnPlaceholder}
                  rows={4}
                  className="w-full px-3 py-2 text-sm border border-bark-200 rounded-lg
                             focus:outline-none focus:ring-2 focus:ring-honey-400
                             placeholder:text-bark-400 resize-y"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-bark-700 mb-1.5">
                  {t.admin.contents.image}
                </label>
                {form.image_url ? (
                  <div className="border border-bark-200 rounded-lg p-3">
                    <div className="flex items-start gap-3">
                      <div className="w-24 h-24 rounded-lg bg-bark-100 overflow-hidden shrink-0">
                        <img
                          src={form.image_url}
                          alt=""
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
                            onClick={handleRemoveImage}
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

              {/* Sort Order & Published */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-bark-700 mb-1.5">
                    {t.admin.contents.sortOrder}
                  </label>
                  <input
                    type="number"
                    value={form.sort_order}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        sort_order: e.target.value === '' ? '' : Number(e.target.value),
                      }))
                    }
                    placeholder={t.admin.common.sortOrderAuto}
                    min={0}
                    className="w-full px-3 py-2 text-sm border border-bark-200 rounded-lg
                               focus:outline-none focus:ring-2 focus:ring-honey-400
                               placeholder:text-bark-400"
                  />
                  <p className="text-xs text-bark-400 mt-1">{t.admin.common.sortOrderAuto}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-bark-700 mb-1.5">
                    {t.admin.contents.publishStatus}
                  </label>
                  <div className="flex items-center h-[38px]">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.is_published}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, is_published: e.target.checked }))
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-bark-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-honey-400
                                      rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white
                                      after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                                      after:bg-white after:border-bark-300 after:border after:rounded-full
                                      after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500" />
                      <span className="ml-3 text-sm text-bark-600">
                        {form.is_published ? t.admin.common.published : t.admin.common.draft}
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit buttons */}
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
                      {editingId ? t.admin.common.save : t.admin.common.create}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => !deleting && setDeleteTarget(null)}
          />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
              <span className="material-icons-outlined text-red-500 text-xl">delete</span>
            </div>
            <h3 className="text-lg font-bold text-bark-900 text-center mb-2">
              {t.admin.contents.deleteContent}
            </h3>
            <p className="text-sm text-bark-600 text-center mb-1">
              {t.admin.contents.deleteConfirm}
            </p>
            <div className="bg-bark-50 rounded-lg p-3 mb-4">
              <p className="text-sm font-medium text-bark-800 truncate">
                {(locale === 'ko' ? (deleteTarget.title_ko || deleteTarget.title_en) : (deleteTarget.title_en || deleteTarget.title_ko)) || t.admin.common.noTitle}
              </p>
              <p className="text-xs text-bark-500 mt-0.5">
                {PAGE_KEY_LABELS[deleteTarget.page_key] || deleteTarget.page_key} / {deleteTarget.section_key}
              </p>
            </div>
            <p className="text-xs text-red-500 text-center mb-4">
              {t.admin.common.actionIrreversible}
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="px-4 py-2 text-sm text-bark-600 hover:bg-bark-100 rounded-lg transition-colors"
              >
                {t.admin.common.cancel}
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 text-sm bg-red-600 text-white font-medium rounded-lg
                           hover:bg-red-700 disabled:opacity-50 transition-colors
                           flex items-center gap-2"
              >
                {deleting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {t.admin.common.deleting}
                  </>
                ) : (
                  t.admin.common.delete
                )}
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
