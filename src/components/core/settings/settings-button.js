'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import { useColorScheme } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import { GearSix as GearSixIcon } from '@phosphor-icons/react/dist/ssr/GearSix';

import { config } from '@/config';
import { setSettings as setPersistedSettings } from '@/lib/settings/set-settings';
import { useSettings } from '@/hooks/use-settings';

import { SettingsDrawer } from './settings-drawer';
import { usePathname } from 'next/navigation';

export function SettingsButton() {
  const { settings } = useSettings();
  const { setColorScheme } = useColorScheme();
  const router = useRouter();
  const pathname = usePathname();

  const [openDrawer, setOpenDrawer] = React.useState(false);

  // React.useEffect(async() => {
  //   if (pathname === '/payment') {
  //     setColorScheme('light');
  //     const updatedSettings = { ...settings, colorScheme: 'light' };
  //     await setPersistedSettings(updatedSettings);
  //   } else {
  //     setColorScheme(settings?.colorScheme || 'light');
  //   }
  // }, [pathname]);

  const handleUpdate = async (values) => {
    if (values.colorScheme) {
      setColorScheme(values.colorScheme);
    }

    const updatedSettings = { ...settings, ...values };

    await setPersistedSettings(updatedSettings);

    router.refresh();
  };

  const handleReset = async () => {
    setColorScheme(config.site.colorScheme);

    await setPersistedSettings({});

    router.refresh();
  };

  if (pathname === '/payment') {
    return null;
  }

  return (
    <React.Fragment>
      <Tooltip title="Settings">
        <Box
          component="button"
          onClick={() => {
            setOpenDrawer(true);
          }}
          sx={{
            animation: 'spin 4s linear infinite',
            background: 'var(--mui-palette-neutral-900)',
            border: 'none',
            borderRadius: '50%',
            bottom: 0,
            color: 'var(--mui-palette-common-white)',
            cursor: 'pointer',
            display: 'inline-flex',
            height: '40px',
            m: 4,
            p: '10px',
            position: 'fixed',
            right: 0,
            width: '40px',
            zIndex: 'var(--mui-zIndex-speedDial)',
            '&:hover': { bgcolor: 'var(--mui-palette-neutral-700)' },
            '@keyframes spin': { '0%': { rotate: '0' }, '100%': { rotate: '360deg' } },
          }}
        >
          <GearSixIcon fontSize="var(--icon-fontSize-md)" />
        </Box>
      </Tooltip>
      <SettingsDrawer
        onClose={() => {
          setOpenDrawer(false);
        }}
        onReset={handleReset}
        onUpdate={handleUpdate}
        open={openDrawer}
        values={settings}
      />
    </React.Fragment>
  );
}
