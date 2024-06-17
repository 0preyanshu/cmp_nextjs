import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


// const initialState = [];
const HOST_API = "https://zfwppq9jk2.execute-api.us-east-1.amazonaws.com/stg";

const name = 'Instructor';
const initialState = createInitialState();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({
  name,
  initialState,
  extraReducers,
});

export const CouponActions = { ...slice.actions, ...extraActions };

export default slice.reducer;

function createInitialState() {
  return {
    coupons: {
      allCoupons: [],
      error: '',
      toast: {},
      totalData: 0,
    },
  };
}

function createExtraActions() {
  return {
    creataCoupons: creataCoupons(),
    fetchCoupons: fetchCoupons(),
    deletecoupons: deletecoupons(),
    updateCoupons: updateCoupons(),
  };
}

// create api
function creataCoupons() {
  return createAsyncThunk(`${name}/creataCoupons`, async (obj) => {
    try {
      const response = await axios.post(HOST_API.concat('/coupon'), obj, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      return response;
    } catch (err) {
      return err;
    }
  });
}
function fetchCoupons() {
  return createAsyncThunk(`${name}/fetchCoupons`, async (data) => {
    try {
      const response = await axios.get(
        HOST_API.concat(`/coupon?page=${data.page}&limit=${data.limit}&search=${data.name}`),
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        }
      );
      return response.data;
    } catch (err) {
      return err;
    }
  });
}

function deletecoupons() {
  return createAsyncThunk(`${name}/deletecoupons`, async (id) => {
    try {
      const response = await axios.delete(HOST_API.concat(`/coupon/${id}`), {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      return response.data;
    } catch (err) {
      return err;
    }
  });
}
function updateCoupons() {
  return createAsyncThunk(`${name}/updateCoupons`, async (data) => {
    try {
      const response = await axios.put(HOST_API.concat(`/coupon/${data.id}`), data, {
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
    ...creataCoupons(),
    ...fetchCoupons(),
    ...deletecoupons(),
    ...updateCoupons(),
  };

  function creataCoupons() {
    const { pending, fulfilled, rejected } = extraActions.creataCoupons;
    return {
      [pending]: (state) => {
        state.coupons = {
          allCoupons: state.coupons.allCoupons || [],
          totalData: state.coupons.totalData,
        };
      },
      [fulfilled]: (state, action) => {
        if(action.payload?.data?.data?.coupon){
          state.coupons = {
            allCoupons: [...state.coupons.allCoupons, action.payload?.data?.data?.coupon],
            totalData: state.coupons.totalData + 1,
            toast: { message: 'coupons Added Successfully', variant: 'success' },
          };
        }
      },
      [rejected]: (state, action) => {
        state.coupons = {
          error: action.error.message,
          loading: false,
          allCoupons: [],
          totalData: state.coupons.totalData,
          toast: { message: action?.error?.message || 'Failed to create coupons!', variant: 'error' },
        };
      },
    };
  }
  function fetchCoupons() {
    const { pending, fulfilled, rejected } = extraActions.fetchCoupons;
    return {
      [pending]: (state) => {
        state.coupons = {
          loading: true,
          allCoupons: state.coupons.allCoupons || [],
          totalData: state.coupons.totalData,
        };
      },
      [fulfilled]: (state, action) => {
        state.coupons = {
          allCoupons: action?.payload?.data?.data || [],
          loading: false,
          totalData: action?.payload?.totalElements,
          toast: { message: 'coupons Added Successfully', variant: 'success' },
        };
      },
      [rejected]: (state, action) => {
        state.coupons = {
          error: action.error.message,
          allCoupons: state?.coupons?.allCoupons || [],
          totalData: state.coupons.totalData,
          loading: false,
          toast: { message: action?.error?.message || 'Failed to create coupons!', variant: 'error' },
        };
      },
    };
  }
  function deletecoupons() {
    const { pending, fulfilled, rejected } = extraActions.deletecoupons;
    return {
      [pending]: (state) => {
        state.coupons = {
          loading: true,
          allCoupons: state.coupons.allCoupons || [],
          totalData: state.coupons.totalData,
        };
      },
      [fulfilled]: (state, action) => {
        const deletedId = action?.meta?.arg;
        state.coupons = {
          allCoupons:
            state?.coupons?.allCoupons?.map((item) =>
              item.id === deletedId ? { ...item, active: !item?.active } : item
            ) || [],
          loading: false,
          totalData: state.coupons.totalData - 1,
          toast: { message: 'coupons Added Successfully', variant: 'success' },
        };
      },
      [rejected]: (state, action) => {
        state.coupons = {
          error: action.error.message,
          allCoupons: state?.coupons?.allCoupons,
          loading: false,
          totalData: state.coupons.totalData,
          toast: { message: action?.error?.message || 'Failed to create coupons!', variant: 'error' },
        };
      },
    };
  }
  function updateCoupons() {
    const { pending, fulfilled, rejected } = extraActions.updateCoupons;
    return {
      [pending]: (state) => {
        state.coupons = { loading: true, allCoupons: state.coupons.allCoupons || [] };
      },
      [fulfilled]: (state, action) => {
        state.coupons.loading = false;
        if(action.payload?.data?.data?.data){
          state.coupons = {
            allCoupons: state?.coupons?.allCoupons?.map((item) =>
              item.id === action.payload?.data?.data?.data?.id ? action.payload?.data?.data?.data : item
            ),
           
            totalData: state.coupons.totalData,
            toast: { message: 'coupons Updated Successfully', variant: 'success' },
          };

        }
        
      },
      [rejected]: (state, action) => {
        state.coupons = {
          error: action.error.message,
          totalData: state.coupons.totalData,
          allCoupons: state?.coupons?.allCoupons,
          loading: false,
          toast: { message: action?.error?.message || 'Failed to create coupons!', variant: 'error' },
        };
      },
    };
  }
}

// Reducer

// Actions
