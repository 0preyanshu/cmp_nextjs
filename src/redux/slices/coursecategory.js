import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
// import { HOST_API } from '../../config';

// const initialState = [];
const HOST_API = 'https://zfwppq9jk2.execute-api.us-east-1.amazonaws.com/stg';

const name = 'coursecategory';
const initialState = createInitialState();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({
  name,
  initialState,
  extraReducers,
});
// const customAxios = axios.create();

// // Add a request interceptor
// customAxios.interceptors.request.use((config) => {
//   // Check if it's a preflight request (OPTIONS) and remove the Authorization header
//   if (config.method === 'options') {
//     delete config.headers.Authorization;
//   }
//   return config;
// });
export const CourseCategoryActions = { ...slice.actions, ...extraActions };

export default slice.reducer;

function createInitialState() {
  return {
    categories: {
      allCategories: [],
      error: '',
      toast: {},
      totalData: 0,
    },
    allCourseCategories: [],
  };
}

function createExtraActions() {
  return {
    createCategories: createCategories(),
    fetchcategories: fetchcategories(),
    deletecategories: deletecategories(),
    updatecategories: updatecategories(),
  };
}

// create api
function createCategories() {
  return createAsyncThunk(`${name}/createCategories`, async (data) => {
//     categoryLogo
// : 
// "https://s3.amazonaws.com/cmp-backend/2024-05-25T12%3A54%3A31.157474063temp-4835493935686429210comb4or5.png"
// categoryName
// : 
// "dsdsv"
// shortName
// : 
// "dadffdfg"
// valid
// : 
// false
const newobj={
  "courseCategoryName" : data.categoryName,
  "categoryShortName" :  data.shortName,
  "categoryLogo" : data.categoryLogo,
}   
    try {
      const response = await axios.post(HOST_API.concat(`/course-category`),newobj);
      return response;
    } catch (err) {
      return err;
    }
  });
}
function fetchcategories() {
  return createAsyncThunk(`${name}/fetchcategories`, async (data) => {
    try {
      const response = await axios.get(
        HOST_API.concat(`/course-category?page=${data.page}&limit=${data.limit}&search=${data.name?data.name:''}`)
      );
      console.log(response.data);
      const res = response.data;
      if(!res.error || res.data.data){
        const newres={
          courseCategoryDTOS: res.data.data,
          totalElements: res.data.data.length,
          totalPages: data.page+1,
          message:res.data.message
        
        }
        return newres;
      }
      return {};
    } catch (err) {
      return err;
    }
  });
}

function deletecategories() {
  return createAsyncThunk(`${name}/deletecategories`, async (id) => {
    try {
      const response = await axios.delete(HOST_API.concat(`/course-category/${id}`), {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      return response.data;
    } catch (err) {
      return err;
    }
  });
}
function updatecategories() {
  // change the body 
  return createAsyncThunk(`${name}/updatecategories`, async (data) => {

    const newobj={
      "courseCategoryName" : data.values.categoryName,
      "categoryShortName" :  data.values.shortName,
      "categoryLogo" : data.values.categoryLogo,
    }  
    try {
      const response = await axios.put(HOST_API.concat(`/course-category/${data.id}`), newobj, {
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
    ...createCategories(),
    ...fetchcategories(),
    ...deletecategories(),
    ...updatecategories(),
  };

  function createCategories() {
    const { pending, fulfilled, rejected } = extraActions.createCategories;
    return {
      [pending]: (state) => {
        state.categories = {
          loading: true,
          allCategories: state.categories.allCategories || [],
          totalData: state.categories.totalData,
        };
      },
      [fulfilled]: (state, action) => {
        // state.categories = {
        //   allCategories: [...state.categories.allCategories, action.payload?.data?.categoryDTO],
        //   totalData: state.categories.totalData + 1,
        //   loading: false,
        //   toast: { message: 'categories Added Successfully', variant: 'success' },
        // };
        // state.allCourseCategories = [...state?.allCourseCategories, action.payload?.data?.data?.data];
      },
      [rejected]: (state, action) => {
        state.categories = {
          error: action.error.message,
          loading: false,
          totalData: state.categories.totalData,
          allCategories: [],
          toast: { message: action?.error?.message || 'Failed to create categories!', variant: 'error' },
        };
      },
    };
  }
  function fetchcategories() {
    const { pending, fulfilled, rejected } = extraActions.fetchcategories;
    return {
      [pending]: (state) => {
        state.categories = {
          loading: true,
          allCategories: state.categories.allCategories || [],
          totalData: state.categories.totalData,
        };
        state.allCourseCategories = state.allCourseCategories || [];
      },
      [fulfilled]: (state, action) => {
        const { isIndex } = action.meta.arg;
        state.categories = {
          allCategories: action?.payload?.courseCategoryDTOS,
          loading: false,
          totalData: action?.payload?.totalElements,
          toast: { message: 'categories Added Successfully', variant: 'success' },
        };
        state.allCourseCategories = isIndex ? action?.payload?.courseCategoryDTOS : state.allCourseCategories;
      },
      [rejected]: (state, action) => {
        state.categories = {
          error: action.error.message,
          allCategories: state?.categories?.allCategories || [],
          totalData: state.categories.totalData,
          loading: false,
          toast: { message: action?.error?.message || 'Failed to create categories!', variant: 'error' },
        };
        state.allCourseCategories = state.allCourseCategories || [];
      },
    };
  }
  function deletecategories() {
    const { pending, fulfilled, rejected } = extraActions.deletecategories;
    return {
      [pending]: (state) => {
        state.categories = {
          loading: true,
          allCategories: state.categories.allCategories,
          totalData: state.categories.totalData,
        };
      },
      [fulfilled]: (state, action) => {
        const deletedId = action?.meta?.arg;
        state.categories = {
          allCategories:
            state.categories?.allCategories?.map((item) =>
              item.id === deletedId ? { ...item, valid: !item.valid } : item
            ) || [],

          loading: false,
          totalData: state.categories.totalData,
          toast: { message: 'categories Added Successfully', variant: 'success' },
        };
        // state.allCourseCategories =
        //   state?.allCourseCategories?.map((item) => (item.id === deletedId ? { ...item, valid: !item.valid } : item)) ||
        //   [];
      },
      [rejected]: (state, action) => {
        state.categories = {
          error: action.error.message,
          allCategories: state?.categories?.allCategories,
          loading: false,
          totalData: state.categories.totalData,
          toast: { message: action?.error?.message || 'Failed to create categories!', variant: 'error' },
        };
      },
    };
  }
  function updatecategories() {
    const { pending, fulfilled, rejected } = extraActions.updatecategories;
    return {
      [pending]: (state) => {
        state.categories = {
          totalData: state.categories.totalData,
          allCategories: state.categories.allCategories || [],
        };
      },
      [fulfilled]: (state, action) => {
        // state.categories = {
        //   allCategories: state?.categories?.allCategories?.map((item) =>
        //     item.id === action.payload.data?.categoryDTO?.id ? action.payload.data?.categoryDTO : item
        //   ),

        //   totalData: state.categories.totalData,
        //   toast: { message: 'categories Updated Successfully', variant: 'success' },
        // };
        // state.allCourseCategories = [
        //   ...state?.allCourseCategories?.filter((item) => item.id !== action.payload.data?.categoryDTO?.id),
        //   action.payload.data?.categoryDTO,
        // ];
      },
      [rejected]: (state, action) => {
        state.categories = {
          error: action.error.message,
          allCategories: state?.categories?.allCategories,

          totalData: state.categories.totalData,
          toast: { message: action?.error?.message || 'Failed to create categories!', variant: 'error' },
        };
      },
    };
  }
}

// Reducer

// Actions
