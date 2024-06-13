import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { TextField, Box, Typography, Button, Stack, MenuItem, Grid, FormControl, FormHelperText, InputLabel, Select } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { toast } from '@/components/core/toaster';
import { EditorField } from './editor-field';

// Define the Zod schema
const schema = z.object({
  emailSubject: z.string().min(1,'Subject is required'),
  emailContent: z.string().min(1,'Content is required'),
  eventId: z.string().min(1,'Event is required'),
  testEmail: z.string().email('Invalid email address'),
  currencyName: z.string().min(1,'Course is required'),
});

// Sample mock data for courses
const courses = [
  { currencyType: 'course1', symbol: '$' },
  { currencyType: 'course2', symbol: '€' },
  // Add more courses as needed
];

// Sample mock data for events
const events = [
  { currencyType: 'event1', symbol: 'Event 1' },
  { currencyType: 'event2', symbol: 'Event 2' },

];

export function WelcomeEmails({ filteredEvents = [], isSubmitting = 0, sendTestEmail, sendTestEmailLoading = 0 }) {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      emailSubject: '',
      emailContent: '',
      eventId: '',
      testEmail: '',
      currencyName: '',
    }
  });

  const variablesList = [
    '[Name] for Participant Name',
    '[First_Name] for Participant First Name',
    '[Last_Name] for Participant Last Name',
    '[Event_Name] for Event Name',
    '[Event_Start_Date] for Event Start Date',
    '[Event_End_Date] for Event End Date',
    '[Event_Start_Time] for Event Start Time',
    '[Event_End_Time] for Event End Time',
    '[Event_Time_Zone] for Event Time Zone',
    '[Instructor] for Instructor Name',
    '[Meeting_Link_1] for Training Link Day 1',
    '[Meeting_Link_2] for Training Link Day 2',
    '[Whiteboard_link] for Whiteboard Link',
    '[Course_Material_Link] for Course Material Link',
    '[Company] for Company Name',
    '[Company_Email] for Company Email',
    '[Company_Phone] for Company Phone',
  ];

  const onSubmit = (data) => {
    toast.success('Form submitted successfully');
    // Handle form submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>

      <Grid container spacing={2}>
        <Grid item md={6} xs={12}>
          <Controller
            control={control}
            name="currencyName"
            render={({ field }) => (
              <FormControl error={Boolean(errors.currencyName)} fullWidth variant="outlined">
                <InputLabel >Courses</InputLabel>
                <Select {...field}>
                  <MenuItem value="">
                    <>Select Course</>
                  </MenuItem>
                  {courses.map((c) => (
                    <MenuItem key={c.currencyType} value={c.currencyType}>
                      {`${c.currencyType} (${c.symbol})`}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.currencyName?.message}</FormHelperText>
              </FormControl>
            )}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <Controller
            control={control}
            name="eventId"
            render={({ field }) => (
              <FormControl error={Boolean(errors.eventId)} fullWidth variant="outlined">
                <InputLabel>Events</InputLabel>
                <Select {...field}>
                  <MenuItem value="">
                    <>Select Event</>
                  </MenuItem>
                  {events.map((e) => (
                    <MenuItem key={e.currencyType} value={e.currencyType}>
                      {`${e.symbol}`}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.eventId?.message}</FormHelperText>
              </FormControl>
            )}
          />
        </Grid>
      </Grid>

      <Controller
        name="emailSubject"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Subject"
            variant="outlined"
            margin="normal"
            fullWidth
            error={!!errors.emailSubject}
            helperText={errors.emailSubject?.message}
          />
        )}
      />

      <Box sx={{ mt: 5 }}>
        <EditorField name="emailContent" control={control} simple />
      </Box>

      <LoadingButton sx={{ my: 3 }} loading={isSubmitting} type="submit" variant="contained" size="large">
        Save Changes
      </LoadingButton>

      <Box>
        <Typography sx={{ my: 3 }} variant="h5">
          Use below variable in email subject and content:
        </Typography>
        {variablesList.map((ele, index) => (
          <Typography key={ele} variant="body2">
            {index + 1}. {ele}
          </Typography>
        ))}
      </Box>

      <Typography sx={{ mt: 6, mb: 3 }} variant="h6">
        Send Test Email:
      </Typography>
      <Stack direction="column" gap={3} alignItems="flex-end" justifyContent="space-between" sx={{ my: 1 }}>

        <Controller
          control={control}
          name="testEmail"
          render={({ field }) => (
            <TextField
              {...field}
              label="Enter Test Email"
              variant="outlined"
              fullWidth
              error={!!errors.testEmail}
              helperText={errors.testEmail?.message}
            />
          )}
        />

        <LoadingButton variant="outlined" size="large" onClick={sendTestEmail} loading={sendTestEmailLoading}>
          Send Test Email
        </LoadingButton>

      </Stack>
    </form>
  );
}
