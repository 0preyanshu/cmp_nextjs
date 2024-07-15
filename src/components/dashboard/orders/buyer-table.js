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

import { paths } from '@/paths';

import { DataTable } from '@/components/core/data-table';


import { useDispatch } from 'react-redux';
import { cityActions } from '@/redux/slices';
import { toast } from '@/components/core/toaster';
import { useRouter } from 'next/navigation';






export function BuyerTable({ rows }) {

  const dispatch = useDispatch();
  const router = useRouter();

  const { deleteCities, fetchCities,createCity, updateCity } = cityActions;

  const columns = [
    {
      formatter: (row) => (
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' ,marginLeft:3}}>
         {' '}
          <div>
            <Link
            
            >
              {row.participantFirstName || ""}
            </Link>
        
          </div>
        </Stack>
      ),
      name: 'First Name',
      width: '250px',
    },
   
    {
      formatter(row) {
        return row.participantFirstName;
      },
      name: 'Last Name',
      width: '200px',
    },
    {
      formatter(row) {
        return row.participantEmail;
      },
      name: 'Email',
      width: '200px',
    },
    {
      formatter(row) {
        return row.participantPhone;
      },
      name: 'Phone',
      width: '200px',
    },
  
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
