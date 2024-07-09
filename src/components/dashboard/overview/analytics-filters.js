'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

import { paths } from '@/paths';

export function AnalyticsFilters({ filters = {}, sortDir = 'desc' }) {
  const { startDate, endDate, limit, page } = filters;

  const router = useRouter();

  const updateSearchParams = React.useCallback(
    (newFilters, newSortDir) => {
      const searchParams = new URLSearchParams();

      Object.entries({ ...filters, ...newFilters }).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.set(key, value);
        }
      });

      if (newSortDir === 'asc' || newSortDir === 'desc') {
        searchParams.set('sortDir', newSortDir);
      }

      router.push(`${paths.dashboard.cities.list}?${searchParams.toString()}`);
    },
    [router, filters]
  );

  const handleClearFilters = React.useCallback(() => {
    updateSearchParams({
      startDate: '',
      endDate: '',
      limit: 10,
      page: 1,
    }, sortDir);
  }, [updateSearchParams, sortDir]);

  const handleStartDateChange = React.useCallback(
    (newDate) => {
      updateSearchParams({ startDate: newDate ? newDate.format('YYYY-MM-DD') : '' }, sortDir);
    },
    [updateSearchParams, sortDir]
  );

  const handleEndDateChange = React.useCallback(
    (newDate) => {
      updateSearchParams({ endDate: newDate ? newDate.format('YYYY-MM-DD') : '' }, sortDir);
    },
    [updateSearchParams, sortDir]
  );

  const hasFilters = startDate || endDate;

  return (
    <div>
      <Divider />
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flexWrap: 'wrap', px: 3, py: 2 }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flex: '1 1 auto', flexWrap: 'wrap' }}>
          {hasFilters ? <Button onClick={handleClearFilters}>Clear filters</Button> : null}
        </Stack>

        <DatePicker
          value={startDate ? dayjs(startDate) : null}
          onChange={handleStartDateChange}
          inputFormat="MM/DD/YYYY"
          slotProps={{ textField: { placeholder: 'Start Date' } }}
          renderInput={(params) => (
            <TextField
              {...params}
              sx={{ maxWidth: '100%', width: '165px' }}
            />
          )}
        />

        <DatePicker
          value={endDate ? dayjs(endDate) : null}
          onChange={handleEndDateChange}
          inputFormat="MM/DD/YYYY"
          slotProps={{ textField: { placeholder: 'End Date' } }}
          renderInput={(params) => (
            <TextField
              {...params}
              sx={{ maxWidth: '100%', width: '165px' }}
            />
          )}
        />
      </Stack>
    </div>
  );
}
