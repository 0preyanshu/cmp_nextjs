'use client';
import * as React from 'react';
import RouterLink from 'next/link';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ArrowLeft as ArrowLeftIcon } from '@phosphor-icons/react/dist/ssr/ArrowLeft';

import { config } from '@/config';
import { paths } from '@/paths';
import {MessageDisplay } from '@/components/dashboard/emaillogs/cities-create-form';
import {Button} from '@mui/material';
import {useRouter} from 'next/navigation';

// export const metadata = { title: `Create | Customers | Dashboard | ${config.site.name}` };

export default function Page() {
  const router = useRouter();
  return (
    <Box
      sx={{
        maxWidth: 'var(--Content-maxWidth)',
        m: 'var(--Content-margin)',
        p: 'var(--Content-padding)',
        width: 'var(--Content-width)',
      }}
    >
      {/* onClick={() => router.back()}  */}
      <Stack spacing={4}>
        <Stack spacing={3}>
        <div>
        <Box
        onClick={() => router.back()}
        sx={{ alignItems: 'center', display: 'inline-flex', gap: 1, cursor: 'pointer', mb: 2 }}
      >
        <ArrowLeftIcon fontSize="var(--icon-fontSize-md)" />
        <Typography variant="subtitle2" color="text.primary">
          back
        </Typography>
      </Box>
          </div>
          <div>
            <Typography variant="h5">View Message</Typography>
          </div>
        </Stack>
        <MessageDisplay />
      </Stack>
    </Box>
  );
}
