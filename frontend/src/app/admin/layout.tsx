'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/context/LanguageContext';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminLoginForm from '@/components/admin/AdminLoginForm';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAdmin, logout } = useAuth();
  const { t } = useTranslation();

  /* Loading state — show spinner while restoring session */
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bark-100">
        <div className="flex flex-col items-center gap-3">
          <span className="w-8 h-8 border-3 border-honey-400/30 border-t-honey-400 rounded-full animate-spin" />
          <span className="text-sm text-bark-500">{t.admin.common.loading}</span>
        </div>
      </div>
    );
  }

  /* Not logged in — show login form */
  if (!user) {
    return <AdminLoginForm />;
  }

  /* Logged in but not admin — show access denied */
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bark-100 px-4">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <span className="material-icons-outlined text-red-500 text-3xl">block</span>
          </div>
          <h1 className="text-xl font-bold text-bark-900 mb-2">{t.admin.layout.accessDenied}</h1>
          <p className="text-bark-500 text-sm mb-6">
            {t.admin.layout.accessDeniedDesc}
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/"
              className="px-5 py-2.5 text-sm font-medium text-bark-600 bg-bark-200 rounded-lg hover:bg-bark-300 transition-colors"
            >
              {t.admin.layout.goHome}
            </Link>
            <button
              onClick={logout}
              className="px-5 py-2.5 text-sm font-medium text-white bg-bark-800 rounded-lg hover:bg-bark-700 transition-colors"
            >
              {t.admin.layout.loginOther}
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* Admin authenticated — render dashboard layout */
  return (
    <div className="flex min-h-screen bg-bark-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-bark-200 flex items-center justify-between px-4 lg:px-6 shrink-0">
          {/* Left spacer for mobile menu button */}
          <div className="lg:hidden w-10" />
          <div className="hidden lg:block" />

          {/* Right side — language switcher + admin info */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher compact className="text-bark-600" />
            <div className="w-px h-5 bg-bark-200" />
            <span className="text-sm text-bark-500 hidden sm:inline">
              {t.admin.layout.greeting} <span className="font-medium text-bark-700">{user.name}</span>{t.admin.layout.greetingSuffix}
            </span>
            <div className="w-8 h-8 rounded-full bg-honey-100 flex items-center justify-center">
              <span className="material-icons-outlined text-honey-600 text-sm">person</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-3 sm:p-4 lg:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
