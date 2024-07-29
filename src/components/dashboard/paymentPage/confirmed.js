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
import { maxWidth } from '@mui/system';
import { PDFDownloadLink } from '@react-pdf/renderer';
import RecieptPDF from './receiptPDF';
import { saveAs } from 'file-saver';
import { pdf } from '@react-pdf/renderer';
import {CloudArrowDown} from '@phosphor-icons/react';

const generatePdfDocument = async (documentData, fileName) => {
  try {
      console.log(documentData, "documentData");
      const blob = await pdf(
          <RecieptPDF orderDetails={documentData} />
      ).toBlob();
      console.log(blob, "blob");
      saveAs(blob, fileName);
  } catch (error) {
      console.error('Error generating PDF:', error);
  }
};

const Confirmed = ({ currentOrder, event, currency, token,For,values,orderInfo}) => {
  const [attendeeFormData, setAttendeeFormData] = useState([]);
  const [loading, setLoading] = useState(false);
  // setOrderInfo({
  //   calculatedAmount,
  //   noOfParticipants,
  //   eventAmount,
  //   taxAmount,
  //   couponAmount,
  // });
  const [orderDetails, setOrderDetails] = useState({
    buyerName: currentOrder?.buyerFirstName || '-',
    buyerEmail: currentOrder?.buyerEmail || '-',
    buyerPhoneNo: currentOrder?.buyerPhone || '-',
    transactionId: currentOrder?.transactions[0]?.transactionID ||  '-',
    numberOfParticipants: currentOrder?.orderInfo?.noOfParticipants|| '-',
    totalAmount: currentOrder?.orderInfo?.totalAmount|| '-',
    currencyType: currency.currencyShortName,
    currencySymbol: currency.currencySymbol,
    eventName: event.eventName,
    instructorName: event.instructorName || 'N/A',
    eventStartDate: event.eventStartDate,
    eventEndDate: event.eventEndDate,
    timZoneShortName: event.timezoneID,
    courseLogoUrl: event.courseLogoUrl || 'https://via.placeholder.com/150',
    orderParticipantDTOS: currentOrder?.participants || [],
    orderDate : currentOrder?.orderHistory[0]?.date || 'N/A',
    calculatedAmount:orderInfo?.calculatedAmount,
    eventAmount:orderInfo?.eventAmount,
    taxAmount:orderInfo?.taxAmount,
    couponAmount:orderInfo?.couponAmount,
  },[currentOrder, event, currency,orderInfo]);

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
        newParticipants: newParticipants,
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

  const [pdfloading, setpdfLoading] = useState(false);

    const handleDownload = async () => {
      console.log('Generating PDF...');
        setpdfLoading(true);
        try {
            await generatePdfDocument(orderDetails, `Receipt_${orderDetails.transactionId}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
        } finally {
            setpdfLoading(false);
        }
    };
  
  return (
    <div className={Styles.confirmed_page}>
      <div className={Styles.header}>
        <img src="https://strapis3images.s3.amazonaws.com/Group_431_89daa9d285.svg" alt="logo" />
      </div>
      <div className={Styles.wrapper}>
        {console.log(For," for ",values)}
        {console.log("x",orderDetails.numberOfParticipants,orderDetails.orderParticipantDTOS.length)}
        {(For!=="MY_SELF" || values.attendees !==1) && <>
        
          <div className={Styles.form}>
          {orderDetails.numberOfParticipants - orderDetails.orderParticipantDTOS.length > 0 && (
            <div className={Styles.header_text}>
             Please enter attendee information in the form below
            </div>
          )}
          <div className={Styles.heading}>
            Attendees Information
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
          <div className={Styles.desktop} style={{maxWidth:"550px"}}>
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
              {console.log(For,"for",values.attendees ,(For==="MY_SELF" && values.attendees ===1),((orderDetails.numberOfParticipants - orderDetails.orderParticipantDTOS.length <= 0) || (For==="MY_SELF" && values.attendees ===1)))}
            {((orderDetails.numberOfParticipants - orderDetails.orderParticipantDTOS.length <= 0) || (For==="MY_SELF" && values.attendees ===1)) &&(
    <button onClick={handleDownload} disabled={pdfloading} style={{ display: 'flex', alignItems: 'center' }}> 
        {pdfloading ? (
            <CircularProgress size={24} color="inherit" sx={{ ml: 5 }} />
        ) : (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ marginRight: '10px' }}>Download Receipt</div>
                <CloudArrowDown size={24} sx={{ ml: 2, mt: 5 }} />
            </div>
        )}
    </button>
)}

        </div>
          </div>
          <div className={Styles.course_card} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid #e0e0e0', borderRadius: '8px',  }}>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h3 style={{ margin: 0 }}>{orderDetails.eventName}</h3>
        <p style={{  margin: 0 }}>Instructor : {orderDetails.instructorName}</p>
      </div>
      <div style={{ textAlign: 'right' }}>
        <p style={{ margin: 0, fontWeight: 'bold' }}>
          {moment(orderDetails.eventStartDate).format('MMM DD')} - {moment(orderDetails.eventEndDate).format('MMM DD, YYYY')}
        </p>
        <p style={{ margin: 0, fontWeight: 'bold' }}>
          {moment(orderDetails.eventStartDate).format('ddd')} - {moment(orderDetails.eventEndDate).format('ddd')} ({moment(orderDetails.eventEndDate).diff(moment(orderDetails.eventStartDate), 'days')} Days)
        </p>
        <p style={{ margin: 0, fontWeight: 'bold' }}>
          {moment(orderDetails.eventStartDate).format('hh:mm A')} - {moment(orderDetails.eventEndDate).format('hh:mm A')} ({orderDetails.timezoneShortName})
        </p>
      </div>
    </div>
          <div className={Styles.footer}>
            <h3>Thank you for your order!</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirmed;
