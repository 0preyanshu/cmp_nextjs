'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';

import { CitiesFilters } from '@/components/dashboard/waitlist/cities-filters';
import { Pagination } from '@/components/core/pagination';
import { CitiesTable } from '@/components/dashboard/waitlist/cities-table';

import InputAdornment from '@mui/material/InputAdornment';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import OutlinedInput from '@mui/material/OutlinedInput';
import { useRouter } from 'next/navigation';
import { paths } from '@/paths';
import { useDispatch, useSelector } from 'react-redux';

import TableSkeleton from '@/components/core/Skeletion';
import Attendance from '@/redux/slices/attendance';
import  AttendanceTable  from '@/components/dashboard/event-registration/attendance-table';
import Grid from '@mui/material/Grid';

export default function Page({ searchParams }) {
  const {  searchTerm, page = 1, limit = 10, } = searchParams;

  const [currentPage, setCurrentPage] = React.useState(parseInt(page));
  const [rowsPerPage, setRowsPerPage] = React.useState(parseInt(limit));
  const [searchInput, setSearchInput] = React.useState(searchTerm || '');

  const router = useRouter();








  const dispatch = useDispatch();



  const isInitialMount = React.useRef(true);

  React.useEffect(() => {
   
     
  
      // if(allCourses.length === 0 ){
      //   dispatch(fetchCourses({ limit: "", page: "", search: "" }));
      // }
      // if(allEvents.length === 0){
      //   dispatch(fetchEvents({ limit: "", page: "", search: "" }));
      // }
      // if(waitlistData.length === 0 || !isInitialMount.current){
      //   dispatch(getWaitlistData(data));
      // }

      updateSearchParams({  page: currentPage, limit: rowsPerPage });
     
    
    if(isInitialMount.current){
      isInitialMount.current = false;

    }
  }, [ currentPage, rowsPerPage]);


  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
    updateSearchParams({ ...searchParams, page: newPage });
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
    updateSearchParams({ ...searchParams, limit: parseInt(event.target.value, 10), page: 1 });
  };

  const updateSearchParams = (newFilters, newSortDir) => {
    const searchParams = new URLSearchParams();




    if (newFilters.page) {
      searchParams.set('page', newFilters.page);
    }

    if (newFilters.limit) {
      searchParams.set('limit', newFilters.limit);
    }




  };

  return (
    <Box
      sx={{
        maxWidth: 'var(--Content-maxWidth)',
        m: 'var(--Content-margin)',
        p: 5,
        width: '100vw',
      }}
    >
      <Stack spacing={4}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ alignItems: 'flex-start' }}>
          <Box sx={{ flex: '1 1 auto' }}>
            <Typography variant="h4">Attendance</Typography>
          </Box>
        </Stack>
  
        <Card sx={{ padding: 2, position: 'relative',paddingY:3 }}>
      {/* <Typography variant="h6" sx={{ position: 'absolute', top: 20, left: 30,mb :3}}>
        Event Info
      </Typography> */}
      <Box sx={{  display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ maxWidth: '180px',textAlign:"left",ml:3  }}>
          <Typography variant="subtitle1"><b>• Course Name</b></Typography>
          <Typography variant="subtitle2" ml={1.5}>palash</Typography>
        </Box>
        <Box sx={{ maxWidth: '180px',textAlign:"left"  }}>
          <Typography variant="subtitle1"><b>• Event Name</b></Typography>
          <Typography variant="subtitle2"ml={1.5}>palash</Typography>
        </Box>
        <Box sx={{ maxWidth: '180px',textAlign:"left"  }}>
          <Typography variant="subtitle1"><b>• Start Date</b></Typography>
          <Typography variant="subtitle2"ml={1.5}>19 June 2024</Typography>
        </Box>
        <Box sx={{ maxWidth: '180px',textAlign:"left",mr:3 }}>
          <Typography variant="subtitle1"><b>• Instructor</b>r</Typography>
          <Typography variant="subtitle2"ml={1.5}>Sourab Jain</Typography>
        </Box>
      </Box>
    </Card>


        <Card>
          <Box sx={{ overflowX: 'auto' }}>
            {0 ? (
              <TableSkeleton />
            ) : (
              <AttendanceTable />
            )}
          </Box>
          <Divider />
          <Pagination page={currentPage-1} rowsPerPage={rowsPerPage} onPageChange={handlePageChange} onRowsPerPageChange={handleRowsPerPageChange} />
        </Card>
      
      </Stack>
    </Box>
  );
}
