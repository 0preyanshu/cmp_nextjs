'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Typography, FormControlLabel, Radio, Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { CardNumberElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import CardInput from './card';
import Styles from './styles/payment.module.scss';
import { toast } from '@/components/core/toaster';
import Image from 'next/image';
import { HOST_API } from '@/config';

const initialOptions = {
  "client-id": "AT6_ZWkFgV1qetaMelV4siuAGFOamNLOSUSEGME4JGgX9tYytioaxIzISe2-6bHjc11AYF46HhnvjTo7",
  "enable-funding": "paylater",
  "data-sdk-integration-source": "integrationbuilder_sc",
};

const chargeApi = async (token, paymentDetails) => {
  try {
    const response = await fetch(`${HOST_API}/payment-service/stripe/charge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
          customerEmail: paymentDetails.customerEmail,
        },
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error charging API: ", error);
    throw error;
  }
};

const createOrder = async (paymentDetails) => {
  try {
    const response = await fetch(`${HOST_API}/payment-service/paypal/createOrder`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentDetails),
    });

    const res = await response.json();
    const orderData = res.data.order;
    if (orderData?.id) {
      return orderData?.id;
    } else {
      const errorDetail = orderData?.details?.[0];
      const errorMessage = errorDetail
        ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
        : JSON.stringify(orderData);

      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error(error);
    toast.error(`Could not initiate PayPal Checkout...${error.message}`);
  }
};

const onApprove = async (data, actions, paymentDetails, setCurrentOrder, setActiveSection) => {
  try {
    const response = await fetch(`${HOST_API}/payment-service/paypal/captureOrder/${data.orderID}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentDetails),
    });

    const resJson = await response.json();
    console.log("Capture response", resJson?.data?.order);
    const orderData = resJson.data.paypalOrder;
    const errorDetail = orderData?.details?.[0];

    if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
      return actions.restart();
    } else if (errorDetail) {
      throw new Error(`${errorDetail.description} (${orderData.debug_id})`);
    } else {
      const transaction = orderData.purchase_units[0].payments.captures[0];
      
      console.log("Order data", orderData);
      console.log("Transaction data", resJson?.data?.order);
      setCurrentOrder(resJson?.data);
      setActiveSection(2);
      toast.success(`Transaction ${transaction.status}: ${transaction.id}`);
      console.log("Capture result", orderData, JSON.stringify(orderData, null, 2));
    }
  } catch (error) {
    console.error(error);
    toast.error(`Sorry, your transaction could not be processed...${error.message}`);
  }
};

export default function PaymentSection({
  data,
  eventID,
  currencyID,
  taxID,
  clientSecret,
  select,
  setSelect,
  triggerPayment,
  orderInfo,
  coupon,
  setActiveSection,
  currentOrder,
  setCurrentOrder,
  setPaymentLoading,
  setPaymentTrigger  // Add this prop
}) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPayPal, setShowPayPal] = useState(true);  // State to control PayPal button visibility

  const paymentDetails = {
    buyerFirstName: data.first_name,
    buyerLastName: data.last_name,
    buyerPhone: data.number,
    buyerEmail: data.email,
    purchaseType: data.for || 'MY_SELF',
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
    couponID: coupon ? coupon?.id : undefined,
    participants: data.participants || [],
    customerName: data.first_name,
    customerEmail: data.email,
  };

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
        toast.error(error?.message || "Payment Failed");
        setIsLoading(false);
        setPaymentLoading(false);
        return;
      }

      const chargeResponse = await chargeApi(token, paymentDetails);
      console.log("Charge response:", chargeResponse);
      if (chargeResponse?.data) {
        setCurrentOrder(chargeResponse?.data);
        toast.success("Payment Successful");
        setActiveSection(2);
      } else {
        toast.error("Payment Failed");
      }
    } catch (error) {
      console.error("Payment error:", error);
    } finally {
      setIsLoading(false);
      setPaymentLoading(false);
    }
  };

  useEffect(() => {
    if (triggerPayment) {
      if (select === "card") {
        handleSubmit();
      } else if (select === "paypal") {
        setShowPayPal(true);
      }
    }
  }, [triggerPayment]);

  return (
    <div>
      <div className={Styles.heading}>Payment</div>
      <div className={Styles.wrapper}>
        <div className={Styles.options}>
          <Box className={Styles.option}>
            <FormControlLabel
              control={<Radio onChange={() => setSelect('card')} checked={select === "card"} />}
              label={<Typography variant="h6">Credit/Debit Card</Typography>}
            />
          </Box>
          <Box className={Styles.option} style={{ borderRadius: '0px 0px 6px 6px' }}>
            <FormControlLabel
              control={<Radio onChange={() => setSelect("paypal")} checked={select === "paypal"} />}
              label={
                <Typography variant="h6">
                  <Image src="/assets/PayPal.png" alt="PayPal" width={100} height={25} />
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
        ) : showPayPal ? (
          <div>
            <div className={Styles.card_form}>
              <Typography variant="h6">
                You will be charged through your PayPal account.
              </Typography>
              <Typography variant="body2">
                Click <strong>"PayPal Checkout"</strong> and you will be redirected to PayPal to make the payment. After completing the payment process, you will be redirected back to Skillbook where you can view the order details.
              </Typography>
            </div>
           <div className={Styles.paypalContainer}>
      <PayPalScriptProvider options={initialOptions}>
        <PayPalButtons
          style={{
            shape: "rect",
            layout: "horizontal",
            color: "gold",
            label: "checkout",
            height: 40,
          }}
          className={Styles.paypalButton}
         
          createOrder={() => createOrder(paymentDetails)}
          onApprove={(data, actions) => onApprove(data, actions, paymentDetails, setCurrentOrder, setActiveSection)}
        />
      </PayPalScriptProvider>
    </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
