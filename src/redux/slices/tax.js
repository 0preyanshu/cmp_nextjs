import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
// import { HOST_API } from '../../config';
const HOST_API = 'https://zfwppq9jk2.execute-api.us-east-1.amazonaws.com/stg';

// const initialState = [];

const name = 'tax';
const initialState = createInitialState();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({
  name,
  initialState,
  extraReducers,
});

export const TaxActions = { ...slice.actions, ...extraActions };

export default slice.reducer;

function createInitialState() {
  return {
    taxes: { allTaxes: [], error: '', toast: {}, totalData: 0 },
    allTaxData: [],
  };
}

function createExtraActions() {
  return {
    createTax: createTax(),
    fetchTaxes: fetchTaxes(),
    deleteTax: deleteTax(),
    updateTax: updateTax(),
  };
}

// create api
function createTax() {
  return createAsyncThunk(`${name}/createTax`, async (data) => {


    const newobj={
      "taxName" : data.taxType,
      "taxPercentage" : Number(data.percentage),
    }
   
    try {
      console.log(data, 'd');
      const response = await axios.post(HOST_API.concat(`/tax`), newobj, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      return response;
    } catch (err) {
      return err;
    }
  });
}
function fetchTaxes() {
  return createAsyncThunk(`${name}/fetchTaxes`, async (data) => {
    try {
      const response = await axios.get(
        HOST_API.concat(`/tax?page=${data.page}&limit=${data.limit}&search=${data.name}`),
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        }
      );
      console.log('response', response.data);
      const res = response.data;
      if (!res.error || res.data) {
        const newres = {
          taxDTOs: res.data.data,
          totalElements: res.data.data.length,
          totalPages: data.page + 1,
        };
        return newres;
      }
      return {};
    } catch (err) {
      return err;
    }
  });
}

function deleteTax() {
  return createAsyncThunk(`${name}/deleteTax`, async (id) => {
    try {
      const response = await axios.delete(HOST_API.concat(`/tax/${id}`), {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      return response.data;
    } catch (err) {
      return err;
    }
  });
}
function updateTax() {
 
  return createAsyncThunk(`${name}/updateTax`, async (data) => {
   
    try {
      
    const newobj={
      "taxName" : data.taxType,
      "taxPercentage" : Number(data.percentage),
    }
      const response = await axios.put(HOST_API.concat(`/tax/${data.id}`), newobj, {
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
    ...createTax(),
    ...fetchTaxes(),
    ...deleteTax(),
    ...updateTax(),
  };

  function createTax() {
    const { pending, fulfilled, rejected } = extraActions.createTax;
    return {
      [pending]: (state) => {
        state.taxes = { loading: true, allTaxes: state.taxes.allTaxes || [], totalData: state.taxes.totalData };
      },
      [fulfilled]: (state, action) => {
        state.taxes = {
          allTaxes: [...state.taxes.allTaxes, action.payload?.data?.taxDTO],
          totalData: state.taxes.totalData + 1,
          loading: false,
          toast: { message: 'Tax Added Successfully', variant: 'success' },
        };
       fetchTaxes()
      },
      [rejected]: (state, action) => {
        state.taxes = {
          error: action.error.message,
          loading: false,
          totalData: state.taxes.totalData,
          allTaxes: state.taxes.allTaxes,
          toast: { message: action?.error?.message || 'Failed to create User!', variant: 'error' },
        };
      },
    };
  }
  function fetchTaxes() {
    const { pending, fulfilled, rejected } = extraActions.fetchTaxes;
    return {
      [pending]: (state) => {
        state.taxes = { loading: true, allTaxes: state.taxes.allTaxes || [], totalData: state.taxes.totalData };
        state.allTaxData = state.allTaxData || [];
      },
      [fulfilled]: (state, action) => {
        const { isIndex } = action.meta.arg;

        state.taxes = {
          allTaxes: action?.payload?.taxDTOs,
          loading: false,
          totalData: action.payload?.totalElements,
          toast: { message: 'User Added Successfully', variant: 'success' },
        };
        state.allTaxData = isIndex ? action?.payload?.taxDTOs : state.allTaxData;
      },
      [rejected]: (state, action) => {
        state.taxes = {
          error: action.error.message,
          allTaxes: state.taxes.allTaxes,
          totalData: state.taxes.totalData,
          loading: false,
          toast: { message: action?.error?.message || 'Failed to create User!', variant: 'error' },
        };
        state.allTaxData = state.allTaxData || [];
      },
    };
  }
  function deleteTax() {
    const { pending, fulfilled, rejected } = extraActions.deleteTax;
    return {
      [pending]: (state) => {
        state.taxes = { loading: true, allTaxes: state.taxes.allTaxes, totalData: state.taxes.totalData };
      },
      [fulfilled]: (state, action) => {
        const deletedId = action?.meta?.arg;

        state.taxes = {
          allTaxes:
            state.taxes.allTaxes.map((item) => (item.id === deletedId ? { ...item, valid: !item.valid } : item)) || [],
          loading: false,
          totalData: state.taxes.totalData,
          toast: { message: 'Tax Deleted Successfully', variant: 'success' },
        };
        fetchTaxes();
      },
      [rejected]: (state, action) => {
        state.taxes = {
          error: action.error.message,
          allTaxes: state?.taxes?.allTaxes,
          totalData: state.taxes.totalData,
          loading: false,
          toast: { message: action?.error?.message || 'Failed to create User!', variant: 'error' },
        };
      },
    };
  }
  function updateTax() {
    const { pending, fulfilled, rejected } = extraActions.updateTax;
    return {
      [pending]: (state) => {
        state.taxes = { loading: true, allTaxes: state.taxes.allTaxes || [], totalData: state.taxes.totalData };
      },
      [fulfilled]: (state, action) => {
        state.taxes = {
          allTaxes: state?.taxes?.allTaxes?.map((item) =>
            item?.id === action.payload?.taxDTO?.id ? action.payload?.taxDTO?.tax : item
          ),
          loading: false,
          totalData: state.taxes.totalData,
          toast: { message: 'User Updated Successfully', variant: 'success' },
        };
        fetchTaxes();
      },
      [rejected]: (state, action) => {
        state.taxes = {
          error: action.error.message,
          allTaxes: state?.taxes?.allTaxes,
          totalData: state.taxes.totalData,
          loading: false,
          toast: { message: action?.error?.message || 'Failed to create User!', variant: 'error' },
        };
      },
    };
  }
}

// Reducer

// Actions
