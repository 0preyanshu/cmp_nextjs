import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// import { HOST_API } from '../../config';

import { HOST_API } from '@/config';

// const initialState = [];

const name = 'Companies';
const initialState = createInitialState();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({
  name,
  initialState,
  extraReducers,
});


const customAxios = axios.create();
customAxios.interceptors.request.use((config) => {
  // Remove Authorization header for preflight (OPTIONS) requests
  if (config.method === 'options') {
    delete config.headers.Authorization;
   
  }
  return config;
});


export const CompanyActions = { ...slice.actions, ...extraActions };

export default slice.reducer;

function createInitialState() {
  return {
    companies: {
      allCompanies: {},
      error: '',
      toast: {},
      totalData: 0,
    },
    allCompaniesData: [],
  };
}

function createExtraActions() {
  return {
    createCompanies: createCompanies(),
    fetchCompanies: fetchCompanies(),
    deletecompanies: deletecompanies(),
    updatecompanies: updatecompanies(),
  };
}

// create api
function createCompanies() {
  return createAsyncThunk(`${name}/createCompanies`, async (obj) => {
    try {
      const response = await axios.post(HOST_API.concat(`/companies/create`), obj, {
        headers: { Authorization: `Bearer ${localStorage.getItem('custom-auth-token')}` },
    });
      return response;
    } catch (err) {
      return err.response.data;
    }
  });
}
function fetchCompanies() {
  return createAsyncThunk(`${name}/fetchCompanies`, async (data) => {
    try {
      const response = await axios.get(`${HOST_API}/company/SKILLBOOK`,{
        headers: { Authorization: `Bearer ${localStorage.getItem('custom-auth-token')}` },
    });

    //   {
        
    //     "logoUrl": "LOGO",
    //     "companyName": "skillbookacademy",
    //     "companyEmail": "fa@emai.l",
    //     "companyPhoneNumber": "012345678",
    //     "companyAddress": "C",
    //     "companyUrl": ""
    // }

    const res = response.data;
    // if(!res.error || res.data.data){
    //   const newres={
        
    //     "logoUrl": res.data.data.companyLogo,
    //     "companyName": res.data.data.companyName,
    //     "companyEmail": res.data.data.companyEmail,
    //     "companyPhoneNumber": res.data.data.companyPhone,
    //     "companyAddress": res.data.data.companyAddress,
    //     "companyUrl": res.data.data.companyUrl
    // }
    //   return newres;
    // }
    //   return {};
    return res?.data?.data;
    } catch (err) {
      return err;
    }
  });
}

function deletecompanies() {
  return createAsyncThunk(`${name}/deletecompanies`, async (id) => {
    try {
      const response = await axios.delete(HOST_API.concat(`/companies/delete/${id}`), {
        headers: { Authorization: `Bearer ${localStorage.getItem('custom-auth-token')}` },
    });
      return response.data;
    } catch (err) {
      return err;
    }
  });
}
function updatecompanies() {
  return createAsyncThunk(`${name}/updatecompanies`, async (data) => {

//         avatar
// : 
// ""
// companyadd
// : 
// "123 Updated St, Updated City, Country"
// companyemail
// : 
// "updated@example.com"
// companyname
// : 
// "Update2345"
// companyphone
// : 
// "456"
// companywebsite
// : 
// "https:/"



    try {
      const response = await axios.put(`${HOST_API}/company/SKILLBOOK`,data,{
        headers: { Authorization: `Bearer ${localStorage.getItem('custom-auth-token')}` },
    });

      return response;
   
    } catch (err) {
      return err.response.data;
    }
  });
}

function createExtraReducers() {
  return {
    ...createCompanies(),
    ...fetchCompanies(),
    ...deletecompanies(),
    ...updatecompanies(),
  };

  function createCompanies() {
    const { pending, fulfilled, rejected } = extraActions.createCompanies;
    return {
      [pending]: (state) => {
        state.companies = {
          loading: true,
          allCompanies: state.companies.allCompanies || [],
          totalData: state.companies.totalData,
        };
      },
      [fulfilled]: (state, action) => {
        state.companies = {
          allCompanies: [...state.companies.allCompanies, action.payload.data.companies],
          loading: false,
          totalData: state.companies.totalData + 1,
          toast: { message: 'companies Added Successfully', variant: 'success' },
        };
      },
      [rejected]: (state, action) => {
        state.companies = {
          error: action.error.message,
          loading: false,
          allCompanies: [],
          totalData: state.companies.totalData,
          toast: { message: action?.error?.message || 'Failed to create companies!', variant: 'error' },
        };
      },
    };
  }
  function fetchCompanies() {
    const { pending, fulfilled, rejected } = extraActions.fetchCompanies;
    return {
      [pending]: (state) => {
        state.companies = { loading: true, allCompanies: state.companies.allCompanies || [] };
      },
      [fulfilled]: (state, action) => {
        console.log(action.payload,"action.payload");
        state.companies = {
          allCompanies: action?.payload,
          loading: false,
          toast: { message: 'companies Added Successfully', variant: 'success' },
        };
      },
      [rejected]: (state, action) => {
        state.companies = {
          error: action.error.message,
          allCompanies: state?.companies?.allCompanies || [],
          totalData: state.companies.totalData,
          loading: false,
          toast: { message: action?.error?.message || 'Failed to create companies!', variant: 'error' },
        };
      },
    };
  }
  function deletecompanies() {
    const { pending, fulfilled, rejected } = extraActions.deletecompanies;
    return {
      [pending]: (state) => {
        state.companies = {
          loading: true,
          allCompanies: state.companies.allCompanies || [],
          totalData: state.companies.totalData,
        };
      },
      [fulfilled]: (state, action) => {
        const deletedId = action?.meta?.arg;
        state.companies = {
          allCompanies: state?.companies?.allCompanies?.filter((companies) => companies.id !== deletedId),
          loading: false,
          totalData: state.companies.totalData - 1,
          toast: { message: 'companies Added Successfully', variant: 'success' },
        };
      },
      [rejected]: (state, action) => {
        state.companies = {
          error: action.error.message,
          allCompanies: state?.companies?.allCompanies,
          loading: false,
          totalData: state.companies.totalData,
          toast: { message: action?.error?.message || 'Failed to create companies!', variant: 'error' },
        };
      },
    };
  }
  function updatecompanies() {
    const { pending, fulfilled, rejected } = extraActions.updatecompanies;
    return {
      [pending]: (state) => {
        state.companies = { loading: true, allCompanies: state.companies.allCompanies || [] };
      },
      [fulfilled]: (state, action) => {
        console.log(action.payload,"action.payload");
        // state.companies = {
        //   allCompanies: action.payload?.data?.data?.data || [],
        //   loading: false,
        //   totalData: state.companies.totalData,
        //   toast: { message: 'companies Updated Successfully', variant: 'success' },
        // };
      },
      [rejected]: (state, action) => {
        state.companies = {
          error: action.error.message,
          totalData: state.companies.totalData,
          allCompanies: state?.companies?.allCompanies,
          loading: false,
          toast: { message: action?.error?.message || 'Failed to create companies!', variant: 'error' },
        };
      },
    };
  }
}

// Reducer

// Actions
