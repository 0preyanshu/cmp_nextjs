'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';

import { Pagination } from '@/components/core/pagination';

import { CourseCategoriesTable } from '@/components/dashboard/course-categories/course-categories-table';

import InputAdornment from '@mui/material/InputAdornment';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import OutlinedInput from '@mui/material/OutlinedInput';
import { useRouter } from 'next/navigation';
import { paths } from '@/paths';
import { useDispatch, useSelector } from 'react-redux';
import { CourseCategoryActions } from '@/redux/slices';
import TableSkeleton from '@/components/core/Skeletion';

const Page = ({ searchParams }) => {
  const { searchTerm, page = 1, limit = 10 } = searchParams;
  const router = useRouter();
  const isInitialMount = React.useRef(true);

  const [searchInput, setSearchInput] = React.useState(searchTerm || '');
  const [currentPage, setCurrentPage] = React.useState(parseInt(page));
  const [rowsPerPage, setRowsPerPage] = React.useState(parseInt(limit));

  const {
    allCategories,
    iserror,
    toast,
    loading: isLoading,
    totalData,
  } = useSelector((state) => state?.categories?.categories);
  const dispatch = useDispatch();
  const { fetchcategories } = CourseCategoryActions;

  React.useEffect(() => {
    const data = {
      page: currentPage,
      limit: rowsPerPage,
      name: searchInput || '',
    };
    if (!isInitialMount.current || allCategories.length === 0) {
      dispatch(fetchcategories(data));
    }
    updateSearchParams({
      searchTerm: searchInput,
      page: currentPage,
      limit: rowsPerPage,
    });

    if (isInitialMount.current) {
      isInitialMount.current = false;
    }
  }, [searchInput, currentPage, rowsPerPage]);

  const handleSearchChange = (event) => {
    setSearchInput(event.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
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

    router.push(`${paths.dashboard.coursecategories.list}?${searchParams.toString()}`);
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
            <Typography variant="h4">Course Category</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              startIcon={<PlusIcon />}
              variant="contained"
              onClick={() => {
                router.push(paths.dashboard.coursecategories.create);
              }}
            >
              Add
            </Button>
          </Box>
        </Stack>

        <Stack direction="row" spacing={2} sx={{ px: 3, py: 2 }}>
          <OutlinedInput
            placeholder="Search courses"
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
            {isLoading ? <TableSkeleton /> : <CourseCategoriesTable rows={allCategories} />}
          </Box>
          <Divider />
          <Pagination
            count={totalData}
            page={currentPage - 1}
            rowsPerPage={rowsPerPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        </Card>
      </Stack>
    </Box>
  );
};

export default Page;
