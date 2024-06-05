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
import { CustomersFilters } from '@/components/dashboard/courses/course-categories-filters';
import { CustomersPagination } from '@/components/dashboard/courses/course-categories-pagination';
import { CustomersSelectionProvider } from '@/components/dashboard/courses/course-categories-selection-context';
import { CustomersTable } from '@/components/dashboard/courses/course-categories-table';

import InputAdornment from '@mui/material/InputAdornment';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import OutlinedInput from '@mui/material/OutlinedInput';
import { useRouter } from 'next/navigation'
import { paths } from '@/paths';
import { useDispatch, useSelector } from 'react-redux';
import { CourseCategoryActions } from '@/redux/slices';
import { CoursesActions } from '@/redux/slices';




const customers = [
  {
    id: 'USR-005',
    name: 'Fran Perez',
    avatar: '/assets/avatar-5.png',
    email: 'fran.perez@domain.com',
    phone: '(815) 704-0045',
    quota: 50,
    status: 'active',
    createdAt: dayjs().subtract(1, 'hour').toDate(),
  },
  {
    id: 'USR-004',
    name: 'Penjani Inyene',
    avatar: '/assets/avatar-4.png',
    email: 'penjani.inyene@domain.com',
    phone: '(803) 937-8925',
    quota: 100,
    status: 'active',
    createdAt: dayjs().subtract(3, 'hour').toDate(),
  },
  {
    id: 'USR-003',
    name: 'Carson Darrin',
    avatar: '/assets/avatar-3.png',
    email: 'carson.darrin@domain.com',
    phone: '(715) 278-5041',
    quota: 10,
    status: 'blocked',
    createdAt: dayjs().subtract(1, 'hour').subtract(1, 'day').toDate(),
  },
  {
    id: 'USR-002',
    name: 'Siegbert Gottfried',
    avatar: '/assets/avatar-2.png',
    email: 'siegbert.gottfried@domain.com',
    phone: '(603) 766-0431',
    quota: 0,
    status: 'pending',
    createdAt: dayjs().subtract(7, 'hour').subtract(1, 'day').toDate(),
  },
  {
    id: 'USR-001',
    name: 'Miron Vitold',
    avatar: '/assets/avatar-1.png',
    email: 'miron.vitold@domain.com',
    phone: '(425) 434-5535',
    quota: 50,
    status: 'active',
    createdAt: dayjs().subtract(2, 'hour').subtract(2, 'day').toDate(),
  },
];

export default function Page({ searchParams }) {
  const { email, phone, sortDir, status } = searchParams;

  const sortedCustomers = applySort(customers, sortDir);

  const router = useRouter();

  const {
    allCategories,
    iserror,
    toast
   
   
  } = useSelector((state) => state?.categories?.categories);
  const { allCourses, loading: isLoading, totalData } = useSelector((state) => state?.courses?.courses);
  const dispatch = useDispatch();
  const { fetchCourses } = CoursesActions;
  const { fetchcategories } = CourseCategoryActions;



  React.useEffect(() => {
    const data = {
      page: 1,
      limit: 10,
      sort: 'asc',
      search: '',
    };
    dispatch(fetchcategories(data));
    dispatch(fetchCourses(data));
    console.log('fetchcategories',allCategories);
    console.log('fetchCourses',allCourses);
  }
  , [dispatch]);

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
            <Button startIcon={<PlusIcon />} variant="contained" onClick={()=>{
             router.push(paths.dashboard.courses.create);
            }}>
              Add
            </Button>
          </Box>
        </Stack>
    
        <Stack direction="row" spacing={2} sx={{ px: 3, py: 2 }}>

<OutlinedInput
      placeholder="Search thread"
      startAdornment={
        <InputAdornment position="start">
          <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
        </InputAdornment>
      }
      sx={{ width: '100%' }}
    />

  </Stack>
  {console.log('allCategoriesfinal',allCategories)}
          <Card>
            <CustomersFilters filters={{ email, phone, status }} sortDir={sortDir} Categories={allCategories}/>
            <Divider />
            <Box sx={{ overflowX: 'auto' }}>
              <CustomersTable rows={allCourses} />
            </Box>
            <Divider />
            <CustomersPagination count={allCourses.length} page={1} />
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
