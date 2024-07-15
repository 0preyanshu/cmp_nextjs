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
import { useParams } from 'next/navigation';
import { formatDateTime } from '@/utils/formatTime';
import { ParticipantsTable } from '@/components/dashboard/orders/participants-table';
import { BuyerTable } from '@/components/dashboard/orders/buyer-table';









export function CancelForm() {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();
  const { allOrders} = useSelector((state) => state?.orders?.orders);
  
  const[currentOrder,setCurrentOrder]=useState(null); 

  const {Id} = useParams();

  React.useEffect(()=>{
    console.log("allOrders",allOrders);
    console.log("id",Id);
      if(allOrders && Id){
          const details=allOrders.find((order)=>order.id===Id);
          console.log("order",details);
          setCurrentOrder(details);

      }
  }
  ,[allOrders,Id]);

  const order = {
    id: currentOrder?.id.slice(-3)||"-",
    eventName: currentOrder?.event?.eventName||"-",
    course: currentOrder?.course?.courseName||"-",
    startDate: formatDateTime(currentOrder?.event?.eventStartDate)||"-",
    totalParticipants: currentOrder?.participants?.length||"-",
    subTotal: currentOrder?.orderInfo?.totalAmount-(currentOrder?.orderInfo?.feesAmount+currentOrder?.orderInfo?.taxAmount),
    fees: currentOrder?.orderInfo?.feesAmount,
    tax: currentOrder?.orderInfo?.taxAmount,
    total: currentOrder?.orderInfo?.totalAmount,
  };
  const schema = z.object({
    participantsToRemove: z.array(z.string()).optional(),
    sendCancellationEmail: z.boolean(),
    customerNotes: z.string().nonempty("Customer notes are required"),
    internalNotes: z.string().nonempty("Internal notes are required"),
    refundType: z.enum(["FULL", "PARTIAL", "NONE"]),
    refundAmount: z.preprocess(
      (input) => Number(input),
      z.number().min(0, 'Minimum refun amount should be 0').max(order.total, 'Refund amount must be at most total amount').optional()
    ),
  });

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
      participantsToRemove: [],
    sendCancellationEmail: false,
    customerNotes: '',
    internalNotes: '',
    refundType: 'NONE',
    refundAmount: 0,
    }),
    [currentOrder,Id]
  );

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue
  } = useForm({ defaultValues, resolver: zodResolver(schema) });

  React.useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const onSubmit = React.useCallback(
    async (data) => {
      try {
        console.log(data,"datatatata");
        // await dispatch(cancelOrder({ id: currentOrder.id, ...data }));
      
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
                Order - {currentOrder?.id.slice(-3)}
              </Typography>
              <Stack direction="column" alignItems="flex-start" spacing={1} sx={{ mr: 8 }}>
                <Stack direction="row" justifyContent="flex-start" sx={{ width: '200px' }}>
                  <Typography variant="h7" align="left" sx={{ flex: 1 }}>
                    SubTotal: {order.subTotal}
                  </Typography>
                  <Typography align="left">{order.fees} USD</Typography>
                </Stack>
                <Stack direction="row" justifyContent="flex-start" sx={{ width: '200px' }}>
                  <Typography variant="h7" align="left" sx={{ flex: 1 }}>
                    Fees: 
                  </Typography>
                  <Typography align="left">{order.fees} USD</Typography>
                </Stack>
                <Stack direction="row" justifyContent="flex-start" sx={{ width: '200px' }}>
                  <Typography variant="h7" align="left" sx={{ flex: 1 }}>
                    Tax: 
                  </Typography>
                  <Typography color="error" align="left">
                  {order.tax} USD
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="flex-start" sx={{ width: '200px' }}>
                  <Typography variant="h7" align="left" sx={{ flex: 1 }}>
                    Total:
                  </Typography>
                  <Typography align="left">{order.total} USD</Typography>
                </Stack>
              </Stack>
            </Card>
            <Card sx={{ p: 3, width: '100%', position: 'relative', mb: 5 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Order - {currentOrder?.id.slice(-3)}
              </Typography>
             

          <Card>
                <Box sx={{ overflowX: 'auto' }}>
                <Table sx={{width:"100%"}}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ ml: 3 }}>#</TableCell>
                <TableCell>Event Name</TableCell>
                <TableCell>Course</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>Total Participants</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.eventName}</TableCell>
                <TableCell>{order.course}</TableCell>
                <TableCell>{order.startDate}</TableCell>
                <TableCell>{order.totalParticipants}</TableCell>
                <Divider sx={{ my: 2 }} />
              </TableRow>
             
            </TableBody>
           
          </Table>

          <Stack direction="column" alignItems="flex-end" spacing={1} sx={{ mr: 8 ,my:5}}>
  <Stack direction="row" justifyContent="flex-end" sx={{ width: '200px' }}>
    <Typography variant="h6" align="left" sx={{ flex: 1 }}>
      SubTotal:
    </Typography>
    <Typography align="left">{order.subTotal} USD</Typography>
  </Stack>
  <Stack direction="row" justifyContent="flex-end" sx={{ width: '200px' }}>
    <Typography variant="h6" align="left" sx={{ flex: 1 }}>
      Fees:
    </Typography>
    <Typography align="left">{order.fees} USD</Typography>
  </Stack>
  <Stack direction="row" justifyContent="flex-end" sx={{ width: '200px' }}>
    <Typography variant="h6" align="left" sx={{ flex: 1 }}>
      Tax:
    </Typography>
    <Typography color="error" align="left">
      {order.tax} USD
    </Typography>
  </Stack>
  <Stack direction="row" justifyContent="flex-end" sx={{ width: '200px' }}>
    <Typography variant="h6" align="left" sx={{ flex: 1 }}>
      Total:
    </Typography>
    <Typography align="left">{order.total} USD</Typography>
  </Stack>
</Stack>
                </Box>
              </Card>

            </Card>
            <Card sx={{ p: 3, width: '100%', position: 'relative', mb: 5 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Buyer Details
              </Typography>
              <Card>
                <Box sx={{ overflowX: 'auto' }}>
                <BuyerTable rows={currentOrder?.participants[0] ?[currentOrder?.participants[0]] : []}></BuyerTable>
                </Box>
              </Card>
            </Card>
            <Card sx={{ p: 3, width: '100%', position: 'relative', mb: 5 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Participants Information
              </Typography>
              <Card>
                <Box sx={{ overflowX: 'auto' }}>
                <ParticipantsTable rows={currentOrder?.participants||[]} showCheckboxes control={control} setValue={setValue} watch={watch} />
                </Box>
              </Card>
            </Card>
          
            <Card sx={{ p: 3, width: '100%', position: 'relative', mb: 5 }}>
  <Typography variant="h6" sx={{ mb: 3 }}>
    Select Cancellation Options
  </Typography>
  <Grid container spacing={2}>
    <Grid item xs={12} md={3} mb={3}>
      <FormControlLabel
        control={
          <Controller
            name="sendCancellationEmail"
            control={control}
            render={({ field }) => <Checkbox {...field} checked={field.value} />}
          />
        }
        label="Send Cancellation Email"
      />
    </Grid>
    <Grid item xs={12} md={12}>
      <FormControl fullWidth>
        <Controller
          name="customerNotes"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Customer Notes"
              multiline
              rows={4}
              variant="outlined"
              error={!!errors.customerNotes}
              helperText={errors.customerNotes ? errors.customerNotes.message : ''}
            />
          )}
        />
      </FormControl>
    </Grid>
    <Grid item xs={12} md={12}>
      <FormControl fullWidth>
        <Controller
          name="internalNotes"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Internal Notes"
              multiline
              rows={4}
              variant="outlined"
              error={!!errors.internalNotes}
              helperText={errors.internalNotes ? errors.internalNotes.message : ''}
            />
          )}
        />
      </FormControl>
    </Grid>
  </Grid>
</Card>

<Card sx={{ p: 3, width: '100%', position: 'relative', mb: 5 }}>
  <Typography variant="h6" sx={{ mb: 3 }}>
    Select Refund Options
  </Typography>
  <Grid container spacing={2}>
    <Grid item xs={12} mb={3}>
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Select Refund Type
      </Typography>
      <Controller
        name="refundType"
        control={control}
        render={({ field }) => (
          <RadioGroup row {...field}>
            <FormControlLabel value="FULL" control={<Radio />} label="Full Refund" />
            <FormControlLabel value="PARTIAL" control={<Radio />} label="Partial Refund" />
            <FormControlLabel value="NONE" control={<Radio />} label="No Refund" />
          </RadioGroup>
        )}
      />
    </Grid>
    {watch('refundType') === 'PARTIAL' && (
      <Grid item xs={12} mb={3}>
        <FormControl fullWidth>
          <Controller
            name="refundAmount"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Refund Amount"
                variant="outlined"
                type='number'
                error={!!errors.refundAmount}
                helperText={errors.refundAmount ? errors.refundAmount.message : ''}
              />
            )}
          />
        </FormControl>
      </Grid>
    )}
    <Grid item xs={12}>
    <Typography variant="h6">
  Total Refund: {watch('refundType') === 'FULL' ? order.total : watch('refundType') === 'PARTIAL' ? (watch('refundAmount')) || 0 : 0} USD
</Typography>

    </Grid>
  </Grid>
  <Box sx={{ my: 5 }}>
    <Stack alignItems="flex-end" sx={{ mt: 2 }}>
      <LoadingButton
        variant="contained"
        style={{ textTransform: 'capitalize' }}
        type="submit"
        loading={isSubmitting}
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
