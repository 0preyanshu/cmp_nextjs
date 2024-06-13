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
import { TaxActions } from '@/redux/slices';
import { useParams, usePathname } from 'next/navigation';
import dayjs from 'dayjs';
import { useState } from 'react';
import { Checkbox, TextField, Autocomplete } from '@mui/material';
import { Typography,createFilterOptions } from '@mui/material';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';



const allCoursesData = [
  { id: 1, courseName: 'Mathematics' },
  { id: 2, courseName: 'Physics' },
  { id: 3, courseName: 'Chemistry' },
  { id: 4, courseName: 'Biology' },
];

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
  currencyID: zod.string().min(1, 'Currency type is required'),
  usageLimit: zod.preprocess((val) => Number(val), zod.number().min(1, 'Usage limit must be at least 1')),
  courseIds: zod.array(zod.number()),
});

export function TaxesCreateForm() {
  const [currentCoupon, setcurrentCoupon] = React.useState({});

  const { allTaxes, iserror, loading: isLoading, totalData } = useSelector((state) => state?.taxes?.taxes);

  const { id } = useParams();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();

  const { createTax, updateTax, fetchTaxes } = TaxActions;

  const isEdit = pathname.includes('edit');



  const defaultValues = React.useMemo(
    () => ({
      couponCode: '',
      expiryDate: dateIsValid(currentCoupon?.expiryDate) && dateIsInFuture(currentCoupon?.expiryDate) ? new Date(currentCoupon.expiryDate).toISOString() : new Date().toISOString() ,  // Hardcoded future date
      couponType: '',
      couponAmount: '',
      currencyID: 'USD',
      usageLimit: '',
      courseIds: [],
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
    if (allTaxes?.length && id) {
      const data = allTaxes.find((allTaxes) => String(allTaxes?.id) === String(id));
      setcurrentCoupon(data);
    }
  }, [allTaxes, id]);

  const fieldMapping = {
    couponCode: 'couponCode',
    expiryDate: 'expiryDate',
    couponType: 'couponType',
    couponAmount: 'couponAmount',
    currencyID: 'currencyID',
    usageLimit: 'usageLimit',
  };

  const getChangedFields = (data) => {
    const changedFields = {};
    for (const key in data) {
      const mappedKey = fieldMapping[key];
      if (String(data[key]) !== String(currentCoupon[mappedKey])) {
        changedFields[mappedKey] = data[key];
      }
    }
    changedFields.id = currentCoupon.id;
    return changedFields;
  };

  const onSubmit = React.useCallback(
    async (data) => {
      try {
        const changedData = getChangedFields(data);
        console.log(data, 'data');

        if (isEdit) {
          await dispatch(updateTax(changedData)).then((res) => {
            if (res?.payload?.data?.data) {
              toast.success('Update success!');
              router.push(paths.dashboard.coupons.list);
            } else {
              toast.error(res?.payload?.data?.error?.message || 'Internal Server Error');
            }
          });
        } else {
          // await dispatch(createTax(changedData)).then((res) => {
          //   if (res?.payload?.data?.data) {
          //     toast.success('Create success!');
          //     router.push(paths.dashboard.coupons.list);
          //   } else {
          //     toast.error(res?.payload?.data?.error?.message || 'Internal Server Error');
          //   }
          // });
        }
      } catch (err) {
        logger.error(err);
      }
    },
    [isEdit, currentCoupon.id, dispatch, router, fetchTaxes, updateTax, createTax]
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
                <Grid md={6} xs={12}>
                  <Controller
                    control={control}
                    name="currencyID"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.currencyID)} fullWidth>
                        <InputLabel required>Currency Type</InputLabel>
                        <Select {...field}>
                          <MenuItem value="USD">USD</MenuItem>
                          <MenuItem value="EUR">EUR</MenuItem>
                          <MenuItem value="GBP">GBP</MenuItem>
                        </Select>
                        {errors.currencyID ? <FormHelperText>{errors.currencyID.message}</FormHelperText> : null}
                      </FormControl>
                    )}
                  />
                </Grid>
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
                
              </Grid>
            </Stack>
          </Stack>
          <Grid md={6} xs={12} mt={3}>
                <CourseSelection control={control} errors={errors} />
                </Grid>
          <Grid md={6} xs={12} mt={3}>
                <CourseSelection control={control} errors={errors} />
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
  const [selectedCourses, setSelectedCourses] = useState([]);

  return (
    <div>

                <Controller
                  name="courseIds"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      multiple
                      disableCloseOnSelect
                      freeSolo
                      // onChange={(event, newValue) => field.onChange(newValue)}
                      onChange={(event, newValue) => {
                        if (newValue.find(option => option.all))
                          return field.onChange(field?.value?.length === allCoursesData?.length ? [] : allCoursesData?.map((option) => option.id))

                        field.onChange(newValue)
                      }}
                      options={allCoursesData && allCoursesData?.map((option) => option.id)}
                      getOptionLabel={(eventId) =>
                        allCoursesData.find((event) => event.id === eventId)?.courseName || ''
                      }
                      filterOptions={(options, params) => { // <<<--- inject the Select All option
                        const filter = createFilterOptions()
                        const filtered = filter(options, params)
                        return [{ title: 'Select All...', all: true }, ...filtered]
                      }}
                      renderOption={(props, option, { selected }) => (
                        <li {...props}>
                          <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={option.all ? (field.value.length===allCoursesData.length): selected}
                          />
                          {option.all ? option?.title : allCoursesData.find((event) => event.id === option)?.courseName || ''}
                        </li>
                      )}
                      // renderTags={(value, getTagProps) =>
                      //   value.map((eventId, index) => (
                      //     <Chip
                      //       {...getTagProps({ index })}
                      //       key={eventId}
                      //       size="small"
                      //       label={allCoursesData.find((event) => event.id === eventId)?.courseName || ''}
                      //     />
                      //   ))
                      // }
                      renderInput={(params) => <TextField label="Courses" {...params} />}
                    />
                  )}
                />
    </div>
  );
}