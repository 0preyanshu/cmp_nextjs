import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


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


function createCategories() {
  return createAsyncThunk(`${name}/createCategories`, async (data) => {

    const newobj={
      "courseCategoryName" : data.categoryname,
      "categoryShortName" :  data.categoryshortname,
      "categoryLogo" : data.avatar || "  ",
    }   
    try {
      const response = await axios.post(HOST_API.concat(`/course-category`),newobj,{
        headers: { Authorization: `Bearer ${localStorage.getItem('custom-auth-token')}` },
    });
      return response;
    } catch (err) {
      return err;
    }
  });
}
function fetchcategories() {
  return createAsyncThunk(`${name}/fetchcategories`, async (data) => {
    console.log("dsd",data.name);
    try {
      const response = await axios.get(
        HOST_API.concat(`/course-category?page=${data.page}&limit=${data.limit}&search=${data.name}`),
          {
          headers: { Authorization: `Bearer ${localStorage.getItem('custom-auth-token')}` },
      }
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
        headers: { Authorization: `Bearer ${localStorage.getItem('custom-auth-token')}` },
    });
      return response.data;
    } catch (err) {
      return err;
    }
  });
}
function updatecategories() {
 
  return createAsyncThunk(`${name}/updatecategories`, async (data) => {

    ;  
    try {
      const response = await axios.put(HOST_API.concat(`/course-category/${data.id}`), data, {
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
 
        state.categories = {
          allCategories: [...state.categories.allCategories, action.payload?.data?.data?.courseCategory],
          totalData: state.categories.allCategories.length + 1,
          loading: false,
          toast: { message: 'categories Added Successfully', variant: 'success' },
        };
        state.allCourseCategories = [...state?.allCourseCategories, action.payload?.data?.data?.courseCategory];
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
          allCategories: action?.payload?.courseCategoryDTOS || [],
          loading: false,
          totalData: action?.payload?.totalElements,
          toast: { message: 'categories Added Successfully', variant: 'success' },
        };
        state.allCourseCategories = isIndex ? action?.payload?.courseCategoryDTOS || [] : state.allCourseCategories;
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
          loading: true,
          allCategories: state.categories.allCategories || [],
        };
      },
      [fulfilled]: (state, action) => {

        console.log(action.payload?.data?.data,"action.payload?.data?.data?.data?.data")
        state.categories.loading=false;
        if(action?.payload?.data?.data?.data){
          state.categories = {
            allCategories: state?.categories?.allCategories?.map((item) =>
              item.id === action?.payload?.data?.data?.data.id ? action?.payload?.data?.data?.data : item
            ),
  
            totalData: state.categories.totalData,
            toast: { message: 'categories Updated Successfully', variant: 'success' },
          };
          state.allCourseCategories = [
            ...state?.allCourseCategories?.filter((item) => item.id !== action?.payload?.data?.data?.data.id),
            action?.payload?.data?.data?.data,
          ];
        }
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




