'use client';
import * as React from 'react';
import { Box, Grid, Typography, Skeleton } from '@mui/material';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { LoadingButton } from '@mui/lab';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import Styles from './payment.module.scss';
import PaymentSummary from './payment-summary';
import BuyerInformation from './buyer-info';
import CustomizedStepper from './stepper';
import BasicInformation from './basic-info';
import PaymentFooter from './payment-footer';
import PaymentSection from './payment';
import InfoSection from './info-section';
import Confirmed from './confirmed';
export default function Payment() {
  const eventid = 1;
  const currencyid = 1;
  const step = 1;

  const isDesktop = false;

  const [activeSection, setActiveSection] = React.useState(step ? step - 1 : 0);
  const [open, setOpen] = React.useState(false);
  const [event, setEvent] = React.useState({});
  const [clientSecret, setClientSecret] = React.useState("test_client_secret");
  const [select, setSelect] = React.useState("card");
  const [triggerPayment, setTriggerPayment] = React.useState(false);
  const [stripePromise, setStripePromise] = React.useState(null);

  const validationSchema = z.object({
    for: z.enum(["Myself", "SomeoneElse"], { required_error: "Select who you are buying for" }),
    attendees: z.number().min(1, "There must be at least one attendee"),
    first_name: z.string().min(1, "First name is required!"),
    last_name: z.string().min(1, "Last name is required!"),
    email: z.string().email('Email must be a valid email address.').min(1, "Email is required!"),
    number: z.string().regex(/^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/, 'Phone number is not valid').min(1, 'Phone number is required'),
    coupon: z.string().min(0, "Coupon is required").optional(),
    orderId: z.string().optional(),
    editable: z.boolean().optional(),
    emailSent: z.boolean().optional(),
  });

  const defaultValues = {
    for: "Myself",
    attendees: 1,
    first_name: "",
    last_name: "",
    email: "",
    number: '',
    coupon: "",
    orderId: "",
    editable: false,
    emailSent: false,
  };

  const methods = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    handleSubmit,
    control,
    setValue,
    formState: { isSubmitting, errors },
  } = methods;

  const values = watch();

  const priceDetails = {
    currencyName: "USD",
    currencyLogo: "$",
    totalAmount: 100,
    couponDiscount: 0,
  };

  const onSubmit = async (data) => {
    try {
      console.log(errors, "errors");
      console.log(data, "submitted values");
   
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    const fetchStripeConfig = async () => {
      const response = await fetch("https://4zg88ggiaa.execute-api.ap-south-1.amazonaws.com/stg/payment-service/stripe/config", {
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAxSjJCUVpSU1FXQ1QwUFpZWDhINkVQRjM0IiwiZW1haWwiOiJhZG1pbkBoZWxpdmVyc2UuY29tIiwidXNlclR5cGVJRCI6IjAxSjJCUzVSRkdDTTdLWjI2QUFZUjM3VkVYIiwiZGVmYXVsdFByaXZpbGVnZXMiOlsiMCIsIjAiXSwiaWF0IjoxNzIwOTY2MjUyLCJleHAiOjE3MjEzOTgyNTJ9.fOZXIZuBvtZuySR1ZxlBOi5nalZEXnTox1_nd7TqON4`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const { publishableKey } = data.data;
        console.log(publishableKey);
        setStripePromise(loadStripe(publishableKey));
      } else {
        console.error('Failed to fetch Stripe config');
      }
    };

    fetchStripeConfig();
  }, []);

  return (
    <div className={Styles.payment_page}>
      <div className={Styles.header}>
        <img src="https://strapis3images.s3.amazonaws.com/Group_431_89daa9d285.svg" alt="logo" />
      </div>
      <div className={Styles.payment_card}>
        <Grid container spacing={isDesktop ? 3 : 5}>
          <Grid item xs={12} md={8}>
            <Box sx={{ mt: { xs: "0", md: "-40px" } }}>
              <CustomizedStepper activeSection={activeSection} />
              {activeSection === 0 && (
                <>
                  <BasicInformation data={values} setData={setValue} control={control} formValues={values} />
                  <BuyerInformation
                    setActiveSection={setActiveSection}
                    data={values}
                    setData={setValue}
                    eventId={event.eventId}
                    courseId={event.courseId}
                    coupon={priceDetails.couponDiscount > 0}
                    isSubmitting={isSubmitting}
                    handleSubmit={handleSubmit}
                    onSubmit={handleSubmit(onSubmit)}
                    control={control}
                    errors={errors}
                  />
                </>
              )}
              {activeSection === 1 && (
                <>
                  <Grid sx={{ display: { xs: 'none', md: 'block' } }}>
                    <InfoSection setActiveSection={setActiveSection} data={values} />
                  </Grid>
                  {stripePromise && clientSecret && (
                    <Elements stripe={stripePromise}>
                      <PaymentSection
                        data={values}
                        eventId={eventid}
                        currencyId={currencyid}
                        clientSecret={"pi_test_123_secret_456"}
                        select={select}
                        setSelect={setSelect}
                        triggerPayment={triggerPayment}
                      />
                    </Elements>
                  )}
                </>
              )}
              {
                activeSection === 2 && (
                  <><Confirmed></Confirmed></>
                )

              
              }
              <PaymentFooter />
            </Box>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: { xs: 'none', md: 'block' } }}>
            <PaymentSummary data={values} setData={setValue} activeSection={activeSection} setActiveSection={setActiveSection} event={event} loading={false} currencyid={currencyid} />
          </Grid>
          <div className={Styles.fixed_footer}>
            <div className={Styles.price}>
              <p>Total: {priceDetails.currencyName} {priceDetails.currencyLogo}{priceDetails.totalAmount}</p>
            </div>
            <div className={Styles.buttons}>
              <button style={{ background: "#000" }} onClick={() => setOpen(!open)}>{open ? "Close Details" : "View Details"}</button>
              <LoadingButton
                loading={isSubmitting}
                style={{ background: "#FB5741" }}
                onClick={activeSection === 0 ? handleSubmit(onSubmit) : () => setTriggerPayment(!triggerPayment)}
              >
                {activeSection === 0 ? "Continue >" : "Pay Now"}
              </LoadingButton>
            </div>
          </div>
          {open && activeSection!==2 && (
            <div className={Styles.info}>
              <PaymentSummary data={values} setData={setValue} activeSection={activeSection} setActiveSection={setActiveSection} event={event} loading={false} currencyid={currencyid} />
            </div>
          )}
        </Grid>
      </div>
    </div>
  );
}
