'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Typography, FormControlLabel, Radio, Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
import CardInput from './card';
import Styles from './styles/payment.module.scss';
import {toast} from '@/components/core/toaster'
import Image from 'next/image';

const PAYPAL_URL = "https://www.paypal.com/checkout";

const chargeApi = async (token, paymentDetails) => {
  try {
    const response = await fetch('https://zl15dvruoa.execute-api.us-east-1.amazonaws.com/prod/payment-service/stripe/charge', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        buyerFirstName: paymentDetails.buyerFirstName,
        buyerLastName: paymentDetails.buyerLastName,
        buyerPhone: paymentDetails.buyerPhone,
        buyerEmail: paymentDetails.buyerEmail,
        purchaseType: paymentDetails.purchaseType,
        orderInfo: paymentDetails.orderInfo,
        eventID: paymentDetails.eventID,
        currencyID: paymentDetails.currencyID,
        taxID: paymentDetails.taxID,
        couponID: paymentDetails.couponID,
        participants: paymentDetails.participants,
        paymentData: {
          token: token.id,
          customerName: paymentDetails.customerName,
          customerEmail: paymentDetails.customerEmail
        }
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error charging API: ", error);
    throw error;
  }
};

export default function PaymentSection({ data, eventID, currencyID,taxID, clientSecret, select, setSelect, triggerPayment, orderInfo , coupon,setActiveSection,currentOrder,setCurrentOrder,setPaymentLoading}) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setPaymentLoading(true);

    const cardElement = elements.getElement(CardNumberElement);

    try {
      const { token, error } = await stripe.createToken(cardElement);
      if (error) {
        console.log("Error creating token:", error);
        toast.error(error?.message || "Payment Failed")
        setIsLoading(false);
        setPaymentLoading(false);
        return;
      }
     

       console.log(data,"data");
      const paymentDetails = {
        buyerFirstName: data.first_name,
        buyerLastName: data.last_name,
        buyerPhone: data.number,
        buyerEmail: data.email,
        purchaseType: data.for ||'MY_SELF',
        orderInfo: {
          calculatedAmount: orderInfo.calculatedAmount,
          noOfParticipants: data.attendees,
          eventAmount: orderInfo.eventAmount,
          taxAmount: orderInfo.taxAmount,
          couponAmount: orderInfo.couponAmount,
        },
        eventID: eventID,
        currencyID: currencyID,
        taxID: taxID,
        couponID:  coupon ? coupon?.id : undefined,
        participants: data.participants || [],
        customerName: data.first_name,
        customerEmail: data.email,
      };

      const chargeResponse = await chargeApi(token, paymentDetails);
      console.log("Charge response:", chargeResponse);
      if(chargeResponse?.data){
        setCurrentOrder(chargeResponse?.data);
        toast.success("Payment Successful")
        setActiveSection(2);
      }else{
        toast.error("Payment Failed")
      }
    } catch (error) {
      console.error("Payment error:", error);
    } finally {
      setIsLoading(false);
      setPaymentLoading(false);
    }
  };

  const handlePayPalPay = () => {
    setIsLoading(true);
    router.push(PAYPAL_URL);
  };

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
      Payment
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
                 <img src="./assets/PayPal.png" alt="PayPal"  width={100} height={25} />
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
                            <LoadingButton loading={isLoading} className={Styles.paypal} onClick={handlePayPalPay}>
                                <img src="./assets/PayPal.png"  style={isLoading ? { opacity: 0 ,margiBottom:"10px"} : {margiBottom:"10px"}} alt="paypal" />
                                Checkout
                            </LoadingButton>
                       
            </div>
            <div className={Styles.message}>
              <Typography variant="body2" sx={{mt:1}}>The safer, easier way to pay</Typography>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
