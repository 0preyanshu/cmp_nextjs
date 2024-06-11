import * as React from 'react';
;
import Box from '@mui/material/Box';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
;

import { config } from '@/config';
;
import { CompanyCreateForm } from '@/components/dashboard/company/company-create-form';

export const metadata = { title: `Create | Companys | Dashboard | ${config.site.name}` };

export default function Page() {
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
          </div>
          <div>
            <Typography variant="h5">Save Changes</Typography>
          </div>
        </Stack>
        <CompanyCreateForm />
      </Stack>
    </Box>
  );
}
