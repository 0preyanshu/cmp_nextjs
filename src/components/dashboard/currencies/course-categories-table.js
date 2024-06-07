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

import { useCustomersSelection } from './course-categories-selection-context';
import { useDispatch } from 'react-redux';
import { CurrencyAction } from '@/redux/slices';
import { toast } from '@/components/core/toaster';
import { useRouter } from 'next/navigation';

export function CustomersTable({ rows }) {
  const { deselectAll, deselectOne, selectAll, selectOne, selected } = useCustomersSelection();
  const dispatch = useDispatch();
  const router = useRouter();

  const { fetchCurrency, deleteCurrency,updateCurrency } = CurrencyAction;


  const columns = [
    {
      formatter: (row) => (
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
         {'   '}
          <div>
            <Link
            
            >
              {row.currencyName}
            </Link>
        
          </div>
        </Stack>
      ),
      name: 'Currency',
      width: '250px',
    },
   
    {
      formatter(row) {
        return row.currencySymbol;
      },
      name: 'Symbol',
      width: '200px',
    },
    
   
    {
      formatter(row) {
        console.log(row.
          country,"rowinside");
          if(row.country){
            return row.country.countryName
          }
        return "No Country"
      },
      name: 'Country',
      width: '200px',
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
  
      <IconButton component={RouterLink} href={paths.dashboard.currencies.edit(row.id)}>
          <PencilSimpleIcon />
        </IconButton>
        
        <IconButton onClick={async ()=>{
                    const {status_} = row;
                    const data ={
                      status_ :status_==="ACTIVE"?"INACTIVE":"ACTIVE",
                      id : row.id
                    }
                    await dispatch(updateCurrency(data)).then((res) => {
                      console.log(res,"reso");
                      if (res?.payload?.data?.data) {
                        // console.log(data,"data");
                            toast.success('Details updated');
                            router.push(paths.dashboard.currencies.list);
                            const data = {
                              page: 1,
                              limit: 10,
                              sort: 'asc',
                              search: '',
                            };
                            dispatch(fetchCurrency(data));
                      } else {
                        toast.error(res?.payload?.data?.error?.message|| 'Internal Server Error');
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
  return (
    <React.Fragment>
      <DataTable
        columns={columns}
        onDeselectAll={deselectAll}
        onDeselectOne={(_, row) => {
          deselectOne(row.id);
        }}
        onSelectAll={selectAll}
        onSelectOne={(_, row) => {
          selectOne(row.id);
        }}
        rows={rows}
        selectable
        selected={selected}
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
