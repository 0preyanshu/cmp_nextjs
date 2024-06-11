import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
// import { HOST_API } from '../../config';
const HOST_API = 'https://zfwppq9jk2.execute-api.us-east-1.amazonaws.com/stg';

// const initialState = [];

const name = 'timezone';
const initialState = createInitialState();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({
  name,
  initialState,
  extraReducers,
});

export const TimezoneAction = { ...slice.actions, ...extraActions };

export default slice.reducer;

function createInitialState() {
  return {
    timezones: { allTimezones: [], error: '', toast: {}, totalData: 0 },
    allTimezonesData: [],
  };
}

function createExtraActions() {
  return {
    createTimezones: createTimezones(),
    fetchTimezones: fetchTimezones(),
    deleteTimezones: deleteTimezones(),
    updateTimezones: updateTimezones(),
  };
}

// create api
function createTimezones() {
  return createAsyncThunk(`${name}/createTimezones`, async (data) => {
     console.log(data,"d")
    try {
      const newobj ={
        timezoneName:data.timezoneName,
        timezoneShortName:data.timezoneShortName,
        gmtOffset:data.gmtOffset,
      }
      const response = await axios.post(HOST_API.concat(`/timezone`), newobj, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
   
      return response.data;
    } catch (err) {
      return err;
    }
  });
}
function fetchTimezones() {
  return createAsyncThunk(`${name}/fetchTimezones`, async (data) => {
    try {
      const response = await axios.get(
        HOST_API.concat(`/timezone?page=${data.page}&limit=${data.limit}&search=${data.name || ""}`),
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        }
      );
      console.log(response.data);
      const res = response.data;
      if (!res.error || res.data.data) {
        const newres = {
            timeZoneDTOS:res.data.data,
            message: res.data.message,
            totalElements: res.data.data.length,
            totalPages: data.page + 1,}

      return newres;
    }
      return {};
    } catch (err) {
      return err;
    }
  });
}

function deleteTimezones() {
  return createAsyncThunk(`${name}/deleteTimezones`, async (id) => {

    try {
      const response = await axios.delete(HOST_API.concat(`/timezone/${id}`), {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      return response.data;
    } catch (err) {
      return err;
    }
  });
}
function updateTimezones() {
  return createAsyncThunk(`${name}/updateTimezones`, async (data) => {

  
      
    try {
      const response = await axios.put(HOST_API.concat(`/timezone/${data.id}/`), data, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      return response.data;
    } catch (err) {
      return err;
    }
  });
}

function createExtraReducers() {
  return {
    ...createTimezones(),
    ...fetchTimezones(),
    ...deleteTimezones(),
    ...updateTimezones(),
  };

  function createTimezones() {
    const { pending, fulfilled, rejected } = extraActions.createTimezones;
    return {
      [pending]: (state) => {
        state.timezones = {
       
          allTimezones: state.timezones.allTimezones || [],
          totalData: state.timezones.totalData,
        };
      },
      [fulfilled]: (state, action) => {
        if(action?.payload?.data?.timezone){
          state.timezones = {
            allTimezones: [...state.timezones.allTimezones, action?.payload?.data?.timezone],
            totalData: state.timezones.totalData + 1,
       
            toast: { message: 'Timezones Added Successfully', variant: 'success' },
          };
          state.allTimezonesData = [...state?.allTimezonesData, action?.payload?.data?.timezone]
        }
      
      },
      [rejected]: (state, action) => {
        state.timezones = {
          error: action.error.message,
          loading: false,
          totalData: state.timezones.totalData,
          allTimezones: state.timezones.allTimezones,
          toast: { message: action?.error?.message || 'Failed to create User!', variant: 'error' },
        };
      },
    };
  }
  function fetchTimezones() {
    const { pending, fulfilled, rejected } = extraActions.fetchTimezones;
    return {
      [pending]: (state) => {
        state.timezones = {
          loading: true,
          allTimezones: state.timezones.allTimezones || [],
          totalData: state.timezones.totalData,
        };
        state.allTimezonesData = state.allTimezonesData || [];
      },
      [fulfilled]: (state, action) => {
        const { isIndex } = action.meta.arg;

        state.timezones = {
          allTimezones: action?.payload?.timeZoneDTOS,
          loading: false,
          totalData: action.payload?.totalElements,
          toast: { message: 'User Added Successfully', variant: 'success' },
        };
        state.allTimezonesData = isIndex ? action?.payload?.timeZoneDTOS : state.allTimezonesData;
      },
      [rejected]: (state, action) => {
        state.timezones = {
          error: action.error.message,
          allTimezones: state.timezones.allTimezones,
          totalData: state.timezones.totalData,
          loading: false,
          toast: { message: action?.error?.message || 'Failed to create User!', variant: 'error' },
        };
        state.allTimezonesData = state.allTimezonesData || [];
      },
    };
  }
  function deleteTimezones() {
    const { pending, fulfilled, rejected } = extraActions.deleteTimezones;
    return {
      [pending]: (state) => {
        state.timezones = {
          loading: true,
          allTimezones: state.timezones.allTimezones,
          totalData: state.timezones.totalData,
        };
      },
      [fulfilled]: (state, action) => {
        const deletedId = action?.meta?.arg;
        state.timezones = {
          allTimezones:
            state.timezones.allTimezones.map((item) =>
              item.id === deletedId ? { ...item, valid: !item.valid } : item
            ) || [],
          loading: false,
          totalData: state.timezones.totalData,
          toast: { message: 'Timezones Deleted Successfully', variant: 'success' },
        }
        
      
        state.allTimezonesData =
          state?.allTimezonesData?.map((item) => (item.id === deletedId ? { ...item, valid: !item.valid } : item)) ||
          [];

      
      },
      [rejected]: (state, action) => {
        state.timezones = {
          error: action.error.message,
          allTimezones: state?.timezones?.allTimezones,
          totalData: state.timezones.totalData,
          loading: false,
          toast: { message: action?.error?.message || 'Failed to create User!', variant: 'error' },
        };
      },
    };
  }
  function updateTimezones() {
    const { pending, fulfilled, rejected } = extraActions.updateTimezones;
    return {
      [pending]: (state) => {
        state.timezones = {
           loading: true, 
          allTimezones: state.timezones.allTimezones || [],
          totalData: state.timezones.totalData,
        };
      },
      [fulfilled]: (state, action) => {
        console.log(action?.payload?.data?.data,"action");
        state.timezones.loading = false;
        if(action?.payload?.data?.data){
          state.timezones = {
            allTimezones: state.timezones.allTimezones.map((item) =>
              item.id === action?.payload?.data?.data?.id ? action?.payload?.data?.data : item
            ),
            totalData: state.timezones.totalData ,
          toast: { message: 'Timezones Updated Successfully', variant: 'success' },
          };
          state.allTimezonesData = state.allTimezonesData.map((item) =>
            item.id === action?.payload?.data?.data?.id ? action?.payload?.data?.data : item)

        }
      
      },
      [rejected]: (state, action) => {
        state.timezones = {
          error: action.error.message,
          allTimezones: state?.timezones?.allTimezones,
          totalData: state.timezones.totalData,
          loading: false,
          toast: { message: action?.error?.message || 'Failed to create User!', variant: 'error' },
        };
      },
    };
  }
}

// Reducer

// Actions
