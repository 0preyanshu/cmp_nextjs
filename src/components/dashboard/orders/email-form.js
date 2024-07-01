'use client';

import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, Box, Grid, FormControl, InputLabel, OutlinedInput, FormHelperText, Typography, Select, MenuItem ,FormControlLabel} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { useSelector, useDispatch } from 'react-redux';
import { LoadingButton } from '@mui/lab';
import { useEffect, useState } from 'react';
import { toast } from '@/components/core/toaster';
import { CompanyPaymentDetailsActions } from '@/redux/slices';
import { PaymentDetailsTable } from '@/components/dashboard/orders/payment-details-table';
// import { useEffect, useState } from 'react';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import dayjs from 'dayjs';
import { Stack ,Checkbox,TextField,RadioGroup,Radio,Table,TableHead,TableRow,TableCell,TableBody,Divider} from '@mui/material';





const schema = z.object({
  DevPublishableKey: z.string().min(1, 'Dev Publishable Key is required').max(255),
  DevSecretKey: z.string().min(1, 'Dev Secret Key is required').max(255),
  LivePublishableKey: z.string().min(1, 'Live Publishable Key is required').max(255),
  LiveSecretKey: z.string().min(1, 'Live Secret Key is required').max(255),
});

export function EmailForm() {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();
  const order = {
    id: 188,
    eventName: 'Certified Scrum Master',
    course: 'cc',
    startDate: '20 June 2024',
    totalParticipants: 1,
    subTotal: '211,212',
    fees: '0',
    tax: '0',
    total: '211,212',
    buyer: {
      firstName: 'drfsdfdsf',
      lastName: '23234',
      email: '2342342@gmail.com',
      phone: '9643775010',
    },
  };

  const stripeData = useSelector((state) => state?.companyPaymentDetails?.stripeData);
  const { updateStripeCompanyPaymentDetails, getCompanyPaymentDetails } = CompanyPaymentDetailsActions;


  const [selectedCourse, setSelectedCourse] = useState('');
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs());

  useEffect(() => {
    if (selectedCourse) {
      setFilteredEvents(allEvents.filter(event => event.courseID === selectedCourse));
    } else {
      setFilteredEvents([]);
    }
  }, [selectedCourse]);

  useEffect(() => {
    dispatch(getCompanyPaymentDetails());
  }, [dispatch]);


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
          variables: {
            stripe: {
              DevPublishableKey: data.DevPublishableKey,
              DevSecretKey: data.DevSecretKey,
              LivePublishableKey: data.LivePublishableKey,
              LiveSecretKey: data.LiveSecretKey,
            },
          },
        };

        await dispatch(updateStripeCompanyPaymentDetails(newobject)).then((res) => {
          if (res?.payload?.data?.data) {
            toast.success('Update success!');
          } else {
            toast.error(res?.payload?.data?.error?.message || 'Internal Server Error');
          }
        });
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch]
  );

  const allCourses = [
    { id: '1', name: 'Course 1' },
    { id: '2', name: 'Course 2' },
  ];
  
  const allEvents = [
    { id: '1', name: 'Event 1', courseID: '1' },
    { id: '2', name: 'Event 2', courseID: '1' },
    { id: '3', name: 'Event 3', courseID: '2' },
  ];

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', height: '100vh', padding: 3, position: 'relative' }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3} sx={{ position: 'absolute', left: '0', justifyContent: 'center' }}>
          <Grid item xs={12} md={12}>
            <Card sx={{ p: 3, width: '100%', position: 'relative', mb: 5 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Order - 118
              </Typography>
              <Stack direction="column" alignItems="flex-start" spacing={1} sx={{ mr: 8 }}>
                <Stack direction="row" justifyContent="flex-start" sx={{ width: '200px' }}>
                  <Typography variant="h7" align="left" sx={{ flex: 1 }}>
                    SubTotal:
                  </Typography>
                  <Typography align="left"> USD</Typography>
                </Stack>
                <Stack direction="row" justifyContent="flex-start" sx={{ width: '200px' }}>
                  <Typography variant="h7" align="left" sx={{ flex: 1 }}>
                    Fees:
                  </Typography>
                  <Typography align="left"> USD</Typography>
                </Stack>
                <Stack direction="row" justifyContent="flex-start" sx={{ width: '200px' }}>
                  <Typography variant="h7" align="left" sx={{ flex: 1 }}>
                    Tax:
                  </Typography>
                  <Typography color="error" align="left">
                    USD
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="flex-start" sx={{ width: '200px' }}>
                  <Typography variant="h7" align="left" sx={{ flex: 1 }}>
                    Total:
                  </Typography>
                  <Typography align="left"> USD</Typography>
                </Stack>
              </Stack>
            </Card>

            <Card sx={{ p: 3, width: '100%', position: 'relative', mb: 5 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Buyer Details
              </Typography>
              <Card>
                <Box sx={{ overflowX: 'auto' }}>
                  <PaymentDetailsTable rows={[]} />
                </Box>
              </Card>
            </Card>
            <Card sx={{ p: 3, width: '100%', position: 'relative', mb: 5 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Participants Information
              </Typography>
              <Card>
                <Box sx={{ overflowX: 'auto' }}>
                  <PaymentDetailsTable rows={[]} />
                </Box>
              </Card>
            </Card>
          

            <Card sx={{ p: 3, width: '100%', position: 'relative'}}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Select Email Content:
      </Typography>
      
      <Box sx={{ my: 5 }}>
        <Grid container spacing={2}>
          <Grid item xs={6} md={3}>
            <FormControlLabel
              control={<Checkbox name="welcomeEmail" />}
              label="Welcome Email"
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <FormControlLabel
              control={<Checkbox name="orderEmail" />}
              label="Order Email"
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <FormControlLabel
              control={<Checkbox name="transferEmail" />}
              label="Transfer Email"
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <FormControlLabel
              control={<Checkbox name="prerequisiteEmail" />}
              label="Pre-Requisite Email"
            />
          </Grid>
        </Grid>

        <Stack alignItems="flex-end" sx={{ mt: 5 }}>
          <LoadingButton
            variant="contained"
            style={{ textTransform: 'capitalize' }}
            type='submit'
          >
            Cancel Order
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
