import React from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  TextField,
  Box,
  Typography,
  Button,
  Stack,
  MenuItem,
  Grid,
  FormControl,
  FormHelperText,
  InputLabel,
  Select
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { toast } from '@/components/core/toaster';
import { EditorField } from './editor-field';
import { useSelector } from 'react-redux';
import axios from 'axios';



// Define the Zod schema
const schema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  eventID: z.string().max(0).or(z.string().min(1, 'Event is required')),
  testEmail: z.string().email('Enter a valid Email').optional().or(z.literal('')),
  courseID: z.string().min(1, 'Course is required'),
  html : z.string().min(0, ''),
  instructorID : z.string().min(1, 'Instructor is required')
});

const HOST_API = "https://zfwppq9jk2.execute-api.us-east-1.amazonaws.com/stg";

export function WelcomeEmails({ filteredEvents = [], sendTestEmail, sendTestEmailLoading = 0 }) {
  const [currentDetails, setCurrentDetails] = React.useState({});

  const { allCourses } = useSelector((state) => state?.courses?.courses);
  const { allEvents } = useSelector((state) => state?.event?.events);
  const { allInstructors } = useSelector((state) => state?.instructors?.instructors);
  const quillContent = `
  <body>
    <div style="font-family: 'Montserrat', sans-serif; margin: 0; padding: 0">
      <div
        style="
          padding: 24px 16px;
          background-color: #fff;
          width: 800px;
          border: 2px solid #000;
          margin: auto;
        "
      >
        <div style="display: flex">
          <h5
            style="
              text-decoration: underline;
              color: #000;
              margin-left: 30px;
              font-size: 18px;
            "
          >
            Abandon Cart Users on {{date}}
          </h5>
          <div style="margin-left: 180px; margin-top: 19px">
            <img
              src="https://cmpmediafiles.s3.ap-south-1.amazonaws.com/skillbooklogo.png"
              alt="logo"
              style="width: 250px"
            />
          </div>
        </div>

        <div
          style="
            background-color: #000;
            margin: 0px 24px;
            border-radius: 15px;
            height: 50px;
          "
        >
          <h3 style="color: #fff; padding-top: 1.5%; text-align: center">
            Abandon Cart Details
          </h3>
        </div>

        <div style="margin: 24px">
          <p style="font-weight: 500">Hello Admin,</p>
          <p style="font-weight: 500">
            Find below list of {{length}} abandon cart users details
          </p>
        </div>

        <div style="margin: 24px; margin-bottom: 100px">
          <table
            style="
              width: 100%;
              border: 1px solid #adadad;
              padding: 10px;
              border-collapse: collapse;
              margin-top: 10px;
            "
          >
            <thead
              style="
                font-weight: bold;
                border: 1px solid #adadad;
                padding: 10px;
              "
            >
              <tr style="border: 1px solid #adadad; padding: 10px">
                <td
                  style="border: 1px solid #adadad; padding: 10px"
                  align="center"
                >
                  Date
                </td>
                <td
                  style="border: 1px solid #adadad; padding: 10px"
                  align="center"
                >
                  Name
                </td>
                <td
                  style="border: 1px solid #adadad; padding: 10px"
                  align="center"
                >
                  Phone No.
                </td>
                <td
                  style="border: 1px solid #adadad; padding: 10px"
                  align="center"
                >
                  Email
                </td>
                <td
                  style="border: 1px solid #adadad; padding: 10px"
                  align="center"
                >
                  Event
                </td>
                <td
                  style="border: 1px solid #adadad; padding: 10px"
                  align="center"
                >
                  Course
                </td>
              </tr>
            </thead>
            {{tbody}}
          </table>
        </div>

        <div
          style="
            background-color: #999999;
            margin: 24px;
            border-radius: 23px;
            height: 40px;
            font-size: 20px;
          "
        >
          <h6 style="font-weight: 500; text-align: center; padding-top: 10px">
            © 2023 <span style="font-weight: 900">SKILLBOOK ACADEMY.</span> ALL
            RIGHTS RESERVED.
          </h6>
        </div>
        <div
          style="
            background-color: #999999;
            margin: 24px;
            border-radius: 23px;
            height: 40px;
            font-size: 20px;
          "
        >
          <h6 style="font-weight: 500; text-align: center; padding-top: 10px">
            © 2023 <span style="font-weight: 900">SKILLBOOK ACADEMY.</span> ALL
            RIGHTS RESERVED.
          </h6>
        </div>
        <div
          style="
            background-color: #999999;
            margin: 24px;
            border-radius: 23px;
            height: 40px;
            font-size: 20px;
          "
        >
          <h6 style="font-weight: 500; text-align: center; padding-top: 10px">
            © 2023 <span style="font-weight: 900">SKILLBOOK ACADEMY.</span> ALL
            RIGHTS RESERVED.
          </h6>
        </div>
        <div
          style="
            background-color: #999999;
            margin: 24px;
            border-radius: 23px;
            height: 40px;
            font-size: 20px;
          "
        >
          <h6 style="font-weight: 500; text-align: center; padding-top: 10px">
            © 2023 <span style="font-weight: 900">SKILLBOOK ACADEMY.</span> ALL
            RIGHTS RESERVED.
          </h6>
        </div>
        <div
          style="
            background-color: #999999;
            margin: 24px;
            border-radius: 23px;
            height: 40px;
            font-size: 20px;
          "
        >
          <h6 style="font-weight: 500; text-align: center; padding-top: 10px">
            © 2023 <span style="font-weight: 900">SKILLBOOK ACADEMY.</span> ALL
            RIGHTS RESERVED.
          </h6>
        </div>
        <div
          style="
            background-color: #999999;
            margin: 24px;
            border-radius: 23px;
            height: 40px;
            font-size: 20px;
          "
        >
          <h6 style="font-weight: 500; text-align: center; padding-top: 10px">
            © 2023 <span style="font-weight: 900">SKILLBOOK ACADEMY.</span> ALL
            RIGHTS RESERVED.
          </h6>
        </div>
        <div
          style="
            background-color: #999999;
            margin: 24px;
            border-radius: 23px;
            height: 40px;
            font-size: 20px;
          "
        >
          <h6 style="font-weight: 500; text-align: center; padding-top: 10px">
            © 2023 <span style="font-weight: 900">SKILLBOOK ACADEMY.</span> ALL
            RIGHTS RESERVED.
          </h6>
        </div>
      </div>
    </div>
  </body>
`;

  React.useEffect(() => {
  
      console.log(currentDetails, 'currentDetails');

    }, [currentDetails]);
  const defaultValues = React.useMemo(
    () => ({
      courseID: currentDetails?.courseID || '',
      subject: currentDetails?.subject || '',
      eventID: currentDetails?.eventId || '',
      testEmail: currentDetails?.testEmail || '',
      html : currentDetails?.html || '<p>Write Something . . . <p>',
      instructorID : currentDetails?.instructorID || ''
    }),
    [currentDetails]
  );

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
    watch
  } = useForm({ defaultValues, resolver: zodResolver(schema) });

  React.useEffect(() => {
    reset(defaultValues);
  }, [currentDetails, reset, defaultValues]);

  const initialMount = React.useRef(true);
  React.useEffect(() => {
    if(initialMount.current){
      initialMount.current = false;
      fetchEmailTemplateDetails().then((data) => {
        console.log(data, 'data');  
     
          setCurrentDetails(data?.data?.emailTemplate
      );
      
      });
    }
  }, []);

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

  const fieldMapping = {
    courseID: 'courseID',
    subject: 'subject',
    html: 'html',
    instructorID: 'instructorID',
  };

  const getChangedFields = (data) => {
    const changedFields = {};
    for (const key in data) {
      const mappedKey = fieldMapping[key];
      if (String(data[key]) !== String(currentDetails[mappedKey] && key !== 'html')) {
        changedFields[mappedKey] = data[key];
      }
    }
    changedFields.id = currentDetails.id;
    return changedFields;
  };

  const onSubmit = async (obj) => {
    const encodedHtml = btoa(obj.html); 
      const dataToSubmit = { ...getChangedFields(obj), html: encodedHtml }; 
      dataToSubmit.templateName = 'welcome-email';  
    try {
      const data = await axios.put(
        HOST_API.concat(`/email-template?templateName=welcome-email`),
        dataToSubmit,{
          headers: {
            Authorization: `Bearer ${localStorage.getItem('custom-auth-token')}`,
          },
        }
      );

      if(data?.data){
        console.log(data?.data, 'datares');
        toast('Pre-Rrequisite email updated!');
      }
      else{
        toast.error(data.error.message||'Something went wrong!');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message||'Something went wrong!');
    }
  };

  const fetchEmailTemplateDetails = async () => {
    try {
      const response = await axios.get(
        HOST_API.concat(`/email-template?templateName=welcome-email`),{
          headers: {
            Authorization: `Bearer ${localStorage.getItem('custom-auth-token')}`,
          },
        }
      );
      console.log(response.data, 'response.data');
      return response.data;
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Something went wrong while fetching email template details!');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Controller
            control={control}
            name="courseID"
            render={({ field }) => (
              <FormControl error={Boolean(errors.courseID)} fullWidth variant="outlined">
                <InputLabel>Courses</InputLabel>
                <Select {...field}>
                  <MenuItem value="">
                    <>Select Course</>
                  </MenuItem>
                  {allCourses.filter((e) => e.status_ === "ACTIVE").map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.courseName}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.courseID?.message}</FormHelperText>
              </FormControl>
            )}
          />
        </Grid>

        <Grid item xs={6}>
          <Controller
            control={control}
            name="instructorID"
            render={({ field }) => (
              <FormControl error={Boolean(errors.instructorID)} fullWidth variant="outlined">
                <InputLabel>Instructors</InputLabel>
                <Select {...field}>
                  <MenuItem value="">
                    <>Select Instructors</>
                  </MenuItem>
                  {allInstructors.filter((e) => e.status_ === "ACTIVE").map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.firstname + ' ' + c.lastname}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.instructorID?.message}</FormHelperText>
              </FormControl>
            )}
          />
        </Grid>
      </Grid>

      <Controller
        name="subject"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Subject"
            variant="outlined"
            margin="normal"
            fullWidth
            error={!!errors.subject}
            helperText={errors.subject?.message}
          />
        )}
      />

      <Box sx={{ mt: 5 }}>
        <EditorField name="html" setValue={setValue}  watch={watch} simple control={control}/>
      </Box>

      <LoadingButton sx={{ my: 3 }} loading={isSubmitting} variant="contained" size="large" type="submit">
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
          name="eventID"
          render={({ field }) => (
            <FormControl error={Boolean(errors.eventID)} fullWidth variant="outlined">
              <InputLabel>Events</InputLabel>
              <Select {...field}>
                <MenuItem value="">
                  <>Select Event</>
                </MenuItem>
                {allEvents.filter((e) => e.status_ === "ACTIVE").map((e) => (
                  <MenuItem key={e.id} value={e.id}>
                    {e.eventName}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{errors.eventID?.message}</FormHelperText>
            </FormControl>
          )}
        />
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
