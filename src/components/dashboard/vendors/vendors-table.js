'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { CheckCircle as CheckCircleIcon } from '@phosphor-icons/react/dist/ssr/CheckCircle';
;
import { Minus as MinusIcon } from '@phosphor-icons/react/dist/ssr/Minus';
import { PencilSimple as PencilSimpleIcon } from '@phosphor-icons/react/dist/ssr/PencilSimple';
import {TrashSimple as TrashSimpleIcon} from '@phosphor-icons/react/dist/ssr/TrashSimple';

import { paths } from '@/paths';
import { DataTable } from '@/components/core/data-table';

import { useDispatch } from 'react-redux';

import { toast } from '@/components/core/toaster';
import { useRouter } from 'next/navigation';
import { VendorActions } from '@/redux/slices';






export function VendorsTable({ rows }) {
  const dispatch = useDispatch();
  const router = useRouter();

  const { deletevendors, fetchVendors,updatevendors } = VendorActions;

  const columns = [
    {
      formatter: (row) => (
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center',marginLeft:3 }}>
         {' '}
          <div>
            <Link
            
            >
              {row.vendorname}
            </Link>
        
          </div>
        </Stack>
      ),
      name: 'Vendor Name',
      width: '150px',
    },
   
    {
      formatter(row) {
        return row.firstname;
      },
      name: 'First Name',
      width: '150px',
    },
    {
      formatter(row) {
        return row.lastname;
      },
      name: 'Last Name',
      width: '150px',
    },
    {
      formatter(row) {
        return row.email;
      },
      name: 'Email',
      width: '150px',
    },
    {
      formatter(row) {
        return row.phone;
      },
      name: 'Phone Number',
      width: '150px',
    },
    
    {
      formatter: (row) => {
        const mapping = {
          active: { label: 'Active', icon: <CheckCircleIcon color="var(--mui-palette-success-main)" weight="fill" /> },
          blocked: { label: 'Blocked', icon: <MinusIcon color="var(--mui-palette-error-main)" /> }
          
        };
        const value=(row.status_==="ACTIVE")?'active':'blocked';
        console.log(value);
        const { label, icon } = mapping[value] ?? { label: 'Unknown', icon: null };
  
        return <Chip icon={icon} label={label} size="small" variant="outlined" />;
      },
      name: 'Status',
      width: '150px',
    },
    {
      formatter: (row) => (<div style={{display:"flex"}}>
  
      <IconButton component={RouterLink} href={paths.dashboard.vendors.edit(row.id)}>
          <PencilSimpleIcon />
        </IconButton>
        
        <IconButton onClick={async ()=>{
          const {status_} = row;
          const data ={
            status_ :status_==="ACTIVE"?"INACTIVE":"ACTIVE",
            id : row.id
          }
          await dispatch(updatevendors(data)).then((res) => {
            console.log(res?.payload?.data?.data?.data,"reso");
            if (res?.payload?.data?.data) {
            
                  toast.success('Details updated');
                  router.push(paths.dashboard.vendors.list);
            } else {
              toast.error(res?.payload?.data?.error?.message || 'Internal Server Error');
            }
          })
  
        }}>
          <TrashSimpleIcon />
        </IconButton>
  
        
        </div>),
      name: 'Actions',
  
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
