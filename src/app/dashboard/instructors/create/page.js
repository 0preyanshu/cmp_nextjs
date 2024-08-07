'use client'
import * as React from 'react';
import RouterLink from 'next/link';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ArrowLeft as ArrowLeftIcon } from '@phosphor-icons/react/dist/ssr/ArrowLeft';

import { config } from '@/config';
import { paths } from '@/paths';
import { InstructorsCreateForm } from '@/components/dashboard/instructors/instructors-create-form';
import  PriviledgeForbidden  from '@/components/core/priviledgeForbidden';
import { useUserPrivileges } from '@/hooks/use-privilages';

// export const metadata = { title: `Create | Customers | Dashboard | ${config.site.name}` };

export default function Page() {
  const userPrivileges = useUserPrivileges();
  return (
    <Box
      sx={{
        maxWidth: 'var(--Content-maxWidth)',
        m: 'var(--Content-margin)',
        p: 'var(--Content-padding)',
        width: 'var(--Content-width)',
      }}
    >
      <Stack spacing={4}>
        <Stack spacing={3}>
          <div>
            <Link
              color="text.primary"
              component={RouterLink}
              href={paths.dashboard.instructors.list}
              sx={{ alignItems: 'center', display: 'inline-flex', gap: 1 }}
              variant="subtitle2"
            >
              <ArrowLeftIcon fontSize="var(--icon-fontSize-md)" />
              back
            </Link>
          </div>
          <div>
            <Typography variant="h5">Create Instructor</Typography>
          </div>
        </Stack>
        {!userPrivileges['Add Instructor'] && <PriviledgeForbidden action={'Add Instructor'} ></PriviledgeForbidden>}
        {userPrivileges['Add Instructor'] && <InstructorsCreateForm />}
      </Stack>
    </Box>
  );
}
