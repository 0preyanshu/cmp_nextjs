import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
// import { HOST_API } from '../../config';
const HOST_API = 'https://zfwppq9jk2.execute-api.us-east-1.amazonaws.com/stg';

// const initialState = [];

const name = 'Currency';
const initialState = createInitialState();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({
  name,
  initialState,
  extraReducers,
});

export const CurrencyAction = { ...slice.actions, ...extraActions };

export default slice.reducer;

function createInitialState() {
  return {
    currency: { allCurrency: [], error: '', toast: {} },
    allCurrencyData: [],
  };
}

function createExtraActions() {
  return {
    createCurrency: createCurrency(),
    fetchCurrency: fetchCurrency(),
    deleteCurrency: deleteCurrency(),
    updateCurrency: updateCurrency(),
  };
}

// create api
function createCurrency() {
  return createAsyncThunk(`${name}/createCurrency`, async (data) => {
  
    const newobj={
    "currencyName": data.currencyName,
    "currencySymbol": data.symbol,
    "currencyShortName": data.symbol,
    "countryID": data.countryID,
   
    }
    try {
      const response = await axios.post(HOST_API.concat(`/currency`), newobj, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      return response;
    } catch (err) {
      return err;
    }
  });
}
function fetchCurrency() {
  return createAsyncThunk(`${name}/fetchCurrency`, async (data) => {
    try {
      const response = await axios.get(
        HOST_API.concat(`/currency?page=${data.page}&limit=${data.limit}&search=${data.name||""}`),
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        }
      );
      console.log(response.data);
      const res = response.data;

      if (!res.error || res.data.data) {
        const newres = {
        currencies: res.data.data,
        message: res.data.message,
        totalElements: res.data.data.length,
        totalPages: data.page + 1,}

        console.log(newres, "newres");

        return newres;
    }
    
      return {};
    } catch (err) {
      return err;
    }
  });
}

function deleteCurrency() {
  return createAsyncThunk(`${name}/deleteCurrency`, async (id) => {
    try {
      const response = await axios.delete(HOST_API.concat(`/currency/${id}`), {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      return response.data;
    } catch (err) {
      return err;
    }
  });
}
function updateCurrency() {
 
  return createAsyncThunk(`${name}/updateCurrency`, async (data) => {
    try {

// console.log(data,"dataupdate")

// const newobj={
// "currencyName": data.currencyType,
// "currencySymbol": data.symbol,
// "currencyShortName": data.shortName,
// "countryID": data.countryId,
// "countryName": data.currencyType,
// "countryShortName": data.currencyType
// }
      const response = await axios.put(HOST_API.concat(`/currency/${data.id}/`), data, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      return response;
    } catch (err) {
      return err;
    }
  });
}

function createExtraReducers() {
  return {
    ...createCurrency(),
    ...fetchCurrency(),
    ...deleteCurrency(),
    ...updateCurrency(),
  };

  function createCurrency() {
    const { pending, fulfilled, rejected } = extraActions.createCurrency;
    return {
      [pending]: (state) => {
        state.currency = {
          loading: true,
          allCurrency: state.currency.allCurrency,
          totalData: state?.currency?.totalData,
        };
      },
      [fulfilled]: (state, action) => {
        
      },
      [rejected]: (state, action) => {
        state.currency = {
          error: action.error.message,
          loading: false,
          totalData: state?.currency?.totalData,
          allCurrency: state.currency.allCurrency,
          toast: { message: action?.error?.message || 'Failed to create User!', variant: 'error' },
        };
      },
    };
  }
  function fetchCurrency() {
    const { pending, fulfilled, rejected } = extraActions.fetchCurrency;
    return {
      [pending]: (state) => {
        state.currency = {
          loading: true,
          allCurrency: state.currency.allCurrency || [],
          totalData: state?.currency?.totalData,
        };
        state.allCurrencyData = state.allCurrencyData || [];
      },
      [fulfilled]: (state, action) => {
        const { isIndex } = action.meta.arg;

        state.currency = {
          allCurrency: action?.payload?.currencies,
          totalData: action?.payload?.totalElements,
          loading: false,
          toast: { message: 'User Added Successfully', variant: 'success' },
        };
        state.allCurrencyData = isIndex ? action?.payload?.currencies : state.allCurrencyData;
      },
      [rejected]: (state, action) => {
        state.currency = {
          error: action.error.message,
          allCurrency: state.currency.allCurrency,
          totalData: state?.currency?.totalData,
          loading: false,
          toast: { message: action?.error?.message || 'Failed to create User!', variant: 'error' },
        };
        state.allCurrencyData = state.allCurrencyData || [];
      },
    };
  }
  function deleteCurrency() {
    const { pending, fulfilled, rejected } = extraActions.deleteCurrency;
    return {
      [pending]: (state) => {
        state.currency = {
          loading: true,
          totalData: state?.currency?.totalData,
          allCurrency: state.currency.allCurrency,
        };
      },
      [fulfilled]: (state, action) => {
        const deletedId = action?.meta?.arg;
        state.currency = {
          loading: false,
          totalData: state?.currency?.totalData,
          allCurrency:
            state.currency.allCurrency?.map((item) =>
              item.id === deletedId ? { ...item, valid: !item.valid } : item
            ) || [],
          toast: { message: 'Tax Deleted Successfully', variant: 'success' },
        };
       
      },
      [rejected]: (state, action) => {
        state.currency = {
          error: action.error.message,
          totalData: state?.currency?.totalData,
          allCurrency: state?.currency?.allCurrency,
          loading: false,
          toast: { message: action?.error?.message || 'Failed to create User!', variant: 'error' },
        };
      },
    };
  }
  function updateCurrency() {
    const { pending, fulfilled, rejected } = extraActions.updateCurrency;
    return {
      [pending]: (state, action) => {
        state.currency = {
          loading: true,
          totalData: state?.currency?.totalData,
          allCurrency: state.currency.allCurrency || [],
        };
      },
      [fulfilled]: (state, action) => {
       
    
      },
      [rejected]: (state, action) => {
        state.currency = {
          error: action.error.message,
          totalData: state?.currency?.totalData,
          allCurrency: state?.currency?.allCurrency,
          loading: false,
          toast: { message: action?.error?.message || 'Failed to create User!', variant: 'error' },
        };
      },
    };
  }
}

// Reducer

// Actions
