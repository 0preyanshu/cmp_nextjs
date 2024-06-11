'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';

import Grid from '@mui/material/Unstable_Grid2';

import { Controller, useForm, useWatch } from 'react-hook-form';


import { paths } from '@/paths';
import { logger } from '@/lib/default-logger';

import { toast } from '@/components/core/toaster';
import { useDispatch, useSelector } from 'react-redux';

import { useParams, usePathname } from 'next/navigation';
import { z } from 'zod';
import { MenuItem } from '@mui/material';
import { currencies } from '../../../utils/currencyData';
import { CurrencyAction } from '@/redux/slices';

import { LoadingButton } from '@mui/lab';


const schema = z.object({
  currencyName: z.string().min(1, 'Currency Name is required').max(255, 'Currency Name must be at most 255 characters'),
  symbol: z.string().min(1, 'Symbol is required').max(255, 'Symbol must be at most 255 characters'),
  countryID: z.string().min(1, 'Country ID is required'),
});


export function CurrenciesCreateForm() {
  const [currentCurrency, setcurrentCurrency] = React.useState({});

  const { allCurrency } = useSelector((state) => state?.currency?.currency);

  const { id } = useParams();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();

  const { createCurrency,updateCurrency } = CurrencyAction;
 

  const { allCountries} = useSelector((state) => state?.countries?.country);

  const isEdit = pathname.includes('edit');

  const defaultValues = React.useMemo(
    () => ({
      currencyName: currentCurrency?.currencyName || '',
      symbol: currentCurrency?.currencySymbol || '',
      countryID: currentCurrency?.countryID || '',
    }),
    [currentCurrency]
  );

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm({ defaultValues, resolver: zodResolver(schema) });

  const watchedCurrencyName = useWatch({
    control,
    name: 'currencyName',
  });

  React.useEffect(() => {
    reset(defaultValues);
  }, [currentCurrency, reset, defaultValues]);



  React.useEffect(() => {

    if (allCurrency?.length && id) {
      const data = allCurrency.find((allCurrency) => String(allCurrency?.id) === String(id));
      setcurrentCurrency(data);
;
    }
  }, [allCurrency, id]);

  React.useEffect(() => {
    if (watchedCurrencyName) {
      const selectedCurrency = currencies.find((c) => c.currencyType === watchedCurrencyName);
      if (selectedCurrency) {
        setValue('symbol', selectedCurrency.symbol);
      }
    }
  }, [watchedCurrencyName, setValue]);

  const fieldMapping = {
    currencyName: 'currencyName',
    symbol: 'currencySymbol',
    countryID: 'countryID',
  };

  const getChangedFields = (data) => {
    const changedFields = {};
    for (const key in data) {
      const mappedKey = fieldMapping[key];
      if (String(data[key]) !== String(currentCurrency[mappedKey])) {
        changedFields[mappedKey] = data[key];
      }
    }
    // Add the id to the changed fields
    changedFields.id = currentCurrency.id;
    return changedFields;
  };

  const onSubmit = React.useCallback(
    async (data) => {
      try {
        const changedData = getChangedFields(data);
        console.log(data, 'data');
        console.log(changedData, 'changed data');

        if (isEdit) {
          await dispatch(updateCurrency(changedData)).then((res) => {
            console.log(res?.payload, 'restax');
            toast.success('Update success!');
            if (res?.payload?.data?.data) {
              toast.success('Update success!');
              router.push(paths.dashboard.currencies.list);

            } else {
              toast.error(res?.payload?.data?.error?.message || 'Internal Server Error');
            }
          });
        } else {
          await dispatch(createCurrency(data)).then((res) => {
            console.log(res?.payload, 'restax');
            if (res?.payload?.data?.data) {
              toast.success('Create success!');
              router.push(paths.dashboard.currencies.list);

            } else {
              toast.error(res?.payload?.data?.error?.message || 'Internal Server Error');
            }
          });
        }
      } catch (err) {
        logger.error(err);
      }
    },
    [isEdit, currentCurrency.id, dispatch, router,  updateCurrency, createCurrency]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardContent>
          <Stack divider={<Divider />} spacing={4}>
            <Stack spacing={3}>
              <Grid container spacing={3}>
                <Grid xs={12}></Grid>
                <Grid md={6} xs={12}>
                  <Controller
                    control={control}
                    name="currencyName"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.currencyName)} fullWidth>
                        <InputLabel required>Currency</InputLabel>
                        <Select {...field}>
                          <MenuItem value="">
                            <>Select Currency</>
                          </MenuItem>
                          {currencies?.map((c) => (
                            <MenuItem key={c.currencyType} value={c.currencyType}>
                              {c.currencyType + `(${c.symbol})`}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.currencyName ? (
                          <FormHelperText>{errors.currencyName.message}</FormHelperText>
                        ) : null}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid md={6} xs={12}>
                  <Controller
                    control={control}
                    name="symbol"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.symbol)} fullWidth>
                        <InputLabel required>Currency Symbol</InputLabel>
                        <OutlinedInput {...field} />
                        {errors.symbol ? (
                          <FormHelperText>{errors.symbol.message}</FormHelperText>
                        ) : null}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid md={6} xs={12}>
                  <Controller
                    control={control}
                    name="countryID"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.countryID)} fullWidth>
                        <InputLabel required>Country</InputLabel>
                        <Select {...field}>
                          <MenuItem value="">
                            <>Select Country</>
                          </MenuItem>
                          {allCountries?.map((c) => (
                            <MenuItem key={c.id} value={c.id}>
                              {c.countryName}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.countryID ? (
                          <FormHelperText>{errors.countryID.message}</FormHelperText>
                        ) : null}
                      </FormControl>
                    )}
                  />
                </Grid>
              </Grid>
            </Stack>
          </Stack>
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button color="secondary" component={RouterLink} href={paths.dashboard.currencies.list}>
            Cancel
          </Button>
          <LoadingButton
            type="submit"
            variant="contained"
            style={{ textTransform: 'capitalize' }}
            loading={isSubmitting}
          >
            {!isEdit ? 'Create Currency' : 'Save Changes'}
          </LoadingButton>
        </CardActions>
      </Card>
    </form>
  );
}
