'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { useRouter, useParams, usePathname } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box, Button, Card, CardActions, CardContent, Divider, FormControl,
  FormHelperText, InputLabel, OutlinedInput, Select, Stack, Grid, MenuItem
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import { paths } from '@/paths';
import { logger } from '@/lib/default-logger';
import { toast } from '@/components/core/toaster';
import { useDispatch, useSelector } from 'react-redux';
import { cityActions, countryActions, StateActions } from '@/redux/slices';
import { LoadingButton } from '@mui/lab';

const schema = zod.object({
  cityName: zod.string().min(1, 'Name is required').max(255),
  cityShortName: zod.string().min(1, 'ShortName is required').max(255),
  countryID: zod.string().min(1, 'Country is required').max(255),
  stateID: zod.string().min(1, 'State is required').max(255)
});

export function CustomerCreateForm() {
  const [currentCity, setCurrentCity] = React.useState({});
  const [filteredStates, setFilteredStates] = React.useState([]);

  const { id } = useParams();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();

  const { allCountries } = useSelector((state) => state?.countries?.country);
  const { allState } = useSelector((state) => state?.states?.state);
  const { allCities, isLoading, totalData } = useSelector((state) => state?.cities?.city);

  const { fetchState } = StateActions;
  const { fetchCountries } = countryActions;
  const { fetchCities, createCity, updateCity } = cityActions;

  const isEdit = pathname.includes('edit');

  const defaultValues = React.useMemo(() => ({
    cityName: currentCity?.cityName || "",
    cityShortName: currentCity?.cityShortName || "",
    countryID: currentCity?.countryID || "",
    stateID: currentCity?.stateID || ""
  }), [currentCity]);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm({ defaultValues, resolver: zodResolver(schema) });

  React.useEffect(() => {
    reset(defaultValues);
  }, [currentCity, reset, defaultValues]);

  React.useEffect(() => {
    const data = { page: "", limit: "25" };
    dispatch(fetchCities(data));
    dispatch(fetchState(data));
    dispatch(fetchCountries(data));
  }, [dispatch]);

  React.useEffect(() => {
    if (allCities?.length && id) {
      const data = allCities.find((city) => String(city?.id) === String(id));
      setCurrentCity(data);
    }
  }, [allCities, id]);

  // Filter active countries
  const activeCountries = React.useMemo(() => allCountries?.filter(country => country.status_ === "ACTIVE"), [allCountries]);

  // Filter active states
  const activeStates = React.useMemo(() => allState?.filter(state => state.status_ === "ACTIVE"), [allState]);

  // Update filtered states based on selected country
  const selectedCountryID = watch('countryID');
  React.useEffect(() => {
    const states = activeStates?.filter(state => state.countryID === selectedCountryID);
    setFilteredStates(states);
  }, [selectedCountryID, activeStates]);

  const fieldMapping = {
    cityName: "cityName",
    cityShortName: "cityShortName",
    countryID: "countryID",
    stateID: "stateID"
  };

  const getChangedFields = (data) => {
    const changedFields = {};
    for (const key in data) {
      const mappedKey = fieldMapping[key];
      if (data[key] !== currentCity[mappedKey]) {
        changedFields[mappedKey] = data[key];
      }
    }
    // Add the id to the changed fields
    changedFields.id = currentCity.id;
    return changedFields;
  };

  const onSubmit = React.useCallback(
    async (data) => {
      try {
        const changedData = getChangedFields(data);

        if (isEdit) {
          await dispatch(updateCity(changedData)).then((res) => {
            if (res?.payload?.data?.data) {
              toast.success('Update success!');
              router.push(paths.dashboard.cities.list);
              dispatch(fetchCities({ page: "", limit: "25" }));
            } else {
              toast.error(res?.payload?.data?.error?.message || 'Internal Server Error');
            }
          });
        } else {
          await dispatch(createCity(data)).then((res) => {
            if (res?.payload?.data?.data) {
              toast.success('Create success!');
              router.push(paths.dashboard.cities.list);
              dispatch(fetchCities({ page: "", limit: "25" }));
            } else {
              toast.error(res?.payload?.data?.error?.message || 'Internal Server Error');
            }
          });
        }
      } catch (err) {
        logger.error(err);
      }
    },
    [isEdit, currentCity.id, dispatch, router, fetchCities, updateCity, createCity]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardContent>
          <Stack divider={<Divider />} spacing={4}>
            <Stack spacing={3}>
              <Grid container spacing={3}>
                <Grid xs={12}></Grid>
                <Grid item md={5} xs={12}>
                  <Controller
                    control={control}
                    name="cityName"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.cityName)} fullWidth sx={{ mx: 2, mt: 3 }}>
                        <InputLabel required>City Name</InputLabel>
                        <OutlinedInput {...field} />
                        {errors.cityName ? <FormHelperText>{errors.cityName.message}</FormHelperText> : null}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item md={5} xs={12}>
                  <Controller
                    control={control}
                    name="cityShortName"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.cityShortName)} fullWidth sx={{ mx: 2, mt: 3 }}>
                        <InputLabel required>City ShortName</InputLabel>
                        <OutlinedInput {...field} />
                        {errors.cityShortName ? <FormHelperText>{errors.cityShortName.message}</FormHelperText> : null}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item md={5} xs={12}>
                  <Controller
                    control={control}
                    name="countryID"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.countryID)} fullWidth sx={{ mx: 2, mt: 3 }}>
                        <InputLabel required>Country</InputLabel>
                        <Select {...field}>
                          <MenuItem value="">
                            <>Select Country</>
                          </MenuItem>
                          {activeCountries?.map((country) => (
                            <MenuItem key={country.id} value={country.id}>
                              {country.countryName}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.countryID ? <FormHelperText>{errors.countryID.message}</FormHelperText> : null}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item md={5} xs={12}>
                  <Controller
                    control={control}
                    name="stateID"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.stateID)} fullWidth sx={{ mx: 2, mt: 3 }}>
                        <InputLabel required>State</InputLabel>
                        <Select {...field} disabled={filteredStates.length === 0}>
                          <MenuItem value="">
                            <>Select State</>
                          </MenuItem>
                          {filteredStates?.map((state) => (
                            <MenuItem key={state.id} value={state.id}>
                              {state.stateName}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.stateID ? <FormHelperText>{errors.stateID.message}</FormHelperText> : null}
                      </FormControl>
                    )}
                  />
                </Grid>
              </Grid>
            </Stack>
          </Stack>
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button color="secondary" component={RouterLink} href={paths.dashboard.cities.list}>
            Cancel
          </Button>
          <LoadingButton
            type="submit"
            variant="contained"
            style={{ textTransform: 'capitalize' }}
            loading={isSubmitting}
          >
            {!isEdit ? 'Create City' : 'Save Changes'}
          </LoadingButton>
        </CardActions>
      </Card>
    </form>
  );
}
