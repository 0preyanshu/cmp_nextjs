/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { TextField, Stack, Box, CircularProgress } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import CustomizedStepper from './stepper';
import Styles from './confirmed.module.scss';
import moment from 'moment';
import axios from 'axios';
import { toast } from '@/components/core/toaster';
import { HOST_API } from '@/config';

const Confirmed = ({ currentOrder, event, currency, token,For}) => {
  const [attendeeFormData, setAttendeeFormData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orderDetails, setOrderDetails] = useState({
    buyerName: currentOrder?.buyerFirstName,
    buyerEmail: currentOrder?.buyerEmail,
    buyerPhoneNo: currentOrder?.buyerPhone || '-',
    transactionId: currentOrder?.transactions[0]?.transactionID,
    numberOfParticipants: currentOrder?.orderInfo?.noOfParticipants,
    totalAmount: currentOrder?.orderInfo?.totalAmount,
    currencyType: currency.currencyShortName,
    currencySymbol: currency.currencySymbol,
    eventName: event.eventName,
    instructorName: event.instructorName || 'N/A',
    eventStartDate: event.eventStartDate,
    eventEndDate: event.eventEndDate,
    timZoneShortName: event.timezoneID,
    courseLogoUrl: event.courseLogoUrl || 'https://via.placeholder.com/150',
    orderParticipantDTOS: currentOrder?.participants || [],
  });

  useEffect(() => {
    console.log(currentOrder, "currentOrder");
  }, [currentOrder]);

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
    setLoading(true);
    try {
      const newParticipants = attendeeFormData.map((participant, index) => ({
        ...participant,
      }));
  
      const existingParticipants = orderDetails.orderParticipantDTOS.map((participant) => ({
        participantFirstName: participant.participantFirstName,
        participantLastName: participant.participantLastName,
        participantPhone: participant.participantPhone,
        participantEmail: participant.participantEmail,
      }));
  
      const allParticipants = [...existingParticipants, ...newParticipants];
  
      const response = await axios.put(`${HOST_API}/order/update-participant/${currentOrder?.id}`, {
        token,
        newParticipants: allParticipants,
      });
  
      console.log(response?.data?.data, "response");
      if (response?.data?.data) {
        const updatedOrderDetails = {
          ...orderDetails,
          orderParticipantDTOS: allParticipants,
        };
        setOrderDetails(updatedOrderDetails);
        setAttendeeFormData([]); // Clear the form after submission
        toast.success('Details updated successfully.');
      } else {
        throw new Error('Failed to update details.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to update details.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className={Styles.confirmed_page}>
      <div className={Styles.header}>
        <img src="https://strapis3images.s3.amazonaws.com/Group_431_89daa9d285.svg" alt="logo" />
      </div>
      <div className={Styles.wrapper}>
        {For==="MY_SELF" && orderDetails.orderParticipantDTOS.length ===1 && <>
        
          <div className={Styles.form}>
          {orderDetails.numberOfParticipants - orderDetails.orderParticipantDTOS.length > 0 && (
            <div className={Styles.header_text}>
              <h3>Please enter attendee information in the form below</h3>
            </div>
          )}
          <div className={Styles.heading}>
            <h3>Attendees Information</h3>
          </div>
          <div className={Styles.attendees}>
            <p>
              Number of Attendees : <span>{orderDetails.numberOfParticipants}</span>
            </p>
          </div>
          {orderDetails.orderParticipantDTOS.length > 0 && (
            <div className={Styles.attendeeDetails}>
              {orderDetails.orderParticipantDTOS.map((item, index) => (
                <div className={Styles.attendee} key={index}>
                  <div>Attendee {index + 1}:</div>
                  <div className={Styles.rightDetails}>
                    <div className={Styles.name}>
                      {item.participantFirstName} {item.participantLastName}
                    </div>
                    <div className={Styles.number}>{item.participantPhone}</div>
                    <div className={Styles.email}>{item.participantEmail}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {orderDetails.numberOfParticipants - orderDetails.orderParticipantDTOS.length > 0 && (
            <form className={Styles.form_wrapper} onSubmit={handleSubmit}>
              {Array.from({
                length: orderDetails.numberOfParticipants - orderDetails.orderParticipantDTOS.length,
              }).map((_, i) => (
                <div className={Styles.attendee} key={i}>
                  <h4>Attendee {orderDetails.orderParticipantDTOS.length + i + 1}:</h4>
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
                        value={attendeeFormData[i]?.participantPhone || ''}
                        onChange={(e) => handleFieldChange(i, 'participantPhone', e.target.value)}
                      />
                    </Box>
                  </Stack>
                </div>
              ))}
              {orderDetails.numberOfParticipants - orderDetails.orderParticipantDTOS.length > 0 && (
                <div className={Styles.button}>
                  <LoadingButton
                    size="large"
                    type="submit"
                    variant="contained"
                    style={{ textTransform: 'capitalize' }}
                    sx={{ mt: 5, mb: 3 }}
                    loading={loading}
                  >
                    {'Continue >'}
                  </LoadingButton>
                </div>
              )}
            </form>
          )}
        </div>
        </>}
        <div className={Styles.confirm}>
          <div className={Styles.desktop}>
            <CustomizedStepper activeSection={3} />
          </div>
          <div className={Styles.card}>
            <h1>Your Booking is Confirmed!</h1>
            <p>
              Confirmation email has been sent to your email address {orderDetails.buyerEmail}
            </p>
            <p>
              For any enquiries please contact <span>support@skillbook.com / +1 999999</span>
            </p>
          </div>
          <p className={Styles.order_no}>
            Order Number : <span>{orderDetails.transactionId}</span>
          </p>
          <div className={Styles.details}>
            <div>
              Name: <span>{orderDetails.buyerName}</span>
            </div>
            <div>
              Amount Paid: <span>{orderDetails.currencySymbol} {orderDetails.totalAmount}</span>
            </div>
            <div>
              No. of Attendees: <span>{orderDetails.numberOfParticipants}</span>
            </div>
            <div className={Styles.reciept}>
              {orderDetails.orderParticipantDTOS.length > 0 && (
                <></>
                // Uncomment and implement PDF download functionality here
                // <PDFDownloadLink
                //   document={<RecieptPDF details={orderDetails} />}
                //   fileName={Invoice${orderDetails.eventName}}
                //   style={{ textDecoration: 'none' }}
                // >
                //   {({ loading }) => (
                //     <button>
                //       {loading ? <CircularProgress size={24} color="inherit" /> : 'Download receipt'}
                //     </button>
                //   )}
                // </PDFDownloadLink>
              )}
            </div>
          </div>
          <div className={Styles.course_card}>
            <div className={Styles.course_wrapper}>
              <div className={Styles.left}>
                <div className={Styles.course_image}>
                  {/* <img src={orderDetails.courseLogoUrl} alt="" /> */}
                </div>
                <div className={Styles.course_details}>
                  <p>{orderDetails.eventName}</p>
                  <p>{orderDetails.instructorName}</p>
                  <p>{moment(orderDetails.eventStartDate).format('dddd, MMMM Do YYYY, h:mm a')} - {moment(orderDetails.eventEndDate).format('h:mm a')}</p>
                  <p>{orderDetails.timZoneShortName}</p>
                </div>
              </div>
            </div>
          </div>
          <div className={Styles.footer}>
            <p>Thank you for your order!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirmed;
