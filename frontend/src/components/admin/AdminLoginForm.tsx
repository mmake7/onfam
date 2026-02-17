'use client';

import { useState, type FormEvent } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/context/LanguageContext';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';

export default function AdminLoginForm() {
  const { login } = useAuth();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.admin.common.errorOccurred);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bark-100 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="material-icons-outlined text-honey-500 text-4xl">hexagon</span>
            <span className="text-2xl font-bold text-bark-900">
              BeeOn<span className="text-honey-500">Farm</span>
            </span>
          </div>
          <p className="text-bark-500 text-sm">{t.admin.login.title}</p>
        </div>

        {/* Login Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg shadow-bark-200/50 border border-bark-200 p-8"
        >
          {error && (
            <div className="mb-4 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              <span className="material-icons-outlined text-lg mt-0.5 shrink-0">error</span>
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-bark-700 mb-1.5">
                {t.admin.login.emailLabel}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-icons-outlined text-bark-400 text-lg">
                  mail
                </span>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.admin.login.emailPlaceholder}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-bark-300 bg-bark-50 text-bark-800 placeholder:text-bark-400 focus:outline-none focus:ring-2 focus:ring-honey-400 focus:border-honey-400 transition-colors"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-bark-700 mb-1.5">
                {t.admin.login.passwordLabel}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-icons-outlined text-bark-400 text-lg">
                  lock
                </span>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.admin.login.passwordPlaceholder}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-bark-300 bg-bark-50 text-bark-800 placeholder:text-bark-400 focus:outline-none focus:ring-2 focus:ring-honey-400 focus:border-honey-400 transition-colors"
                  autoComplete="current-password"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full py-2.5 bg-honey-400 text-bark-900 font-semibold rounded-lg hover:bg-honey-300 focus:outline-none focus:ring-2 focus:ring-honey-400 focus:ring-offset-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-bark-900/30 border-t-bark-900 rounded-full animate-spin" />
                {t.admin.login.loggingIn}
              </>
            ) : (
              t.admin.login.submit
            )}
          </button>
        </form>

        <div className="flex items-center justify-center mt-6">
          <LanguageSwitcher className="text-bark-500" />
        </div>
      </div>
    </div>
  );
}
