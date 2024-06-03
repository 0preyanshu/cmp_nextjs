import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { HOST_API } from '../../config';
import axios from 'axios';

const name = 'Event_Registrations';
const initialState = {
  isLoading: false,
  toast: '',
  registrationData: [],
  totalElements: 0,
};

// For Actions
function getEventRegistrationData() {
  return createAsyncThunk(`${name}/fetch`, async (data) => {
    try {
      const response = await axios.get(
        HOST_API.concat(
          `/event/eventRegistration?page=${data?.page}&limit=${data?.limit}&courseId=${data?.courseId}&instructorId=${data?.instructorId}&countryId=${data?.countryId}&timeZoneName=${data?.timezone}&status=${data?.status}`
        ),
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        }
      );
      return response;
    } catch (error) {
      return error.response.data;
    }
  });
}

function deleteEventData() {
  return createAsyncThunk(`${name}/delete/eventRegistration`, async (data) => {
    try {
      const response = await axios.delete(HOST_API.concat(`/event/delete/${data.eventId}`), {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      return { eventId: data?.eventId, res: response.data };
    } catch (error) {
      return error.response.data;
    }
  });
}

const createExtraActions = () => ({
  getEventRegistrationData: getEventRegistrationData(),
  deleteEventData: deleteEventData(),
});

const extraActions = createExtraActions();

const createExtraReducers = () => {
  function getEventRegistrationDataReducer() {
    const { fulfilled, pending, rejected } = extraActions.getEventRegistrationData;
    return {
      [pending]: (state) => {
        state.isLoading = true;
        state.registrationData = [];
        state.totalElements = 0;
      },
      [fulfilled]: (state, actions) => {
        state.isLoading = false;
        // console.log(actions);
        state.registrationData = actions?.payload?.data?.eventRegistrationDTOS;
        state.totalElements = actions?.payload?.data?.totalElements;
        state.toast = 'Registration Events fetched successfully!';
      },
      [rejected]: (state, actions) => {
        state.isLoading = false;
        // console.log(actions);
        state.registrationData = [];
        state.toast = 'Failed Registration Events!';
      },
    };
  }

  function deleteEventDataReducer() {
    const { fulfilled, pending, rejected } = extraActions.deleteEventData;
    return {
      [pending]: (state) => {
        state.isLoading = true;
      },
      [fulfilled]: (state, actions) => {
        state.isLoading = false;
        console.log(actions);
        state.registrationData = state?.registrationData.filter(
          (event) => event?.eventId !== actions?.payload?.eventId
        );
        state.totalElements -= 1;
        state.toast = 'Event deleted successfully!';
      },
      [rejected]: (state, actions) => {
        state.isLoading = false;
        // console.log(actions);
        state.registrationData = [];
        state.toast = 'Failed to delete event!';
      },
    };
  }

  return {
    ...getEventRegistrationDataReducer(),
    ...deleteEventDataReducer(),
  };
};

const extraReducers = createExtraReducers();

const slice = createSlice({
  name,
  initialState,
  extraReducers,
});

export const RegistrationEventActions = { ...extraActions, ...slice.actions };
export default slice.reducer;
