'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { paths } from '@/paths';
import { logger } from '@/lib/default-logger';
import { toast } from '@/components/core/toaster';
import { useDispatch, useSelector } from 'react-redux';
import { CouponActions } from '@/redux/slices';
import { CurrencyAction } from '@/redux/slices';
import { EventsActions } from '@/redux/slices';
import { CoursesActions } from '@/redux/slices';
import { useParams, usePathname } from 'next/navigation';
import dayjs from 'dayjs';
import { useState } from 'react';
import { Checkbox, TextField, Autocomplete } from '@mui/material';
import { Typography,createFilterOptions } from '@mui/material';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';






const dateIsValid = (date) => !Number.isNaN(new Date(date).getTime());
const dateIsInFuture = (date) => dayjs(date).isAfter(dayjs());

const schema = zod.object({
  couponCode: zod.string().min(1, 'Coupon code is required'),
  expiryDate: zod.string().refine((val) => dateIsValid(new Date(val)), {
    message: 'Invalid date format',
  }).refine((val) => dateIsInFuture(new Date(val)), {
    message: 'Date must be in the future',
  }),
  couponAmount: zod.preprocess((val) => Number(val), zod.number().min(1, 'Coupon amount must be at least 1')),
  
  usageLimit: zod.preprocess((val) => Number(val), zod.number().min(1, 'Usage limit must be at least 1')),
  courseID: zod.array(zod.string()).min(1, 'At least one course is required'),
  eventID: zod.array(zod.string()).min(1, 'At least one event is required'),
  couponType: zod.string().min(1, 'Coupon type is required'),
  status_: zod.boolean(),
});

export function TaxesCreateForm() {
  const [currentCoupon, setcurrentCoupon] = React.useState({});
  const { allCourses } = useSelector((state) => state?.courses?.courses);
  const { allCoupons, loading: isLoading, totalData } = useSelector((state) => state?.coupon?.coupons);


  const { allCurrency } = useSelector((state) => state?.currency?.currency);
  const { allEvents } = useSelector((state) => state?.event?.events);

  const { fetchCurrency, deleteCurrency } = CurrencyAction;
  const { fetchCourses} = CoursesActions;
  const { fetchCoupons, deletecoupons,updateCoupons,creataCoupons } = CouponActions;
  const { fetchEvents } = EventsActions;

  const { id } = useParams();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();


  const isEdit = pathname.includes('edit');



  const defaultValues = React.useMemo(
    () => ({
      couponCode: currentCoupon?.couponCode ||'',
      expiryDate: dateIsValid(currentCoupon?.expiryDate) && dateIsInFuture(currentCoupon?.expiryDate) ? new Date(currentCoupon.expiryDate).toISOString() : new Date().toISOString() , 
      couponType: currentCoupon?.couponType||'FIXED',
      couponAmount: currentCoupon?.couponAmount|| '',
     
      usageLimit: currentCoupon?.usageLimit||'',
      courseID: currentCoupon?.courseID|| [],
      eventID:currentCoupon?.eventID|| [],
      status_: currentCoupon?.status_||true,
    }),
    [currentCoupon]
  );

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
  }, [currentCoupon, reset, defaultValues]);

  React.useEffect(() => {
    if (allCoupons?.length && id) {
      const data = allCoupons.find((allCoupons) => String(allCoupons?.id) === String(id));
      setcurrentCoupon(data);
    }
  }, [allCoupons, id]);

  React.useEffect(() => {
    const data ={
      page: 1,
      limit: '',
      name : '',
    }
    if(allCurrency.length===0)dispatch(fetchCurrency(data));
    if(allCourses.length===0)dispatch(fetchCourses(data));
    if(allEvents.length===0)dispatch(fetchEvents(data));

  }, [dispatch]);


  const fieldMapping = {
    couponCode: 'couponCode',
    expiryDate: 'expiryDate',
    couponType: 'couponType',
    couponAmount: 'couponAmount',
    usageLimit: 'usageLimit',
    courseID: 'courseID',
    eventID: 'eventID',
    status_: 'status_'
  };

  const getChangedFields = (data) => {
    const changedFields = {};
    for (const key in data) {
      const mKey = fieldMapping[key];
      if (String(data[key]) !== String(currentCoupon[mKey])) {
        changedFields[mKey] = data[key];
      }
    }
    changedFields.id = currentCoupon.id;
    return changedFields;
  };

  const onSubmit = React.useCallback(
    async (data) => {
      try {
        const changedData = getChangedFields(data);
        console.log(changedData, 'changedData');
        console.log(data, 'data');
        changedData.status_ = data.status_ ? 'ACTIVE' : 'INACTIVE';

        if (isEdit) {
          await dispatch(updateCoupons(changedData)).then((res) => {
            if (res?.payload?.data?.data) {
              toast.success('Update success!');
              router.push(paths.dashboard.coupons.list);
            } else {
              toast.error(res?.payload?.data?.error?.message || 'Internal Server Error');
            }
          });
        } else {
          await dispatch(creataCoupons(changedData)).then((res) => {
            if (res?.payload?.data?.data) {
              toast.success('Create success!');
              router.push(paths.dashboard.coupons.list);
            } else {
              toast.error(res?.payload?.data?.error?.message || 'Internal Server Error');
            }
          });
        }
      } catch (err) {
        logger.error(err);
      }
    },
    [isEdit, currentCoupon.id, dispatch, router]
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
                    name="couponCode"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.couponCode)} fullWidth>
                        <InputLabel required>Coupon Code</InputLabel>
                        <OutlinedInput {...field} />
                        {errors.couponCode ? <FormHelperText>{errors.couponCode.message}</FormHelperText> : null}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid md={6} xs={12}>
                  <Controller
                    control={control}
                    name="expiryDate"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.expiryDate)} fullWidth>
                        <DatePicker
                          label="Expiry Date"
                          value={dayjs(field.value)}
                          onChange={(date) => {
                            setValue('expiryDate', date.toISOString());
                            console.log(date, 'date');
                            console.log(new Date('2025-06-12T00:00:00.000Z'), 'field.value');
                          }}
                          renderInput={(params) => (
                            <OutlinedInput {...params} error={Boolean(errors.expiryDate)} />
                          )}
                        />
                        {errors.expiryDate ? <FormHelperText>{errors.expiryDate.message}</FormHelperText> : null}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid md={6} xs={12}>
                  <Controller
                    control={control}
                    name="couponType"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.couponType)} fullWidth>
                        <InputLabel required>Coupon Type</InputLabel>
                        <Select {...field}>
                          <MenuItem value="STANDARD">Percentage</MenuItem>
                          <MenuItem value="FIXED">Fixed Amount</MenuItem>
                        </Select>
                        {errors.couponType ? <FormHelperText>{errors.couponType.message}</FormHelperText> : null}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid md={6} xs={12}>
                  <Controller
                    control={control}
                    name="couponAmount"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.couponAmount)} fullWidth>
                        <InputLabel required>Coupon Amount</InputLabel>
                        <OutlinedInput
                          type="number"
                          inputProps={{ min: 1 }}
                          {...field}
                        />
                        {errors.couponAmount ? <FormHelperText>{errors.couponAmount.message}</FormHelperText> : null}
                      </FormControl>
                    )}
                  />
                </Grid>
                {/* <Grid md={6} xs={12}>
                  <Controller
                    control={control}
                    name="currencyID"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.currencyID)} fullWidth>
                        <InputLabel required>Currency Type</InputLabel>
                        <Select {...field}>
                          <MenuItem value="">Select Currency</MenuItem>
                          {allCurrency.map((currency) => (
                            <MenuItem key={currency.id} value={currency.id}>
                              {currency.currencyName}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.currencyID ? <FormHelperText>{errors.currencyID.message}</FormHelperText> : null}
                      </FormControl>
                    )}
                  />
                </Grid> */}
                <Grid md={6} xs={12}>
                  <Controller
                    control={control}
                    name="usageLimit"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.usageLimit)} fullWidth>
                        <InputLabel required>Usage Limit</InputLabel>
                        <OutlinedInput
                          type="number"
                          inputProps={{ min: 1 }}
                          {...field}
                        />
                        {errors.usageLimit ? <FormHelperText>{errors.usageLimit.message}</FormHelperText> : null}
                      </FormControl>
                    )}
                  />
                </Grid>

                <Grid xs={12} md={6} mt={4} >
                  <Controller
                    name="status_"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth error={Boolean(errors.status_)}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={field.value}
                              onChange={(event) => field.onChange(event.target.checked)}
                              color="primary"
                            />
                          }
                          label="Active"
                        />
                        {errors.status_ ? <FormHelperText>{errors.status_.message}</FormHelperText> : null}
                      </FormControl>
                    )}
                  />
                </Grid>
                
              </Grid>
            </Stack>
          </Stack>
          <Grid md={6} xs={12} mt={3}>
                <CourseSelection control={control} errors={errors} />
                </Grid>
          <Grid md={6} xs={12} mt={3}>
                <EventsSelection control={control} errors={errors} />
                </Grid>
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button color="secondary" component={RouterLink} href={paths.dashboard.coupons.list}>
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            Save Changes
          </Button>
        </CardActions>
      </Card>
    </form>
  );
}

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;


function CourseSelection({ control, errors }) {
  const { allCourses } = useSelector((state) => state?.courses?.courses);

  return (
    <div>
      <Controller
        name="courseID"
        control={control}
        render={({ field }) => (
          <>
            <Autocomplete
              {...field}
              multiple
              disableCloseOnSelect
              freeSolo
              onChange={(event, newValue) => {
                if (newValue.find((option) => option.all))
                  return field.onChange(field?.value?.length === allCourses?.length ? [] : allCourses?.map((option) => option.id));

                field.onChange(newValue);
              }}
              options={allCourses && allCourses?.map((option) => option.id)}
              getOptionLabel={(eventId) =>
                allCourses.find((event) => event.id === eventId)?.courseName || ''
              }
              filterOptions={(options, params) => {
                const filter = createFilterOptions();
                const filtered = filter(options, params);
                return [{ title: 'Select All...', all: true }, ...filtered];
              }}
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={option.all ? (field.value.length === allCourses.length) : selected}
                  />
                  {option.all ? option?.title : allCourses.find((event) => event.id === option)?.courseName || ''}
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  label="Select Applicable Courses:"
                  {...params}
                  error={!!errors.courseID}
                  helperText={errors.courseID ? errors.courseID.message : ''}
                />
              )}
            />
          </>
        )}
      />
    </div>
  );
}
function EventsSelection({ control, errors }) {
  const { allEvents } = useSelector((state) => state?.event?.events);

  return (
    <div>
      <Controller
        name="eventID"
        control={control}
        render={({ field }) => (
          <>
            <Autocomplete
              {...field}
              multiple
              disableCloseOnSelect
              freeSolo
              onChange={(event, newValue) => {
                if (newValue.find((option) => option.all))
                  return field.onChange(field?.value?.length === allEvents?.length ? [] : allEvents?.map((option) => option.id));

                field.onChange(newValue);
              }}
              options={allEvents && allEvents?.map((option) => option.id)}
              getOptionLabel={(eventId) =>
                allEvents.find((event) => event.id === eventId)?.eventName || ''
              }
              filterOptions={(options, params) => {
                const filter = createFilterOptions();
                const filtered = filter(options, params);
                return [{ title: 'Select All...', all: true }, ...filtered];
              }}
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={option.all ? (field.value.length === allEvents.length) : selected}
                  />
                  {option.all ? option?.title : allEvents.find((event) => event.id === option)?.eventName || ''}
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  label="Select Applicable Events:"
                  {...params}
                  error={!!errors.eventID}
                  helperText={errors.eventID ? errors.eventID.message : ''}
                />
              )}
            />
          </>
        )}
      />
    </div>
  );
}
