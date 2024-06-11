import * as React from 'react';
import { applyDefaultSettings } from '@/lib/settings/apply-default-settings';
import { getSettings as getPersistedSettings } from '@/lib/settings/get-settings';

import Layout from './clientLayout';

export default async function ServerLayout({ children }) {
  const persistedSettings = await getPersistedSettings();
  const settings = applyDefaultSettings(persistedSettings);

  return <Layout settings={settings}>{children}</Layout>;
}
