import React, { useState } from "react";
import { useStripe, useElements, CardNumberElement, CardCvcElement, CardExpiryElement } from "@stripe/react-stripe-js";

const chargeApi = async (token, paymentDetails) => {
  try {
    const response = await fetch('https://4zg88ggiaa.execute-api.ap-south-1.amazonaws.com/stg/payment-service/stripe/charge', {
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

export default chargeApi;
