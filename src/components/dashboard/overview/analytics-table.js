'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { CheckCircle as CheckCircleIcon } from '@phosphor-icons/react/dist/ssr/CheckCircle';
import { Clock as ClockIcon } from '@phosphor-icons/react/dist/ssr/Clock';
import { Minus as MinusIcon } from '@phosphor-icons/react/dist/ssr/Minus';
import { PencilSimple as PencilSimpleIcon } from '@phosphor-icons/react/dist/ssr/PencilSimple';
import {TrashSimple as TrashSimpleIcon} from '@phosphor-icons/react/dist/ssr/TrashSimple';

import { paths } from '@/paths';
import { dayjs } from '@/lib/dayjs';
import { DataTable } from '@/components/core/data-table';


import { useDispatch } from 'react-redux';

import { toast } from '@/components/core/toaster';
import { useRouter } from 'next/navigation';
import { CoursesActions } from '@/redux/slices';


// import RouterLink from 'next/link';











export function AnalyticsTable({ rows }) {

  const dispatch = useDispatch();
  const router = useRouter();

  const { updateCourses} = CoursesActions;

  const columns = [
    {
      formatter: (row) => (
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', marginLeft: 1 }}>
          <div>
            <Link>
              {row.courseName}
            </Link>
          </div>
        </Stack>
      ),
      name: 'Course',
      width: '250px',
    },
    {
      formatter(row) {
        return (
          <div style={{ marginLeft: 3 }}>
            {row.orders}
          </div>
        );
      },
      name: 'Orders',
      width: '100px',
    },
    {
      formatter(row) {
        return (
          <div style={{ marginLeft: 3 }}>
            {row.internalOrder}
          </div>
        );
      },
      name: 'Internal',
      width: '100px',
    },
    {
      formatter(row) {
        return (
          <div style={{ marginLeft: 3 }}>
            {row.vendorOrder}
          </div>
        );
      },
      name: 'Vendor',
      width: '100px',
    },
    {
      formatter(row) {
        return (
          <div style={{ marginLeft: 3, fontWeight: 'bold' }}>
            {'$' + (row.orderTotal || '0')}
          </div>
        );
      },
      name: 'Total',
      width: '150px',
    },
    {
      formatter(row) {
        return (
          <div style={{ marginLeft: 3 }}>
            {row.abandons}
          </div>
        );
      },
      name: 'Abandoned',
      width: '100px',
    },
    {
      formatter(row) {
        return (
          <div style={{ marginLeft: 3 }}>
            {row.waiting}
          </div>
        );
      },
      name: 'Waitlist',
      width: '100px',
    },
  ];
  
  


 

  return (
    <React.Fragment>
      {console.log(rows,"rows")}
      <DataTable
        columns={columns}

        
        rows={rows}
      
       
      />
      {!rows.length ? (
        <Box sx={{ p: 3 }}>
          <Typography color="text.secondary" sx={{ textAlign: 'center' }} variant="body2">
            No Data
          </Typography>
        </Box>
      ) : null}
    </React.Fragment>
  );
}
