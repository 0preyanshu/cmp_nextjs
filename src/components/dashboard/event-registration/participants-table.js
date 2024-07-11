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






export function ParticipantsTable({ rows }) {

 

  const columns = [
    {
      formatter: (_,index) => (
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' ,marginLeft:3}}>
         {' '}
          <div>
           
             {index+1} 
         
        
          </div>
        </Stack>
      ),
      name: 'S.No',
      width: '50px',
    },
   
    {
      formatter(row) {
        return row.orderID;
      },
      name: 'Order ID',
      width: '250px',
    },
    {
      formatter(row) {
        return row.firstName;
      },
      name: 'First Name',
      width: '100px',
    },
    {
      formatter(row) {
        return row.lastName;
      },
      name: 'Last Name',
      width: '100px',
    },
    {
      formatter(row) {
        return row.email;
      },
      name: 'Email',
      width: '100px',
    },
    {
      formatter(row) {
        return row.phone;
      },
      name: 'Phone',
      width: '100px',
    },
    {
      formatter(row) {
        return '-';
      },
      name: 'Vendor',
      width: '100px',
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
