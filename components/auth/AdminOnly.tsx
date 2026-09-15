'use client';

import React from 'react';

import { useCurrentUser } from '@/components/auth/CurrentUserProvider';

// Renders its children for administrators only. While /me is loading nothing
// is shown (no flash of a link the user may not follow); when /me failed the
// children are shown, the backend still refuses what the user may not do.
export function AdminOnly({ children }: { children: React.ReactNode }) {
  const { user, loading } = useCurrentUser();

  if (loading) return null;
  if (user && !user.is_admin) return null;

  return <>{children}</>;
}
