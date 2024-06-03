import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { HOST_API } from '../../config';
import axios from 'axios';
import { dispatch } from '../store';

const name = 'Attendance';
const initialState = {
  isLoading: false,
  toast: '',
  attendanceData: [],
  eventData: {},
  totalElements: 0,
  savedAttendance: [], // saving attendance for checked or uncheked
};

// For Actions
function getAttendanceData() {
  return createAsyncThunk(`${name}/fetch`, async (data) => {
    try {
      const response = await axios.get(
        HOST_API.concat(
          `/attendance/get/${data.eventId}`
        ),
      );
      return response;
    } catch (error) {
      return error.response.data;
    }
  });
}

// For Actions
function saveAttendanceData() {
  return createAsyncThunk(`${name}/fetch`, async (data) => {
    try {
      const response = await axios.get(
        HOST_API.concat(
          `/attendance/save/${data.eventId}`
        ),
        data.savedAttendance,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        }
      );
      const eventId = data.eventId
      return {response, eventId};
    } catch (error) {
      return error.response.data;
    }
  });
}

const createExtraActions = () => ({
    getAttendanceData: getAttendanceData(),
    saveAttendanceData: saveAttendanceData(),
});

const extraActions = createExtraActions();

const createExtraReducers = () => {
  function getAttendanceDataReducer() {
    const { fulfilled, pending, rejected } = extraActions.getAttendanceData;
    return {
      [pending]: (state) => {
        state.isLoading = true;
        state.attendanceData = [];
        state.eventData = {};
        state.totalElements = 0;
      },
      [fulfilled]: (state, actions) => {
        state.isLoading = false;
        state.attendanceData = actions?.payload?.data?.attendees;
        state.eventData = actions?.payload?.data?.eventResponse?.eventDTO;
        state.totalElements = actions?.payload?.data?.totalElements;
        state.toast = 'Attendance fetched successfully!';
      },
      [rejected]: (state, actions) => {
        state.isLoading = false;
        state.attendanceData = [];
        state.eventData = {};
        state.toast = 'Failed Attendance Events!';
      },
    };
  }

    // function saveAttendanceDataReducer() {
    //   const { fulfilled, pending, rejected } = extraActions.saveAttendanceData;
    //   return {
    //     [pending]: (state) => {
    //       // state.isLoading = true;
    //       // state.attendanceData = [];
    //       // state.totalElements = 0;
    //     },
    //     [fulfilled]: (state, actions) => {
    //       // state.isLoading = false;
    //       // // state.attendanceData = actions?.payload?.data?.attendees;
    //       // // state.totalElements = actions?.payload?.data?.totalElements;
    //       // state.toast = 'Attendance fetched successfully!';
    //       // const { eventId } = actions?.payload;
    //       // const data = {eventId}
    //       // dispatch(getAttendanceData(data));
    //     },
    //     [rejected]: (state, actions) => {
    //       // state.isLoading = false;
    //       // // console.log(actions);
    //       // state.attendanceData = [];
    //       // state.toast = 'Failed Attendance Events!';
    //     },
    //   };
    // }

  return {
    ...getAttendanceDataReducer(),
    // ...deleteEventDataReducer(),
    // ...saveAttendanceDataReducer()
  };
};

const extraReducers = createExtraReducers();

const slice = createSlice({
  name,
  initialState,
  extraReducers,
});

export const AttendanceEventActions = { ...extraActions, ...slice.actions };
export default slice.reducer;
