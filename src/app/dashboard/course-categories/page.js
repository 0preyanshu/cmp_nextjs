'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';

import { CustomersFilters } from '@/components/dashboard/course-categories/course-categories-filters';
import { CustomersPagination } from '@/components/dashboard/courses/course-categories-pagination';
import { CustomersSelectionProvider } from '@/components/dashboard/course-categories/course-categories-selection-context';
import { CustomersTable } from '@/components/dashboard/course-categories/course-categories-table';

import InputAdornment from '@mui/material/InputAdornment';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import OutlinedInput from '@mui/material/OutlinedInput';
import { useRouter } from 'next/navigation';
import { paths } from '@/paths';
import { useDispatch, useSelector } from 'react-redux';
import { CourseCategoryActions } from '@/redux/slices';

const Page = ({ searchParams }) => {
  const { email, phone, sortDir, status, searchTerm, page = 1, limit = 10 } = searchParams;
  const router = useRouter();

  const [searchInput, setSearchInput] = React.useState(searchTerm || '');

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
    const fetchData = async () => {
      const data = {
        page,
        limit,
        name: searchTerm || '',
      };
      dispatch(fetchcategories(data));
    };

    fetchData();
  }, [dispatch, searchTerm, page, limit]);

  const handleSearchChange = (event) => {
    setSearchInput(event.target.value);
    updateSearchParams({ ...searchParams, searchTerm: event.target.value, page: 1 }); // Reset to first page on search
  };

  const handlePageChange = (event, newPage) => {
    updateSearchParams({ ...searchParams, page: newPage });
  };

  const handleRowsPerPageChange = (event) => {
    updateSearchParams({ ...searchParams, limit: parseInt(event.target.value, 10), page: 1 });
  };

  const updateSearchParams = (newFilters) => {
    const searchParams = new URLSearchParams();

    if (newFilters.sortDir) {
      searchParams.set('sortDir', newFilters.sortDir);
    }

    if (newFilters.status) {
      searchParams.set('status', newFilters.status);
    }

    if (newFilters.email) {
      searchParams.set('email', newFilters.email);
    }

    if (newFilters.phone) {
      searchParams.set('phone', newFilters.phone);
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
        <CustomersSelectionProvider customers={allCategories}>
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
              <CustomersTable rows={allCategories} />
            </Box>
            <Divider />
            <CustomersPagination
              count={totalData}
              page={page - 1} // Material-UI TablePagination uses zero-based index
              rowsPerPage={limit}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
            />
          </Card>
        </CustomersSelectionProvider>
      </Stack>
    </Box>
  );
};

export default Page;
