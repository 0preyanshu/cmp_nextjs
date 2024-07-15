'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Pagination } from '@/components/core/pagination';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import TableSkeleton from '@/components/core/Skeletion';
import {AttendanceTable} from '@/components/dashboard/event-registration/attendance-table';
import axios from 'axios';

import { useParams } from 'next/navigation';
import { LoadingButton } from '@mui/lab';
import { useRef } from 'react';
import { Button } from '@mui/material';

const HOST_API = "https://zfwppq9jk2.execute-api.us-east-1.amazonaws.com/stg";

export default function Page({ searchParams }) {
  const attendanceTableRef = React.useRef();

  const { searchTerm, page = 1, limit = 10 } = searchParams;
  const [currentPage, setCurrentPage] = React.useState(parseInt(page));
  const [rowsPerPage, setRowsPerPage] = React.useState(parseInt(limit));
  const [searchInput, setSearchInput] = React.useState(searchTerm || '');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [eventData, setEventData] = React.useState(null);
  const [attendanceData, setAttendanceData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [buttonLoading, setButtonLoading] = React.useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const isInitialMount = React.useRef(true);

  const {id} = useParams(); // Adjust this line as needed to get the event ID

  React.useEffect(() => {
    const fetchData = async () => {
      console.log('fetching data',id);
      try {
        const [eventResponse, attendanceResponse] = await Promise.all([
          axios.get(`${HOST_API}/event/${id}`),
          axios.get(`${HOST_API}/event/attendance/${id}`)
        ]);
        
        setEventData(eventResponse.data?.data?.event||null);
        setAttendanceData(attendanceResponse.data?.data?.data||null);

        console.log('eventResponse', eventResponse?.data?.data);
        console.log('attendanceResponse', attendanceResponse?.data?.data);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  React.useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      updateSearchParams({ page: currentPage, limit: rowsPerPage });
    }
  }, [currentPage, rowsPerPage]);

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
    updateSearchParams({ ...searchParams, page: newPage });
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
    updateSearchParams({ ...searchParams, limit: parseInt(event.target.value, 10), page: 1 });
  };

  const updateSearchParams = (newFilters) => {
    const searchParams = new URLSearchParams();

    if (newFilters.page) {
      searchParams.set('page', newFilters.page);
    }

    if (newFilters.limit) {
      searchParams.set('limit', newFilters.limit);
    }

    console.log('searchParams', router.pathname);

    // router.push(`${router.pathname}?${searchParams.toString()}`);
  };

  const handleParentSubmit = () => {
    if (attendanceTableRef.current) {
      attendanceTableRef.current.submit();
    }
  };
  const handleDownloadCSV = () => {
    if (attendanceTableRef.current) {
      attendanceTableRef.current.downloadCSV();
    }
  };

  const handleDownloadRosterCSV = () => {
    if (attendanceTableRef.current) {
      attendanceTableRef.current.downloadRosterCSV();
    }
  };

  const handleDownloadAgileRosterCSV = () => {
    if (attendanceTableRef.current) {
      attendanceTableRef.current.downloadAgileRosterCSV();
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

        <Card sx={{ padding: 2, position: 'relative', paddingY: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ maxWidth: '180px', textAlign: 'left', ml: 3 }}>
              <Typography variant="subtitle1"><b>• Course Name</b></Typography>
              <Typography variant="subtitle2" ml={1.5}>{eventData?.course?.courseName ||"-"}</Typography>
            </Box>
            <Box sx={{ maxWidth: '180px', textAlign: 'left' }}>
              <Typography variant="subtitle1"><b>• Event Name</b></Typography>
              <Typography variant="subtitle2" ml={1.5}>{eventData?.eventName || "-"}</Typography>
            </Box>
            <Box sx={{ maxWidth: '230px', textAlign: 'left' }}>
              <Typography variant="subtitle1"><b>• Start Date</b></Typography>
              <Typography variant="subtitle2" ml={1.5}>{eventData?.eventStartDate || "-"}</Typography>
            </Box>
            <Box sx={{ maxWidth: '180px', textAlign: 'left', mr: 3 }}>
              <Typography variant="subtitle1"><b>• Instructor</b></Typography>
              <Typography variant="subtitle2" ml={1.5}>{eventData?.instructor[0]?.firstname || "-"}</Typography>
            </Box>
          </Box>
        </Card>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4,mr:2 }}>
        <Button
        onClick={handleDownloadCSV}
        variant="contained"
        color="primary"
        sx={{ mr: 2 }}
      >
        Download CSV
      </Button>
      <Button
        onClick={handleDownloadRosterCSV}
        variant="contained"
        color="primary"
        sx={{ mr: 2 }}
      >
        Download Roster CSV
      </Button>
      <Button
        onClick={handleDownloadAgileRosterCSV}
        variant="contained"
        color="primary"
      >
        Download Agile Roster CSV
      </Button>
        </Box>

        <Card>
          <Box sx={{ overflowX: 'auto' }}>
            {loading ? (
              <TableSkeleton />
            ) : (
              <AttendanceTable ref={attendanceTableRef} eventData={eventData} attendance={attendanceData} setParentIsSubmitting={setIsSubmitting} currentPage={currentPage} currentLimit={rowsPerPage}/>
            )}
          </Box>
          <Divider />
          <Pagination
            page={currentPage - 1}
            rowsPerPage={rowsPerPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        </Card>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: -1,mr:2 }}>
          <LoadingButton
            onClick={handleParentSubmit}
            loading={isSubmitting}
            variant="contained"
            color="primary"
          >
            Save Attendance
          </LoadingButton>
        </Box>
        
      </Stack>
    </Box>
  );
}
