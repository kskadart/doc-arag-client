'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { locales, type Locale } from '@/i18n';
import { Languages } from 'lucide-react';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: Locale) => {
    // Remove current locale from pathname
    const pathWithoutLocale = pathname.replace(`/${locale}`, '');
    // Navigate to same path with new locale
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  const getLanguageName = (locale: string) => {
    const names: Record<string, string> = {
      en: 'English',
      ru: 'Русский',
    };
    return names[locale] || locale;
  };

  return (
    <div className="relative inline-block">
      <button
        className="flex items-center gap-2 py-2 rounded-full transition-all duration-200 hover:opacity-70"
        style={{ backgroundColor: '#f0efea', color: '#1a1a1a', paddingLeft: '1.05rem', paddingRight: '1.05rem' }}
        onClick={() => {
          const currentIndex = locales.indexOf(locale as Locale);
          const nextIndex = (currentIndex + 1) % locales.length;
          switchLocale(locales[nextIndex]);
        }}
        title={`Switch to ${getLanguageName(locales[(locales.indexOf(locale as Locale) + 1) % locales.length])}`}
      >
        <Languages className="w-5 h-5" />
        <span className="text-sm font-medium">{getLanguageName(locale)}</span>
      </button>
    </div>
  );
}
