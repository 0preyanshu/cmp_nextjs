'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import {Download as DownloadIcon} from '@phosphor-icons/react/dist/ssr/Download';
import { EventFilters } from '@/components/dashboard/event-registration/event-filters';
import { Pagination } from '@/components/core/pagination';
import { EventTable } from '@/components/dashboard/event-registration/event-table';
import InputAdornment from '@mui/material/InputAdornment';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import OutlinedInput from '@mui/material/OutlinedInput';
import { useRouter } from 'next/navigation';
import { paths } from '@/paths';
import { useDispatch, useSelector } from 'react-redux';
import { EventsActions } from '@/redux/slices';
import { countryActions } from '@/redux/slices';
import { StateActions,cityActions,CoursesActions,InstructorActions,TimezoneAction,CourseCategoryActions } from '@/redux/slices';
import TableSkeleton from '@/components/core/Skeletion';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import * as XLSX from 'xlsx';

export default function Page({ searchParams }) {
  const { sortDir, countryID, stateID, searchTerm, page = 1, limit = 10, instructorID, courseCategoryID, courseID, timezoneID } = searchParams;

  const [currentPage, setCurrentPage] = React.useState(parseInt(page));
  const [rowsPerPage, setRowsPerPage] = React.useState(parseInt(limit));
  const [searchInput, setSearchInput] = React.useState(searchTerm || '');
  const [tabValue, setTabValue] = React.useState('1');

  const router = useRouter();

  const { allCountries } = useSelector((state) => state?.countries?.country);
  const { allState } = useSelector((state) => state?.states?.state);
  const { allEvents, loading: isLoading } = useSelector((state) => state?.event?.events);



  const { allCities } = useSelector((state) => state?.cities?.city);
  const {allCourses}=useSelector((state)=>state?.courses?.courses);
  const { allInstructors } = useSelector((state) => state?.instructors?.instructors);
  const {allTimezones}=useSelector((state)=>state?.timezone?.timezones);
  const {
    allCategories
  } = useSelector((state) => state?.categories?.categories);

  





  const dispatch = useDispatch();
  const { fetchState } = StateActions;
  const { fetchCountries } = countryActions;
  const { fetchEvents } = EventsActions;
  const { fetchCities } = cityActions;
  const { fetchCourses } = CoursesActions;
  const { fetchInstructor } = InstructorActions;
  const { fetchTimezones } = TimezoneAction;
  const { fetchcategories } = CourseCategoryActions;



  React.useEffect(() => {
    const data = {
      page: currentPage,
      limit: rowsPerPage,
      name: searchInput || '',
      countryId: countryID || '',
      stateId: stateID || '',
      instructorId: instructorID || '',
      courseCategoryId: courseCategoryID || '',
      courseId: courseID || '',
      timezone: timezoneID || '',
      tab: tabValue, // Pass the tab value
      status : 'upcoming'
    };
    if (allCountries.length === 0) {
      dispatch(fetchCountries({ limit: "", page: "", search: "" }));
    }
    if (allState.length === 0) {
      dispatch(fetchState({ limit: "", page: "", search: "" }));
    }
    if(allCities.length===0){
      dispatch(fetchCities({limit:"",page:"",search:""}));
    }
    if(allCourses.length===0){
      dispatch(fetchCourses({limit:"",page:"",search:""}));
    }
    if(allInstructors.length===0){
      dispatch(fetchInstructor({limit:"",page:"",search:""}));
    }
    if(allTimezones.length===0){
      dispatch(fetchTimezones({limit:"",page:"",search:""}));
    }
    if(allCategories.length===0){
      dispatch(fetchcategories({limit:"",page:"",search:""}));
    }
    
      dispatch(fetchEvents(data));
    
   
    
    updateSearchParams({ searchTerm: searchInput, page: currentPage, limit: rowsPerPage, countryID: countryID, stateID: stateID, instructorID: instructorID, courseCategoryID: courseCategoryID, courseID: courseID, timezoneID: timezoneID });

  }, [searchInput, currentPage, rowsPerPage, countryID, stateID, instructorID, courseCategoryID, courseID, timezoneID, tabValue]);

  const handleSearchChange = (event) => {
    setSearchInput(event.target.value);
    updateSearchParams({ ...searchParams, searchTerm: event.target.value, page: 1 }, sortDir);
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
    updateSearchParams({ ...searchParams, page: newPage }, sortDir);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
    updateSearchParams({ ...searchParams, limit: parseInt(event.target.value, 10), page: 1 }, sortDir);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setCurrentPage(1);
  };

  const updateSearchParams = (newFilters, newSortDir) => {
    const searchParams = new URLSearchParams();

    if (newFilters.countryID) {
      searchParams.set('countryID', newFilters.countryID);
    }

    if (newFilters.stateID) {
      searchParams.set('stateID', newFilters.stateID);
    }

    if (newFilters.instructorID) {
      searchParams.set('instructorID', newFilters.instructorID);
    }

    if (newFilters.courseCategoryID) {
      searchParams.set('courseCategoryID', newFilters.courseCategoryID);
    }

    if (newFilters.courseID) {
      searchParams.set('courseID', newFilters.courseID);
    }

    if (newFilters.timezoneID) {
      searchParams.set('timezoneID', newFilters.timezoneID);
    }

    if (newFilters.searchTerm) {
      searchParams.set('searchTerm', newFilters.searchTerm);
    }

    if (newFilters.page) {
      searchParams.set('page', newFilters.page);
    }

    if (newFilters.limit) {
      searchParams.set('limit', newFilters.limit);
    }

    router.push(`${paths.dashboard.eventregistration.list}?${searchParams.toString()}`);
  };

  function generateExcel(data) {
    if (data) {
      const workbook = XLSX.utils.book_new();
      const sheet = XLSX.utils.json_to_sheet(data);
      XLSX?.utils.book_append_sheet(workbook, sheet, 'Sheet1');
      const excelData = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'data.xlsx';
      link.click();
      URL.revokeObjectURL(link.href);
    } else {
      toast.error('Failed to Download Try Again!');
    }
  }

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
            <Typography variant="h4">Events</Typography>
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

        <Card>
          <EventFilters filters={{ countryID, stateID, instructorID, courseCategoryID, courseID, timezoneID, limit, page }} sortDir={sortDir} />
          <Divider />
          <Box sx={{ overflowX: 'auto' }}>
            {isLoading ? (
              <TableSkeleton />
            ) : (
              <EventTable rows={allEvents} />
            )}
          </Box>
          <Divider />
          <Pagination page={currentPage - 1} rowsPerPage={rowsPerPage} onPageChange={handlePageChange} onRowsPerPageChange={handleRowsPerPageChange} />
        </Card>
      </Stack>
    </Box>
  );
}
