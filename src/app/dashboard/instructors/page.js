'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';

import { CustomersPagination } from '@/components/dashboard/courses/course-categories-pagination';
import { CustomersTable } from '@/components/dashboard/instructors/course-categories-table';

import InputAdornment from '@mui/material/InputAdornment';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import OutlinedInput from '@mui/material/OutlinedInput';
import { useRouter } from 'next/navigation';
import { paths } from '@/paths';
import { useDispatch, useSelector } from 'react-redux';

import { InstructorActions } from '@/redux/slices';
import TableSkeleton from '@/components/core/Skeletion';


export default function Page({ searchParams }) {
  const { sortDir,searchTerm, page = 1, limit = 10 } = searchParams;

  const [currentPage, setCurrentPage] = React.useState(parseInt(page));
  const [rowsPerPage, setRowsPerPage] = React.useState(parseInt(limit));

  const router = useRouter();


  const { allInstructors, loading: isLoading } = useSelector((state) => state?.instructors?.instructors);
  const dispatch = useDispatch();


  const { fetchInstructor} = InstructorActions;


  const [searchInput, setSearchInput] = React.useState(searchTerm || '');
  const isInitialMount = React.useRef(true);

  React.useEffect(() => {
    const data = {
      page: currentPage,
      limit: rowsPerPage,
      name: searchInput || ''
    };
    if (!isInitialMount.current || allInstructors.length === 0) {
      dispatch(fetchInstructor(data));
    }
  
    updateSearchParams({
      searchTerm: searchInput,
      page: currentPage,
      limit: rowsPerPage
    });
  
    if (isInitialMount.current) {
      isInitialMount.current = false;
    }
  }, [searchInput, currentPage, rowsPerPage]);

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

    router.push(`${paths.dashboard.instructors.list}?${searchParams.toString()}`);
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
            <Typography variant="h4">Instructors</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button startIcon={<PlusIcon />} variant="contained" onClick={() => {
              router.push(paths.dashboard.instructors.create);
            }}>
              Add
            </Button>
          </Box>
        </Stack>

        <Stack direction="row" spacing={2} sx={{ px: 3, py: 2 }}>
          <OutlinedInput
            placeholder="Search Instructors"
            startAdornment={
              <InputAdornment position="start">
                <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
              </InputAdornment>
            }
            sx={{ width: '100%' }}
            value={searchInput}
            onChange={handleSearchChange}
          />
        </Stack>
      
        <Card>
          <Divider />
          <Box sx={{ overflowX: 'auto' }}>
            {isLoading && <>
              <TableSkeleton />
            </>}
            {!isLoading && <>
              <CustomersTable rows={allInstructors} />
            </>}
          </Box>
          <Divider />
          <CustomersPagination
            count={100}
            page={currentPage-1}
            rowsPerPage={rowsPerPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        </Card>
      </Stack>
    </Box>
  );
}

// Sorting and filtering has to be done on the server.

function applySort(row, sortDir) {
  return row.sort((a, b) => {
    if (sortDir === 'asc') {
      return a.createdAt.getTime() - b.createdAt.getTime();
    }

    return b.createdAt.getTime() - a.createdAt.getTime();
  });
}

function applyFilters(row, { email, phone, status }) {
  return row.filter((item) => {
    if (email) {
      if (!item.email?.toLowerCase().includes(email.toLowerCase())) {
        return false;
      }
    }

    if (phone) {
      if (!item.phone?.toLowerCase().includes(phone.toLowerCase())) {
        return false;
      }
    }

    if (status) {
      if (item.status !== status) {
        return false;
      }
    }

    return true;
  });
}
