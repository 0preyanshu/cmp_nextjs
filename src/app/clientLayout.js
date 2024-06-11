'use client';
import * as React from 'react';

import '@/styles/global.css';

import { config } from '@/config';
import { UserProvider } from '@/contexts/auth/user-context';
import { SettingsProvider } from '@/contexts/settings';
import { Analytics } from '@/components/core/analytics';
import { I18nProvider } from '@/components/core/i18n-provider';
import { LocalizationProvider } from '@/components/core/localization-provider';
import { SettingsButton } from '@/components/core/settings/settings-button';
import { ThemeProvider } from '@/components/core/theme-provider/theme-provider';
import { Toaster } from '@/components/core/toaster';
import { Provider as ReduxProvider } from 'react-redux';
import {persistStore} from 'redux-persist';
import {store} from '@/redux/store';
import {PersistGate} from 'redux-persist/integration/react';



export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: config.site.themeColor,
};

export default function Layout({ settings, children }) {
  let persistor = persistStore(store);
  return (
    <html data-mui-color-scheme={settings.colorScheme} lang="en">
      <body>
        <Analytics>
          <ReduxProvider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <LocalizationProvider>
                <UserProvider>
                  <SettingsProvider settings={settings}>
                    <I18nProvider language="en">
                      <ThemeProvider>
                        {children}
                        <SettingsButton />
                        <Toaster position="bottom-right" />
                      </ThemeProvider>
                    </I18nProvider>
                  </SettingsProvider>
                </UserProvider>
              </LocalizationProvider>
            </PersistGate>
          </ReduxProvider>
        </Analytics>
      </body>
    </html>
  );
}
