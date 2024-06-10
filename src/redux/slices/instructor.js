import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


const HOST_API = 'https://zfwppq9jk2.execute-api.us-east-1.amazonaws.com/stg';

// const initialState = [];

const name = 'Instructor';
const initialState = createInitialState();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({
    name,
    initialState,
    extraReducers,
});

export const InstructorActions = { ...slice.actions, ...extraActions };

export default slice.reducer;

function createInitialState() {
    return {
        instructors: {
            allInstructors: [], error: '', toast: {}, totalData: 0
        },
        allInstructorsData: []
    };
}

function createExtraActions() {
    return {
        createInstructor: createInstructor(),
        fetchInstructor: fetchInstructor(),
        deleteinstructor: deleteinstructor(),
        updateinstructor: updateinstructor()
    };
}


// create api
function createInstructor() {
    return createAsyncThunk(`${name}/createInstructor`, async (obj) => {
        const newobj={
            photo : obj.avatar || "image",
            firstname:obj.firstname,
            lastname:obj.lastname,
            email:obj.email,
        }
        try {
            const response = await axios.post(HOST_API.concat(`/instructor`), newobj, {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
            });
            return response;
        } catch (err) {
            return err;
        }
    });
}
function fetchInstructor() {
    return createAsyncThunk(`${name}/fetchInstructor`, async (data) => {
        try {
            const response = await axios.get(HOST_API.concat(`/instructor?page=${data.page}&limit=${data.limit}&search=${data.name || " "}`), {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
            });
            return response.data;
        } catch (err) {
            return err;
        }
    });
}

function deleteinstructor() {
    return createAsyncThunk(`${name}/deleteinstructor`, async (id) => {
        try {
            const response = await axios.delete(HOST_API.concat(`/instructor/${id}`), {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
            });
            return response.data;
        } catch (err) {
            return err;
        }
    });
}
function updateinstructor() {
    return createAsyncThunk(`${name}/updateinstructor`, async (data) => {
        try {
            const response = await axios.put(HOST_API.concat(`/instructor/${data.id}`), data, {
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
        ...createInstructor(),
        ...fetchInstructor(),
        ...deleteinstructor(),
        ...updateinstructor()
    };


    function createInstructor() {
        const { pending, fulfilled, rejected } = extraActions.createInstructor;
        return {
            [pending]: (state) => {
                state.instructors = { loading: true, allInstructors: state?.instructors?.allInstructors || [], totalData: state?.instructors?.totalData, };
            },
            [fulfilled]: (state, action) => {
                
            },
            [rejected]: (state, action) => {
                state.instructors = {
                    error: action?.error?.message,
                    loading: false,
                    allInstructors: [],
                    totalData: state?.instructors?.totalData,
                    toast: { message: action?.error?.message || 'Failed to create instructors!', variant: 'error' },
                };
            },
        };
    }
    function fetchInstructor() {
        const { pending, fulfilled, rejected } = extraActions.fetchInstructor;
        return {
            [pending]: (state) => {
                state.instructors = { loading: true, allInstructors: state.instructors.allInstructors || [], totalData: state.instructors.totalData, };
                state.allInstructorsData = state.allInstructorsData || []

            },
            [fulfilled]: (state, action) => {
                const { isIndex } = action.meta.arg;

                console.log(action?.payload, 'action?.payload?.instructors');

                state.instructors = {
                    allInstructors: action?.payload?.data?.data || [],
                    loading: false,
                    totalData: action?.payload?.totalElements,
                    toast: { message: 'instructors Added Successfully', variant: 'success', },
                };
                state.allInstructorsData = isIndex ? action?.payload?.data?.data || [] : state.allInstructorsData

            },
            [rejected]: (state, action) => {
                state.instructors = {
                    error: action.error.message,
                    allInstructors: state?.instructors?.allInstructors || [],
                    totalData: state.instructors.totalData,
                    loading: false,
                    toast: { message: action?.error?.message || 'Failed to create instructors!', variant: 'error', },
                };
                state.allInstructorsData = state.allInstructorsData || []

            },
        };
    }
    function deleteinstructor() {
        const { pending, fulfilled, rejected } = extraActions.deleteinstructor;
        return {
            [pending]: (state) => {
                state.instructors = { loading: true, allInstructors: state.instructors.allInstructors || [], totalData: state.instructors.totalData, };
            },
            [fulfilled]: (state, action) => {
             
            },
            [rejected]: (state, action) => {
                state.instructors = {
                    error: action.error.message,
                    allInstructors: state?.instructors?.allInstructors,
                    loading: false,
                    totalData: state.instructors.totalData,
                    toast: { message: action?.error?.message || 'Failed to create instructors!', variant: 'error', },
                };
            },
        };
    }
    function updateinstructor() {
        const { pending, fulfilled, rejected } = extraActions.updateinstructor;
        return {
            [pending]: (state) => {
                state.instructors = { loading: true, allInstructors: state?.instructors?.allInstructors || [] };
            },
            [fulfilled]: (state, action) => {

            },
            [rejected]: (state, action) => {
                state.instructors = {
                    error: action?.error?.message,
                    totalData: state?.instructors?.totalData,
                    allInstructors: state?.instructors?.allInstructors,
                    loading: false,
                    toast: { message: action?.error?.message || 'Failed to create instructors!', variant: 'error', },
                };
            },
        };
    }


}

// Reducer

// Actions
