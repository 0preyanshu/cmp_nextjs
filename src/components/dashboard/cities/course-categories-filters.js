'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';

import { paths } from '@/paths';
import { FilterButton, FilterPopover, useFilterContext } from '@/components/core/filter-button';
import { Option } from '@/components/core/option';

import { useCustomersSelection } from './course-categories-selection-context';

export function CustomersFilters({ filters = {}, sortDir = 'desc', Countries, States }) {
  const { email, phone, status, countryID, stateID, limit, page } = filters;

  const router = useRouter();

  const selection = useCustomersSelection();

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
      email: '',
      phone: '',
      status: '',
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

  const handleEmailChange = React.useCallback(
    (value) => {
      updateSearchParams({ email: value }, sortDir);
    },
    [updateSearchParams, sortDir]
  );

  const handlePhoneChange = React.useCallback(
    (value) => {
      updateSearchParams({ phone: value }, sortDir);
    },
    [updateSearchParams, sortDir]
  );

  const handleSortChange = React.useCallback(
    (event) => {
      updateSearchParams(filters, event.target.value);
    },
    [updateSearchParams, filters]
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
