import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { Link } from '@/lib/navigation';

export default function HomePage() {
  const t = useTranslations('home');

  return (
    <main className="min-h-screen flex flex-col" style={{ backgroundColor: '#f0efea' }}>
      {/* Top navigation bar */}
      <div className="absolute top-8 z-10 px-8 md:px-12 lg:px-16">
        <div style={{ marginLeft: '10px' }}>
        <div className="flex gap-6 items-center">
          <Link
            href="/chat"
            className="text-base font-medium transition-colors duration-200 hover:opacity-70"
            style={{ color: '#1a1a1a' }}
          >
            {t('cta.startChat')}
          </Link>
          <Link
            href="/documents"
            className="text-base font-medium transition-colors duration-200 hover:opacity-70"
            style={{ color: '#1a1a1a' }}
          >
            {t('cta.manageDocuments')}
          </Link>
        </div>
        </div>
      </div>

      {/* Language switcher - right side of page */}
      <div className="absolute top-8 z-10 px-8 md:px-12 lg:px-16 right-0">
        <div style={{ marginRight: '10px' }}>
          <LanguageSwitcher />
        </div>
      </div>

      <div className="container mx-auto px-8 md:px-12 lg:px-16 pb-16 md:pb-24 max-w-7xl flex-grow" style={{ paddingTop: '15vh' }}>
        <div className="max-w-5xl mx-auto">
          {/* Hero section */}
          <div className="mb-16 md:mb-24" style={{ marginLeft: '10px' }}>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 md:mb-10 leading-tight" style={{ color: '#1a1a1a', letterSpacing: '-0.02em' }}>
              {t('title')}
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl mb-8 leading-relaxed" style={{ color: '#1a1a1a', lineHeight: '1.5' }}>
              {t('subtitle')}
            </p>
            <p className="text-xl md:text-2xl lg:text-3xl max-w-4xl leading-relaxed" style={{ color: '#1a1a1a', lineHeight: '1.5' }}>
              {t('description')}
            </p>
          </div>

          {/* CTA button */}
          <div className="absolute left-1/2 transform -translate-x-1/2 mt-16 md:mt-24">
            <Link
              href="/chat"
              className="py-4 md:py-5 rounded-lg font-medium transition-colors duration-200"
              style={{ backgroundColor: '#1a1a1a', color: '#ffffff', fontSize: '1.625rem', paddingLeft: '3.36rem', paddingRight: '3.36rem' }}
            >
              {t('cta.startChat')}
            </Link>
          </div>
        </div>
      </div>

      {/* Footer - Bottom of page, horizontally centered */}
      <footer className="w-full py-8 text-sm text-center" style={{ color: '#8c8c8c' }}>
        <p>{t('footer.poweredBy')}</p>
      </footer>
    </main>
  );
}
