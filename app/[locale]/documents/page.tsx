'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Home, Upload } from 'lucide-react';
import { DocumentList } from '@/components/documents/DocumentList';
import { DocumentUpload } from '@/components/documents/DocumentUpload';
import { Modal } from '@/components/ui/Modal';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { Link } from '@/lib/navigation';

export default function DocumentsPage() {
  const t = useTranslations('documents');
  const tCommon = useTranslations('common');
  
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadComplete = () => {
    setShowUploadModal(false);
    setRefreshTrigger(prev => prev + 1); // Trigger document list refresh
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f0efea' }}>
      {/* Header */}
      <div className="border-b sticky top-0 z-10" style={{ backgroundColor: '#f0efea', borderColor: '#e0e0e0' }}>
        <div className="container mx-auto px-8 md:px-12 lg:px-16 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link
                href="/"
                className="p-2 rounded-lg transition-colors duration-200 hover:opacity-70"
                style={{ color: '#1a1a1a' }}
                title={tCommon('home')}
              >
                <Home className="w-5 h-5" />
              </Link>
              <h1 className="text-2xl font-semibold" style={{ color: '#1a1a1a' }}>
                {t('title')}
              </h1>
            </div>
            <div className="flex items-center gap-6">
              <LanguageSwitcher />
              <Link
                href="/chat"
                className="py-2 rounded-lg font-medium transition-colors duration-200 hover:opacity-90"
                style={{ backgroundColor: '#1a1a1a', color: '#ffffff', paddingLeft: '1.575rem', paddingRight: '1.575rem' }}
              >
                {t('goToChat')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-8 md:px-12 lg:px-16 py-12">
        {/* Upload button */}
        <div className="mb-12 flex justify-center">
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-3 py-4 rounded-lg text-lg font-semibold transition-colors duration-200 hover:opacity-90"
            style={{ backgroundColor: '#1a1a1a', color: '#ffffff', paddingLeft: '2.625rem', paddingRight: '2.625rem' }}
          >
            <Upload className="w-6 h-6" />
            {t('uploadButton')}
          </button>
        </div>

        {/* Document list */}
        <DocumentList refreshTrigger={refreshTrigger} />
      </div>

      {/* Upload modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title={t('upload.title')}
        className="max-w-3xl"
      >
        <DocumentUpload onUploadComplete={handleUploadComplete} />
      </Modal>

      {/* Floating action button for mobile */}
      <button
        onClick={() => setShowUploadModal(true)}
        className="fixed bottom-6 right-6 rounded-full transition-all duration-200 hover:opacity-90 flex items-center justify-center md:hidden"
        style={{ backgroundColor: '#1a1a1a', color: '#ffffff', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)', width: '4.2rem', height: '4.2rem' }}
        title={t('uploadButton')}
      >
        <Upload className="w-7 h-7" />
      </button>
    </div>
  );
}
