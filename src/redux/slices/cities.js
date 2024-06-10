import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
// import { HOST_API } from '../../config';

const HOST_API = 'https://zfwppq9jk2.execute-api.us-east-1.amazonaws.com/stg';

const name = 'city';
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

export const cityActions = { ...slice.actions, ...extraActions };

export default slice.reducer;

function createInitialState() {
  return {
    city: { allCities: [], iserror: false, toast: {}, loading: false, totalData: 0 },
    allCitesData: [],
  };
}

function createExtraActions() {
  return {
    fetchCities: fetchCities(),
    searchcity: searchcity(),
    fetchDeviceById: fetchDeviceById(),
    createCity: createCity(),
    deleteCities: deleteCities(),
    updateCity: updateCity(),
  };
}

function fetchCities() {
  return createAsyncThunk(`${name}/fetchCities`, async (data) => {
    try {
      const response = await customAxios.get(
        HOST_API.concat(
          `/city?page=${data.page}&limit=${data.limit}&search=${data.name || ""}&stateID=${data.stateId|| ""}&countryID=${data.countryId|| ""}`
        )
      );
      console.log (response.data, 'response');
      const res = response.data;

      if(!res.error || res.data.data){
        const newres = {
          cityDTOS: res.data.data,
          message: res.data.message,
          totalElements: res.data.data.length,
          totalPages: data.page+1,
        }
        return newres;
      }
      return {};
    } catch (err) {
      return err;
    }
  });
}
function searchcity() {
  return createAsyncThunk(`${name}/searchcity`, async (name) => {
    try {
      const response = await axios.get(HOST_API.concat(`/device/search?device=${name}`), {
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
function createCity() {
  return createAsyncThunk(`${name}/createCity`, async (data, thunkAPI) => {
    try {

      const newobj={
      "cityName" : data.cityName,
      "cityShortName" : data.cityShortName,
      "stateID" : data.stateID,
      "countryID" : data.countryID
    }
      const response = await customAxios.post(HOST_API.concat(`/city`), newobj, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      return response;
    } catch (error) {
      console.log(error);
      return error;
    }
  });
}

// delete api
function deleteCities() {
  return createAsyncThunk(`${name}/deleteCities`, async (Id) => {
    try {
      const response = await customAxios.delete(HOST_API.concat(`/city/${Id}`), {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      return response;
    } catch (err) {
      return err;
    }
  });
}
function updateCity() {
  return createAsyncThunk(`${name}/updateCity`, async (data) => {
   
    try {
      const response = await customAxios.put(HOST_API.concat(`/city/${data?.id}`), data, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      return response;
    } catch (error) {
      return error;
    }
  });
}

function createExtraReducers() {
  return {
    ...fetchCities(),
    ...searchcity(),
    ...fetchDeviceById(),
    ...createCity(),
    ...deleteCities(),
    ...updateCity(),
  };

  function fetchCities() {
    const { pending, fulfilled, rejected } = extraActions.fetchCities;
    return {
      [pending]: (state) => {
        state.city = { loading: true, allCities: [], totalData: state.city.totalData };
        state.allCitesData = state.allCitesData || [];
      },
      [fulfilled]: (state, action) => {
        const { isIndex } = action.meta.arg;

        state.city = {
          allCities: action.payload.cityDTOS || [],
          totalData: action.payload.totalElements,
          loading: false,
        };
        state.allCitesData = isIndex ? action.payload.cityDTOS : state.allCitesData;
      },
      [rejected]: (state, action) => {
        state.city = {
          error: action.error,
          totalData: state.city.totalData,
          allCities: state.city.allCities || [],
          loading: false,
        };
        state.allCitesData = state.allCitesData || [];
      },
    };
  }
  function searchcity() {
    const { pending, fulfilled, rejected } = extraActions.searchcity;
    return {
      [pending]: (state) => {
        state.city = { loading: true, allCities: [], totalcity: state?.city?.totalcity };
      },
      [fulfilled]: (state, action) => {
        state.city = {
          allCities: action.payload.city,
          totalcity: action.payload.city.length,
          loading: false,
        };
      },
      [rejected]: (state, action) => {
        state.city = {
          error: action.error,
          totalcity: state?.city?.totalcity,
          allCities: [],
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
  function createCity() {
    const { pending, fulfilled, rejected } = extraActions.createCity;
    return {
      [pending]: (state) => {
        state.city = {
          loading: true,
          allCities: state.city.allCities || [],
          totalData: state.city.totalData,
          iserror: false,
        };
      },
      [fulfilled]: (state, action) => {
        // console.log(action);
     
      
      },
      [rejected]: (state, action) => {
        // console.log(action);
        state.city = {
          allCities: state.city.allCities || [],
          iserror: true,
          totalData: state.city.totalData,
          toast: { message: action?.error?.message || 'Failed to create device!', variant: 'error' },
        };
      },
    };
  }
  function deleteCities() {
    const { pending, fulfilled, rejected } = extraActions.deleteCities;
    return {
      [pending]: (state, action) => {
        state.city = {
          loading: true,
          totalData: state.city.totalData,
          allCities: state?.city?.allCities || [],
        };
      },
      [fulfilled]: (state, action) => {
     
      
      },
      [rejected]: (state, action) => {
        state.city = {
          error: action.error,
          totalData: state.city.totalData,
          allCities: state?.city?.allCities || [],
          toast: { message: action?.error?.message, variant: 'error' },
        };
      },
    };
  }

  function updateCity() {
    const { pending, fulfilled, rejected } = extraActions.updateCity;
    return {
      [pending]: (state, action) => {
        state.city = {
          loading: true,
          totalData: state.city.totalData,
          iserror: false,
          allCities: state?.city?.allCities || [],
        };
      },
      [fulfilled]: (state, action) => {
      
        
       
      },
      [rejected]: (state, action) => {
        state.city = {
          error: action.error,
          allCities: state?.city?.allCities || [],
          totalData: state.city.totalData,
          totalcity: state?.city?.totalcity || 0,
          iserror: true,
          toast: { message: 'Failed to update Device', variant: 'error' },
        };
      },
    };
  }
}


