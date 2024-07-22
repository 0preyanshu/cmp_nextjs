'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Typography, FormControlLabel, Radio, Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import CardInput from './card';
// import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Styles from './styles/payment.module.scss';

const PAYPAL_URL = "https://www.paypal.com/checkout";

export default function PaymentSection({ data, eventId, currencyId, clientSecret, select, setSelect, triggerPayment }) {
  // const stripe = useStripe();
  const stripe = 1; // Hardcoded value for stripe
  // const elements = useElements();
  const elements = 1; // Hardcoded value for elements
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    // Simulate payment intent initiation
    console.log('Initiating payment intent:', {
      currencyId,
      noOfParticipants: data.attendees,
      eventId,
      couponCode: data.coupon,
      orderId: data.orderId,
    });

    // Simulate a successful payment confirmation
    console.log('Payment confirmed');

    setIsLoading(false);
  };

  const handlePayPalPay = () => {
    setIsLoading(true);
    // Simulate redirect to PayPal
    router.push(PAYPAL_URL);
  }

  const paymentElementOptions = {
    layout: "tabs"
  }

  useEffect(() => {
    if (triggerPayment) {
      if (select === "card") {
        handleSubmit();
      } else {
        handlePayPalPay();
      }
    }
  }, [triggerPayment]);

  return (
    <div>
      <div className={Styles.heading}>
        <Typography variant="h4">Payment</Typography>
      </div>
      <div className={Styles.wrapper}>
        <div className={Styles.options}>
          <Box className={Styles.option}>
            <FormControlLabel
              control={<Radio onChange={() => setSelect('card')} checked={select === "card"} />}
              label={
                <Typography variant="h6">
                  Credit/Debit Card
                </Typography>
              }
            />
          </Box>
          <Box className={Styles.option} style={{ borderRadius: '0px 0px 6px 6px' }}>
            <FormControlLabel
              control={<Radio onChange={() => setSelect("paypal")} checked={select === "paypal"} />}
              label={
                <Typography variant="h6">
                  PayPal
                </Typography>
              }
            />
          </Box>
        </div>
        {select === "card" ? (
          <form id="payment-form" onSubmit={handleSubmit}>
            <CardInput />
            <div className={Styles.button}>
              <LoadingButton
                size="large"
                type="submit"
                variant="contained"
                loading={isLoading || !stripe || !elements}
                style={{ textTransform: 'capitalize' }}
                sx={{ mt: 5, mb: 3 }}
              >
                {'Continue >'}
              </LoadingButton>
            </div>
          </form>
        ) : (
          <div>
            <div className={Styles.card_form}>
              <Typography variant="h6">
                You will be charged through your PayPal account.
              </Typography>
              <Typography variant="body2">
                Click <strong>"PayPal Checkout"</strong> and you will be redirected to PayPal to make the payment. After completing the payment process, you will be redirected back to Skillbook where you can view the order details.
              </Typography>
            </div>
            <div className={Styles.button}>
              <LoadingButton loading={isLoading} onClick={handlePayPalPay}>
                PayPal Checkout
              </LoadingButton>
            </div>
            <div className={Styles.message}>
              <Typography variant="body2">The safer, easier way to pay</Typography>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
