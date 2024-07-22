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
import { cityActions } from '@/redux/slices';
import { countryActions } from '@/redux/slices';
import { CoursesActions,WaitlistActions,EventsActions } from '@/redux/slices';

import TableSkeleton from '@/components/core/Skeletion';

export default function Page({ searchParams }) {
  const {  searchTerm, page = 1, limit = 10,startDate,eventID,courseID } = searchParams;

  const [currentPage, setCurrentPage] = React.useState(parseInt(page));
  const [rowsPerPage, setRowsPerPage] = React.useState(parseInt(limit));
  const [searchInput, setSearchInput] = React.useState(searchTerm || '');

  const router = useRouter();


  const { waitlistData, isLoading } = useSelector((state) => state?.waitlist?.waitlist);
  const {allCourses}=useSelector((state)=>state?.courses?.courses);
  // const { allInstructors } = useSelector((state) => state?.instructors?.instructors);
  // const {allTimezones}=useSelector((state)=>state?.timezone?.timezones);
  const { allEvents } = useSelector((state) => state?.event?.events);

  const {fetchCourses} = CoursesActions;
  const {fetchEvents} = EventsActions;





  const dispatch = useDispatch();

  const { getWaitlistData } = WaitlistActions;



  React.useEffect(() => {
   
      const data = {
        page: currentPage,
        limit: rowsPerPage,
        name: searchInput || '',
        startDate: startDate || '',
        courseID: courseID || '',
        eventId: eventID || '',
  
      };
      if(allCourses.length === 0 ){
        dispatch(fetchCourses({ limit: "", page: "", search: "" }));
      }
      if(allEvents.length === 0){
        dispatch(fetchEvents({ limit: "", page: "", search: "" }));
      }
   
        dispatch(getWaitlistData(data));
      

      ({ searchTerm: searchInput, page: currentPage, limit: rowsPerPage, startDate:startDate, courseID:courseID, eventID:eventID });
     
   
  }, [searchInput, currentPage, rowsPerPage,courseID,eventID,startDate]);

  const handleSearchChange = (event) => {
    setSearchInput(event.target.value);
    ({ ...searchParams, searchTerm: event.target.value, page: 1 });
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
    ({ ...searchParams, page: newPage });
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
    ({ ...searchParams, limit: parseInt(event.target.value, 10), page: 1 });
  };

  const updateSearchParams = (newFilters, newSortDir) => {
    const searchParams = new URLSearchParams();


    if (newFilters.searchTerm) {
      searchParams.set('searchTerm', newFilters.searchTerm);
    }

    if (newFilters.page) {
      searchParams.set('page', newFilters.page);
    }

    if (newFilters.limit) {
      searchParams.set('limit', newFilters.limit);
    }
    if(newFilters.startDate){
      searchParams.set('startDate', newFilters.startDate);
    }
    if(newFilters.courseID){
      searchParams.set('courseID', newFilters.courseID);
    }
    if(newFilters.eventID){
      searchParams.set('eventID', newFilters.eventID);
    }


    router.push(`${paths.dashboard.waitlist.list}?${searchParams.toString()}`);
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
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ alignItems: 'flex-start' }}>
          <Box sx={{ flex: '1 1 auto' }}>
            <Typography variant="h4">Waitist</Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={2} sx={{ px: 3, py: 2 }}>
          <OutlinedInput
            placeholder="Search thread"
            value={searchInput}
            onChange={handleSearchChange}
            startAdornment={
              <InputAdornment position="start">
                <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
              </InputAdornment>
            }
            sx={{ width: '100%' }}
          />
        </Stack>

        <Card>
          <CitiesFilters filters={{ page,limit,courseID,eventID,startDate }} />
          <Divider />
          <Box sx={{ overflowX: 'auto' }}>
            {isLoading ? (
              <TableSkeleton />
            ) : (
              <CitiesTable rows={waitlistData} />
            )}
          </Box>
          <Divider />
          <Pagination page={currentPage-1} rowsPerPage={rowsPerPage} onPageChange={handlePageChange} onRowsPerPageChange={handleRowsPerPageChange} />
        </Card>
      </Stack>
    </Box>
  );
}
