import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import { HOST_API } from '../../config';
import axios from 'axios';
import { createDeflateRaw } from 'zlib';

import { HOST_API } from '@/config';
const name = 'company-payment';

const createInitialState = () => ({
  isLoading: false,
  error: null,
  paypalData: {
    companyId: 123,
    developmentMode: true,
    devPublicKey: '',
    devSecretKey: '',
    prodPublicKey: 'your_prod_public_key',
    prodSecretKey: 'your_prod_secret_key',
    cardNumber: '',
    cvv: '000',
    cardDate: '',
    valid: true,
  },
  stripeData: {
    companyId: 123,
    developmentMode: true,
    devPublicKey: '',
    devSecretKey: '',
    prodPublicKey: 'your_prod_public_key',
    prodSecretKey: 'your_prod_secret_key',
    cardNumber: '',
    cvv: '000',
    cardDate: '',
    valid: true,
  },
});

function getCompanyPaymentDetails() {
  return createAsyncThunk(`${name}/getCompanyPaymentDetails`, async () => {
    try {
      const response = await axios.get(HOST_API.concat(`/credentials/01J00AT4C1V8YCD9HGVE9935JH`), {
        headers: { Authorization: `Bearer ${localStorage.getItem('custom-auth-token')}` },
      });
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  });
}

function updateStripeCompanyPaymentDetails() {
  return createAsyncThunk(`${name}/updateStripeCompanyPaymentDetails`, async (updatedStripeCompanyPaymentDetail) => {
    try {
      //   For Stripe Payment
      const response = await axios.put(
        HOST_API.concat('/credentials/01J00AT4C1V8YCD9HGVE9935JH'),
        updatedStripeCompanyPaymentDetail,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('custom-auth-token')}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  });
}

function updatePaypalCompanyPaymentDetails() {
  return createAsyncThunk(`${name}/updatePaypalCompanyPaymentDetails`, async (updatedPaypalCompanyPaymentDetail) => {
    try {
      // For Paypal Data
      const response = await axios.put(
        HOST_API.concat('/credentials/01J00AT4C1V8YCD9HGVE9935JH'),
        updatedPaypalCompanyPaymentDetail,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('custom-auth-token')}`,
          },
        }
      );
      return response;
    } catch (error) {
      return error.response.data;
    }
  });
}

function createExtraActions() {
  return {
    getCompanyPaymentDetails: getCompanyPaymentDetails(),
    updateStripeCompanyPaymentDetails: updateStripeCompanyPaymentDetails(),
    updatePaypalCompanyPaymentDetails: updatePaypalCompanyPaymentDetails(),
  };
}

const extraActions = createExtraActions();

function createExtraReducers() {
  function getCompanyPaymentDetailsReducer() {
    const { fulfilled, pending, rejected } = extraActions.getCompanyPaymentDetails;
    return {
      [pending]: (state) => {
        state.isLoading = true;
      },
      [fulfilled]: (state, action) => {
        console.log("action?.payload?.data", action?.payload?.data)
        state.paypalData = action?.payload?.data?.credentials?.variables?.paypal 
        state.stripeData = action?.payload?.data?.credentials?.variables?.stripe 
        state.isLoading = false;
      },
      [rejected]: (state, action) => {
        state.isLoading = false;
        state.error = action?.error?.message;
      },
    };
  }
  function updateStripeCompanyPaymentDetailsReducer() {
    const { fulfilled, pending, rejected } = extraActions.updateStripeCompanyPaymentDetails;
    return {
      [pending]: (state) => {
        state.isLoading = true;
      },
      [fulfilled]: (state, action) => {

      },
      [rejected]: (state, action) => {
        state.isLoading = false;
        state.error = action?.error?.message;
      },
    };
  }
  function updatePaypalCompanyPaymentDetailsReducer() {
    const { fulfilled, pending, rejected } = extraActions.updatePaypalCompanyPaymentDetails;
    return {
      [pending]: (state) => {
        state.isLoading = true;
      },
      [fulfilled]: (state, action) => {

      },
      [rejected]: (state, action) => {
        state.isLoading = false;
        state.error = action?.error?.message;
      },
    };
  }
  return {
    ...getCompanyPaymentDetailsReducer(),
    ...updateStripeCompanyPaymentDetailsReducer(),
    ...updatePaypalCompanyPaymentDetailsReducer(),
  };
}

const extraReducers = createExtraReducers();
const initialState = createInitialState();

const slice = createSlice({
  name: 'companyPaymentDetails',
  initialState,
  extraReducers,
});

export const CompanyPaymentDetailsActions = { ...slice.actions, ...extraActions };
export default slice.reducer;
