import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { HOST_API } from '../../config';
import axios from 'axios';

const name = 'email_logs';
const initialState = {
  isLoading: false,
  toast: '',
  emailLogs: [],
  totalElements: 0,
};

// For Actions
function getEmailLogsData() {
  return createAsyncThunk(`${name}/fetchData`, async (data) => {
    let status;
    try {
      switch (data?.filterStatus) {
        case 'All':
          status = '';
          break;
        case 'Past':
          status = 'COMPLETED';
          break;
        case 'Upcoming':
          status = 'UPCOMING';
          break;
        default:
          status = '';
          break;
      }
      const response = await axios.get(
        HOST_API.concat(
          `/email-logs?page=${data?.page}&limit=${data?.limit}&startDate=${
            data?.startDate || ""
          }&endDate=${data?.endDate || ''}&search=${data?.name || ''}&eventID=${data.eventID || ''}&status=${status}`
        ),
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('custom-auth-token')}` },
        }
      );
      // const response = await axios.get(HOST_API.concat(`/emailLogs/get?eventName=prtk_test_2&page=0&limit=2`), {
      //   headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      // });
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  });
}

const createExtraActions = () => ({
  getEmailLogsData: getEmailLogsData(),
});

const extraActions = createExtraActions();

const createExtraReducers = () => {
  function getEmailLogsDataReducer() {
    const { fulfilled, pending, rejected } = extraActions.getEmailLogsData;
    return {
      [pending]: (state) => {
        state.isLoading = true;
        state.emailLogs = [];
        state.totalElements = 0;
      },
      [fulfilled]: (state, actions) => {
        console.log(actions);
        state.emailLogs = actions?.payload?.data?.data || [];
        state.totalElements = actions?.payload?.totalElements || 0;
        state.isLoading = false;
        state.toast = 'Email Logs fetched successfully!';
      },
      [rejected]: (state, actions) => {
        // console.log(actions);
        state.emailLogs = [];
        state.isLoading = false;
        state.toast = actions?.payload?.message || 'Failed to fetch Email Logs!';
      },
    };
  }

  return {
    ...getEmailLogsDataReducer(),
  };
};

const extraReducers = createExtraReducers();

const slice = createSlice({
  name,
  initialState,
  extraReducers,
});

export const EmailLogsActions = { ...extraActions, ...slice.actions };
export default slice.reducer;
