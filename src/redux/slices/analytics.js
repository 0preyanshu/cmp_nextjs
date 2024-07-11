import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { HOST_API } from '../../config';

const HOST_API = 'https://zfwppq9jk2.execute-api.us-east-1.amazonaws.com/stg';

import axios from 'axios';

const name = 'Analytics';
const initialState = {
    dataLoading: true,
    analyticsLoading: true,
    analyticsData: [],
    graphData: [],
    overviewdata: [],
};

// For Actions
function getAnalyticsData() {
    return createAsyncThunk(`${name}/getAnalyticsData`, async ({ startDate, endDate ,page,limit}) => {
        try {
            const response = await axios.get(HOST_API.concat(`/dashboard/analytics?page=${page}&limit=${limit}&startDate=${startDate}&endDate=${endDate}`), {
                headers: { Authorization: `Bearer ${localStorage.getItem('custom-auth-token')}` },
            });
            return response.data;
        } catch (err) {
            return err;
        }

    })
}

function getData() {
    return createAsyncThunk(`${name}/getData`, async () => {
        try {
            const response = await axios.get(HOST_API.concat(`/dashboard/graph`), {
                headers: { Authorization: `Bearer ${localStorage.getItem('custom-auth-token')}` },
            });
            return response.data;
        } catch (err) {
            return err;
        }

    })
}



const createExtraActions = () => ({
    getAnalyticsData: getAnalyticsData(),
    getData: getData(),
});

const extraActions = createExtraActions();

const createExtraReducers = () => {
    function getAnalyticsData() {
        const { fulfilled, pending, rejected } = extraActions.getAnalyticsData;
        return {
            [pending]: (state) => {
                state.analyticsLoading = true;
                state.analyticsData = [];
            },
            [fulfilled]: (state, actions) => {
                console.log(actions.payload?.data?.data)
                if(actions.payload?.data?.data)
                state.analyticsData = actions.payload?.data?.data || [];
                state.analyticsLoading = false;
            },
            [rejected]: (state, actions) => {
                state.analyticsLoading = false;
            },
        };
    }

    function getData() {
        const { fulfilled, pending, rejected } = extraActions.getData;
        return {
            [pending]: (state) => {
                state.dataLoading = true;
                state.graphData = [];
                state.overviewdata = [];
            },
            [fulfilled]: (state, actions) => {
                if(actions?.payload?.data?.data)
                state.graphData = actions.payload.data.data || [];
                state.overviewdata = actions.payload.dashBoardDataMap || [];
                state.dataLoading = false;
            },
            [rejected]: (state, actions) => {
                state.dataLoading = false;
                state.graphData = [];
                state.overviewdata = [];
            },
        };
    }

    return {
        ...getAnalyticsData(),
        ...getData(),
    };
};

const extraReducers = createExtraReducers();

const slice = createSlice({
    name,
    initialState,
    extraReducers,
});

export const AnalyticsActions = { ...extraActions, ...slice.actions };
export default slice.reducer;
