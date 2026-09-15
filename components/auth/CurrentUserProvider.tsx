'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

import { apiClient } from '@/lib/api';
import { MeResponse } from '@/lib/types';

interface CurrentUserState {
  // null while loading or when /me could not be reached
  user: MeResponse | null;
  loading: boolean;
}

const CurrentUserContext = createContext<CurrentUserState>({ user: null, loading: true });

// Fetches /me once per page load so every header can show the user and the
// admin-only parts can hide themselves. The backend enforces the rules anyway;
// this only shapes the UI.
export function CurrentUserProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<CurrentUserState>({ user: null, loading: true });

  useEffect(() => {
    let cancelled = false;

    apiClient
      .me()
      .then((user) => {
        if (!cancelled) setState({ user, loading: false });
      })
      .catch(() => {
        if (!cancelled) setState({ user: null, loading: false });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return <CurrentUserContext.Provider value={state}>{children}</CurrentUserContext.Provider>;
}

export function useCurrentUser(): CurrentUserState {
  return useContext(CurrentUserContext);
}
