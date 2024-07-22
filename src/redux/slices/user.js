import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
// import { HOST_API } from '../../config';

import { HOST_API } from '@/config';

// const initialState = [];

// const userEmailStoredInLocalStorage = JSON.parse(localStorage.getItem('user'))?.emailId;

const name = 'user';
const initialState = createInitialState();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({
  name,
  initialState,
  extraReducers,
});

export const UserActions = { ...slice.actions, ...extraActions };

export default slice.reducer;

function createInitialState() {
  return {
    users: { allUsers: [], error: '', toast: {}, totalData: 0, loading: true },
    currentUser: {}, // This is the data of currently logged in user.
  };
}

function createExtraActions() {
  return {
    createUser: createUser(),
    fetchUser: fetchUser(),
    deleteUser: deleteUser(),
    updateUser: updateUser(),
  };
}

// create api
function createUser() {
  return createAsyncThunk(`${name}/createUser`, async (obj) => {
    try {
      const response = await axios.post(HOST_API.concat(`/user`), obj, {
        headers: { Authorization: `Bearer ${localStorage.getItem('custom-auth-token')}` },
      });
      return response;
    } catch (err) {
      return err;
    }
  });
}
function fetchUser() {

  return createAsyncThunk(`${name}/fetchUser`, async (data) => {
    console.log("fetchUser called",data);
    try {
      const response = await axios.get(
        HOST_API.concat(
          `/user?page=${data.page}&limit=${data.limit}&search=${data.name}&userTypeID=${data.userTypeID}`
        ),
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('custom-auth-token')}` },
        }
      );
      return response.data;
    } catch (err) {
      return err;
    }
  });
}

function deleteUser() {
  return createAsyncThunk(`${name}/deleteUser`, async (id) => {
    try {
      const response = await axios.delete(HOST_API.concat(`/user/delete/${id}`), {
        headers: { Authorization: `Bearer ${localStorage.getItem('custom-auth-token')}` 
      },
      });
      return response.data;
    } catch (err) {
      return err;
    }
  });
}
function updateUser() {
  return createAsyncThunk(`${name}/updateUser`, async (data) => {
    try {
      const response = await axios.put(HOST_API.concat(`/user/${data.id}`), data, {
        headers: { Authorization: `Bearer ${localStorage.getItem('custom-auth-token')}` },
      });
      return response;
    } catch (err) {
      return err;
    }
  });
}

function createExtraReducers() {
  return {
    ...createUser(),
    ...fetchUser(),
    ...deleteUser(),
    ...updateUser(),
  };

  function createUser() {
    const { pending, fulfilled, rejected } = extraActions.createUser;
    return {
      [pending]: (state) => {
        state.users = { loading: true, allUsers: state.users.allUsers || [], totalData: state.users.totalData };
      },
      [fulfilled]: (state, action) => {
        state.users.loading = false;
        if (action?.payload?.data?.data?.data) {
          state.users = {
            allUsers: [...state.users.allUsers, action?.payload?.data?.data?.data ],
            totalData: state.users.totalData + 1,
            toast: { message: 'User Added Successfully', variant: 'success' },
          };

        }
       
      },
      [rejected]: (state, action) => {
        state.users = {
          error: action.error.message,
          loading: false,
          totalData: state.users.totalData,
          allUsers: [],
          toast: { message: action?.error?.message || 'Failed to create User!', variant: 'error' },
        };
      },
    };
  }
  function fetchUser() {
    const { pending, fulfilled, rejected } = extraActions.fetchUser;

    return {
      [pending]: (state) => {
        state.users = { loading: true, allUsers: [], totalData: state.users.totalData };
      },
      [fulfilled]: (state, action) => {
        state.users = {
          loading: false,
          allUsers: action?.payload?.data?.data || [],
          totalData: action.payload.totalElements,
          toast: { message: 'User Added Successfully', variant: 'success' },
        };
       
        // const userEmailStoredInLocalStorage = JSON.parse(localStorage.getItem('user'))?.emailId;
        // const currUser = action?.payload?.users?.find((user) => user?.emailId === userEmailStoredInLocalStorage);
        // if (currUser) {
        //   state.currentUser = currUser;
        // }
      },
      [rejected]: (state, action) => {
        state.users = {
          loading: false,
          error: action.error.message,
          allUsers: [],
          totalData: state.users.totalData,
          toast: { message: action?.error?.message || 'Failed to create User!', variant: 'error' },
        };
      },
    };
  }
  function deleteUser() {
    const { pending, fulfilled, rejected } = extraActions.deleteUser;
    return {
      [pending]: (state) => {
        state.users = { loading: true, allUsers: state.users.allUsers || [], totalData: state.users.totalData };
      },
      [fulfilled]: (state, action) => {
        const deletedId = action?.meta?.arg;
        state.users = {
          allUsers:
            state?.users?.allUsers?.map((item) =>
              item.id === deletedId ? { ...item, active: !item?.active } : item
            ) || [],
          totalData: state.users.totalData,
          loading: false,
          toast: { message: 'User Added Successfully', variant: 'success' },
        };
      },
      [rejected]: (state, action) => {
        state.users = {
          error: action.error.message,
          allUsers: state?.users?.allUsers,
          totalData: state.users.totalData,
          loading: false,
          toast: { message: action?.error?.message || 'Failed to create User!', variant: 'error' },
        };
      },
    };
  }
  function updateUser() {
    const { pending, fulfilled, rejected } = extraActions.updateUser;

    return {
      [pending]: (state, action) => {
        console.log({ action });
        state.users = { loading: true, allUsers: state.users.allUsers, totalData: state.users.totalData };
      },
      [fulfilled]: (state, action) => {

        state.users.loading = false;
        if(action?.payload?.data?.data?.data){
          state.users = {
            allUsers: state?.users?.allUsers?.map((item) =>
              item.id === action?.payload?.data?.data?.data.id ? action?.payload?.data?.data?.data : item
            ),
            totalData: state.users.totalData || 0,
            toast: { message: 'User Updated Successfully', variant: 'success' },
          };

        }
        
        // TODO: Confirm whether we're allowing multiple ids with same emailID or not
        // const userEmailStoredInLocalStorage = JSON.parse(localStorage.getItem('user'))?.emailId;
        // if (action.payload?.data?.user?.emailId === userEmailStoredInLocalStorage) {
        //   state.currentUser = action.payload?.data?.user;
        // }
      },
      [rejected]: (state, action) => {
        state.users = {
          error: action.error.message,
          allUsers: state?.users?.allUsers,
          loading: false,
          totalData: state.users.totalData,
          toast: { message: action?.error?.message || 'Failed to create User!', variant: 'error' },
        };
      },
    };
  }
}

// Reducer

// Actions