import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { HOST_API } from '../../config';

const name = 'privilage';
const initialState = createInitialState();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({
  name,
  initialState,
  extraReducers,
});

export const privelageActions = { ...slice.actions, ...extraActions };

export default slice.reducer;

function createInitialState() {
  return {
    privilage: { allPrivilage: [], iserror: false, toast: {}, loading: true, totalData: 0 },
  };
}

function createExtraActions() {
  return {
    fetchPrivilages: fetchPrivilages(),
  };
}

function fetchPrivilages() {
  return createAsyncThunk(`${name}/fetchPrivilages`, async (data) => {
    try {
      const response = await axios.get(HOST_API.concat(`/privilege/privileges/`), {
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
    ...fetchPrivilages(),
  };

  function fetchPrivilages() {
    const { pending, fulfilled, rejected } = extraActions.fetchPrivilages;
    return {
      [pending]: (state) => {
        state.privilage = { loading: true, allPrivilage: [] };
      },
      [fulfilled]: (state, action) => {
        // console.log(action);
        state.privilage = {
          allPrivilage: action.payload || [],
          loading: false,
        };
      },
      [rejected]: (state, action) => {
        state.privilage = {
          error: action.error,

          allPrivilage: state.privilage.allPrivilage || [],
          loading: false,
        };
      },
    };
  }
}

// Reducer

// Actions
