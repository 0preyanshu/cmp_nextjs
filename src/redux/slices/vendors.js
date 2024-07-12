import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const HOST_API = 'https://zfwppq9jk2.execute-api.us-east-1.amazonaws.com/stg';

// const initialState = [];

const name = 'vendors';
const initialState = createInitialState();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({
    name,
    initialState,
    extraReducers,
});

export const VendorActions = { ...slice.actions, ...extraActions };

export default slice.reducer;

function createInitialState() {
    return {
        vendors: {
            allVendors: [], error: '', toast: {}, totalData: 0
        },
        singleVendor: {
            vendor: {}, error: '', toast: {}
        },
        allVendorsData: []
    };
}

function createExtraActions() {
    return {
        createvendor: createvendor(),
        fetchVendors: fetchVendors(),
        deletevendors: deletevendors(),
        updatevendors: updatevendors(),
        getVendorById: getVendorById()
    };
}


// create api
function createvendor() {
    return createAsyncThunk(`${name}/createvendor`, async (obj) => {
        try {
            const response = await axios.post(HOST_API.concat(`/vendor`), obj, {
                headers: { Authorization: `Bearer ${localStorage.getItem('custom-auth-token')}` },
            });
            return response;
        } catch (err) {
            return err;
        }
    });
}
function fetchVendors() {
    return createAsyncThunk(`${name}/fetchVendors`, async (data) => {
        try {
            const response = await axios.get(HOST_API.concat(`/vendor?page=${data.page}&limit=${data.limit}&search=${data.name}`), {
                headers: { Authorization: `Bearer ${localStorage.getItem('custom-auth-token')}` },
            });
            return response.data;
        } catch (err) {
            return err;
        }
    });
}

function getVendorById() {
    return createAsyncThunk(`${name}/getVendorById`, async (id) => {
        try {
            const response = await axios.get(HOST_API.concat(`/vendor/${id}`), {
                headers: { Authorization: `Bearer ${localStorage.getItem('custom-auth-token')}` },
            });
            return response.data;
        } catch (err) {
            return err;
        }
    });
}

function deletevendors() {
    return createAsyncThunk(`${name}/deletevendors`, async (id) => {
        try {
            const response = await axios.delete(HOST_API.concat(`/vendor/${id}`), {
                headers: { Authorization: `Bearer ${localStorage.getItem('custom-auth-token')}` },
            });
            return response.data;
        } catch (err) {
            return err;
        }
    });
}
function updatevendors() {
    return createAsyncThunk(`${name}/updatevendors`, async (data) => {
        try {
            const response = await axios.put(HOST_API.concat(`/vendor/${data.id}`), data, {
                headers: { Authorization: `Bearer ${localStorage.getItem('custom-auth-token')}` },
            });
            return response
        } catch (err) {
            return err;
        }
    });
}


function createExtraReducers() {
    return {
        ...createvendor(),
        ...fetchVendors(),
        ...deletevendors(),
        ...updatevendors(),
        ...getVendorById()
    };


    function createvendor() {
        const { pending, fulfilled, rejected } = extraActions.createvendor;
        return {
            [pending]: (state) => {
                state.vendors = { loading: true, allVendors: state.vendors.allVendors || [], totalData: state.vendors.totalData };
            },
            [fulfilled]: (state, action) => {
                // state.vendors = {
                //     allVendors: [...state.vendors.allVendors, action.payload.data?.vendor],
                //     loading: false,
                //     totalData: state.vendors.totalData + 1,
                //     toast: { message: 'vendors Added Successfully', variant: 'success' },
                // };
                // state.allVendorsData = [...state.allVendorsData, action.payload.data?.vendor]
            },
            [rejected]: (state, action) => {
                state.vendors = {
                    error: action.error.message,
                    loading: false,
                    totalData: state.vendors.totalData,
                    allVendors: state.vendors.allVendors,
                    toast: { message: action?.error?.message || 'Failed to create vendors!', variant: 'error' },
                };
            },
        };
    }
    function fetchVendors() {
        const { pending, fulfilled, rejected } = extraActions.fetchVendors;
        return {
            [pending]: (state) => {
                state.vendors = { loading: true, allVendors: state.vendors.allVendors || [], totalData: state.vendors.totalData };
                state.allVendorsData = state.allVendorsData || []

            },
            [fulfilled]: (state, action) => {
                const { isIndex } = action.meta.arg;
                console.log(action?.payload, 'action?.payload?.vendors');

                state.vendors = {
                    allVendors: action?.payload?.data?.data || [],
                    loading: false,
                    totalData: action?.payload?.totalElements,
                    toast: { message: 'vendors Added Successfully', variant: 'success', },
                };
                state.allVendorsData = isIndex ? action?.payload?.data?.data || [] : state.allVendorsData

            },
            [rejected]: (state, action) => {
                state.vendors = {
                    error: action.error.message,
                    allVendors: state?.vendors?.allVendors || [],
                    totalData: state?.vendors?.totalData,
                    loading: false,
                    toast: { message: action?.error?.message || 'Failed to create vendors!', variant: 'error', },
                };
                state.allVendorsData = state.allVendorsData || []

            },
        };
    }

    function getVendorById() {
        const { pending, fulfilled, rejected } = extraActions.getVendorById;
        return {
            [pending]: (state) => {
                state.singleVendor = { loading: true, vendor: {} };

            },
            [fulfilled]: (state, action) => {
                state.singleVendor = {
                    loading: false,
                    vendor: action?.payload?.vendor,
                    toast: { message: 'vendor fetched Successfully', variant: 'success', },
                };

            },
            [rejected]: (state, action) => {
                state.singleVendor = {
                    error: action.error.message,
                    vendor: {},
                    loading: false,
                    toast: { message: action?.error?.message || 'Failed to fetch vendors!', variant: 'error', },
                };
            },
        };
    }

    function deletevendors() {
        const { pending, fulfilled, rejected } = extraActions.deletevendors;
        return {
            [pending]: (state) => {
                state.vendors = { loading: true, allVendors: state.vendors.allVendors || [] };
            },
            [fulfilled]: (state, action) => {
                // const deletedId = action?.meta?.arg;
                // state.vendors = {
                //     allVendors: state?.vendors?.allVendors?.map((item) => item.id === deletedId ? { ...item, valid: !item.valid } : item) || [],
                //     loading: false,
                //     toast: { message: 'vendors Added Successfully', variant: 'success', },
                // };
                // state.allVendorsData = state?.allVendorsData?.map((item) => item.id === deletedId ? { ...item, valid: !item.valid } : item) || []
            },
            [rejected]: (state, action) => {
                state.vendors = {
                    error: action.error.message,
                    allVendors: state?.vendors?.allVendors,
                    loading: false,
                    toast: { message: action?.error?.message || 'Failed to create vendors!', variant: 'error', },
                };
            },
        };
    }
    function updatevendors() {
        const { pending, fulfilled, rejected } = extraActions.updatevendors;
        return {
            [pending]: (state) => {
                state.vendors = { loading: true, allVendors: state.vendors.allVendors || [], totalData: state.vendors.totalData };
            },
            [fulfilled]: (state, action) => {

                state.vendors.loading = false;
                if(action?.payload?.data?.data?.data){
                    state.vendors.allVendors = state.vendors.allVendors.map((item) => item.id === action?.payload?.data?.data?.data?.id ? action?.payload?.data?.data?.data : item)

                }
            },
            [rejected]: (state, action) => {
                state.vendors = {
                    error: action.error.message,
                    allVendors: state?.vendors?.allVendors,
                    totalData: state.vendors.totalData,
                    loading: false,
                    toast: { message: action?.error?.message || 'Failed to create vendors!', variant: 'error', },
                };
            },
        };
    }


}

// Reducer

// Actions
