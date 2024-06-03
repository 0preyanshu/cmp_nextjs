'use client'
import * as React from 'react';
import RouterLink from 'next/link';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ArrowLeft as ArrowLeftIcon } from '@phosphor-icons/react/dist/ssr/ArrowLeft';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';

import { config } from '@/config';
import { paths } from '@/paths';
import { CustomerCreateForm } from '@/components/dashboard/company/course-categories-create-form';

import { useDispatch } from 'react-redux';
import { CompanyActions } from '../../../../redux/slices';

// export const metadata = { title: `Create | Customers | Dashboard | ${config.site.name}` };

export default function Page() {

  const [currentCompany, setCurrentCompany] = useState({});
  const dispatch = useDispatch();

  const { deletecompanies, fetchCompanies } = CompanyActions;


  const { allCompanies } = useSelector((state) => state?.company?.companies);

  useEffect(() => {
    if (allCompanies) {
      setCurrentCompany(allCompanies);
    }
  }, [allCompanies]);

  useEffect(() => {
    const data = {
      page: 1,
      limit: 10,
    };

dispatch(fetchCompanies(data))

    
}, [])

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
            <Typography variant="h5">Edit Company</Typography>
          </div>
        </Stack>
        <CustomerCreateForm currentCompany={currentCompany}/>
      </Stack>
    </Box>
  );
}
