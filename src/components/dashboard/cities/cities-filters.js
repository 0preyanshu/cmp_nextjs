'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Button from '@mui/material/Button';

import Divider from '@mui/material/Divider';

import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';

import Typography from '@mui/material/Typography';


import { paths } from '@/paths';

import { Option } from '@/components/core/option';


export function CitiesFilters({ filters = {}, sortDir = 'desc', Countries, States }) {
  const { email, phone, status, countryID, stateID, limit, page } = filters;

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

      router.push(`${paths.dashboard.cities.list}?${searchParams.toString()}`);
    },
    [router, filters]
  );

  const handleClearFilters = React.useCallback(() => {
    updateSearchParams({
      countryID: '',
      stateID: '',
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

  const handleCountryChange = React.useCallback(
    (event) => {
      updateSearchParams({ countryID: event.target.value, stateID: '' }, sortDir); // Reset stateID when country changes
    },
    [updateSearchParams, sortDir]
  );

  const handleStateChange = React.useCallback(
    (event) => {
      updateSearchParams({ stateID: event.target.value }, sortDir);
    },
    [updateSearchParams, sortDir]
  );

  const filteredStates = countryID ? States.filter(state => state.countryID === countryID) : [];

  const hasFilters = status || email || phone || countryID || stateID;

  return (
    <div>
      <Divider />
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flexWrap: 'wrap', px: 3, py: 2 }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flex: '1 1 auto', flexWrap: 'wrap' }}>
          {hasFilters ? <Button onClick={handleClearFilters}>Clear filters</Button> : null}
        </Stack>
l

        <Select
          sx={{ maxWidth: '100%', width: '165px' }}
          defaultValue=""
          value={countryID || ''}
          onChange={handleCountryChange}
        >
          <Option value="">Select Country</Option>
          {Countries.map((country) => (
            <Option key={country.id} value={country.id}>
              {country.countryName}
            </Option>
          ))}
        </Select>

        <Select
          sx={{ maxWidth: '100%', width: '165px' }}
          defaultValue=""
          value={stateID || ''}
          onChange={handleStateChange}
          disabled={!countryID}
        >
          <Option value="">Select State</Option>
          {filteredStates.map((state) => (
            <Option key={state.id} value={state.id}>
              {state.stateName}
            </Option>
          ))}
        </Select>
      </Stack>
    </div>
  );
}

