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
import { CustomersFilters } from '@/components/dashboard/countries/course-categories-filters';
import { CustomersPagination } from '@/components/dashboard/courses/course-categories-pagination';
import { CustomersSelectionProvider } from '@/components/dashboard/countries/course-categories-selection-context';
import { CustomersTable } from '@/components/dashboard/countries/course-categories-table';

import InputAdornment from '@mui/material/InputAdornment';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import OutlinedInput from '@mui/material/OutlinedInput';
import { useRouter } from 'next/navigation';
import { paths } from '@/paths';
import { useDispatch, useSelector } from 'react-redux';
import { countryActions } from '@/redux/slices';
import TableSkeleton from '@/components/core/Skeletion';

export default function Page({ searchParams }) {
  const { email, phone, sortDir, status, searchTerm, page = 1, limit = 10 } = searchParams;

  const [currentPage, setCurrentPage] = React.useState(parseInt(page));
  const [rowsPerPage, setRowsPerPage] = React.useState(parseInt(limit));
  const [searchInput, setSearchInput] = React.useState(searchTerm || '');

  const router = useRouter();

  const { allCountries, loading: isLoading, totalData } = useSelector((state) => state?.countries?.country);
  const dispatch = useDispatch();
  const { deleteCountry, fetchCountries } = countryActions;

  React.useEffect(() => {
    const data = {
      page: currentPage,
      limit: rowsPerPage,
      sort: 'asc',
      name: searchTerm || '',
    };
    dispatch(fetchCountries(data));
    console.log('fetching countries', allCountries);
  }, [dispatch, searchTerm, currentPage, rowsPerPage]);

  const handleSearchChange = (event) => {
    setSearchInput(event.target.value);
    updateSearchParams({ ...searchParams, searchTerm: event.target.value, page: 1 }); // Reset to page 1 on search
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
    updateSearchParams({ ...searchParams, page: newPage });
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1); // Reset to page 1 on rows per page change
    updateSearchParams({ ...searchParams, limit: parseInt(event.target.value, 10), page: 1 });
  };

  const updateSearchParams = (newFilters) => {
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

    router.push(`${paths.dashboard.countries.list}?${searchParams.toString()}`);
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
            <Typography variant="h4">Country</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button startIcon={<PlusIcon />} variant="contained" onClick={() => {
              router.push(paths.dashboard.countries.create);
            }}>
              Add
            </Button>
          </Box>
        </Stack>
        <CustomersSelectionProvider customers={[]}>
          <Stack direction="row" spacing={2} sx={{ px: 3, py: 2 }}>
            <OutlinedInput
              placeholder="Search thread"
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
            {/* <CustomersFilters filters={{ email, phone, status }} sortDir={sortDir} /> */}
            <Divider />
            <Box sx={{ overflowX: 'auto' }}>
              {isLoading && <>
                <TableSkeleton />
              </>}
              {!isLoading && <>
                <CustomersTable rows={allCountries} />
              </>}
            </Box>
            <Divider />
            <CustomersPagination
              count={totalData || 0}
              page={currentPage-1}
              rowsPerPage={rowsPerPage}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
            />
          </Card>
        </CustomersSelectionProvider>
      </Stack>
    </Box>
  );
}
