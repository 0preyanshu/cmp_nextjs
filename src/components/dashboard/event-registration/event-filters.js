'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import { paths } from '@/paths';
import { Option } from '@/components/core/option';
import { useSelector } from 'react-redux';

export function EventFilters({ filters = {} }) {
  const { countryID, instructorID, courseCategoryID, courseID, timezoneID } = filters;
  const router = useRouter();
  const { allCountries } = useSelector((state) => state?.countries?.country);
  const { allCourses } = useSelector((state) => state?.courses?.courses);
  const { allInstructors } = useSelector((state) => state?.instructors?.instructors);
  const { allTimezones } = useSelector((state) => state?.timezone?.timezones);
  const { allCategories } = useSelector((state) => state?.categories?.categories);

  const updateSearchParams = React.useCallback(
    (newFilters) => {
      const searchParams = new URLSearchParams();

      // Preserve existing filters
      Object.entries({ ...filters, ...newFilters }).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.set(key, value);
        }
      });
      router.push(`${paths.dashboard.eventregistration.list}?${searchParams.toString()}`);
    },
    [router, filters]
  );

  const handleClearFilters = React.useCallback(() => {
    updateSearchParams({
      countryID: '',
      stateID: '',
      instructorID: '',
      courseCategoryID: '',
      courseID: '',
      timezoneID: '',
      limit: 10,
      page: 1,
    });
  }, [updateSearchParams]);

  const handleFilterChange = React.useCallback(
    (event, filterKey) => {
      const newFilter = { [filterKey]: event.target.value };
      updateSearchParams(newFilter);
    },
    [updateSearchParams]
  );

  const hasFilters = countryID || instructorID || courseCategoryID || courseID || timezoneID;

  return (
    <div>
      <Divider />
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flexWrap: 'wrap', px: 3, py: 2 }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flex: '1 1 auto', flexWrap: 'wrap' }}>
          {hasFilters ? <Button onClick={handleClearFilters}>Clear filters</Button> : null}
        </Stack>
      </Stack>
      <Grid container spacing={3} sx={{ px: 3, py: 2 }}>
        <Grid item xs={12} sm={6} lg={2}>
          <Select
            fullWidth
            defaultValue=""
            value={countryID || ''}
            onChange={(event) => handleFilterChange(event, 'countryID')}
          >
            <Option value="">Select Country</Option>
            {allCountries.filter((country) => country.status_ === 'ACTIVE').map((country) => (
              <Option key={country.id} value={country.id}>
                {country.countryName}
              </Option>
            ))}
          </Select>
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <Select
            fullWidth
            defaultValue=""
            value={instructorID || ''}
            onChange={(event) => handleFilterChange(event, 'instructorID')}
          >
            <Option value="">Select Instructor</Option>
            {allInstructors.filter((instructor) => instructor.status_ === 'ACTIVE').map((instructor) => (
              <Option key={instructor.id} value={instructor.id}>
                {instructor.firstname} {instructor.lastname}
              </Option>
            ))}
          </Select>
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <Select
            fullWidth
            defaultValue=""
            value={courseCategoryID || ''}
            onChange={(event) => handleFilterChange(event, 'courseCategoryID')}
          >
            <Option value="">Select Course Category</Option>
            {allCategories.filter((category) => category.status_ === 'ACTIVE').map((category) => (
              <Option key={category.id} value={category.id}>
                {category.courseCategoryName}
              </Option>
            ))}
          </Select>
        </Grid>

        <Grid item xs={12} sm={6} lg={2}>
          <Select
            fullWidth
            defaultValue=""
            value={courseID || ''}
            onChange={(event) => handleFilterChange(event, 'courseID')}
          >
            <Option value="">Select Course</Option>
            {allCourses.filter((course) => course.status_ === 'ACTIVE').map((course) => (
              <Option key={course.id} value={course.id}>
                {course.courseName}
              </Option>
            ))}
          </Select>
        </Grid>

        <Grid item xs={12} sm={6} lg={2}>
          <Select
            fullWidth
            defaultValue=""
            value={timezoneID || ''}
            onChange={(event) => handleFilterChange(event, 'timezoneID')}
          >
            <Option value="">Select Timezone</Option>
            {allTimezones.filter((timezone) => timezone.status_ === 'ACTIVE').map((timezone) => (
              <Option key={timezone.id} value={timezone.id}>
                {timezone.timezoneName}
              </Option>
            ))}
          </Select>
        </Grid>
      </Grid>
    </div>
  );
}
