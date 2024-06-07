'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';

import { config } from '@/config';
import { dayjs } from '@/lib/dayjs';
import { CustomersFilters } from '@/components/dashboard/cities/course-categories-filters';
import { CustomersPagination } from '@/components/dashboard/courses/course-categories-pagination';
import { CustomersSelectionProvider } from '@/components/dashboard/cities/course-categories-selection-context';
import { CustomersTable } from '@/components/dashboard/cities/course-categories-table';

import InputAdornment from '@mui/material/InputAdornment';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import OutlinedInput from '@mui/material/OutlinedInput';
import { useRouter } from 'next/navigation';
import { paths } from '@/paths';
import { useDispatch, useSelector } from 'react-redux';
import { cityActions } from '@/redux/slices';
import { countryActions } from '@/redux/slices';
import { StateActions } from '@/redux/slices';

import { Skeleton, TableCell, TableRow } from '@mui/material';
import TableSkeleton from '@/components/core/Skeletion';
import state from '@/redux/slices/state';

export default function Page({ searchParams }) {
  const { email, phone, sortDir, status, countryID, stateID, searchTerm, page = 1, limit = 10 } = searchParams;

  const [currentPage, setCurrentPage] = React.useState(parseInt(page));
  const [rowsPerPage, setRowsPerPage] = React.useState(parseInt(limit));

  const router = useRouter();

  const { allCountries } = useSelector((state) => state?.countries?.country);
  const { allState } = useSelector((state) => state?.states?.state);
  const { allCities, iserror, toast, loading: isLoading, totalData } = useSelector((state) => state?.cities?.city);
  const dispatch = useDispatch();
  const { fetchState } = StateActions;
  const { fetchCountries } = countryActions;
  const { fetchCities } = cityActions;

  const [searchInput, setSearchInput] = React.useState(searchTerm || '');

  React.useEffect(() => {
    const data = {
      page: currentPage,
      limit: rowsPerPage,
      name: searchTerm || '',
      countryId: countryID || '',
      stateId: stateID || '',
    };
    dispatch(fetchCountries({ limit: "", page: "", search: "" }));
    dispatch(fetchState({ limit: "", page: "", search: "" }));
    dispatch(fetchCities(data));
  }, [dispatch, searchTerm, currentPage, rowsPerPage, countryID, stateID]);

  const handleSearchChange = (event) => {
    setSearchInput(event.target.value);
    updateSearchParams({ ...searchParams, searchTerm: event.target.value, page: 1 }, sortDir); // Reset to page 1 on search
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
    updateSearchParams({ ...searchParams, page: newPage }, sortDir);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1); // Reset to page 1 on rows per page change
    updateSearchParams({ ...searchParams, limit: parseInt(event.target.value, 10), page: 1 }, sortDir);
  };

  const updateSearchParams = (newFilters, newSortDir) => {
    const searchParams = new URLSearchParams();

    if (newFilters.countryID) {
      searchParams.set('countryID', newFilters.countryID);
    }

    if (newFilters.stateID) {
      searchParams.set('stateID', newFilters.stateID);
    }

    if (newFilters.email) {
      searchParams.set('email', newFilters.email);
    }

    if (newFilters.phone) {
      searchParams.set('phone', newFilters.phone);
    }

    if (newFilters.status) {
      searchParams.set('status', newFilters.status);
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

    if (newSortDir === 'asc' || newSortDir === 'desc') {
      searchParams.set('sortDir', newSortDir);
    }

    router.push(`${paths.dashboard.cities.list}?${searchParams.toString()}`);
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
            <Typography variant="h4">City</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button startIcon={<PlusIcon />} variant="contained" onClick={() => {
              router.push(paths.dashboard.cities.create);
            }}>
              Add
            </Button>
          </Box>
        </Stack>

        <Stack direction="row" spacing={2} sx={{ px: 3, py: 2 }}>
          <OutlinedInput
            placeholder="Search city"
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
          <CustomersFilters filters={{ email, phone, status, countryID, stateID }} sortDir={sortDir} Countries={allCountries} States={allState} />
          <Divider />
          <Box sx={{ overflowX: 'auto' }}>
            {isLoading ? (
              <TableSkeleton />
            ) : (
              <CustomersTable rows={allCities} />
            )}
          </Box>
          <Divider />
          <CustomersPagination count={totalData} page={currentPage-1} rowsPerPage={rowsPerPage} onPageChange={handlePageChange} onRowsPerPageChange={handleRowsPerPageChange} />
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
