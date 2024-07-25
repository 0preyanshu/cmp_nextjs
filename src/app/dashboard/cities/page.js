'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';

import { CitiesFilters } from '@/components/dashboard/cities/cities-filters';
import { Pagination } from '@/components/core/pagination';
import { CitiesTable } from '@/components/dashboard/cities/cities-table';

import InputAdornment from '@mui/material/InputAdornment';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import OutlinedInput from '@mui/material/OutlinedInput';
import { useRouter } from 'next/navigation';
import { paths } from '@/paths';
import { useDispatch, useSelector } from 'react-redux';
import { cityActions } from '@/redux/slices';
import { countryActions } from '@/redux/slices';
import { StateActions } from '@/redux/slices';

import TableSkeleton from '@/components/core/Skeletion';

export default function Page({ searchParams }) {
  const { sortDir, countryID, stateID, searchTerm, page = 1, limit = 10 } = searchParams;

  const [currentPage, setCurrentPage] = React.useState(parseInt(page));
  const [rowsPerPage, setRowsPerPage] = React.useState(parseInt(limit));
  const [searchInput, setSearchInput] = React.useState(searchTerm || '');

  const router = useRouter();

  const { allCountries } = useSelector((state) => state?.countries?.country);
  const { allState } = useSelector((state) => state?.states?.state);
  const { allCities, iserror, toast, loading: isLoading, totalData } = useSelector((state) => state?.cities?.city);
  const dispatch = useDispatch();
  const { fetchState } = StateActions;
  const { fetchCountries } = countryActions;
  const { fetchCities } = cityActions;

 

  React.useEffect(() => {
   
      const data = {
        page: currentPage,
        limit: rowsPerPage,
        name: searchInput || '',
        countryId: countryID || '',
        stateId: stateID || '',
      };
      if(allCountries.length === 0 ){
        dispatch(fetchCountries({ limit: "", page: "", search: "" }));
      }
      if(allState.length === 0){
        dispatch(fetchState({ limit: "", page: "", search: "" }));
      }
     
         dispatch(fetchCities(data));
      

      updateSearchParams({ searchTerm: searchInput, page: currentPage, limit: rowsPerPage, countryID: countryID, stateID: stateID });
     
    
  
  }, [searchInput, currentPage, rowsPerPage, countryID, stateID]);

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

    if (newFilters.countryID) {
      searchParams.set('countryID', newFilters.countryID);
    }

    if (newFilters.stateID) {
      searchParams.set('stateID', newFilters.stateID);
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
          <CitiesFilters filters={{ countryID, stateID }} sortDir={sortDir} Countries={allCountries} States={allState} />
          <Divider />
          <Box sx={{ overflowX: 'auto' }}>
            {isLoading ? (
              <TableSkeleton />
            ) : (
              <CitiesTable rows={allCities} />
            )}
          </Box>
          <Divider />
          <Pagination count={totalData} page={currentPage-1} rowsPerPage={rowsPerPage} onPageChange={handlePageChange} onRowsPerPageChange={handleRowsPerPageChange} />
        </Card>
      </Stack>
    </Box>
  );
}
