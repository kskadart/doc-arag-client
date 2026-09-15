'use client';

import { useTranslations } from 'next-intl';

import { LogOut } from 'lucide-react';

import { useCurrentUser } from '@/components/auth/CurrentUserProvider';
import { logoutUrl } from '@/lib/auth';

// Signed-in user's name and a sign-out button. Hidden when the deployment
// runs without authentication (backend AUTH_MODE=none).
export function UserMenu() {
  const t = useTranslations('auth');
  const { user } = useCurrentUser();

  if (!user || user.auth_mode === 'none') return null;

  const name = user.display_name || user.username;

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium" style={{ color: '#1a1a1a' }} title={user.username}>
        {name}
      </span>
      <button
        type="button"
        onClick={() => {
          window.location.href = logoutUrl();
        }}
        className="flex items-center gap-2 py-2 rounded-full transition-all duration-200 hover:opacity-70"
        style={{
          backgroundColor: '#f0efea',
          color: '#1a1a1a',
          paddingLeft: '1.05rem',
          paddingRight: '1.05rem',
        }}
        title={t('signOut')}
      >
        <LogOut className="w-5 h-5" />
        <span className="text-sm font-medium">{t('signOut')}</span>
      </button>
    </div>
  );
}
