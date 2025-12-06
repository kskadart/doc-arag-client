import createMiddleware from 'next-intl/middleware';

import { defaultLocale, locales } from './i18n';

const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale,

  // Always use locale prefix
  localePrefix: 'always',
});

// Next.js 16+ requires named export 'proxy' instead of 'middleware'
export const proxy = intlMiddleware;

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(ru|en)/:path*'],
};
