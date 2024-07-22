'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { CitiesFilters } from '@/components/dashboard/abandoned-cart/cities-filters';
import { Pagination } from '@/components/core/pagination';
import { HistoryTable } from '@/components/dashboard/orders/history-table';

import InputAdornment from '@mui/material/InputAdornment';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import OutlinedInput from '@mui/material/OutlinedInput';
import { useRouter } from 'next/navigation';
import { paths } from '@/paths';
import { useDispatch, useSelector } from 'react-redux';
import { OrderActions,VendorActions } from '@/redux/slices';
import { CoursesActions,WaitlistActions,EventsActions } from '@/redux/slices';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TableSkeleton from '@/components/core/Skeletion';
import { Link } from '@mui/material';
import RouterLink from 'next/link';
import { ArrowLeft as ArrowLeftIcon } from '@phosphor-icons/react/dist/ssr/ArrowLeft';
import { useParams } from 'next/navigation';


export default function Page({ searchParams }) {

  const [currentPage, setCurrentPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [currentOrder, setCurrentOrder] = React.useState(null);









  const { allOrders} = useSelector((state) => state?.orders?.orders);

  
 

  const {Id} = useParams();

  React.useEffect(()=>{
    console.log("allOrders",allOrders);
    console.log("id",Id);
      if(allOrders && Id){
          const details=allOrders.find((order)=>order.id===Id);
          console.log("order",details);

          setCurrentOrder(details);

      }
  }
  ,[allOrders,Id]);




  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);

  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
 
  };



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
      <div>
            <Link
              color="text.primary"
              component={RouterLink}
              href={paths.dashboard.orders.details(Id)}
              sx={{ alignItems: 'center', display: 'inline-flex', gap: 1 }}
              variant="subtitle2"
            >
              <ArrowLeftIcon fontSize="var(--icon-fontSize-md)" />
              back
            </Link>
          </div>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ alignItems: 'flex-start' }}>
        
          <Box sx={{ flex: '1 1 auto' }}>
            <Typography variant="h4">Order History</Typography>
          </Box>
        </Stack>
        {/* subTotal: currentOrder?.orderInfo?.totalAmount-(currentOrder?.orderInfo?.feesAmount+currentOrder?.orderInfo?.taxAmount),
    fees: currentOrder?.orderInfo?.feesAmount,
    tax: currentOrder?.orderInfo?.taxAmount,
    total: currentOrder?.orderInfo?.totalAmount, */}


        <Card sx={{ p: 3, width: '100%', position: 'relative', mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Order - {currentOrder?.id?.slice(-3) || "N/A"}
              </Typography>
              <Stack direction="column" alignItems="flex-start" spacing={1} sx={{ mr: 8 }}>
                <Stack direction="row" justifyContent="flex-start" sx={{ width: '200px' }}>
                  <Typography variant="h7" align="left" sx={{ flex: 1 }}>
                    SubTotal: 
                  </Typography>
                  <Typography align="left">{currentOrder?.orderInfo?.totalAmount-(currentOrder?.orderInfo?.feesAmount+currentOrder?.orderInfo?.taxAmount)} USD</Typography>
                </Stack>
                <Stack direction="row" justifyContent="flex-start" sx={{ width: '200px' }}>
                  <Typography variant="h7" align="left" sx={{ flex: 1 }}>
                    Fees:
                  </Typography>
                  <Typography align="left">{currentOrder?.orderInfo?.feesAmount} USD</Typography>
                </Stack>
                <Stack direction="row" justifyContent="flex-start" sx={{ width: '200px' }}>
                  <Typography variant="h7" align="left" sx={{ flex: 1 }}>
                    Tax:
                  </Typography>
                  <Typography color="error" align="left">
                    {currentOrder?.orderInfo?.taxAmount} USD
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="flex-start" sx={{ width: '200px' }}>
                  <Typography variant="h7" align="left" sx={{ flex: 1 }}>
                    Total:
                  </Typography>
                  <Typography align="left">{currentOrder?.orderInfo?.totalAmount} USD</Typography>
                </Stack>
              </Stack>
            </Card>

        <Card>
          <Divider />
          <Box sx={{ overflowX: 'auto' }}>
           
              <HistoryTable rows={currentOrder?.orderHistory || []} />
           
          </Box>
          <Divider />
          <Pagination page={currentPage-1} rowsPerPage={rowsPerPage} onPageChange={handlePageChange} onRowsPerPageChange={handleRowsPerPageChange} />
        </Card>
      </Stack>
    </Box>
  );
}
