'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { useRouter, useParams, usePathname } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import { toast } from '@/components/core/toaster';
import { useDispatch, useSelector } from 'react-redux';
import { VendorActions } from '@/redux/slices';
import { LoadingButton } from '@mui/lab';

const schema = zod.object({
  vendorname: zod.string().min(1, 'Vendor Name is required'),
  firstname: zod.string().min(1, 'First Name is required'),
  lastname: zod.string().min(1, 'Last Name is required'),
  email: zod.string().email('Enter a valid email').min(1, 'Email is required'),
  phone: zod.string().min(1, 'Phone Number is required'),
});

export function VendorsCreateForm() {
  const [currentVendor, setCurrentVendor] = React.useState({});
  const { allVendors } = useSelector((state) => state?.vendors?.vendors);
  const { id } = useParams();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();
  const { fetchVendors, updatevendors, createvendor } = VendorActions;
  const isEdit = pathname.includes('edit');

  const defaultValues = React.useMemo(
    () => ({
      vendorname: currentVendor.vendorname || '',
      firstname: currentVendor.firstname || '',
      lastname: currentVendor.lastname || '',
      email: currentVendor.email || '',
      phone: currentVendor.phone || '',
    }),
    [currentVendor]
  );

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({ defaultValues, resolver: zodResolver(schema) });

  React.useEffect(() => {
    reset(defaultValues);
  }, [currentVendor, reset, defaultValues]);

  React.useEffect(() => {
    if (allVendors?.length && id) {
      const data = allVendors.find((allVendors) => String(allVendors?.id) === String(id));
      setCurrentVendor(data);
    }
  }, [allVendors, id]);

  const getChangedFields = (data) => {
    const changedFields = {};
    for (const key in data) {
      if (data[key] !== currentVendor[key]) {
        changedFields[key] = data[key];
      }
    }
    changedFields.id = currentVendor.id;
    return changedFields;
  };

  const onSubmit = React.useCallback(
    async (data) => {
      try {
        const changedData = getChangedFields(data);
        if (isEdit) {
          await dispatch(updatevendors(changedData)).then((res) => {
            if (res?.payload?.data?.data) {
              toast.success('Update success!');
              router.push('/dashboard/vendors');
            } else {
              toast.error(res?.payload?.data?.error?.message || 'Internal Server Error');
            }
          });
        } else {
          await dispatch(createvendor(data)).then((res) => {
            if (res?.payload?.data?.data) {
              toast.success('Create success!');
              router.push('/dashboard/vendors');
            } else {
              toast.error(res?.payload?.data?.error?.message || 'Internal Server Error');
            }
          });
        }
      } catch (err) {
        toast.error('An error occurred. Please try again.');
      }
    },
    [isEdit, currentVendor.id, dispatch, router]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardContent>
          <Stack spacing={4}>
            <Grid container spacing={3}>
              <Grid md={6} xs={12}>
                <Controller
                  control={control}
                  name="vendorname"
                  render={({ field }) => (
                    <FormControl error={Boolean(errors.vendorname)} fullWidth>
                      <InputLabel required>Vendor Name</InputLabel>
                      <OutlinedInput {...field} />
                      {errors.vendorname && <FormHelperText>{errors.vendorname.message}</FormHelperText>}
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid md={6} xs={12}>
                <Controller
                  control={control}
                  name="firstname"
                  render={({ field }) => (
                    <FormControl error={Boolean(errors.firstname)} fullWidth>
                      <InputLabel required>First Name</InputLabel>
                      <OutlinedInput {...field} />
                      {errors.firstname && <FormHelperText>{errors.firstname.message}</FormHelperText>}
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid md={6} xs={12}>
                <Controller
                  control={control}
                  name="lastname"
                  render={({ field }) => (
                    <FormControl error={Boolean(errors.lastname)} fullWidth>
                      <InputLabel required>Last Name</InputLabel>
                      <OutlinedInput {...field} />
                      {errors.lastname && <FormHelperText>{errors.lastname.message}</FormHelperText>}
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid md={6} xs={12}>
                <Controller
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <FormControl error={Boolean(errors.email)} fullWidth>
                      <InputLabel required>Email</InputLabel>
                      <OutlinedInput {...field} type="email" />
                      {errors.email && <FormHelperText>{errors.email.message}</FormHelperText>}
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid md={6} xs={12}>
                <Controller
                  control={control}
                  name="phone"
                  render={({ field }) => (
                    <FormControl error={Boolean(errors.phone)} fullWidth>
                      <InputLabel required>Phone Number</InputLabel>
                      <OutlinedInput {...field} />
                      {errors.phone && <FormHelperText>{errors.phone.message}</FormHelperText>}
                    </FormControl>
                  )}
                />
              </Grid>
            </Grid>
          </Stack>
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button color="secondary" component={RouterLink} href="/dashboard/vendors">
            Cancel
          </Button>
          <LoadingButton color="primary" loading={isSubmitting} type="submit" variant="contained">
            {isEdit ? 'Update' : 'Create'}
          </LoadingButton>
        </CardActions>
      </Card>
    </form>
  );
}
