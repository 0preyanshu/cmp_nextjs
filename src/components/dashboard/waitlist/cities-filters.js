'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { paths } from '@/paths';
import { Option } from '@/components/core/option';

export function CitiesFilters({ filters = {}, sortDir = 'desc' }) {
  const { email, phone, status, limit, page, courseID, eventID, startDate } = filters;
  const { allCourses } = useSelector((state) => state?.courses?.courses);
  const { allEvents } = useSelector((state) => state?.event?.events);

  const router = useRouter();

  const updateSearchParams = React.useCallback(
    (newFilters, newSortDir) => {
      const searchParams = new URLSearchParams();

      // Preserve existing filters
      Object.entries({ ...filters, ...newFilters }).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.set(key, value);
        }
      });

      // Set sort direction if provided
      if (newSortDir === 'asc' || newSortDir === 'desc') {
        searchParams.set('sortDir', newSortDir);
      }

      router.push(`${paths.dashboard.waitlist.list}?${searchParams.toString()}`);
    },
    [router, filters]
  );

  const handleClearFilters = React.useCallback(() => {
    updateSearchParams({
      courseID: '',
      eventID: '',
      startDate: '',
      limit: 10,
      page: 1,
    }, sortDir);
  }, [updateSearchParams, sortDir]);

  const handleStatusChange = React.useCallback(
    (_, value) => {
      updateSearchParams({ status: value }, sortDir);
    },
    [updateSearchParams, sortDir]
  );

  const handleCourseChange = React.useCallback(
    (event) => {
      updateSearchParams({ courseID: event.target.value }, sortDir);
    },
    [updateSearchParams, sortDir]
  );

  const handleEventChange = React.useCallback(
    (event) => {
      updateSearchParams({ eventID: event.target.value }, sortDir);
    },
    [updateSearchParams, sortDir]
  );

  const handleDateChange = React.useCallback(
    (newValue) => {
      updateSearchParams({ startDate: newValue ? dayjs(newValue).format('YYYY-MM-DD') : '' }, sortDir);
    },
    [updateSearchParams, sortDir]
  );

  const hasFilters = status || email || phone || courseID || eventID || startDate;

  return (
    <div>
      <Divider />
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flexWrap: 'wrap', px: 3, py: 2 }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flex: '1 1 auto', flexWrap: 'wrap' }}>
          {hasFilters ? <Button onClick={handleClearFilters}>Clear filters</Button> : null}
        </Stack>

        <Select
          sx={{ maxWidth: '100%', width: '165px' }}
          defaultValue=""
          value={courseID || ''}
          onChange={handleCourseChange}
        >
          <Option value="">Select Course</Option>
          {allCourses.map((course) => (
            <Option key={course.id} value={course.id}>
              {course.courseName}
            </Option>
          ))}
        </Select>

        <Select
          sx={{ maxWidth: '100%', width: '165px' }}
          defaultValue=""
          value={eventID || ''}
          onChange={handleEventChange}
        >
          <Option value="">Select Event</Option>
          {allEvents.map((event) => (
            <Option key={event.id} value={event.id}>
              {event.eventName}
            </Option>
          ))}
        </Select>

        <DatePicker
          value={startDate ? dayjs(startDate) : null}
          onChange={handleDateChange}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Start Date"
              sx={{ maxWidth: '100%', width: '165px' }}
            />
          )}
        />
      </Stack>
    </div>
  );
}
