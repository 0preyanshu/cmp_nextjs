'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { useRouter, useParams, usePathname } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box, Button, Card, CardActions, CardContent, Divider, FormControl,
  FormHelperText, InputLabel, OutlinedInput, Select, Stack, Grid, MenuItem,
  Typography
} from '@mui/material';
import { Controller, useForm ,register,useFieldArray,useFormContext} from 'react-hook-form';
import { z as zod } from 'zod';
import { paths } from '@/paths';
import { logger } from '@/lib/default-logger';
import { toast } from '@/components/core/toaster';
import { useDispatch, useSelector } from 'react-redux';
import { cityActions, countryActions, StateActions, EventsActions } from '@/redux/slices';
import { LoadingButton } from '@mui/lab';
import { Checkbox } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import coursecategory from '@/redux/slices/coursecategory';

const dateIsValid = (date) => !Number.isNaN(new Date(date).getTime());
const dateIsInFuture = (date) => dayjs(date).isAfter(dayjs());


const priceGroupSchema = zod.object({
  earlyBirdPrice: zod.preprocess(
    (input) => Number(input),
    zod.number().min(1, 'Early Bird Price must be at least 1')
  ),
  regularPrice: zod.preprocess(
    (input) => Number(input),
    zod.number().min(1, 'Regular Price must be at least 1')
  ),
  currencyID: zod.string().min(1, 'Currency is required'),
  taxable: zod.boolean().optional(),
  taxPercentage: zod.preprocess(
    (input) => Number(input),
    zod.number().min(0, 'Tax Percentage must be at least 0')
  ).optional(),
  taxID: zod.string().min(1, 'Tax ID is required').optional(),
});


const schema = zod.object({
  eventName: zod.string().min(1, 'Event Name is required'),
  courseID: zod.string().min(1, 'Course is required'),
  countryID: zod.string().min(1, 'Country is required'),
  stateID: zod.string().min(1, 'State is required'),
  cityID: zod.string().min(1, 'City is required'),
  eventStartDate: zod.string().refine((val) => dateIsValid(new Date(val)), {
    message: 'Invalid date format',
  }).refine((val) => dateIsInFuture(new Date(val)), {
    message: 'Date must be in the future',
  }),
  eventEndDate: zod.string().refine((val) => dateIsValid(new Date(val)), {
    message: 'Invalid date format',
  }).refine((val) => dateIsInFuture(new Date(val)), {
    message: 'Date must be in the future',
  }),
 
  capacity: zod.preprocess(
    (input) => Number(input),
    zod.number().min(1, 'Capacity must be at least 1')
  ),
  instructorID: zod.string().min(1, 'Instructor is required'),
  waitlistCapacity: zod.preprocess(
    (input) => Number(input),
    zod.number().min(1, 'Waitlist Capacity must be at least 1')
  ),
  show: zod.boolean(),
  upcoming: zod.boolean(),
  soldOut: zod.boolean(),
  days : zod.number().min(0, 'Days must be at least 0') ,
  eventPrice: zod.array(priceGroupSchema),
  timezoneID: zod.string().min(1, 'Timezone is required'),
  salesDescription: zod.object({
    regularPriceTicketName: zod.string().min(1, { message: 'Regular Price Ticket Name is required' }),
    salePriceTicketName: zod.string().min(1, { message: 'Sale Price Ticket Name is required' }),
    saleDescription: zod.string().min(1, { message: 'Sale Description is required' }),
    saleStatusDescription: zod.string().min(1, { message: 'Sale Status Description is required' }),
    saleStartDate:  zod.string().refine((val) => dateIsValid(new Date(val)), {
      message: 'Invalid date format',
    }).refine((val) => dateIsInFuture(new Date(val)), {
      message: 'Date must be in the future',
    }),
    saleEndDate:  zod.string().refine((val) => dateIsValid(new Date(val)), {
      message: 'Invalid date format',
    }).refine((val) => dateIsInFuture(new Date(val)), {
      message: 'Date must be in the future',
    }),
  }),
  eventLogistics: zod.object({
    meetingLink: zod.string().min(1, { message: 'Meeting Link is required' }),
    courseMaterialLink: zod.string().min(1, { message: 'Course Material Link is required' }),
    videoLink: zod.string().min(1, { message: 'Video Link is required' }),
    whiteboardLink: zod.string().min(1, { message: 'Whiteboard Link is required' }),
    remarks: zod.string().min(1, { message: 'Remarks is required' }),
}),
  courseCategoryID: zod.string().min(0, 'Course Category is required'),   

});

export function EventCreateForm() {
  const [currentEvent, setcurrentEvent] = React.useState({});
  const [filteredStates, setFilteredStates] = React.useState([]);
  const [filteredCities, setFilteredCities] = React.useState([]);
  const [days, setDays] = React.useState(0);

  const { id } = useParams();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();

  const { allCountries } = useSelector((state) => state?.countries?.country);
  const { allState } = useSelector((state) => state?.states?.state);
  const { allCities } = useSelector((state) => state?.cities?.city);
  const {allCourses}=useSelector((state)=>state?.courses?.courses);
  const { allInstructors } = useSelector((state) => state?.instructors?.instructors);
  const {allTimezones}=useSelector((state)=>state?.timezone?.timezones);
  const { allEvents ,loading : isLoading} = useSelector((state) => state?.event?.events);
  


  const { fetchCities, createCity, updateCity } = cityActions;
  const {updateEvents,createEvents}= EventsActions;

  const isEdit = pathname.includes('edit');

  const defaultValues = React.useMemo(() => ({
    eventName: currentEvent.eventName || '',
    courseID: currentEvent.courseID || '',
    countryID: currentEvent.countryID || '',
    stateID: currentEvent.stateID || '',
    cityID: currentEvent.cityID || '',
    eventStartDate: dateIsValid(currentEvent?.eventStartDate) && dateIsInFuture(currentEvent?.eventStartDate) ? new Date(currentEvent?.eventStartDate).toISOString() : new Date().toISOString(),
    eventEndDate: dateIsValid(currentEvent?.eventEndDate) && dateIsInFuture(currentEvent?.eventEndDate) ? new Date(currentEvent?.eventEndDate).toISOString() : new Date().toISOString(),
    capacity: currentEvent.capacity || '',
    instructorID: currentEvent?.instructorID ?  currentEvent.instructorID[0] : '',
    waitlistCapacity: currentEvent.waitlistCapacity || '',
    show: currentEvent.show || false,
    upcoming: currentEvent.upcoming || false,
    soldOut: currentEvent.soldOut || false,
    days : currentEvent.days || 0,
    timezoneID: currentEvent.timezoneID || '',
    eventPrice: currentEvent.eventPrice || [{ earlyBirdPrice: '', regularPrice: '', currencyID: '', taxable: false, taxPercentage: '', taxID: ''}],
    salesDescription: {
      regularPriceTicketName: currentEvent.salesDescription?.regularPriceTicketName || '',
      salePriceTicketName: currentEvent.salesDescription?.salePriceTicketName || '',
      saleDescription: currentEvent.salesDescription?.saleDescription || '',
      saleStatusDescription: currentEvent.salesDescription?.saleStatusDescription || '',
      saleStartDate: dateIsValid(currentEvent?.salesDescription?.saleStartDate) && dateIsInFuture(currentEvent?.salesDescription?.saleStartDate) ? new Date(currentEvent?.salesDescription?.saleStartDate).toISOString() : new Date().toISOString(),
      saleEndDate: dateIsValid(currentEvent?.salesDescription?.saleEndDate) && dateIsInFuture(currentEvent?.salesDescription?.saleEndDate) ? new Date(currentEvent?.salesDescription?.saleEndDate).toISOString() : new Date().toISOString(),
    },

    eventLogistics: {
      meetingLink: currentEvent.eventLogistics?.meetingLink || '',
      courseMaterialLink: currentEvent.eventLogistics?.courseMaterialLink || '',
      videoLink: currentEvent.eventLogistics?.videoLink || '',
      whiteboardLink: currentEvent.eventLogistics?.whiteboardLink || '',
      remarks: currentEvent.eventLogistics?.remarks || '',
    },
    courseCategoryID: currentEvent.courseCategoryID ||'',

                            

    
  }), [currentEvent]);

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
  }, [currentEvent, reset, defaultValues]);

  React.useEffect(() => {
    if (allEvents?.length && id) {
      const data = allEvents.find((city) => String(city?.id) === String(id));
      setcurrentEvent(data);
      console.log(data,"data");
    }
  }, [allEvents, id]);



  // Filter active countries
  const activeCountries = React.useMemo(() => allCountries?.filter(country => country.status_ === "ACTIVE"), [allCountries]);

  // Filter active states
  const activeStates = React.useMemo(() => allState?.filter(state => state.status_ === "ACTIVE"), [allState]);
  const activeCities = React.useMemo(() => allCities?.filter(city => city.status_ === "ACTIVE"), [allCities]);

 
  const selectedCountryID = watch('countryID');
  const selectedStateID = watch('stateID');
  const selectedEventStartDate = watch('eventStartDate');
  const selectedEventEndDate = watch('eventEndDate');

  React.useEffect(() => {
    const states = activeStates?.filter(state => state.countryID === selectedCountryID);
    setFilteredStates(states);
  }, [selectedCountryID, activeStates]);

  React.useEffect(() => {
    const cities = activeCities?.filter(city => city.stateID === selectedStateID);
    setFilteredCities(cities);
  }, [selectedStateID, activeCities]);

  React.useEffect(() => {
    if (dateIsValid(selectedEventStartDate) && dateIsValid(selectedEventEndDate)) {
      const start = dayjs(selectedEventStartDate);
      const end = dayjs(selectedEventEndDate);
      const diff = end.diff(start, 'day');
      setDays(diff);
      setValue('days', diff);
    }
  }, [selectedEventStartDate, selectedEventEndDate, setValue])

  const watchCourse = watch(`courseID`);

  React.useEffect(() => {
    if (watchCourse) {
      const selectedCourse = allCourses.find((e) => e.id === watchCourse);
      if (selectedCourse) {
        setValue(`courseCategoryID`, selectedCourse.courseCategoryID);
        console.log(selectedCourse.courseCategoryID,"selectedCourse");
      }
    } else {
      setValue(`courseCategoryID`, '');
    }
  }, [watchCourse, allCourses, setValue]);


  const getChangedFields = (data) => {
    const changedFields = {};
    for (const key in data) {

      if (String(data[key]) !== String(currentEvent[key])) {
        changedFields[key] = data[key];
      }
    }
    // Add the id to the changed fields
    changedFields.id = currentEvent.id;
    return changedFields;
  };

  const onSubmit = React.useCallback(
    async (data) => {
      try {
        const changedData = getChangedFields(data);
       
        const temp = data?.instructorID;
        data.instructorID = [temp];
        console.log(data,"data");
        console.log(changedData,"changedData");

        if (isEdit) {
          await dispatch(updateEvents(changedData)).then((res) => {
            if (res?.payload?.data?.data) {
              toast.success('Update success!');
              router.push(paths.dashboard.eventregistration.list);
            } else {
              toast.error(res?.payload?.data?.error?.message || 'Internal Server Error');
            }
          });
        } else {
          await dispatch(createEvents(data)).then((res) => {
            if (res?.payload?.data?.data) {
              toast.success('Create success!');
              router.push(paths.dashboard.eventregistration.list);
            } else {
              toast.error(res?.payload?.data?.error?.message || 'Internal Server Error');
            }
          });
        }
      } catch (err) {
        logger.error(err);
      }
    },
    [isEdit, currentEvent.id, dispatch, router, updateEvents, createEvents]
  );

  const { fields, append, remove } = useFieldArray({ control, name: 'eventPrice' });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
      <CardContent>
  <Typography variant="h5" sx={{ mt: 3,mb:1 }}>Event Details</Typography>
  <Stack divider={<Divider />} spacing={4}>
    <Stack spacing={3}>
      <Grid container spacing={3}>
        <Grid item md={6} xs={12}>
          <Controller
            control={control}
            name="eventName"
            render={({ field }) => (
              <FormControl error={Boolean(errors.eventName)} fullWidth sx={{ mt: 3 }}>
                <InputLabel required>Event Name</InputLabel>
                <OutlinedInput {...field} />
                {errors.eventName ? <FormHelperText>{errors.eventName.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
        </Grid>
        <Grid item md={6} xs={12}>
        <Controller
            control={control}
            name="courseID"
            render={({ field }) => (
              <FormControl error={Boolean(errors.courseID)} fullWidth sx={{  mt: 3 }}>
                <InputLabel required>Course</InputLabel>
                <Select {...field}>
                  <MenuItem value="">
                    <>Select Course</>
                  </MenuItem>
                  {allCourses?.map((e) => (
                    <MenuItem key={e.id} value={e.id}>
                      {e.courseName}
                    </MenuItem>
                  ))}
                </Select>
                {errors.courseID ? <FormHelperText>{errors.courseID.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
        </Grid>
        <Grid item md={4} xs={12}>
          <Controller
            control={control}
            name="countryID"
            render={({ field }) => (
              <FormControl error={Boolean(errors.countryID)} fullWidth sx={{  mt: 3 }}>
                <InputLabel required>Country</InputLabel>
                <Select {...field}>
                  <MenuItem value="">
                    <>Select Country</>
                  </MenuItem>
                  {activeCountries?.map((country) => (
                    <MenuItem key={country.id} value={country.id}>
                      {country.countryName}
                    </MenuItem>
                  ))}
                </Select>
                {errors.countryID ? <FormHelperText>{errors.countryID.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
        </Grid>
        <Grid item md={4} xs={12}>
          <Controller
            control={control}
            name="stateID"
            render={({ field }) => (
              <FormControl error={Boolean(errors.stateID)} fullWidth sx={{  mt: 3 }}>
                <InputLabel required>State</InputLabel>
                <Select {...field} disabled={filteredStates.length === 0}>
                  <MenuItem value="">
                    <>Select State</>
                  </MenuItem>
                  {filteredStates?.map((state) => (
                    <MenuItem key={state.id} value={state.id}>
                      {state.stateName}
                    </MenuItem>
                  ))}
                </Select>
                {errors.stateID ? <FormHelperText>{errors.stateID.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
        </Grid>
        <Grid item md={4} xs={12}>
        <Controller
            control={control}
            name="cityID"
            render={({ field }) => (
              <FormControl error={Boolean(errors.cityID)} fullWidth sx={{  mt: 3 }}>
                <InputLabel required>City</InputLabel>
                <Select {...field} disabled={filteredCities.length === 0}>
                  <MenuItem value="">
                    <>Select City</>
                  </MenuItem>
                  {filteredCities?.map((e) => (
                    <MenuItem key={e.id} value={e.id}>
                      {e.cityName}
                    </MenuItem>
                  ))}
                </Select>
                {errors.cityID ? <FormHelperText>{errors.cityID.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
        </Grid>


        <Grid item md={6} xs={12}>
        <Controller
                    control={control}
                    name="eventStartDate"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.eventStartDate)} fullWidth sx={{  mt: 3 }}>
                        <DatePicker
                          label="Expiry Date"
                          value={dayjs(field.value)}
                          onChange={(date) => {
                            setValue('eventStartDate', date.toISOString());
                          }}
                          renderInput={(params) => (
                            <OutlinedInput {...params} error={Boolean(errors.eventStartDate)} />
                          )}
                        />
                        {errors.eventStartDate ? <FormHelperText>{errors.eventStartDate.message}</FormHelperText> : null}
                      </FormControl>
                    )}
                  />
        </Grid>

        <Grid item md={6} xs={12}>
        <Controller
                    control={control}
                    name="eventEndDate"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.eventEndDate)} fullWidth sx={{  mt: 3 }}>
                        <DatePicker
                          label="Expiry Date"
                          value={dayjs(field.value)}
                          onChange={(date) => {
                            setValue('eventEndDate', date.toISOString());
                          }}
                          renderInput={(params) => (
                            <OutlinedInput {...params} error={Boolean(errors.eventEndDate)} />
                          )}
                        />
                        {errors.eventEndDate ? <FormHelperText>{errors.eventEndDate.message}</FormHelperText> : null}
                      </FormControl>
                    )}
                  />
        </Grid>
        
        <Grid item md={6} xs={12}>
          <Controller
            control={control}
            name="days"
            render={({ field }) => (
              <FormControl error={Boolean(errors.days)} fullWidth sx={{  mt: 3 }}>
                <InputLabel required>No of Days</InputLabel>
                <OutlinedInput {...field} disabled />
                {errors.days? <FormHelperText>{errors.days.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <Controller
            control={control}
            name="capacity"
            render={({ field }) => (
              <FormControl error={Boolean(errors.capacity)} fullWidth sx={{  mt: 3 }}>
                <InputLabel required>Capacity</InputLabel>
                <OutlinedInput {...field} type='number' />
                {errors.capacity ? <FormHelperText>{errors.capacity.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
        </Grid>
        <Grid item md={6} xs={12}>
        <Controller
            control={control}
            name="instructorID"
            render={({ field }) => (
              <FormControl error={Boolean(errors.instructorID)} fullWidth sx={{  mt: 3 }}>
                <InputLabel required>Instructor</InputLabel>
                <Select {...field} disabled={allInstructors?.filter((e)=>e.status_==="ACTIVE").length === 0}>
                  <MenuItem value="">
                    <>Select Instructor</>
                  </MenuItem>
                  {allInstructors?.filter((e)=>e.status_==="ACTIVE").map((state) => (
                    <MenuItem key={state.id} value={state.id}>
                      {state.firstname+" "+ state.lastname}
                    </MenuItem>
                  ))}
                </Select>
                {errors.instructorID ? <FormHelperText>{errors.instructorID.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <Controller
            control={control}
            name="waitlistCapacity"
            render={({ field }) => (
              <FormControl error={Boolean(errors.waitlistCapacity)} fullWidth sx={{  mt: 3 }}>
                <InputLabel required>Waitlist Capacity</InputLabel>
                <OutlinedInput {...field} type='number' />
                {errors.waitlistCapacity? <FormHelperText>{errors.waitlistCapacity.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
        </Grid>

          <Grid item md={2} xs={12} mt={2}>
            <Controller
              control={control}
              name="show"
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox {...field} />}
                  label="Show"
                />
              )}
            />
          </Grid>
          <Grid item md={2} xs={12} mt={2}>
            <Controller
              control={control}
              name="upcoming"
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox {...field} />}
                  label="Upcoming"
                />
              )}
            />
          </Grid>
          <Grid item md={2} xs={12} mt={2}>
            <Controller
              control={control}
              name="soldOut"
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox {...field} />}
                  label="Is Sold Out"
                />
              )}
            />
          </Grid>

          <Grid item md={12} xs={12}>
        <Controller
            control={control}
            name="timezoneID"
            render={({ field }) => (
              <FormControl error={Boolean(errors.timezoneID)} fullWidth sx={{  mt: 3 }}>
                <InputLabel required>Timezone</InputLabel>
                <Select {...field} disabled={allInstructors?.filter((e)=>e.status_==="ACTIVE").length === 0}>
                  <MenuItem value="">
                    <>Select Timezone</>
                  </MenuItem>
                  {allTimezones?.filter((e)=>e.status_==="ACTIVE").map((state) => (
                    <MenuItem key={state.id} value={state.id}>
                      {state.timezoneName}
                    </MenuItem>
                  ))}
                </Select>
                {errors.timezoneID ? <FormHelperText>{errors.timezoneID.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
        </Grid>

        

      </Grid>
    </Stack>
  </Stack>
</CardContent>
      </Card>
      <Card sx={{mt:8}}>
      <CardContent>
  <Typography variant="h5" sx={{ mt:3 ,mb:2 }}>Event Price</Typography>
  <Stack divider={<Divider />} spacing={4}>
    <Stack spacing={3}>
      <Grid container spacing={3}>
<Grid item md={12} xs={12}>

  
<Stack spacing={2}>
        {fields.map((field, index) => (
          <PriceGroup key={field.id} control={control} index={index} remove={remove} setValue={setValue} watch={watch}/>
        ))}
        <Button variant="outlined" onClick={() => append({ earlyBirdPrice: '', regularPrice: '', currency: '', tax: false, taxPercentage: '' })}>
          Add New Currency
        </Button>
         </Stack>


  </Grid>

        

      </Grid>
    </Stack>
  </Stack>
</CardContent>
      </Card>


      <Card sx={{mt:8}}>
      <CardContent>
  <Typography variant="h5" sx={{ mt:3 ,mb:2 }}>Sale Description Details</Typography>
  <Stack divider={<Divider />} spacing={4}>
    <Stack spacing={3}>
      <Grid container spacing={3}>
<Grid item md={12} xs={12}>
<Controller
            control={control}
            name={`salesDescription.regularPriceTicketName`}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth error={Boolean(error)}>
                <InputLabel required>Regular Price Ticket Name</InputLabel>
                <OutlinedInput {...field}  />
                {error ? <FormHelperText>{error.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
  </Grid>

<Grid item md={12} xs={12}>
<Controller
            control={control}
            name={`salesDescription.salePriceTicketName`}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth error={Boolean(error)}>
                <InputLabel required>Sale Price Ticket Name</InputLabel>
                <OutlinedInput {...field}  />
                {error ? <FormHelperText>{error.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
  </Grid>
<Grid item md={12} xs={12}>
<Controller
            control={control}
            name={`salesDescription.saleDescription`}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth error={Boolean(error)}>
                <InputLabel required>Sale Description</InputLabel>
                <OutlinedInput {...field}  />
                {error ? <FormHelperText>{error.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
  </Grid>
<Grid item md={12} xs={12}>
<Controller
            control={control}
            name={`salesDescription.saleStatusDescription`}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth error={Boolean(error)}>
                <InputLabel required>Sale Status Description</InputLabel>
                <OutlinedInput {...field}  />
                {error ? <FormHelperText>{error.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
  </Grid>

  <Grid item md={12} xs={12}>
  <Controller
    control={control}
    name="salesDescription.saleStartDate"
    render={({ field }) => (
      <FormControl error={Boolean(errors.salesDescription?.saleStartDate)} fullWidth>
        <DatePicker
          label="Sale Start Date"
          value={field.value ? dayjs(field.value) : null}
          onChange={(date) => setValue('salesDescription.saleStartDate', date.toISOString())}
          renderInput={(params) => (
            <OutlinedInput {...params} error={Boolean(errors.salesDescription?.saleStartDate)} />
          )}
        />
        {errors.salesDescription?.saleStartDate && (
          <FormHelperText>
            {errors.salesDescription.saleStartDate.message}
          </FormHelperText>
        )}
      </FormControl>
    )}
  />
</Grid>
  <Grid item md={12} xs={12}>
  <Controller
    control={control}
    name="salesDescription.saleEndDate"
    render={({ field }) => (
      <FormControl error={Boolean(errors.salesDescription?.saleEndDate)} fullWidth>
        <DatePicker
          label="Sale Start Date"
          value={field.value ? dayjs(field.value) : null}
          onChange={(date) => setValue('salesDescription.saleEndDate', date.toISOString())}
          renderInput={(params) => (
            <OutlinedInput {...params} error={Boolean(errors.salesDescription?.saleEndDate)} />
          )}
        />
        {errors.salesDescription?.saleEndDate && (
          <FormHelperText>
            {errors.salesDescription.saleEndDate.message}
          </FormHelperText>
        )}
      </FormControl>
    )}
  />
</Grid>


  {/* <Grid item md={12} xs={12}>
        <Controller
                    control={control}
                    name="salesDescription.saleEndDate"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors?.salesDescription?.saleEndDate||false)} fullWidth >
                        <DatePicker
                          label="Expiry Date"
                          value={dayjs(field.value)}
                          onChange={(date) => {
                            setValue('salesDescription.saleEndDate', date.toISOString());
                          }}
                          renderInput={(params) => (
                            <OutlinedInput {...params} error={Boolean(errors.salesDescription?.saleEndDate)} />
                          )}
                        />
                        {errors?.salesDescription?.saleEndDate||false ? <FormHelperText></FormHelperText> : null}
                      </FormControl>
                    )}
                  />
        </Grid> */}

        

      </Grid>
    </Stack>
  </Stack>
</CardContent>
      </Card>





      <Card sx={{mt:8}}>
      <CardContent>
  <Typography variant="h5" sx={{ mt:3 ,mb:2 }}>Event Logistics</Typography>
  <Stack divider={<Divider />} spacing={4}>
    <Stack spacing={3}>
      <Grid container spacing={3}>


<Grid item md={12} xs={12}>
<Controller
            control={control}
            name={`eventLogistics.meetingLink`}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth error={Boolean(error)}>
                <InputLabel required>Meeting Link</InputLabel>
                <OutlinedInput {...field}  />
                {error ? <FormHelperText>{error.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
  </Grid>
<Grid item md={12} xs={12}>
<Controller
            control={control}
            name={`eventLogistics.courseMaterialLink`}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth error={Boolean(error)}>
                <InputLabel required>Course Material Link</InputLabel>
                <OutlinedInput {...field}  />
                {error ? <FormHelperText>{error.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
  </Grid>
<Grid item md={12} xs={12}>
<Controller
            control={control}
            name={`eventLogistics.videoLink`}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth error={Boolean(error)}>
                <InputLabel required>Video Link</InputLabel>
                <OutlinedInput {...field}  />
                {error ? <FormHelperText>{error.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
  </Grid>
<Grid item md={12} xs={12}>
<Controller
            control={control}
            name={`eventLogistics.whiteboardLink`}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth error={Boolean(error)}>
                <InputLabel required>Whiteboard Link</InputLabel>
                <OutlinedInput {...field}  />
                {error ? <FormHelperText>{error.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
  </Grid>
<Grid item md={12} xs={12}>
<Controller
            control={control}
            name={`eventLogistics.remarks`}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth error={Boolean(error)}>
                <InputLabel required>Remarks</InputLabel>
                <OutlinedInput {...field}  />
                {error ? <FormHelperText>{error.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
  </Grid>






  {/* <Grid item md={12} xs={12}>
        <Controller
                    control={control}
                    name="salesDescription.saleEndDate"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors?.salesDescription?.saleEndDate||false)} fullWidth >
                        <DatePicker
                          label="Expiry Date"
                          value={dayjs(field.value)}
                          onChange={(date) => {
                            setValue('salesDescription.saleEndDate', date.toISOString());
                          }}
                          renderInput={(params) => (
                            <OutlinedInput {...params} error={Boolean(errors.salesDescription?.saleEndDate)} />
                          )}
                        />
                        {errors?.salesDescription?.saleEndDate||false ? <FormHelperText></FormHelperText> : null}
                      </FormControl>
                    )}
                  />
        </Grid> */}

        

      </Grid>
    </Stack>
  </Stack>
</CardContent>
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button color="secondary" component={RouterLink} href={paths.dashboard.eventregistration.list}>
            Cancel
          </Button>
          <LoadingButton
            type="submit"
            variant="contained"
            style={{ textTransform: 'capitalize' }}
            loading={isSubmitting}
          >
            {!isEdit ? 'Create Event' : 'Save Changes'}
          </LoadingButton>
        </CardActions>
      </Card>
    </form>
  );
}

const PriceGroup = ({ control, index, remove,watch,setValue }) => {

  const watchTax = watch(`eventPrice.${index}.taxable`);
  const watchTaxID = watch(`eventPrice.${index}.taxID`);
  const { allTaxes } = useSelector((state) => state?.taxes?.taxes);
 
  const { allCurrency } = useSelector((state) => state?.currency?.currency);

  React.useEffect(() => {
    if (watchTaxID) {
      const selectedTax = allTaxes.find((tax) => tax.id === watchTaxID);
      if (selectedTax) {
        setValue(`eventPrice.${index}.taxPercentage`, selectedTax.taxPercentage);
      }
    } else {
      setValue(`eventPrice.${index}.taxPercentage`, '');
    }
  }, [watchTaxID, allTaxes, setValue, index]);


  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item md={4} xs={12}>
          <Controller
            control={control}
            name={`eventPrice.${index}.earlyBirdPrice`}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth error={Boolean(error)}>
                <InputLabel required>Early Bird Price</InputLabel>
                <OutlinedInput {...field} type="number" />
                {error ? <FormHelperText>{error.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
        </Grid>
        <Grid item md={4} xs={12}>
          <Controller
            control={control}
            name={`eventPrice.${index}.regularPrice`}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth error={Boolean(error)}>
                <InputLabel required>Regular Price</InputLabel>
                <OutlinedInput {...field} type="number" />
                {error ? <FormHelperText>{error.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
        </Grid>
        <Grid item md={4} xs={12}>
          <Controller
            control={control}
            name={`eventPrice.${index}.currencyID`}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth error={Boolean(error)}>
                <InputLabel required>Currency</InputLabel>
                <Select {...field}>
                  <MenuItem value="">Select Currency</MenuItem>
                 {allCurrency?.filter(e=>e.status_==="ACTIVE").map((e) => (
                    <MenuItem key={e.id} value={e.id}>
                      {e.currencyName}
                    </MenuItem>
                  ))}
                </Select>
                {error ? <FormHelperText>{error.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
        </Grid>
        <Grid item md={4} xs={12}>
          <Controller
            control={control}
            name={`eventPrice.${index}.taxable`}
            render={({ field }) => (
              <FormControlLabel
                control={<Checkbox {...field} />}
                label="Taxable"
                checked={field.value}
              />
            )}
          />
        </Grid>
        <Grid item md={8} xs={12}>
         
        </Grid>
        {watchTax && (
          <>




<Grid item md={12} xs={12}>
            <Controller
            control={control}
            name={`eventPrice.${index}.taxID`}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth error={Boolean(error)}>
                <InputLabel required>Tax</InputLabel>
                <Select {...field}>
                <MenuItem value="">Select Tax</MenuItem>
                  {allTaxes?.filter(e=>e.status_==="ACTIVE").map((e) => (
                    <MenuItem key={e.id} value={e.id}>
                      {e.taxName}
                    </MenuItem>
                  ))}
                  {/* Add other currencies as needed */}
                </Select>
                {error ? <FormHelperText>{error.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
            </Grid>


            <Grid item md={12} xs={12}>
              <Controller
                control={control}
                name={`eventPrice.${index}.taxPercentage`}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth error={Boolean(error)}>
                    <InputLabel required>Tax Percentage</InputLabel>
                    <OutlinedInput {...field} type="number" disabled />
                    {error ? <FormHelperText>{error.message}</FormHelperText> : null}
                  </FormControl>
                )}
              />
            </Grid>
          
          </>
        )}
        <Grid item md={4} xs={12} mb={5}>
          <Button variant="outlined" color="secondary" onClick={() => remove(index)}>Remove</Button>
        </Grid>
      </Grid>
      
    </Box>
  );
};