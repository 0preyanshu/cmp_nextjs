'use client';

import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';
import { usePathname } from 'next/navigation';
import { useSettings } from '@/hooks/use-settings';
import { createTheme } from '@/styles/theme/create-theme';

import EmotionCache from './emotion-cache';
import { Rtl } from './rtl';

export function ThemeProvider({ children }) {
  const { settings } = useSettings();
  const pathname = usePathname();

  const isPaymentPage = pathname === '/payment';
  const primaryColor = isPaymentPage ? 'tomatoOrange' : settings.primaryColor;
  const colorScheme = isPaymentPage ? 'light' : settings.colorScheme || 'light';

  const theme = createTheme({
    primaryColor,
    colorScheme,
    direction: settings.direction,
  });

  console.log("theme", {
    primaryColor,
    colorScheme,
    direction: settings.direction,
  });

  return (
    <EmotionCache options={{ key: 'mui' }}>
      <CssVarsProvider defaultColorScheme={colorScheme} defaultMode={colorScheme} theme={theme}>
        <CssBaseline />
        <Rtl direction={settings.direction}>{children}</Rtl>
      </CssVarsProvider>
    </EmotionCache>
  );
}
