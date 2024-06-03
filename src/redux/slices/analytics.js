import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { HOST_API } from '../../config';
import axios from 'axios';

const name = 'Analytics';
const initialState = {
    dataLoading: true,
    analyticsLoading: true,
    analyticsData: {},
    graphData: {},
    overviewdata: {},
};

// For Actions
function getAnalyticsData() {
    return createAsyncThunk(`${name}/getAnalyticsData`, async ({ filterStartDate, filterEndDate }) => {
        try {
            const response = await axios.get(HOST_API.concat(`/dashboard/data?startDate=${filterStartDate}&endDate=${filterEndDate}`), {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
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
            const response = await axios.get(HOST_API.concat(`/dashboard/lineGraph`), {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
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
                state.analyticsData = {};
            },
            [fulfilled]: (state, actions) => {
                state.analyticsData = actions?.payload?.dashBoardAnalyticsDTOList;
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
                state.graphData = {};
                state.overviewdata = {};
            },
            [fulfilled]: (state, actions) => {
                state.graphData = actions.payload.lineGraphDataMap;
                state.overviewdata = actions.payload.dashBoardDataMap;
                state.dataLoading = false;
            },
            [rejected]: (state, actions) => {
                state.dataLoading = false;
                state.graphData = {};
                state.overviewdata = {};
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
