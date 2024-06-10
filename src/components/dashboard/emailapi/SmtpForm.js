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

// Define the validation schema using Zod
const schema = z.object({
  HostAddress: z.string().min(1, 'Host Address is required').max(255, 'Host Address must be at most 255 characters'),
  UserName: z.string().min(1, 'User Name is required').max(255, 'User Name must be at most 255 characters'),
  Password: z.string().min(1, 'Password is required').max(255, 'Password must be at most 255 characters'),
  Port: z.preprocess(
    (input) => Number(input),
    z.number().min(1, 'Port must be a positive number').nonnegative()
  ),
  Secure: z.string().min(1, 'Secure is required').max(255, 'Secure must be at most 255 characters'),
  TestingEmail: z.string().optional(),
  enabled: z.boolean()
});

export function SmtpForm() {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();

 

  const smtpStoreData = useSelector((state) => state?.smtp?.smtpData);
  const { updateSmtpData,getSmtpDetails } = SMTPActions;

  useEffect(() => {
    dispatch(getSmtpDetails());
    }, [dispatch]);
  const isEdit = pathname.includes('edit');

  const defaultValues = React.useMemo(
    () => ({
      HostAddress: smtpStoreData?.HostAddress || '',
      UserName: smtpStoreData?.UserName || '',
      Password: smtpStoreData?.Password || '',
      Port: smtpStoreData?.Port || '',
      Secure: smtpStoreData?.Secure || '',
      TestingEmail: smtpStoreData?.TestingEmail || '',
      enabled: smtpStoreData?.enabled || false,
    }),
    [smtpStoreData]
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
        console.log(data, 'data');

        await dispatch(updateSmtpData(data)).then((res) => {
           
            console.log(res?.payload?.data?.data, 'restax');
            
            if (res?.payload?.data?.data?.data) {
              toast.success('Update success!');
            } else {
              toast.error(res?.payload?.data?.error?.message || 'Internal Server Error');
            }
          });
        
      } catch (err) {
        logger.error(err);
      }
    },
    [isEdit,dispatch, router]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'grid',
                columnGap: 2,
                rowGap: 3,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <Controller
                control={control}
                name="HostAddress"
                render={({ field }) => (
                  <FormControl error={Boolean(errors.HostAddress)} fullWidth>
                    <InputLabel required>Host Address</InputLabel>
                    <OutlinedInput {...field} />
                    {errors.HostAddress && (
                      <FormHelperText>{errors.HostAddress.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
              <Controller
                control={control}
                name="UserName"
                render={({ field }) => (
                  <FormControl error={Boolean(errors.UserName)} fullWidth>
                    <InputLabel required>User Name</InputLabel>
                    <OutlinedInput {...field} />
                    {errors.UserName && (
                      <FormHelperText>{errors.UserName.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
              <Controller
                control={control}
                name="Password"
                render={({ field }) => (
                  <FormControl error={Boolean(errors.Password)} fullWidth>
                    <InputLabel required>Password</InputLabel>
                    <OutlinedInput {...field} type="password" />
                    {errors.Password && (
                      <FormHelperText>{errors.Password.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
              <Controller
                control={control}
                name="Port"
                render={({ field }) => (
                  <FormControl error={Boolean(errors.Port)} fullWidth>
                    <InputLabel required>Port</InputLabel>
                    <OutlinedInput {...field} type="number" />
                    {errors.Port && (
                      <FormHelperText>{errors.Port.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
              <Controller
                control={control}
                name="Secure"
                render={({ field }) => (
                  <FormControl error={Boolean(errors.Secure)} fullWidth>
                    <InputLabel required>Secure</InputLabel>
                    <Select {...field} defaultValue="">
                      <MenuItem value="">Select Secure Type</MenuItem>
                      <MenuItem value="TLS">TLS</MenuItem>
                      <MenuItem value="SSL">SSL</MenuItem>
                    </Select>
                    {errors.Secure && (
                      <FormHelperText>{errors.Secure.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
              <FormControlLabel
                labelPlacement="start"
                control={
                  <Controller
                    name="enabled"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        {...field}
                        checked={field.value}
                        sx={{ color: 'error.main' }}
                      />
                    )}
                  />
                }
                label={
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    Enabled
                  </Typography>
                }
                sx={{ mx: 0, mt: 3.6, width: 0.7, justifyContent: 'space-between', marginLeft: 2.2 }}
              />
            </Box>
          
            <Box sx={{ my: 5 }}>
              <Controller
                control={control}
                name="TestingEmail"
                render={({ field }) => (
                  <FormControl error={Boolean(errors.TestingEmail)} fullWidth>
                    <InputLabel>Testing Email</InputLabel>
                    <OutlinedInput {...field} />
                    {errors.TestingEmail && (
                      <FormHelperText>{errors.TestingEmail.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
              <LoadingButton
                sx={{ mt: 3 }}
                variant="contained"
                style={{ textTransform: 'capitalize' }}
                type="button"
                
              >
                {'Send Test Email'}
              </LoadingButton>

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
  );
}
