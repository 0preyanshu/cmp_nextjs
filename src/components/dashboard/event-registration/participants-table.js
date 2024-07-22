'use client';

import * as React from 'react';


import Box from '@mui/material/Box';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';




import { DataTable } from '@/components/core/data-table';








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
