'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';

import { paths } from '@/paths';
import { FilterPopover, useFilterContext } from '@/components/core/filter-button';


// The tabs should be generated using API data.


export function CoursesFilters({ filters = {}, sortDir = 'desc', Categories = [] }) {
  const { email, phone, status, courseCategory } = filters;

  const router = useRouter();
  



  const updateSearchParams = React.useCallback(
    (newFilters, newSortDir) => {
      const searchParams = new URLSearchParams();

      if (newSortDir === 'asc') {
        searchParams.set('sortDir', newSortDir);
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

      if (newFilters.courseCategory) {
        searchParams.set('courseCategory', newFilters.courseCategory);
      }

      router.push(`${paths.dashboard.courses.list}?${searchParams.toString()}`);
    },
    [router]
  );

  const handleClearFilters = React.useCallback(() => {
    updateSearchParams({}, sortDir);
  }, [updateSearchParams, sortDir]);

 

  const handleCategoryChange = React.useCallback(
    (event) => {
      const category = event.target.value;
      updateSearchParams({ ...filters, courseCategory: category }, sortDir);
    },
    [updateSearchParams, filters, sortDir]
  );

  const hasFilters = status || email || phone || courseCategory;

  return (
    <div>
      <Divider />
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flexWrap: 'wrap', px: 3, py: 2 }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flex: '1 1 auto', flexWrap: 'wrap' }}>
          {hasFilters ? <Button onClick={handleClearFilters}>Clear filters</Button> : null}
        </Stack>

        <Select
          name="category"
          onChange={handleCategoryChange}
          sx={{ maxWidth: '100%', width: '200px' }}
          defaultValue=""
          value={courseCategory || ''}
        >
          <MenuItem value="">
            <>Select Category</>
          </MenuItem>
          {Categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.courseCategoryName}
            </MenuItem>
          ))}
        </Select>
      </Stack>
    </div>
  );
}

function EmailFilterPopover() {
  const { anchorEl, onApply, onClose, open, value: initialValue } = useFilterContext();
  const [value, setValue] = React.useState('');

  React.useEffect(() => {
    setValue(initialValue ?? '');
  }, [initialValue]);

  return (
    <FilterPopover anchorEl={anchorEl} onClose={onClose} open={open} title="Filter by email">
      <FormControl>
        <OutlinedInput
          onChange={(event) => {
            setValue(event.target.value);
          }}
          onKeyUp={(event) => {
            if (event.key === 'Enter') {
              onApply(value);
            }
          }}
          value={value}
        />
      </FormControl>
      <Button
        onClick={() => {
          onApply(value);
        }}
        variant="contained"
      >
        Apply
      </Button>
    </FilterPopover>
  );
}

function PhoneFilterPopover() {
  const { anchorEl, onApply, onClose, open, value: initialValue } = useFilterContext();
  const [value, setValue] = React.useState('');

  React.useEffect(() => {
    setValue(initialValue ?? '');
  }, [initialValue]);

  return (
    <FilterPopover anchorEl={anchorEl} onClose={onClose} open={open} title="Filter by phone number">
      <FormControl>
        <OutlinedInput
          onChange={(event) => {
            setValue(event.target.value);
          }}
          onKeyUp={(event) => {
            if (event.key === 'Enter') {
              onApply(value);
            }
          }}
          value={value}
        />
      </FormControl>
      <Button
        onClick={() => {
          onApply(value);
        }}
        variant="contained"
      >
        Apply
      </Button>
    </FilterPopover>
  );
}
