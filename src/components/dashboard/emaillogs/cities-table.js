'use client';

import * as React from 'react';
import RouterLink from 'next/link';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { CheckCircle as CheckCircleIcon } from '@phosphor-icons/react/dist/ssr/CheckCircle';

import { Minus as MinusIcon } from '@phosphor-icons/react/dist/ssr/Minus';
import { PencilSimple as PencilSimpleIcon } from '@phosphor-icons/react/dist/ssr/PencilSimple';
import {TrashSimple as TrashSimpleIcon} from '@phosphor-icons/react/dist/ssr/TrashSimple';
import { Eye } from '@phosphor-icons/react/dist/ssr/Eye';

import { paths } from '@/paths';

import { DataTable } from '@/components/core/data-table';


import { useDispatch } from 'react-redux';
import { cityActions } from '@/redux/slices';
import { toast } from '@/components/core/toaster';
import { useRouter } from 'next/navigation';
import { formatDate } from '@/utils/formatTime';






export function CitiesTable({ rows }) {

  const dispatch = useDispatch();
  const router = useRouter();



  const { deleteCities, fetchCities,createCity, updateCity } = cityActions;

  const columns = [
    {
      formatter: (row) => (
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' ,marginLeft:0}}>
         {' '}
          <div>
            <Link
            
            >
              { formatDate(row.createdAt)}
            </Link>
        
          </div>
        </Stack>
      ),
      name: 'Date',
      width: '150px',
    },
   
    {
      formatter(row) {
        return row.event?.eventName || '-';
      },
      name: 'Event',
      width: '150px',
    },
    {
      formatter(row) {
        return row?.participantName + " " + row?.participantEmail || '-';
      },
      name: 'Participant',
      width: '200px',
    },
    {
      formatter(row) {
        return row?.emailType;
      },
      name: 'Type',
      width: '150px',
    },
    {
      formatter(row) {
        return row?.logStatus || '-';
      },
      name: 'Status',
      width: '200px',
    },
    {
      formatter: (row) => (
        <div style={{ display: "flex" }}>
          <IconButton component={RouterLink} href={paths.dashboard.emaillogs.view(row.id)}>
            <Eye/>
          </IconButton>
        
          
        </div>
      ),
      name: 'Actions',
      width: '100px',
    }


  ];


  console.log(rows,"rows"); 
  return (
    <React.Fragment>
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
