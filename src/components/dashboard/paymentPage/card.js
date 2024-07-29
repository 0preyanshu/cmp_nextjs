import React from 'react';
import { CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import { Grid, TextField } from '@mui/material';
import Styles from './styles/card.module.scss';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#000000",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

function CardInput() {
  return (
    <div className={Styles.cardWrapper}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <label className={Styles.cardLabel}>
            <span className={Styles.cardLabelText}>Card number</span>
            <div className={Styles.cardNumberWrapper}>
              <CardNumberElement className={Styles.cardInput} options={CARD_ELEMENT_OPTIONS} />
              {/* <img src="/path/to/mastercard-logo.png" alt="MasterCard" className={Styles.cardLogo} /> */}
            </div>
          </label>
        </Grid>
        <Grid item xs={6}>
          <label className={Styles.cardLabel}>
            <span className={Styles.cardLabelText}>MM / YY</span>
            <CardExpiryElement className={Styles.cardInput} options={CARD_ELEMENT_OPTIONS} />
          </label>
        </Grid>
        <Grid item xs={6}>
          <label className={Styles.cardLabel}>
            <span className={Styles.cardLabelText}>CVC</span>
            <CardCvcElement className={Styles.cardInput} options={CARD_ELEMENT_OPTIONS} />
          </label>
        </Grid>
        <Grid item xs={12}>
          <label className={Styles.cardLabel}>
            <span className={Styles.cardLabelText}>Cardholder name (as printed on your card)</span>
            <TextField
              variant="outlined"
              fullWidth
              placeholder="Cardholder name"
              className={Styles.cardInput}
            />
          </label>
        </Grid>
        <Grid item xs={12} className={Styles.sslSecured}>
          {/* <img src="/path/to/ssl-secured-logo.png" alt="SSL Secured" /> */}
          {/* <span>SSL Secured</span> */}
        </Grid>
      </Grid>
    </div>
  );
}

export default CardInput;
