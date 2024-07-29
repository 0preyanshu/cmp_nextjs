'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { CitiesFilters } from '@/components/dashboard/emaillogs/cities-filters';
import { Pagination } from '@/components/core/pagination';
import { CitiesTable } from '@/components/dashboard/emaillogs/cities-table';

import InputAdornment from '@mui/material/InputAdornment';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import OutlinedInput from '@mui/material/OutlinedInput';
import { useRouter } from 'next/navigation';
import { paths } from '@/paths';
import { useDispatch, useSelector } from 'react-redux';
import { EmailLogsActions,VendorActions } from '@/redux/slices';
import { CoursesActions,WaitlistActions,EventsActions } from '@/redux/slices';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TableSkeleton from '@/components/core/Skeletion';
import { useUserPrivileges } from '@/hooks/use-privilages';



export default function Page({ searchParams }) {
  const {  searchTerm, page = 1, limit = 10,startDate,eventID,courseID,endDate } = searchParams;

  const [currentPage, setCurrentPage] = React.useState(parseInt(page));
  const [rowsPerPage, setRowsPerPage] = React.useState(parseInt(limit));
  const [searchInput, setSearchInput] = React.useState(searchTerm || '');
  const [tabValue, setTabValue] = React.useState('1');

  const router = useRouter();
  const userPrivileges = useUserPrivileges();

  console.log("userPrivileges",userPrivileges);



  const {allCourses}=useSelector((state)=>state?.courses?.courses);

  const { allEvents } = useSelector((state) => state?.event?.events);
  const { isLoading, toast, emailLogs, totalElements } = useSelector((state) => state.emailLogs);
  const {fetchCourses} = CoursesActions;
  const {getEmailLogsData} = EmailLogsActions;
  const { fetchEvents } = EventsActions;









  const dispatch = useDispatch();



 

  React.useEffect(() => {
   
      const data = {
        page: currentPage,
        limit: rowsPerPage,
        name: searchInput || '',
        startDate: startDate || '',
        eventID: eventID || '',
        endDate: endDate || '',
      
        
  
      };
      if(allEvents.length === 0){
        dispatch(fetchEvents({ limit: "", page: "", name: "" }));
      }
      
        dispatch(getEmailLogsData(data));
      

      updateSearchParams({ searchTerm: searchInput, page: currentPage, limit: rowsPerPage, startDate:startDate, courseID:courseID, eventID:eventID, endDate:endDate});
     
    
   
  }, [searchInput, currentPage, rowsPerPage,eventID,startDate,tabValue,endDate]);

  const handleSearchChange = (event) => {
    setSearchInput(event.target.value);
    updateSearchParams({ ...searchParams, searchTerm: event.target.value, page: 1 });
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
    updateSearchParams({ ...searchParams, page: newPage });
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
    updateSearchParams({ ...searchParams, limit: parseInt(event.target.value, 10), page: 1 });
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setCurrentPage(1);
  }

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
    if(newFilters.endDate){
      searchParams.set('endDate', newFilters.endDate);
    }
    if(newFilters.courseID){
      searchParams.set('courseID', newFilters.courseID);
    }
    if(newFilters.eventID){
      searchParams.set('eventID', newFilters.eventID);
    }


    router.push(`${paths.dashboard.emaillogs.list}?${searchParams.toString()}`);
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
            <Typography variant="h4">Email Logs</Typography>
          </Box>
        </Stack>

        <TabContext value={tabValue}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleTabChange}>
              <Tab label="Upcoming" value="1" />
              <Tab label="Past" value="2" />
              <Tab label="All" value="3" />
            </TabList>
          </Box>
        </TabContext>

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
          <CitiesFilters filters={{ page,limit,courseID,eventID,startDate,endDate }} />
          <Divider />
          <Box sx={{ overflowX: 'auto' }}>
            {isLoading ? (
              <TableSkeleton />
            ) : (
              <CitiesTable rows={emailLogs} />
            )}
          </Box>
          <Divider />
          <Pagination page={currentPage-1} rowsPerPage={rowsPerPage} onPageChange={handlePageChange} onRowsPerPageChange={handleRowsPerPageChange} />
        </Card>
      </Stack>
    </Box>
  );
}
