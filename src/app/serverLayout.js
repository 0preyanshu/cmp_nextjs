import * as React from 'react';
import { applyDefaultSettings } from '@/lib/settings/apply-default-settings';
import { getSettings as getPersistedSettings } from '@/lib/settings/get-settings';
import ClientLayout from './clientLayout';
import { UserProvider } from '@/contexts/auth/user-context';
import { SettingsProvider } from '@/contexts/settings';
import { Analytics } from '@/components/core/analytics';
import { I18nProvider } from '@/components/core/i18n-provider';
import { LocalizationProvider } from '@/components/core/localization-provider';
import { ThemeProvider } from '@/components/core/theme-provider/theme-provider';
import { SettingsButton } from '@/components/core/settings/settings-button';
import { Toaster } from '@/components/core/toaster';
import '@/styles/global.css';
import { config } from '@/config';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: config.site.themeColor,
};

export default async function ServerLayout({ children }) {
  const persistedSettings = await getPersistedSettings();
  const settings = applyDefaultSettings(persistedSettings);

  return (
    <html data-mui-color-scheme={settings?.colorScheme} lang="en">
      <body>
        <Analytics>
          <LocalizationProvider>
            <UserProvider>
              <SettingsProvider settings={settings}>
                <I18nProvider language="en">
                  <ThemeProvider>
                    <ClientLayout>{children}</ClientLayout>
                    <SettingsButton />
                    <Toaster position="bottom-right" />
                  </ThemeProvider>
                </I18nProvider>
              </SettingsProvider>
            </UserProvider>
          </LocalizationProvider>
        </Analytics>
      </body>
    </html>
  );
}
