'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/context/LanguageContext';

/* ─── Menu items ─── */
interface MenuItem {
  href: string;
  labelKey: 'dashboard' | 'users' | 'contents' | 'programs' | 'enrollments' | 'stats';
  icon: string;
  exact?: boolean;
}

const MENU_ITEMS: MenuItem[] = [
  { href: '/admin', labelKey: 'dashboard', icon: 'dashboard', exact: true },
  { href: '/admin/users', labelKey: 'users', icon: 'people' },
  { href: '/admin/contents', labelKey: 'contents', icon: 'article' },
  { href: '/admin/programs', labelKey: 'programs', icon: 'school' },
  { href: '/admin/enrollments', labelKey: 'enrollments', icon: 'receipt_long' },
  { href: '/admin/stats', labelKey: 'stats', icon: 'bar_chart' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string, exact?: boolean) => {
    if (!pathname) return false;
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo / Brand */}
      <div className="flex items-center gap-2 px-4 h-16 border-b border-bark-700/50 shrink-0">
        <Link href="/admin" className="flex items-center gap-2 min-w-0">
          <span className="material-icons-outlined text-honey-400 text-2xl shrink-0">hexagon</span>
          {!collapsed && (
            <span className="text-white font-bold text-base tracking-tight truncate">
              BeeOn<span className="text-honey-400">Farm</span>
              <span className="text-bark-400 text-xs font-normal ml-1.5">Admin</span>
            </span>
          )}
        </Link>
        {/* Collapse toggle — desktop only */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex ml-auto text-bark-400 hover:text-white transition-colors p-1 rounded"
          aria-label={collapsed ? t.admin.sidebar.expandSidebar : t.admin.sidebar.collapseSidebar}
        >
          <span className="material-icons-outlined text-lg">
            {collapsed ? 'chevron_right' : 'chevron_left'}
          </span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1" aria-label={t.admin.sidebar.adminMenu}>
        {MENU_ITEMS.map((item) => {
          const active = isActive(item.href, item.exact);
          const label = t.admin.sidebar[item.labelKey];
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                active
                  ? 'bg-honey-400/15 text-honey-400'
                  : 'text-bark-300 hover:bg-bark-800/60 hover:text-white'
              }`}
              title={collapsed ? label : undefined}
            >
              <span
                className={`material-icons-outlined text-xl shrink-0 transition-colors ${
                  active ? 'text-honey-400' : 'text-bark-400 group-hover:text-bark-200'
                }`}
              >
                {item.icon}
              </span>
              {!collapsed && <span className="truncate">{label}</span>}
              {active && !collapsed && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-honey-400 shrink-0" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User info / Logout */}
      <div className="border-t border-bark-700/50 px-3 py-3 shrink-0">
        {!collapsed && user && (
          <div className="flex items-center gap-2 px-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-honey-400/20 flex items-center justify-center shrink-0">
              <span className="material-icons-outlined text-honey-400 text-sm">person</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm text-white font-medium truncate">{user.name}</p>
              <p className="text-xs text-bark-400 truncate">{user.email}</p>
            </div>
          </div>
        )}
        <div className="flex gap-1">
          <Link
            href="/"
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-bark-400 hover:text-white hover:bg-bark-800/60 transition-colors ${
              collapsed ? 'justify-center flex-1' : ''
            }`}
            title={t.admin.common.goToSite}
          >
            <span className="material-icons-outlined text-lg">open_in_new</span>
            {!collapsed && <span>{t.admin.common.goToSite}</span>}
          </Link>
          <button
            onClick={logout}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-bark-400 hover:text-red-400 hover:bg-red-400/10 transition-colors ${
              collapsed ? 'justify-center flex-1' : ''
            }`}
            title={t.admin.common.logout}
          >
            <span className="material-icons-outlined text-lg">logout</span>
            {!collapsed && <span>{t.admin.common.logout}</span>}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile menu button — visible only on small screens */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-3 left-3 z-50 bg-bark-900 text-white p-2 rounded-lg shadow-lg border border-bark-700/50"
        aria-label={t.admin.sidebar.openMenu}
      >
        <span className="material-icons-outlined text-xl">menu</span>
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-bark-900 transform transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-3 right-3 text-bark-400 hover:text-white p-1"
          aria-label={t.admin.sidebar.closeMenu}
        >
          <span className="material-icons-outlined text-xl">close</span>
        </button>
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:block shrink-0 bg-bark-900 border-r border-bark-700/50 transition-all duration-300 ${
          collapsed ? 'w-16' : 'w-60'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
