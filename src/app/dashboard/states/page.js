'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';

import { CustomersFilters } from '@/components/dashboard/states/course-categories-filters';
import { CustomersPagination } from '@/components/dashboard/courses/course-categories-pagination';
import { CustomersSelectionProvider } from '@/components/dashboard/states/course-categories-selection-context';
import { CustomersTable } from '@/components/dashboard/states/course-categories-table';

import InputAdornment from '@mui/material/InputAdornment';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import OutlinedInput from '@mui/material/OutlinedInput';
import { useRouter } from 'next/navigation';
import { paths } from '@/paths';
import { useDispatch, useSelector } from 'react-redux';
import { StateActions } from '@/redux/slices';
import { countryActions } from '@/redux/slices';
import TableSkeleton from '@/components/core/Skeletion';

export default function Page({ searchParams }) {
  const { email, phone, sortDir, status, page = 1, limit = 10, searchTerm = '', countryID = '' } = searchParams;

  const [currentPage, setCurrentPage] = React.useState(parseInt(page));
  const [rowsPerPage, setRowsPerPage] = React.useState(parseInt(limit));
  const [searchInput, setSearchInput] = React.useState(searchTerm);

  const router = useRouter();

  const { allCountries } = useSelector((state) => state?.countries?.country);
  const { allState, loading: isLoading, totalData } = useSelector((state) => state?.states?.state);
  const dispatch = useDispatch();
  const { deletestate, fetchState } = StateActions;
  const { fetchCountries } = countryActions;

  React.useEffect(() => {
    const data = {
      page: currentPage,
      limit: rowsPerPage,
      sort: 'asc',
      name: searchTerm || "",
      countryId: countryID
    };
    dispatch(fetchCountries({ limit: "", page: "", sort: 'asc', name: '' }));
    dispatch(fetchState(data));
  }, [dispatch, searchTerm, currentPage, rowsPerPage, countryID]);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchInput(value);
    updateSearchParams({ searchTerm: value, page: 1 }); // Reset to page 1 on search
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage); // Zero-based index adjustment
    updateSearchParams({ page: newPage });
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1); // Reset to page 1 on rows per page change
    updateSearchParams({ limit: parseInt(event.target.value, 10), page: 1 });
  };

  const updateSearchParams = (newParams) => {
    const searchParams = new URLSearchParams();

    if (newParams.searchTerm !== undefined) {
      if (newParams.searchTerm) {
        searchParams.set('searchTerm', newParams.searchTerm);
      }
    } else if (searchInput) {
      searchParams.set('searchTerm', searchInput);
    }

    if (newParams.page) {
      searchParams.set('page', newParams.page);
    } else {
      searchParams.set('page', currentPage);
    }

    if (newParams.limit) {
      searchParams.set('limit', newParams.limit);
    } else {
      searchParams.set('limit', rowsPerPage);
    }

    if (newParams.countryID) {
      searchParams.set('countryID', newParams.countryID);
    } else if (countryID) {
      searchParams.set('countryID', countryID);
    }

    router.push(`${paths.dashboard.states.list}?${searchParams.toString()}`);
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
            <Typography variant="h4">States</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button startIcon={<PlusIcon />} variant="contained" onClick={() => {
              router.push(paths.dashboard.states.create);
            }}>
              Add
            </Button>
          </Box>
        </Stack>
        <Stack direction="row" spacing={2} sx={{ px: 3, py: 2 }}>
          <OutlinedInput
            placeholder="Search state"
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
          <CustomersFilters filters={{ email, phone, status, searchTerm, limit, page ,countryID}} sortDir={sortDir} Countries={allCountries} />
          <Divider />
          <Box sx={{ overflowX: 'auto' }}>
            {isLoading && <TableSkeleton />}
            {!isLoading && <CustomersTable rows={allState} />}
          </Box>
          <Divider />
          <CustomersPagination
            count={totalData || 0}
            page={currentPage - 1} // Zero-based index adjustment
            rowsPerPage={rowsPerPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        </Card>
      </Stack>
    </Box>
  );
}
