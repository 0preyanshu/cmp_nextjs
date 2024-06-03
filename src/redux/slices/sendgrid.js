import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import { HOST_API } from '../../config';
import axios from 'axios';

const HOST_API = 'https://zfwppq9jk2.execute-api.us-east-1.amazonaws.com/stg';

const name = 'sendgrid';

const createInitialState = () => ({
  isLoading: false,
  error: null,
  sendgridData: { apiKey: '', enabled: false },
});

function getSendgridDetails() {
  return createAsyncThunk(`${name}/getSendgridDetails`, async () => {
    try {
      const response = await axios.get(HOST_API.concat(`/credentials/01HYQ0CX106EM3YGJCVHGDEZ29`), {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      return response?.data;
    } catch (error) {
      return error.response.data;
    }
  });
}

function updateSendGridDetails() {
  return createAsyncThunk(`${name}/updateSendgridData`, async (updatedSendgridData) => {
    try {
      const newobj ={
        "variables" : updatedSendgridData
    }
      const response = await axios.put(HOST_API.concat('/credentials/01HYQ0CX106EM3YGJCVHGDEZ29'), newobj, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      return response;
    } catch (err) {
      return err.response.data;
    }
  });
}

function createExtraActions() {
  return {
    getSendgridDetails: getSendgridDetails(),
    updateSendGridDetails: updateSendGridDetails(),
  };
}

const extraActions = createExtraActions();

function createExtraReducers() {
  function getSendgridDataReducer() {
    const { fulfilled, pending, rejected } = extraActions.getSendgridDetails;
    return {
      [pending]: (state) => {
        state.isLoading = true;
      },
      [fulfilled]: (state, action) => {
        console.log(action);
        state.sendgridData = action?.payload?.data?.credentials?.variables;
        state.isLoading = false;
      },
      [rejected]: (state, action) => {
        state.isLoading = false;
        state.error = action?.error?.message;
      },
    };
  }
  function updateSendgridDataReducer() {
    const { fulfilled, pending, rejected } = extraActions.updateSendGridDetails;
    return {
      [pending]: (state) => {
        state.isLoading = true;
      },
      [fulfilled]: (state, action) => {
        state.isLoading = false;
        // state.sendgridData = action?.payload?.data || state.sendgridData;
        getSendgridDetails();
      },
      [rejected]: (state, action) => {
        state.isLoading = false;
        state.error = action?.error?.message;
      },
    };
  }
  return {
    ...getSendgridDataReducer(),
    ...updateSendgridDataReducer(),
  };
}

const extraReducers = createExtraReducers();
const initialState = createInitialState();

const slice = createSlice({
  name: 'sendgrid',
  initialState,
  extraReducers,
});

export const SendgridActions = { ...slice.actions, ...extraActions };
export default slice.reducer;
