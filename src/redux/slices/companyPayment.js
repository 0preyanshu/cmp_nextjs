import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { HOST_API } from '../../config';
import axios from 'axios';

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
      const response = await axios.get(HOST_API.concat(`/companyPaymentDetails/get`), {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      return response;
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
        HOST_API.concat('/companyPaymentDetails/update/19'),
        updatedStripeCompanyPaymentDetail,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );
      return response;
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
        HOST_API.concat('/companyPaymentDetails/update/18'),
        updatedPaypalCompanyPaymentDetail,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
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
        state.paypalData = action?.payload?.data?.find((ele) => ele.paymentMethodName === 'PAYPAL');
        state.stripeData = action?.payload?.data?.find((ele) => ele.paymentMethodName === 'STRIPE');
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
        state.isLoading = false;
        state.stripeData = action?.payload?.data || state.stripeData;
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
        state.isLoading = false;
        state.paypalData = action?.payload?.data || state.paypalData;
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
