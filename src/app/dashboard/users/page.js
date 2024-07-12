'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';

import { StatesFilters } from '@/components/dashboard/users/states-filters';
import {Pagination } from '@/components/core/pagination';

import { StatesTable } from '@/components/dashboard/users/states-table';

import InputAdornment from '@mui/material/InputAdornment';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import OutlinedInput from '@mui/material/OutlinedInput';
import { useRouter } from 'next/navigation';
import { paths } from '@/paths';
import { useDispatch, useSelector } from 'react-redux';
import { UserActions } from '@/redux/slices';
import { UserTypeActions } from '@/redux/slices';
import TableSkeleton from '@/components/core/Skeletion';

export default function Page({ searchParams }) {
  const { sortDir, page = 1, limit = 10, searchTerm = '', userTypeID = '' } = searchParams;

  const [currentPage, setCurrentPage] = React.useState(parseInt(page));
  const [rowsPerPage, setRowsPerPage] = React.useState(parseInt(limit));
  const [searchInput, setSearchInput] = React.useState(searchTerm);

  const router = useRouter();

  const { userTypes } = useSelector((state) => state.userType.userType);
  const { allUsers, loading: isLoading, totalData } = useSelector((state) => state.users.users);
  const {  fetchUser } = UserActions;
  const { fetchUserType } = UserTypeActions ;
  const isInitialMount = React.useRef(true);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (!isInitialMount.current) {
      const data = {
        page: currentPage,
        limit: rowsPerPage,
        name: searchInput || '',
        userTypeID: userTypeID || '',
      };
      if(userTypes.length === 0){
        dispatch(fetchUserType({ limit: "", page: "", search: "" }));
      }
      if(allUsers.length === 0 || !isInitialMount.current){
       dispatch(fetchUser(data));}

      
    }
    updateSearchParams({ searchTerm: searchInput, page: currentPage, limit: rowsPerPage });
    
   
    if(isInitialMount.current){
      isInitialMount.current = false;
    }
  
  },[searchInput, currentPage, rowsPerPage, userTypeID]);



  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchInput(value);
    updateSearchParams({ searchTerm: value, page: 1 }); 
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage); 
    updateSearchParams({ page: newPage });
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1); 
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

    if (newParams.userTypeID) {
      searchParams.set('userTypeID', newParams.userTypeID);
    } else if (userTypeID) {
      searchParams.set('userTypeID', userTypeID);
    }

    router.push(`${paths.dashboard.users.list}?${searchParams.toString()}`);
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
            <Typography variant="h4">Users</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button startIcon={<PlusIcon />} variant="contained" onClick={() => {
              console.log("clicked")
              router.push(paths.dashboard.users.create);
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
          <StatesFilters filters={{  searchTerm, limit, page ,userTypeID}} sortDir={sortDir} />
          <Divider />
          <Box sx={{ overflowX: 'auto' }}>
            {isLoading && <TableSkeleton />}
            {!isLoading && <StatesTable rows={ allUsers} />}
          </Box>
          <Divider />
          <Pagination
            page={currentPage - 1} 
            rowsPerPage={rowsPerPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        </Card>
      </Stack>
    </Box>
  );
}
