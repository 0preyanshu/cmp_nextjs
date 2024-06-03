import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { HOST_API } from '../../config';

// const initialState = [];

const name = 'user-type';
const initialState = createInitialState();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({
  name,
  initialState,
  extraReducers,
});

export const UserTypeActions = { ...slice.actions, ...extraActions };

export default slice.reducer;

function createInitialState() {
  return {
    userType: {
      userTypes: [],
      error: '',
      toast: {},
      totalElements: 0,
      loading: true,
    },
    allUserTypeData: [],
  };
}

function createExtraActions() {
  return {
    createUserType: createUserType(),
    fetchUserType: fetchUserType(),
    updateUserType: updateUserType(),
  };
}

// create api
function createUserType() {
  return createAsyncThunk(`${name}/createUserType`, async (obj) => {
    try {
      const response = await axios.post(HOST_API.concat(`/userType/create`), obj, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      return response;
    } catch (err) {
      return err;
    }
  });
}
function fetchUserType() {
  return createAsyncThunk(`${name}/fetchUserType`, async (data) => {
    try {
      const response = await axios.get(HOST_API.concat(`/userType/get?page=${data.page}&limit=${data.limit}`), {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      return response.data;
    } catch (err) {
      return err;
    }
  });
}

// function deleteUser() {
//   return createAsyncThunk(`${name}/deleteUser`, async (id) => {
//     try {
//       const response = await axios.delete(HOST_API.concat(`/user/delete/${id}`), {
//         headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
//       });
//       return response.data;
//     } catch (err) {
//       return err;
//     }
//   });
// }
function updateUserType() {
  return createAsyncThunk(`${name}/updateUserType`, async (data) => {
    try {
      const response = await axios.put(HOST_API.concat(`/userType/update/${data.id}`), data, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      return response;
    } catch (err) {
      return err;
    }
  });
}

function createExtraReducers() {
  return {
    ...createUserType(),
    ...fetchUserType(),
    // ...deleteUser(),
    ...updateUserType(),
  };

  function createUserType() {
    const { pending, fulfilled, rejected } = extraActions.createUserType;
    return {
      [pending]: (state) => {
        state.userType = {
          loading: true,
          userTypes: state.userType.userTypes || [],
          totalElements: state.userType.totalElements,
        };
      },
      [fulfilled]: (state, action) => {
        console.log(action);
        state.userType = {
          userTypes: [...state.userType.userTypes, action?.payload?.data?.userType],
          loading: false,
          totalElements: state.userType.totalElements + 1,
          toast: { message: 'Usertype created Successfully', variant: 'success' },
        };
        state.allUserTypeData = [...state?.allUserTypeData, action.payload?.data?.userType];
      },
      [rejected]: (state, action) => {
        state.userType = {
          error: action.error.message,
          loading: false,
          totalElements: state.users.totalElements,
          userTypes: [],
          toast: { message: action?.error?.message || 'Failed to create User!', variant: 'error' },
        };
      },
    };
  }
  function fetchUserType() {
    const { pending, fulfilled, rejected } = extraActions.fetchUserType;
    return {
      [pending]: (state) => {
        state.userType = { loading: true, userTypes: [], totalElements: state.userType.totalElements };
      },
      [fulfilled]: (state, action) => {
        const { isIndex } = action.meta.arg;
        state.userType = {
          loading: false,
          userTypes: action?.payload?.userTypeDTOS,
          totalElements: action.payload.totalElements,
          toast: { message: 'UserTypes fetched Successfully', variant: 'success' },
        };
        state.allUserTypeData = isIndex ? action.payload.userTypeDTOS : state.allUserTypeData;
      },
      [rejected]: (state, action) => {
        state.userType = {
          loading: false,
          error: action.error.message,
          userTypes: [],
          totalElements: state.users.totalElements,
          toast: { message: action?.error?.message || 'Failed to fetch Usertypes!', variant: 'error' },
        };
      },
    };
  }
  //   function deleteUser() {
  //     const { pending, fulfilled, rejected } = extraActions.deleteUser;
  //     return {
  //       [pending]: (state) => {
  //         state.users = { loading: true, allUsers: state.users.allUsers || [], totalElements: state.users.totalElements };
  //       },
  //       [fulfilled]: (state, action) => {
  //         const deletedId = action?.meta?.arg;
  //         state.users = {
  //           allUsers:
  //             state?.users?.allUsers?.map((item) =>
  //               item.id === deletedId ? { ...item, active: !item?.active } : item
  //             ) || [],
  //           totalElements: state.users.totalElements,
  //           loading: false,
  //           toast: { message: 'User Added Successfully', variant: 'success' },
  //         };
  //       },
  //       [rejected]: (state, action) => {
  //         state.users = {
  //           error: action.error.message,
  //           allUsers: state?.users?.allUsers,
  //           totalElements: state.users.totalElements,
  //           loading: false,
  //           toast: { message: action?.error?.message || 'Failed to create User!', variant: 'error' },
  //         };
  //       },
  //     };
  //   }
  function updateUserType() {
    const { pending, fulfilled, rejected } = extraActions.updateUserType;

    return {
      [pending]: (state, action) => {
        state.userType = {
          loading: true,
          userTypes: state.userType?.userTypes,
          totalElements: state.userType.totalElements,
        };
      },
      [fulfilled]: (state, action) => {
        console.log({ action });
        state.userType = {
          userTypes: state?.userType?.userTypes?.map((item) =>
            item.id === action.payload.data?.userType?.id ? action.payload?.data?.userType : item
          ),
          loading: false,
          totalElements: state.userType.totalElements,
          toast: { message: 'User Updated Successfully', variant: 'success' },
        };
        state.allUserTypeData = [
          ...state?.allUserTypeData?.filter((ele) => ele.id !== action.payload.data.userType?.id),
          action.payload.data.userType,
        ];
      },
      [rejected]: (state, action) => {
        state.userType = {
          error: action.error.message,
          userTypes: state?.userType?.userTypes,
          loading: false,
          totalElements: state.userType.totalElements,
          toast: { message: action?.error?.message || 'Failed to create User!', variant: 'error' },
        };
      },
    };
  }
}

// Reducer

// Actions