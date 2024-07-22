'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';

import { CoursesFilters } from '@/components/dashboard/courses/courses-filters';
import { Pagination } from '@/components/core/pagination';
import { CoursesTable } from '@/components/dashboard/courses/courses-table';

import InputAdornment from '@mui/material/InputAdornment';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import OutlinedInput from '@mui/material/OutlinedInput';
import { useRouter } from 'next/navigation';
import { paths } from '@/paths';
import { useDispatch, useSelector } from 'react-redux';
import { CourseCategoryActions } from '@/redux/slices';
import { CoursesActions } from '@/redux/slices';
import TableSkeleton from '@/components/core/Skeletion';

export default function Page({ searchParams }) {
  const { sortDir, courseCategory, searchTerm, page = 1, limit = 10 } = searchParams;

  const [currentPage, setCurrentPage] = React.useState(parseInt(page));
  const [rowsPerPage, setRowsPerPage] = React.useState(parseInt(limit));

  const router = useRouter();

  const {
    allCategories,
  } = useSelector((state) => state?.categories?.categories);
  const { allCourses, loading: isLoading } = useSelector((state) => state?.courses?.courses);
  const dispatch = useDispatch();
  const { fetchCourses } = CoursesActions;
  const { fetchcategories } = CourseCategoryActions;

  const [searchInput, setSearchInput] = React.useState(searchTerm || '');



  React.useEffect(() => {
    const data = {
      page: currentPage,
      limit: rowsPerPage,
      sort: 'asc',
      name: searchInput || '',
      category: courseCategory || '',
    };

  
      dispatch(fetchCourses(data));
    
    if ( allCategories.length === 0) {
      dispatch(fetchcategories({ limit: '', page: '', search: '' }));
    }

    updateSearchParams({ searchTerm: searchInput, page: currentPage, limit: rowsPerPage, courseCategory });

    
  }, [searchInput, currentPage, rowsPerPage, courseCategory]);

  const handleSearchChange = (event) => {
    setSearchInput(event.target.value);
    setCurrentPage(1);
    updateSearchParams({ ...searchParams, searchTerm: event.target.value, page: 1 });
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage );
    updateSearchParams({ ...searchParams, page: newPage });
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
    updateSearchParams({ ...searchParams, limit: parseInt(event.target.value, 10), page: 1 });
  };

  const updateSearchParams = (newFilters) => {
    const searchParams = new URLSearchParams();

    if (newFilters.courseCategory) {
      searchParams.set('courseCategory', newFilters.courseCategory);
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

    router.push(`${paths.dashboard.courses.list}?${searchParams.toString()}`);
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
            <Typography variant="h4">Courses</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              startIcon={<PlusIcon />}
              variant="contained"
              onClick={() => {
                router.push(paths.dashboard.courses.create);
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
          <CoursesFilters filters={{ courseCategory, searchTerm }} sortDir={sortDir} Categories={allCategories} />
          <Divider />
          <Box sx={{ overflowX: 'auto' }}>
            {isLoading ? <TableSkeleton /> : <CoursesTable rows={allCourses} />}
          </Box>
          <Divider />
          <Pagination
            count={100}
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
