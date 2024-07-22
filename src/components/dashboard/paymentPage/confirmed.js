/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { Typography, TextField, Stack, Box, CircularProgress } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import CustomizedStepper from './stepper';
import Styles from './confirmed.module.scss';
import moment from 'moment';

const orderFor = "Myself";

const hardcodedOrderDetails = {
  buyerName: 'John Doe',
  buyerEmail: 'john.doe@example.com',
  buyerPhoneNo: '1234567890',
  transactionId: '1234567890',
  numberOfParticipants: 1,
  totalAmount: 100,
  currencyType: 'USD',
  currencySymbol: '$',
  eventName: 'React Workshop',
  instructorName: 'Jane Smith',
  eventStartDate: '2024-07-20T10:00:00Z',
  eventEndDate: '2024-07-22T16:00:00Z',
  timZoneShortName: 'PST',
  courseLogoUrl: 'https://via.placeholder.com/150',
  orderParticipantDTOS: [
    {
      participantFirstName: 'John',
      participantLastName: 'Doe',
      participantEmail: 'john.doe@example.com',
      participantPhoneNo: '1234567890',
    },
  ],
};

export default function Confirmed() {
  const [attendees, setAttendees] = useState([]);
  const [attendeeFormData, setAttendeeFormData] = useState([]);

  const handleFieldChange = (index, field, value) => {
    const updatedFormData = [...attendeeFormData];
    updatedFormData[index] = {
      ...updatedFormData[index],
      [field]: value,
    };
    setAttendeeFormData(updatedFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formdata = {
        buyerName: hardcodedOrderDetails.buyerName,
        orderParticipants: attendeeFormData,
      };
      // Normally here you would dispatch an updateOrder action
      // enqueueSnackbar('Details updated Successfully.', { variant: 'success' });
      setAttendees(formdata.orderParticipants);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (hardcodedOrderDetails.internalOrderType === 'INDIVIDUAL') {
      let firstname = hardcodedOrderDetails.buyerName.split(' ')[0];
      let lastname = hardcodedOrderDetails.buyerName.split(' ')[1];
      const exisitingParticipant = {
        participantFirstName: firstname,
        participantLastName: lastname,
        participantEmail: hardcodedOrderDetails.buyerEmail,
        participantPhoneNo: hardcodedOrderDetails.buyerPhoneNo,
      };
      setAttendeeFormData([exisitingParticipant]);
    }
  }, []);

  return (
    <div className={Styles.confirmed_page}>
      <div className={Styles.header}>
        <img src="https://strapis3images.s3.amazonaws.com/Group_431_89daa9d285.svg" alt="logo" />
      </div>
      <div className={Styles.wrapper}>
        <div className={Styles.form}>
          {(hardcodedOrderDetails.numberOfParticipants)-(hardcodedOrderDetails.orderParticipantDTOS.length) > 0 && (
            <div className={Styles.header_text}>
              <h3>Please enter attendee information in the form below</h3>
            </div>
          )}
          <div className={Styles.heading}>
            <h3>Attendees Information</h3>
          </div>
          <div className={Styles.attendees}>
            <p>
              Number of Attendees : <span>{hardcodedOrderDetails.numberOfParticipants}</span>
            </p>
          </div>
          {hardcodedOrderDetails.orderParticipantDTOS.length > 0 && (
            <div className={Styles.attendeeDetails}>
              {hardcodedOrderDetails.orderParticipantDTOS.map((item, index) => (
                <div className={Styles.attendee} key={index}>
                  <p>Attendee {index + 1}:</p>
                  <div className={Styles.rightDetails}>
                    <p className={Styles.name}>
                      {item.participantFirstName} {item.participantLastName}
                    </p>
                    <p className={Styles.number}>{item.participantPhoneNo}</p>
                    <p className={Styles.email}>{item.participantEmail}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <form className={Styles.form_wrapper} onSubmit={(event) => handleSubmit(event)}>
            {Array.from({
              length:
                hardcodedOrderDetails.numberOfParticipants -
                hardcodedOrderDetails.orderParticipantDTOS.length,
            }).map((_, i) => (
              <div className={Styles.attendee} key={i}>
                <h4>
                  Attendee {hardcodedOrderDetails.orderParticipantDTOS.length + i + 1}:
                </h4>
                <Stack spacing={3} mt={2}>
                  <Box
                    sx={{
                      display: 'grid',
                      gap: { xs: 2, md: 5 },
                      gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' },
                    }}
                  >
                    <TextField
                      fullWidth
                      label="First Name"
                      required
                      value={attendeeFormData[i]?.participantFirstName || ''}
                      onChange={(e) =>
                        handleFieldChange(i, 'participantFirstName', e.target.value)
                      }
                    />
                    <TextField
                      fullWidth
                      label="Last Name"
                      required
                      value={attendeeFormData[i]?.participantLastName || ''}
                      onChange={(e) => handleFieldChange(i, 'participantLastName', e.target.value)}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: 'grid',
                      gap: { xs: 2, md: 5 },
                      gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' },
                    }}
                  >
                    <TextField
                      fullWidth
                      label="Email Address"
                      required
                      value={attendeeFormData[i]?.participantEmail || ''}
                      onChange={(e) => handleFieldChange(i, 'participantEmail', e.target.value)}
                    />
                    <TextField
                      fullWidth
                      label="Phone Number"
                      required
                      value={attendeeFormData[i]?.participantPhoneNo || ''}
                      onChange={(e) => handleFieldChange(i, 'participantPhoneNo', e.target.value)}
                    />
                  </Box>
                </Stack>
              </div>
            ))}
            <div className={Styles.button}>
              <LoadingButton
                size="large"
                type="submit"
                variant="contained"
                style={{ textTransform: 'capitalize' }}
                sx={{ mt: 5, mb: 3 }}
              >
                {'Continue >'}
              </LoadingButton>
            </div>
          </form>
        </div>
        <div className={Styles.confirm}>
          <div className={Styles.desktop}>
            <CustomizedStepper activeSection={3} />
          </div>
          <div className={Styles.card}>
            <h1>Your Booking is Confirmed!</h1>
            <p>
              Confirmation email has been sent to your email address{' '}
              {hardcodedOrderDetails.buyerEmail}
            </p>
            <p>
              For any enquiries please contact{' '}
              <span>support@skillbook.com / +1 999999</span>
            </p>
          </div>
          <div className={Styles.order_no}>
            Order Number : <span>{hardcodedOrderDetails.transactionId}</span>
          </div>
          <div className={Styles.details}>
            <p>
              Name: <span>{hardcodedOrderDetails.buyerName}</span>
            </p>
            <p>
              Amount Paid: <span>{hardcodedOrderDetails.currencyType}{' '}
              {hardcodedOrderDetails.currencySymbol}
              {hardcodedOrderDetails.totalAmount}</span>
            </p>
            <p>
              No. of Attendees: <span>{hardcodedOrderDetails.numberOfParticipants}</span>
            </p>
            <div className={Styles.reciept}>
              {hardcodedOrderDetails.orderParticipantDTOS.length > 0 && (<></>
                //   <PDFDownloadLink
                //     document={<RecieptPDF details={hardcodedOrderDetails} />}
                //     fileName={`Invoice${hardcodedOrderDetails.eventName}`}
                //     style={{ textDecoration: 'none' }}
                //   >
                //     {({ loading }) => (
                //       <button>
                //         {loading ? <CircularProgress size={24} color="inherit" /> : 'Download reciept'}
                //       </button>
                //     )}
                //   </PDFDownloadLink>
              )}
            </div>
          </div>
          <div className={Styles.course_card}>
            <div className={Styles.course_wrapper}>
              <div className={Styles.left}>
                <div className={Styles.course_image}>
                  {/* <img src={hardcodedOrderDetails.courseLogoUrl} alt="" /> */}
                </div>
                <div className={Styles.course_details}>
                  <p>{hardcodedOrderDetails.eventName}</p>
                  <p>{hardcodedOrderDetails.instructorName}</p>
                  <p>
                    {moment(hardcodedOrderDetails.eventStartDate).format(
                      'MMMM DD YYYY, hh:mm A'
                    )}{' '}
                    to{' '}
                    {moment(hardcodedOrderDetails.eventEndDate).format(
                      'MMMM DD YYYY, hh:mm A'
                    )}{' '}
                    {hardcodedOrderDetails.timZoneShortName}
                  </p>
                </div>
              </div>
             
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
