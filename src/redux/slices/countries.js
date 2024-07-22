import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';
import axios from 'axios';
// import { HOST_API } from '../../config';
import { HOST_API } from '@/config';

const name = 'country';
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
  // Check if it's a preflight request (OPTIONS) and remove the Authorization header
  if (config.method === 'options') {
    delete config.headers.Authorization;
  }
  return config;
});

export const countryActions = { ...slice.actions, ...extraActions };

export default slice.reducer;

function createInitialState() {
  return {
    country: { allCountries: [], iserror: false, toast: {}, loading: false, totalData: 0 },
    allCountriesData: [],
  };
}

function createExtraActions() {
  return {
    fetchCountries: fetchCountries(),
    searchDevices: searchDevices(),
    fetchDeviceById: fetchDeviceById(),
    createCountry: createCountry(),
    deleteCountry: deleteCountry(),
    updateCountry: updateCountry(),
  };
}

function fetchCountries() {
  return createAsyncThunk(`${name}/fetchCountries`, async (data) => {
    try {
      const response = await axios.get(
        HOST_API.concat(
          `/country/?page=${data.page}&limit=${data.limit}&search=${data.name||""}&state_id=${data?.stateId || ""}`
        ),
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('custom-auth-token')}` },
      }
      );
      console.log(response.data);
      const res =response.data;
      if(!res.error || res.data.data){
        const newres = {
          countryDTOS: res.data.data,
          message : res.data.message,
          totalElements: res.data.data.length,
          totalPages: data.pages+1,
        
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
      const response = await axios.get(HOST_API.concat(`/device/search?device=${name}`),{
        headers: { Authorization: `Bearer ${localStorage.getItem('custom-auth-token')}` },
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
        headers: { Authorization: `Bearer ${localStorage.getItem('custom-auth-token')}` },
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
function createCountry() {
  return createAsyncThunk(`${name}/createCountry`, async (data, thunkAPI) => {
    try {
      // change the body
      console.log(data, 'data');  
      // {countryName: 'S', shortName: 'S'}
      const newobj={
        countryName: data.countryname,
        countryShortName: data.countryshortname
      }
      const response = await axios.post(
        HOST_API.concat(`/country`),
        newobj,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('custom-auth-token')}` },
      }
      );
      return response;
    } catch (error) {
      return error;
    }
  });
}

// delete api
function deleteCountry() {
  return createAsyncThunk(`${name}/deleteCountry`, async (Id) => {
    try {
      const response = await axios.delete(HOST_API.concat(`/country/${Id}`), {
        headers: { Authorization: `Bearer ${localStorage.getItem('custom-auth-token')}` },
    });
      return response;
    } catch (err) {
      return err;
    }
  });
}
function updateCountry() {
  return createAsyncThunk(`${name}/updateCountry`, async (data) => {

    try {
      const response = await axios.put(
        HOST_API.concat(
          `/country/${data.id}`
        ),
        data,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('custom-auth-token')}` },
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
    ...fetchCountries(),
    ...searchDevices(),
    ...fetchDeviceById(),
    ...createCountry(),
    ...deleteCountry(),
    ...updateCountry(),
  };

  function fetchCountries() {
    const { pending, fulfilled, rejected } = extraActions.fetchCountries;

    return {
      [pending]: (state) => {
        state.country = { loading: true, allCountries: state?.country?.allCountries, totalData: 0 };
      },
      [fulfilled]: (state, action) => {
       
        state.country = {
          totalData: action.payload.totalElements || 0,
          allCountries: action.payload.countryDTOS || [],
          loading: false,
        };
        state.allCountriesData =  action.payload.countryDTOS || [];
     
      },
      [rejected]: (state, action) => {
        state.country = {
          error: action.error,
          totalData: state.country.totalData || 0,
          allCountries: state.country.allCountries || [],
          loading: false,
        };
      },
    };
  }
  function searchDevices() {
    const { pending, fulfilled, rejected } = extraActions.searchDevices;
    return {
      [pending]: (state) => {
        state.country = { loading: true, allCountries: [], totalData: state?.country?.totalData };
      },
      [fulfilled]: (state, action) => {
        state.country = {
          allCountries: action.payload.devices,
          totalData: action.payload.devices.length,
          loading: false,
        };
      },
      [rejected]: (state, action) => {
        state.country = {
          error: action.error,
          totalData: state?.country?.totalData,
          allCountries: [],
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
  function createCountry() {
    const { pending, fulfilled, rejected } = extraActions.createCountry;

    return {
      [pending]: (state, action) => {
        state.country = {
          allCountries: state.country.allCountries || [],
          iserror: false,
          totalData: state.country.totalData,
        };
        console.log(state.country);
      },
      [fulfilled]: (state, action) => {
        console.log(action.payload?.data?.data, 'action.payload?.data?.data');
       if(action.payload?.data?.data?.country){
        state.country = {
          allCountries: [...state?.country?.allCountries, action.payload?.data?.data?.country],
          totalData: state.country.totalData + 1,
          iserror: false,
          toast: { message: 'Country Added Successfully', variant: 'success' },
        };
        state.allCountriesData = [...state?.allCountriesData, action.payload?.data?.data?.country];
      }
       
      },
      [rejected]: (state, action) => {
        state.country = {
          allCountries: state?.country?.allCountries || [],
          iserror: true,
          totalData: state.country.totalData || 0,
          toast: { message: action?.error?.message || 'Failed to create device!', variant: 'error' },
        };
      },
    };
  }
  function deleteCountry() {
    const { pending, fulfilled, rejected } = extraActions.deleteCountry;
    return {
      [pending]: (state, action) => {
        state.country = {
          loading: true,
          totalData: state?.country?.totalData || 0,
          allCountries: state?.country?.allCountries || [],
        };
      },
      [fulfilled]: (state, action) => {
        const deletedId = action?.meta?.arg;
        if(action.payload?.data?.data){
          state.country = {
            allCountries:
              state?.country?.allCountries?.map((item) =>
                item.id === deletedId ? { ...item, valid: !item.valid } : item
              ) || [],
            totalData: state?.country?.totalData || 0,
            toast: { message: 'Country deletion successful', variant: 'success' },
          };
          state.allCountriesData =
            state?.allCountriesData?.map((item) => (item.id === deletedId ? { ...item, valid: !item.valid } : item)) ||
            [];
        }

       
      },
      [rejected]: (state, action) => {
        state.country = {
          error: action.error,
          totalData: state?.country?.totalData || 0,
          allCountries: state?.country?.allCountries || [],
          toast: { message: action?.error?.message, variant: 'error' },
        };
      },
    };
  }

  function updateCountry() {
    const { pending, fulfilled, rejected } = extraActions.updateCountry;
    return {
      [pending]: (state, action) => {
        state.country = {
          loading: false,
          iserror: false,
          allCountries: state?.country?.allCountries,
          totalData: state?.country?.totalData || 0,
        };
      },
      [fulfilled]: (state, action) => {
        const updatedCountry = action.payload?.data?.data;
        
        if (updatedCountry) {
          const updatedCountries = state.country.allCountries.map((device) =>
            device.id === updatedCountry.data.id ? updatedCountry.data : device
          );
      
          state.country = {
            ...state.country,
            allCountries: updatedCountries,
            totalData: state?.country?.totalData || 0,
            iserror: false,
            loading: false,
            toast: { message: 'Device Updated successfully', variant: 'success' },
          };
      
     
          const filteredCountriesData = state?.allCountriesData?.filter((device) => device.id !== updatedCountry.id);
          state.allCountriesData = [...filteredCountriesData, updatedCountry];
        }
      },
      
      [rejected]: (state, action) => {
        state.country = {
          error: action.error,
          allCountries: state?.country?.allCountries || [],
          totalData: state?.country?.totalData || 0,
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
