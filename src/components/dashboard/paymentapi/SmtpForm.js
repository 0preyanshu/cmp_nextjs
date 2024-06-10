'use client';

import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, Box, Grid, FormControl, InputLabel, OutlinedInput, FormHelperText, FormControlLabel, Typography, Divider, Stack, Switch, MenuItem, Select } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { useSelector, useDispatch } from 'react-redux';
import { LoadingButton } from '@mui/lab';
import { logger } from '@/lib/default-logger';
import { SMTPActions } from '@/redux/slices';
import { useEffect } from 'react';
import { toast } from '@/components/core/toaster';
import { CompanyPaymentDetailsActions } from '@/redux/slices';

// Define the validation schema using Zod
const schema = z.object({
  DevPublishableKey: z.string().min(1, 'Dev Publishable Key is required').max(255),
  DevSecretKey: z.string().min(1, 'Dev Secret Key is required').max(255),
  LivePublishableKey: z.string().min(1, 'Live Publishable Key is required').max(255),
  LiveSecretKey: z.string().min(1, 'Live Secret Key is required').max(255),
});

export function SmtpForm() {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();

  const stripeData = useSelector((state) => state?.companyPaymentDetails?.stripeData);
  const { updateStripeCompanyPaymentDetails , getCompanyPaymentDetails } = CompanyPaymentDetailsActions;

  useEffect(() => {
    dispatch(getCompanyPaymentDetails());
  }, [dispatch]);

  const isEdit = pathname.includes('edit');

  const defaultValues = React.useMemo(
    () => ({
      DevPublishableKey: stripeData?.DevPublishableKey || '',
      DevSecretKey: stripeData?.DevSecretKey || '',
      LivePublishableKey: stripeData?.LivePublishableKey || '',
      LiveSecretKey: stripeData?.LiveSecretKey || '',
    }),
    [stripeData]
  );

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({ defaultValues, resolver: zodResolver(schema) });

  React.useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const onSubmit = React.useCallback(
    async (data) => {
      try {
        const newobject = {
          variables:{
            stripe:{
              DevPublishableKey:data.DevPublishableKey,
              DevSecretKey:data.DevSecretKey,
              LivePublishableKey:data.LivePublishableKey,
              LiveSecretKey:data.LiveSecretKey
            }
          }
        }

        await dispatch(updateStripeCompanyPaymentDetails(newobject)).then((res) => {
          console.log(res?.payload?.data?.data, 'restax');

          if (res?.payload?.data?.data) {
            toast.success('Update success!');
          } else {
            toast.error(res?.payload?.data?.error?.message || 'Internal Server Error');
          }
        });

      } catch (err) {
        logger.error(err);
      }
    },
    [isEdit, dispatch, router]
  );

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        
        height: '100vh',
        padding: 3,
       
        position:"relative"
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3} sx={{position:"absolute",left:"0",justifyContent:"center"}}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3, width: '100%',  position: 'relative' }}>
              <Box
                sx={{
                  display: 'grid',
                  columnGap: 2,
                  rowGap: 3,
               
                }}
              >
                <Controller
                  control={control}
                  name="DevPublishableKey"
                  render={({ field }) => (
                    <FormControl error={Boolean(errors.DevPublishableKey)} fullWidth>
                      <InputLabel required>Dev Publishable Key</InputLabel>
                      <OutlinedInput {...field} />
                      {errors.DevPublishableKey && (
                        <FormHelperText>{errors.DevPublishableKey.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
                <Controller
                  control={control}
                  name="DevSecretKey"
                  render={({ field }) => (
                    <FormControl error={Boolean(errors.UserName)} fullWidth>
                      <InputLabel required>Dev Secret Key</InputLabel>
                      <OutlinedInput {...field} />
                      {errors.UserName && (
                        <FormHelperText>{errors.UserName.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
                <Controller
                  control={control}
                  name="LivePublishableKey"
                  render={({ field }) => (
                    <FormControl error={Boolean(errors.LivePublishableKey)} fullWidth>
                      <InputLabel required>Live Publishable Key</InputLabel>
                      <OutlinedInput {...field}  />
                      {errors.LivePublishableKey && (
                        <FormHelperText>{errors.LivePublishableKey.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
                <Controller
                  control={control}
                  name="LiveSecretKey"
                  render={({ field }) => (
                    <FormControl error={Boolean(errors.LiveSecretKey)} fullWidth>
                      <InputLabel required>Live Secret Key</InputLabel>
                      <OutlinedInput {...field}  />
                      {errors.LiveSecretKey && (
                        <FormHelperText>{errors.LiveSecretKey.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
               
              
              </Box>

              <Box sx={{ my: 5 }}>
                

                <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                  <LoadingButton
                    variant="contained"
                    style={{ textTransform: 'capitalize' }}
                    loading={isSubmitting}
                    onClick={handleSubmit(onSubmit)}
                  >
                    {'Save Changes'}
                  </LoadingButton>
                </Stack>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}
