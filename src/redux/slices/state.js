import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
// import { HOST_API } from '../../config';
const HOST_API = 'https://zfwppq9jk2.execute-api.us-east-1.amazonaws.com/stg';

const name = 'state';
const initialState = createInitialState();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({
  name,
  initialState,
  extraReducers,
});

const customAxios = axios.create();

// Add a request interceptor
customAxios.interceptors.request.use((config) => {

  if (config.method === 'options') {
    delete config.headers.Authorization;
  }
  return config;
});

export const StateActions = { ...slice.actions, ...extraActions };

export default slice.reducer;

function createInitialState() {
  return {
    state: { allState: [], iserror: false, toast: {}, loading: false, totalData: 0 },
    allStateData: [],
  };
}

function createExtraActions() {
  return {
    fetchState: fetchState(),
    searchDevices: searchDevices(),
    fetchDeviceById: fetchDeviceById(),
    createstate: createstate(),
    deletestate: deletestate(),
    updatestate: updatestate(),
  };
}

function fetchState() {
  return createAsyncThunk(`${name}/fetchState`, async (data) => {
   
    try {
      const response = await axios.get(
        HOST_API.concat(
          `/state?page=${data.page}&limit=${data.limit}&search=${data.name || ""}&countryID=${data.countryId?data.countryId:""}`
        ),
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('custom-auth-token')}`,
          },
        }
      );
     
      const res = response.data;
      if(!res.error||res.data.data){
        const newres={
          states: res.data.data,
        message: res.data.message,
        totalElements: res.data.data.length
        }
        return newres;

      }
      return {};
      
    } catch (err) {
      return err;
    }
  });
}
function searchDevices() {
  return createAsyncThunk(`${name}/searchDevices`, async (name) => {
    try {
      const response = await axios.get(HOST_API.concat(`/device/search?device=${name}`), {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('custom-auth-token')}`,
        },
      });
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      throw err.response.data;
    }
  });
}
function fetchDeviceById() {
  return createAsyncThunk(`${name}/fetchDeviceById`, async (id) => {
    try {
      const response = await axios.get(HOST_API.concat(`/device/${id}`), {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      throw err.response.data;
    }
  });
}
// create api
function createstate() {
  return createAsyncThunk(`${name}/createstate`, async (data, thunkAPI) => {


    try {

      const newobj = {
        "stateName" : data.stateName,
        "countryID" : data.countryID,
        "countryName": "NA",
        "stateShortName" : data.stateShortName
      }

      const response = await axios.post(
        HOST_API.concat(
          `/state`
        ),
        newobj,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('custom-auth-token')}`,
          },
        }
      );
      return response;
    } catch (error) {
      return error;
    }
  });
}

// delete api
function deletestate() {
  return createAsyncThunk(`${name}/deletestate`, async (Id) => {
    try {
      const response = await axios.delete(HOST_API.concat(`/state/${Id}`), {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      return response;
    } catch (err) {
      return err;
    }
  });
}
function updatestate() {

  return createAsyncThunk(`${name}/updatestate`, async (data) => {
    try {



      const response = await axios.put(
        HOST_API.concat(
          `/state/${data.id}`
        ),
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('custom-auth-token')}`,
          },
        }
      );
      return response;
    } catch (error) {
      return error;
    }
  });
}

function createExtraReducers() {
  return {
    ...fetchState(),
    ...searchDevices(),
    ...fetchDeviceById(),
    ...createstate(),
    ...deletestate(),
    ...updatestate(),
  };

  function fetchState() {
    const { pending, fulfilled, rejected } = extraActions.fetchState;
    return {
      [pending]: (state) => {
        state.state = { loading: true, allState: state.state.allState, totalData: 0 };
        state.allStateData = state.allStateData || [];
      },
      [fulfilled]: (state, action) => {
        const { isIndex } = action.meta.arg;

        state.state = {
          totalData: action.payload.totalElements || 0,
          allState: action.payload.states || [],
          loading: false,
        };
        state.allStateData = isIndex ? action.payload.states : state.allStateData;
        state.allStateData = JSON.parse(JSON.stringify(state.allStateData));
        console.log(state.allStateData, "state");
      },
      [rejected]: (state, action) => {
        state.state = {
          error: action.error,
          totalData: state.state.totalData || 0,
          allState: state.state.allState || [],
          loading: false,
        };
        state.allStateData = state.allStateData || [];
      },
    };
  }
  function searchDevices() {
    const { pending, fulfilled, rejected } = extraActions.searchDevices;
    return {
      [pending]: (state) => {
        state.state = { loading: true, allState: [], totalData: state?.state?.totalData };
      },
      [fulfilled]: (state, action) => {
        state.state = {
          allState: action.payload.devices,
          totalData: action.payload.devices.length,
          loading: false,
        };
      },
      [rejected]: (state, action) => {
        state.state = {
          error: action.error,
          totalData: state?.state?.totalData,
          allState: [],
          loading: false,
        };
      },
    };
  }
  function fetchDeviceById() {
    const { pending, fulfilled, rejected } = extraActions.fetchDeviceById;
    return {
      [pending]: (state) => {
        state.device = {};
      },
      [fulfilled]: (state, action) => {
        state.device = action.payload.device;
      },
      [rejected]: (state, action) => {
        state.device = {};
      },
    };
  }
  function createstate() {
    const { pending, fulfilled, rejected } = extraActions.createstate;

    return {
      [pending]: (state, action) => {
        state.state = { allState: state.state.allState || [], iserror: false, totalData: state.state.totalData };
        console.log(state.state);
      },
      [fulfilled]: (state, action) => {
        console.log( action.payload?.data, "state");
        if( action.payload?.data?.data?.state){
          state.state = {
            allState: [...state?.state?.allState,  action.payload?.data?.data?.state],
            totalData: state.state.totalData + 1,
            iserror: false,
            toast: { message: 'state Added Successfully', variant: 'success' },
          };
          state.allStateData = [...state?.allStateData, action.payload?.data?.data?.state];
        }
    
     
      },
      [rejected]: (state, action) => {
        // console.log(action);
        state.state = {
          allState: state?.state?.allState || [],
          iserror: true,
          totalData: state.state.totalData || 0,
          toast: { message: action?.error?.message || 'Failed to create device!', variant: 'error' },
        };
      },
    };
  }
  function deletestate() {
    const { pending, fulfilled, rejected } = extraActions.deletestate;
    return {
      [pending]: (state, action) => {
        state.state = {
          loading: true,
          totalData: state.state.totalData || 0,
          allState: state?.state?.allState || [],
        };
      },
      [fulfilled]: (state, action) => {
        if(action?.payload?.data?.data?.data){
          state.state = {
            allState: state?.state?.allState.filter((state) => state.id !== action.payload?.data?.data?.data),
            totalData: state.state.totalData - 1,
            toast: { message: 'state Deleted Successfully', variant: 'success' },
          };
          state.allStateData = state.allStateData.filter((state) => state.id !== action.payload?.data?.data?.data);
        }
      
      
      },
      [rejected]: (state, action) => {
        state.state = {
          error: action.error,
          totalData: state.state.totalData || 0,
          allState: state?.state?.allState || [],
          toast: { message: action?.error?.message, variant: 'error' },
        };
      },
    };
  }

  function updatestate() {
    const { pending, fulfilled, rejected } = extraActions.updatestate;
    return {
      [pending]: (state, action) => {
        state.state = {
          loading: true,
          iserror: false,
          allState: state?.state?.allState,
          totalData: state?.state?.totalData || 0,
        };
      },
      [fulfilled]: (state, action) => {
        if(action.payload?.data?.data?.data){
          state.state = {
            allState: state?.state?.allState.map((state) =>
              state.id === action.payload?.data?.data?.data.id ? action.payload?.data?.data?.data : state
            ),
            totalData: state.state.totalData,
            iserror: false,
            toast: { message: 'state Updated Successfully', variant: 'success' },
          };
          state.allStateData = state.allStateData.map((state) =>
            state.id === action.payload?.data?.data?.data.id ? action.payload?.data?.data?.data : state
          );
        }
       
       
      },
      [rejected]: (state, action) => {
        state.state = {
          error: action.error,
          allState: state?.state?.allState || [],
          totalData: state?.state?.totalData || 0,
          iserror: true,
          loading: false,
          toast: { message: 'Failed to update Device', variant: 'error' },
        };
      },
    };
  }
}

// Reducer

// Actions
