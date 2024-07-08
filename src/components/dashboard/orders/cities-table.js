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






export function CitiesTable({ rows }) {

  const dispatch = useDispatch();
  const router = useRouter();

  function formatDateTime(timestamp) {

    const date = new Date(timestamp);
  

    const dateOptions = {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    };
  

    const formattedDate = date.toLocaleDateString('en-US', dateOptions);
  

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    const formattedDateTime = `${formattedDate} ${hours}:${minutes}`;
  
    return formattedDateTime;
  }

  const { deleteCities, fetchCities,createCity, updateCity } = cityActions;

  const columns = [
    // {
    //   formatter(row) {
    //     return "N/A";
    //   },
    //   name: 'Buyer Name',
    //   width: '150px',
    // },
    {
      formatter: (row) => (
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' ,marginLeft:0}}>
         {' '}
          <div>
            <Link
            
            >
              {row.eventStartDate}
            </Link>
        
          </div>
        </Stack>
      ),
      name: 'Date and Time',
      width: '150px',
    },
   
    {
      formatter(row) {
        return row.buyerFirstName + ' ' + row.buyerLastName;
      },
      name: 'Buyer Name',
      width: '150px',
    },
    {
      formatter(row) {
        return row.buyerPhone;
      },
      name: 'Phone',
      width: '150px',
    },
    {
      formatter(row) {
        return row.buyerEmail;
      },
      name: 'Email',
      width: '150px',
    },
    {
      formatter(row) {
        return row.courseName || 'N/A';
      },
      name: 'Course',
      width: '150px',
    },
    {
      formatter(row) {
        return row.eventName || 'N/A';
      },
      name: 'Event',
      width: '150px',
    }
    ,
    {
      formatter(row) {
        return row.numberOfParticipants || 'N/A';
      },
      name: ' No of Participants',
      width: '150px',
    }
    ,
    {
      formatter(row) {
        return row.numberOfParticipants || '200';
      },
      name: 'Amount',
      width: '100px',
    }
    ,
    {
      formatter(row) {
        return row.feesAmount || '200';
      },
      name: ' Fee',
      width: '100px',
    }
    ,
    {
      formatter(row) {
        return row.taxAmount || '200';
      },
      name: 'Tax',
      width: '100px',
    }
    ,
    {
      formatter(row) {
        return row.balance || '200';
      },
      name: 'Balance',
      width: '100px',
    },
    {
      formatter(row) {
        return row.refundAmount || '200';
      },
      name: 'Refund',
      width: '100px',
    }
    ,
    {
      formatter(row) {
        return row.sourceType || '200';
      },
      name: 'Payment Mode',
      width: '150px',
    }


  ];


  console.log(rows,"rows"); 
  return (
    <React.Fragment>
      <DataTable
        columns={columns}
        rows={rows}
        onClick={(event, row)=>{
          router.push(paths.dashboard.orders.details(row.id));
        }}
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