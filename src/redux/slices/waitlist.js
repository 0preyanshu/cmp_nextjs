import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const HOST_API = "https://zfwppq9jk2.execute-api.us-east-1.amazonaws.com/stg";

const name = 'waitlist';
const initialState = {
  waitlist: {
    isLoading: false,
    toast: '',
    waitlistData: [],
    totalElements: 0,
  },
};

// For Actions
function getWaitlistData() {
  return createAsyncThunk(`${name}/fetchData`, async (data) => {
    try {
      const response = await axios.get(
        HOST_API.concat(
          `/waitlist?page=${data?.page}&limit=${data?.limit}&courseID=${data?.courseID || ''}&search=${data?.name || ''
          }&eventID=${data?.eventId || ''}&startDate=${data?.startDate || ''}`
        ),
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        }
      );
      return response.data;
    } catch (error) {
      return error;
    }
  });
}

const createExtraActions = () => ({
  getWaitlistData: getWaitlistData(),
});

const extraActions = createExtraActions();

const createExtraReducers = () => {
  function getWaitlistReducer() {
    const { fulfilled, pending, rejected } = extraActions.getWaitlistData;
    return {
      [pending]: (state) => {
        state.waitlist.isLoading = true;
        state.waitlist.totalElements = 0;
      },
      [fulfilled]: (state, actions) => {
        state.waitlist.waitlistData = actions?.payload?.data?.data || [];
        state.waitlist.totalElements = actions?.payload?.totalElements || 0;
        state.waitlist.isLoading = false;
        state.waitlist.toast = actions?.payload?.message || 'Waitlist fetched successfully!';
      },
      [rejected]: (state, actions) => {
        state.waitlist.isLoading = false;
        state.waitlist.toast = actions?.payload?.message || 'Failed to fetch waitlist!';
      },
    };
  }

  return {
    ...getWaitlistReducer(),
  };
};

const extraReducers = createExtraReducers();

const slice = createSlice({
  name,
  initialState,
  extraReducers,
});

export const WaitlistActions = { ...extraActions, ...slice.actions };
export default slice.reducer;
