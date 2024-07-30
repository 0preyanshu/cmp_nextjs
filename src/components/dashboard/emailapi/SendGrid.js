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
import { SendgridActions } from '@/redux/slices';
import { useEffect } from 'react';
import { toast } from '@/components/core/toaster';

// Define the validation schema using Zod
const schema = z.object({
  SENDGRID_API_KEY: z.string().min(1, 'API Key is required').max(255, 'API Key must be at most 255 characters'),
  TestingEmail: z.string().optional(),
  status_: z.boolean()
});

export function SendGrid() {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();

 

  const sendgridStoreData = useSelector((state) => state?.sendgrid?.sendgridData);
  const { updateSendGridDetails,getSendgridDetails } = SendgridActions;


  useEffect(() => {
    dispatch(getSendgridDetails ());
    }, [dispatch]);
  const isEdit = pathname.includes('edit');

  const defaultValues = React.useMemo(
    () => ({
      SENDGRID_API_KEY: sendgridStoreData?.SENDGRID_API_KEY || '',
      TestingEmail:  '',
      status_: (sendgridStoreData?.status_ ==="ACTIVE")|| false,
    }),
    [sendgridStoreData]
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

        await dispatch(updateSendGridDetails(data)).then((res) => {
           
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
                name="SENDGRID_API_KEY"
                render={({ field }) => (
                  <FormControl error={Boolean(errors.SENDGRID_API_KEY)} fullWidth>
                    <InputLabel required>API Key </InputLabel>
                    <OutlinedInput {...field} />
                    {errors.SENDGRID_API_KEY && (
                      <FormHelperText>{errors.SENDGRID_API_KEY.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            
            
              <FormControlLabel
                labelPlacement="start"
                control={
                  <Controller
                    name="status_"
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
