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

import { paths } from '@/paths';
import {  FilterPopover, useFilterContext } from '@/components/core/filter-button';
import { Option } from '@/components/core/option';
import { useSelector } from 'react-redux';



export function StatesFilters({ filters = {}, sortDir = 'desc' }) {
  const {  userTypeID , searchTerm } = filters;
  const { userTypes } = useSelector((state) => state.userType.userType);

  const router = useRouter();


  const updateSearchParams = React.useCallback(
    (newFilters, newSortDir) => {
      const searchParams = new URLSearchParams();

      if (newFilters.userTypeID) {
        searchParams.set('userTypeID', newFilters.userTypeID);
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

      router.push(`${paths.dashboard.users.list}?${searchParams.toString()}`);
    },
    [router]
  );

  const handleClearFilters = React.useCallback(() => {
    updateSearchParams({}, sortDir);
  }, [updateSearchParams, sortDir]);


  const handleUserTypeChange = React.useCallback(
    (event) => {
      updateSearchParams({ ...filters, userTypeID: event.target.value }, sortDir);
    },
    [updateSearchParams, filters, sortDir]
  );

  const hasFilters =  userTypeID || searchTerm 
  

  return (
    <div>
      <Divider />
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flexWrap: 'wrap', px: 3, py: 2 }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flex: '1 1 auto', flexWrap: 'wrap' }}>
          {hasFilters ? <Button onClick={handleClearFilters}>Clear filters</Button> : null}
        </Stack>


        <Select
          sx={{ maxWidth: '100%', width: '165px' }}
          value={userTypeID || ''}
          onChange={handleUserTypeChange}
        >

          {/* {console.log('Countrieids', userTypeID)} */}
          <Option value="">Select User Type</Option>
          {userTypes.map((e) => (
            <Option key={e.id} value={e.id}>
              {e.userTypeName || "No User Type"}
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
