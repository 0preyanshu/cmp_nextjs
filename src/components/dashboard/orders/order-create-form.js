'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { useRouter, useParams, usePathname } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
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
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { Controller, useForm, useFieldArray } from 'react-hook-form';
import { z as zod } from 'zod';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

import { paths } from '@/paths';
import { logger } from '@/lib/default-logger';
import { toast } from '@/components/core/toaster';
import { useDispatch, useSelector } from 'react-redux';
import { OrderActions } from '@/redux/slices';
import { LoadingButton } from '@mui/lab';
import dayjs from 'dayjs';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';

const dateIsValid = (date) => !Number.isNaN(new Date(date).getTime());
const dateIsInFuture = (date) => dayjs(date).isAfter(dayjs());

const participantSchema = zod.object({
  participantID: zod.string().min(0, 'Participant ID is required'),
  participantFirstName: zod.string().min(1, 'First Name is required').max(255),
  participantLastName: zod.string().min(1, 'Last Name is required').max(255),
  participantEmail: zod.string().email('Invalid email').min(1, 'Email is required').max(255),
  participantPhone: zod.string().min(1, 'Phone Number is required').max(20),
});

const schema = zod.object({
  orderSource: zod.string().min(1, 'Order Source is required'),
  orderType: zod.string().min(1, 'Order Type is required'),
//   orderStatus: zod.string().min(1, 'Order Status is required'),
  startDate: zod.string().refine((val) => dateIsValid(new Date(val)), {
    message: 'Invalid date format',
  }).refine((val) => dateIsInFuture(new Date(val)), {
    message: 'Date must be in the future',
  }),
  numberOfParticipants: zod.number().min(1, 'At least one participant is required'),
  participants: zod.array(participantSchema).min(1, 'At least one participant is required'),
  eventID: zod.string().min(1, 'Event ID is required'),
  courseID: zod.string().min(1, 'Course ID is required'),
  // vendorID: zod.string().optional(),
});

export function OrdersCreateForm() {
  const [currentOrder, setCurrentOrder] = React.useState({
});
  const { allOrders } = useSelector((state) => state?.orders?.orders);
  const { id } = useParams();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();
  const { fetchOrder, createOrder, updateOrder } = OrderActions;
//   const isEdit = pathname.includes('edit');
const isEdit =0;

  const defaultValues = React.useMemo(() => ({
    orderSource: currentOrder?.orderSource || '',
    orderType: currentOrder?.orderType || '',
    // orderStatus: currentOrder?.orderStatus || '',
    startDate: dateIsValid(currentOrder?.startDate) && dateIsInFuture(currentOrder?.startDate) ? new Date(currentOrder?.startDate).toISOString() : new Date().toISOString(),
    numberOfParticipants: currentOrder?.participants ? currentOrder?.participants.length : 1,
    participants: currentOrder?.participants || [{ participantID: uuidv4(), participantFirstName: '', participantLastName: '', participantEmail: '', participantPhone: '' }],
    eventID: currentOrder?.eventID || '',
    courseID: currentOrder?.courseID || '',
    // vendorID: currentOrder?.vendorID || '',
  }), [currentOrder]);

  const { control, handleSubmit, formState: { errors, isSubmitting }, setValue, watch, reset } = useForm({ defaultValues, resolver: zodResolver(schema) });
  const { fields, append, remove } = useFieldArray({ control, name: 'participants' });

  React.useEffect(() => {
    reset(defaultValues);
  }, [currentOrder, reset, defaultValues]);

//   React.useEffect(() => {
//     // if (allOrders?.length && id) {
//     //   const data = allOrders.find((order) => String(order?.id) === String(id));
//     //   setCurrentOrder(data);
//     // }
//   }, [allOrders, id]);
// React.useEffect(() => {
//     console.log("Zod Schema:", schema.safeParse(data));
//   }, [schema]);
const formData = watch();
React.useEffect(() => {
  console.log("Current Form Data:", formData);
}, [formData]);
  const fieldMapping = {
    orderSource: 'orderSource',
    orderType: 'orderType',
    orderStatus: 'orderStatus',
    startDate: 'startDate',
    numberOfParticipants: 'numberOfParticipants',
    participants: 'participants',
    eventID: 'eventID',
    courseID: 'courseID'
  };

  const getChangedFields = (data) => {
    const changedFields = {};
    for (const key in data) {
      const mappedKey = fieldMapping[key];
      if (data[key] !== currentOrder[mappedKey]) {
        changedFields[mappedKey] = data[key];
      }
    }

    changedFields.id = currentOrder.id;
    return changedFields;
  };

  const onSubmit = React.useCallback(
    async (data) => {
      try {
        const changedData = getChangedFields(data);
        console.log("data", data);

        if (isEdit) {
          await dispatch(updateOrder(changedData)).then((res) => {
            if (res?.payload?.data?.data?.data) {
              toast.success('Update success!');
              router.push(paths.dashboard.orders.list);
            } else {
              toast.error(res?.payload?.data?.data?.error?.message || 'Internal Server Error');
            }
          });
        } else {
          await dispatch(createOrder(data)).then((res) => {
            if (res?.payload?.data?.data) {
              toast.success('Create success!');
              router.push(paths.dashboard.orders.list);
            } else {
              toast.error(res?.payload?.data?.error?.message || 'Internal Server Error');
            }
          });
        }
      } catch (err) {
        logger.error(err);
      }
    },
    [isEdit, currentOrder.id, dispatch, router, fetchOrder, updateOrder, createOrder]
  );

  const numberOfParticipants = watch('numberOfParticipants');

  React.useEffect(() => {
    const currentParticipants = watch('participants') || [];
    const newParticipants = [];

    for (let i = 0; i < numberOfParticipants; i++) {
        console.log("i", i);
        console.log("currentParticipants", currentParticipants);
      newParticipants.push(currentParticipants[i] || { participantID: uuidv4(), participantFirstName: '', participantLastName: '', participantEmail: '', participantPhone: '' });
    }

    setValue('participants', newParticipants);
  }, [numberOfParticipants, setValue, watch]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardContent>
          <Stack divider={<Divider />} spacing={4}>
            <Stack spacing={3}>
              <Grid container spacing={3}>
                {!isEdit && <>
                   
                    <Grid md={4} xs={12} mb={3} mt={5}>
                    
                  <Controller
                    control={control}
                    name="orderSource"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.orderSource)} fullWidth>
                        <InputLabel required>Order  Source</InputLabel>
                        <Select {...field}>
                          <MenuItem value="Internal">Internal</MenuItem>
                          <MenuItem value="External">External</MenuItem>
                        </Select>
                        {errors.orderSource ? <FormHelperText>{errors.orderSource.message}</FormHelperText> : null}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid md={4} xs={12} mb={3} mt={5}>
                  <Controller
                    control={control}
                    name="orderType"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.orderType)} fullWidth>
                        <InputLabel required>Order Type</InputLabel>
                        <Select {...field}>
                          <MenuItem value="Select">Select</MenuItem>
                          <MenuItem value="Other">Other</MenuItem>
                        </Select>
                        {errors.orderType ? <FormHelperText>{errors.orderType.message}</FormHelperText> : null}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid md={4} xs={12} mb={3} mt={5}>
                  <Controller
                    control={control}
                    name="orderType"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.orderType)} fullWidth>
                        <InputLabel required>Vendor</InputLabel>
                        <Select {...field}>
                          <MenuItem value="Select">Select</MenuItem>
                          <MenuItem value="Other">Other</MenuItem>
                        </Select>
                        {errors.orderType ? <FormHelperText>{errors.orderType.message}</FormHelperText> : null}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid md={4} xs={12} mb={3}>
                  <Controller
                    control={control}
                    name="courseID"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.courseID)} fullWidth>
                        <InputLabel required>Course</InputLabel>
                        <Select {...field}>
                          <MenuItem value="Course1">Course1</MenuItem>
                          <MenuItem value="Course2">Course2</MenuItem>
                        </Select>
                        {errors.courseID ? <FormHelperText>{errors.courseID.message}</FormHelperText> : null}
                      </FormControl>
                    )}
                  />
                </Grid>
               
                <Grid md={4} xs={12} mb={3}>
                  <Controller
                    control={control}
                    name="startDate"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.startDate)} fullWidth>
                        <MobileDateTimePicker
                          label="Start Date"
                          value={dayjs(field.value)}
                          onChange={(date) => {
                            setValue('startDate', date.toISOString());
                          }}
                          renderInput={(params) => (
                            <OutlinedInput {...params} error={Boolean(errors.startDate)} />
                          )}
                        />
                        {errors.startDate ? <FormHelperText>{errors.startDate.message}</FormHelperText> : null}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid md={4} xs={12} mb={3}>
                  <Controller
                    control={control}
                    name="eventID"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.eventID)} fullWidth>
                        <InputLabel required>Event</InputLabel>
                        <Select {...field}>
                          <MenuItem value="Event1">Event1</MenuItem>
                          <MenuItem value="Event2">Event2</MenuItem>
                        </Select>
                        {errors.eventID ? <FormHelperText>{errors.eventID.message}</FormHelperText> : null}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid md={12} xs={12}>
                  <Controller
                    control={control}
                    name="numberOfParticipants"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.numberOfParticipants)} fullWidth>
                        <InputLabel required>Number of Participants</InputLabel>
                        <Select
                          {...field}
                          onChange={(e) => {
                            const value = parseInt(e.target.value, 10);
                            setValue('numberOfParticipants', value);
                          }}
                        >
                          {[1, 2, 3, 4, 5].map((num) => (
                            <MenuItem key={num} value={num}>{num}</MenuItem>
                          ))}
                        </Select>
                        {errors.numberOfParticipants ? <FormHelperText>{errors.numberOfParticipants.message}</FormHelperText> : null}
                      </FormControl>
                    )}
                  />
                </Grid>
                
                
                </>

                }
              </Grid>

              {isEdit && fields.length > 0 && (
                <React.Fragment>
                  <Typography variant="h6" mt={4} mb={1}>Buyer Details : </Typography>
                  <Grid container spacing={3}>
                    <Grid md={3} xs={12}>
                      <FormControl fullWidth>
                        <InputLabel>First Name</InputLabel>
                        <OutlinedInput value={fields[0].participantFirstName} readOnly />
                      </FormControl>
                    </Grid>
                    <Grid md={3} xs={12}>
                      <FormControl fullWidth>
                        <InputLabel>Last Name</InputLabel>
                        <OutlinedInput value={fields[0].participantLastName} readOnly />
                      </FormControl>
                    </Grid>
                    <Grid md={3} xs={12}>
                      <FormControl fullWidth>
                        <InputLabel>Email</InputLabel>
                        <OutlinedInput value={fields[0].participantEmail} readOnly />
                      </FormControl>
                    </Grid>
                    <Grid md={3} xs={12}>
                      <FormControl fullWidth>
                        <InputLabel>Phone Number</InputLabel>
                        <OutlinedInput value={fields[0].participantPhone} readOnly />
                      </FormControl>
                    </Grid>
                  </Grid>
                </React.Fragment>
              )}

              <Typography variant="h6" mt={4} mb={1}>Participants :</Typography>
              <Grid container spacing={3}>
                {(isEdit ? fields.slice(1) : fields).map((field, index) => (
                  <React.Fragment key={field.participantID}>
                    <Grid xs={12}>
                      <Typography variant="subtitle1">Participant {isEdit ? index + 2 : index+1}</Typography>
                    </Grid>
                    <Grid md={3} xs={12}>
                      <Controller
                        control={control}
                        name={`participants.${index }.participantFirstName`}
                        render={({ field }) => (
                          <FormControl error={Boolean(errors.participants?.[index ]?.participantFirstName)} fullWidth>
                            <InputLabel required>First Name</InputLabel>
                            <OutlinedInput {...field} />
                            {errors.participants?.[index]?.participantFirstName ? <FormHelperText>{errors.participants?.[index ]?.participantFirstName.message}</FormHelperText> : null}
                          </FormControl>
                        )}
                      />
                    </Grid>
                    <Grid md={3} xs={12}>
                      <Controller
                        control={control}
                        name={`participants.${index }.participantLastName`}
                        render={({ field }) => (
                          <FormControl error={Boolean(errors.participants?.[index ]?.participantLastName)} fullWidth>
                            <InputLabel required>Last Name</InputLabel>
                            <OutlinedInput {...field} />
                            {errors.participants?.[index ]?.participantLastName ? <FormHelperText>{errors.participants?.[index ]?.participantLastName.message}</FormHelperText> : null}
                          </FormControl>
                        )}
                      />
                    </Grid>
                    <Grid md={3} xs={12}>
                      <Controller
                        control={control}
                        name={`participants.${index}.participantEmail`}
                        render={({ field }) => (
                          <FormControl error={Boolean(errors.participants?.[index]?.participantEmail)} fullWidth>
                            <InputLabel required>Email</InputLabel>
                            <OutlinedInput {...field} type='email' />
                            {errors.participants?.[index ]?.participantEmail ? <FormHelperText>{errors.participants?.[index ]?.participantEmail.message}</FormHelperText> : null}
                          </FormControl>
                        )}
                      />
                    </Grid>
                    <Grid md={3} xs={12}>
                      <Controller
                        control={control}
                        name={`participants.${index }.participantPhone`}
                        render={({ field }) => (
                          <FormControl error={Boolean(errors.participants?.[index ]?.participantPhone)} fullWidth>
                            <InputLabel required>Phone Number</InputLabel>
                            <OutlinedInput {...field} />
                            {errors.participants?.[index ]?.participantPhone ? <FormHelperText>{errors.participants?.[index]?.participantPhone.message}</FormHelperText> : null}
                          </FormControl>
                        )}
                      />
                    </Grid>
                  </React.Fragment>
                ))}
              </Grid>
            </Stack>
          </Stack>
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button color="secondary" component={RouterLink} href={paths.dashboard.orders.list}>
            Cancel
          </Button>
          <LoadingButton
            color="primary"
            loading={isSubmitting}
            type="submit"
            variant="contained"
          >
            {isEdit ? 'Update' : 'Create'}
          </LoadingButton>
        </CardActions>
      </Card>
    </form>
  );
}
