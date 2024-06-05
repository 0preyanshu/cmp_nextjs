import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
// import { HOST_API } from '../../config';
const HOST_API = 'https://zfwppq9jk2.execute-api.us-east-1.amazonaws.com/stg';


const name = 'courses';
const initialState = createInitialState();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({
  name,
  initialState,
  extraReducers,
});

export const CoursesActions = { ...slice.actions, ...extraActions };

export default slice.reducer;

function createInitialState() {
  return {
    courses: {
      allCourses: [],
      error: '',
      toast: {},
      totalData: 0,
    },
    allCoursesData: [],
  };
}

function createExtraActions() {
  return {
    createCourses: createCourses(),
    fetchCourses: fetchCourses(),
    deleteCourses: deleteCourses(),
    updateCourses: updateCourses(),
  };
}

// create api
function createCourses() {
  return createAsyncThunk(`${name}/createCourses`, async (obj) => {

    // avatar: "courseLogo",
    // coursename: "courseName",
    // courseshortname: "courseShortName",
    // category: "courseCategoryID",
    // courseurl: "courseUrl",

    const newobj={
      "courseName" : obj.coursename,
      "courseCategoryID" : obj.category,
      "courseLogo" : obj.avatar || "image.com",
      "courseShortName" : obj.courseshortname,
      "courseUrl": obj.courseurl,
  }  
    try {
      const response = await axios.post(HOST_API.concat(`/course`), newobj, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      return response;
    } catch (err) {
      return err;
    }
  });
}
function fetchCourses() {
  return createAsyncThunk(`${name}/fetchCourses`, async (data) => {
    try {
      const response = await axios.get(
        HOST_API.concat(
          `/course?page=${data.page}&limit=${data.limit}&search=${data?.name||""}&courseCategoryID=${
            data?.categoryId || ''
          } `
        ),
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        }
      );
      console.log(response.data);
      const res = response.data;
      
      if(!res.error || res.data.data){
        const newres ={
          courseDTOS: res.data.data,
          totalElements: res.data.data.length,
          message: res.data.message,
          totalPages : data.page + 1,
        
        }
        return newres;
      }
      return {};
    } catch (err) {
      return err;
    }
  });
}

function deleteCourses() {
  return createAsyncThunk(`${name}/deleteCourses`, async (id) => {
    try {
      const response = await axios.delete(HOST_API.concat(`/course/${id}`), {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      return response.data;
    } catch (err) {
      return err;
    }
  });
}
function updateCourses() {
  return createAsyncThunk(`${name}/updateCourses`, async (data) => {
    // change the body
    try {
    //   const newobj={
    //     "courseName" : data.values.courseName,
    //     "courseCategoryID" : data.values.categoryId,
    //     "courseLogo" : data.values.courseLogo,
    //     "courseShortName" :data.values.shortName,
    //     "courseUrl": data.values.courseUrl,
    // } 
      const response = await axios.put(HOST_API.concat(`/course/${data.id}`), data, {
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
    ...createCourses(),
    ...fetchCourses(),
    ...deleteCourses(),
    ...updateCourses(),
  };

  function createCourses() {
    const { pending, fulfilled, rejected } = extraActions.createCourses;
    return {
      [pending]: (state) => {
        state.courses = {
          loading: true,
          allCourses: state.courses.allCourses || [],
          totalData: state.courses.totalData,
        };
      },
      [fulfilled]: (state, action) => {
        state.courses = {
          loading: false,
          totalData: state.courses.totalData + 1,
          toast: { message: 'courses Added Successfully', variant: 'success' },
        }
                                    
      },
      [rejected]: (state, action) => {
        state.courses = {
          error: action.error.message,
          loading: false,
          allCourses: [],
          totalData: state.courses.totalData,
          toast: { message: action?.error?.message || 'Failed to create courses!', variant: 'error' },
        };
      },
    };
  }
  function fetchCourses() {
    const { pending, fulfilled, rejected } = extraActions.fetchCourses;
    return {
      [pending]: (state) => {
        state.courses = {
          loading: true,
          allCourses: state.courses.allCourses || [],
          totalData: state.courses.totalData,
        };
        state.allCoursesData = state.allCoursesData || [];
      },
      [fulfilled]: (state, action) => {
        const { isIndex } = action.meta.arg;

        state.courses = {
          allCourses: action?.payload?.courseDTOS,
          loading: false,
          totalData: action?.payload?.totalElements,
          toast: { message: 'courses Added Successfully', variant: 'success' },
        };
        state.allCoursesData = isIndex ? action.payload.courseDTOS : state.allCoursesData;
      },
      [rejected]: (state, action) => {
        state.courses = {
          error: action.error.message,
          allCourses: state?.courses?.allCourses || [],
          totalData: state?.courses?.totalData || 0,
          loading: false,
          toast: { message: action?.error?.message || 'Failed to create courses!', variant: 'error' },
        };
        state.allCoursesData = state.allCoursesData || [];
      },
    };
  }
  function deleteCourses() {
    const { pending, fulfilled, rejected } = extraActions.deleteCourses;
    return {
      [pending]: (state) => {
        state.courses = {
          loading: true,
          allCourses: state.courses.allCourses || [],
          totalData: state.courses.totalData,
        };
      },
      [fulfilled]: (state, action) => {
        const deletedId = action?.meta?.arg;
        
     
      },
      [rejected]: (state, action) => {
        state.courses = {
          error: action.error.message,
          allCourses: state?.courses?.allCourses,
          totalData: state.courses.totalData,
          loading: false,
          toast: { message: action?.error?.message || 'Failed to create courses!', variant: 'error' },
        };
      },
    };
  }
  function updateCourses() {
    const { pending, fulfilled, rejected } = extraActions.updateCourses;
    return {
      [pending]: (state) => {
        state.courses = {
          loading: true,
          totalData: state.courses.totalData,
          allCourses: state.courses.allCourses || [],
        };
      },
      [fulfilled]: (state, action) => {
        
      },
      [rejected]: (state, action) => {
        state.courses = {
          error: action.error.message,
          allCourses: state?.courses?.allCourses,
          totalData: state.courses.totalData,
          loading: false,
          toast: { message: action?.error?.message || 'Failed to create courses!', variant: 'error' },
        };
      },
    };
  }
}

// Reducer

// Actions
