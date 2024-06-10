'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';

import { paths } from '@/paths';
import { FilterButton, FilterPopover, useFilterContext } from '@/components/core/filter-button';
import { Option } from '@/components/core/option';

import { useCustomersSelection } from './course-categories-selection-context';

export function CustomersFilters({ filters = {}, sortDir = 'desc', Countries }) {
  const { email, phone, status, countryID , searchTerm , page , limit} = filters;

  const router = useRouter();

  const selection = useCustomersSelection();

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

      if (newFilters.countryID) {
        searchParams.set('countryID', newFilters.countryID);
      }
      if(newFilters.searchTerm){
        searchParams.set('searchTerm', newFilters.searchTerm);
      }
      if(newFilters.page){
        searchParams.set('page', newFilters.page);
      }
      if(newFilters.limit){
        searchParams.set('limit', newFilters.limit);
      }

      router.push(`${paths.dashboard.states.list}?${searchParams.toString()}`);
    },
    [router]
  );

  const handleClearFilters = React.useCallback(() => {
    updateSearchParams({}, sortDir);
  }, [updateSearchParams, sortDir]);

  const handleStatusChange = React.useCallback(
    (_, value) => {
      updateSearchParams({ ...filters, status: value }, sortDir);
    },
    [updateSearchParams, filters, sortDir]
  );

  const handleEmailChange = React.useCallback(
    (value) => {
      updateSearchParams({ ...filters, email: value }, sortDir);
    },
    [updateSearchParams, filters, sortDir]
  );

  const handlePhoneChange = React.useCallback(
    (value) => {
      updateSearchParams({ ...filters, phone: value }, sortDir);
    },
    [updateSearchParams, filters, sortDir]
  );

  const handleSortChange = React.useCallback(
    (event) => {
      updateSearchParams(filters, event.target.value);
    },
    [updateSearchParams, filters]
  );

  const handleCountryChange = React.useCallback(
    (event) => {
      updateSearchParams({ ...filters, countryID: event.target.value }, sortDir);
    },
    [updateSearchParams, filters, sortDir]
  );

  const hasFilters =  countryID || searchTerm 
  

  return (
    <div>
      <Divider />
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flexWrap: 'wrap', px: 3, py: 2 }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flex: '1 1 auto', flexWrap: 'wrap' }}>
          {hasFilters ? <Button onClick={handleClearFilters}>Clear filters</Button> : null}
        </Stack>
        {selection.selectedAny ? (
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <Typography color="text.secondary" variant="body2">
              {selection.selected.size} selected
            </Typography>
            <Button color="error" variant="contained">
              Delete
            </Button>
          </Stack>
        ) : null}

        <Select
          sx={{ maxWidth: '100%', width: '165px' }}
          value={countryID || ''}
          onChange={handleCountryChange}
        >

          {console.log('Countrieids', countryID)}
          <Option value="">Select Country</Option>
          {Countries.map((country) => (
            <Option key={country.id} value={country.id}>
              {country.countryName}
            </Option>
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
