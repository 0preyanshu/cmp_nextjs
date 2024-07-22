import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';
import axios from 'axios';
import { HOST_API } from '@/config';

// const initialState = [];

const name = 'Events';
const initialState = createInitialState();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({
  name,
  initialState,
  extraReducers,
});


export const EventsActions = { ...slice.actions, ...extraActions };

export default slice.reducer;

function createInitialState() {
  const analyticsdata = {
    eventId: 1,
    eventName: 'Class 24aug 2023',
    courseName: 'Photography',
    courseLogo:
      'https://s3.amazonaws.com/cmp-backend/2023-08-12T10%3A51%3A42.378081769temp-119836483469591801032profile.png',
    courseCategoryName: 'Testing',
    courseCategoryLogo:
      'https://s3.amazonaws.com/cmp-backend/2023-08-09T04%3A22%3A06.856807197temp-10451417383402251083Pmi.png',
    countryName: 'India',
    timezone: 'America/Antigua',
    classStartDate: '2023-11-23T00:00:00.000',
    stringClassStartDate: '2023-11-23T00:00:00.000Z',
    classEndDate: '2023-11-17T00:00:00.000',
    stringClassEndDate: '2023-11-17T00:00:00.000Z',
    revenueStats: {
      totalRevenue: 3567,
      totalfees: 5667,
      totaltax: 890,
      netProfit: 1220,
    },
    orderStats: [
      { label: 'Internal', value: 2 },
      { label: 'Vendors', value: 4 },
    ],
    participantsStats: [
      { label: 'Internal', value: 12 },
      { label: 'Vendors', value: 44 },
    ],
    otherparticipantsStats: [
      { label: 'Abaondoned', value: 12 },
      { label: 'Waitlist', value: 44 },
    ],
    participantDetails: [
      {
        id: 63,
        orderId: 45,
        orderStatus: 'WAITLIST',
        vendorName: 'arup',
        participantFirstName: 'Arup Testing 28',
        participantLastName: 'ArupTesting28',
        participantPhoneNo: '9883692791',
        participantEmail: 'arup@heliverse.com',
        notes: 'test',
      },
      {
        id: 64,
        orderId: 46,
        orderStatus: 'CONFIRMED',
        vendorName: 'jane',
        participantFirstName: 'Jane Testing 29',
        participantLastName: 'JaneTesting29',
        participantPhoneNo: '9876543210',
        participantEmail: 'jane@example.com',
        notes: 'test',
      },
      {
        id: 65,
        orderId: 47,
        orderStatus: 'CANCELLED',
        vendorName: 'john',
        participantFirstName: 'John Testing 30',
        participantLastName: 'JohnTesting30',
        participantPhoneNo: '1234567890',
        notes: 'test',
        participantEmail: 'john@example.com',
      },
      {
        id: 66,
        orderId: 48,
        orderStatus: 'WAITLIST',
        vendorName: 'mary',
        participantFirstName: 'Mary Testing 31',
        participantLastName: 'MaryTesting31',
        participantPhoneNo: '5555555555',
        notes: 'test',
        participantEmail: 'mary@example.com',
      },
      {
        id: 67,
        orderId: 49,
        orderStatus: 'CONFIRMED',
        vendorName: 'peter',
        participantFirstName: 'Peter Testing 32',
        participantLastName: 'PeterTesting32',
        participantPhoneNo: '4444444444',
        participantEmail: 'peter@example.com',
        notes: 'test',
      },
    ],
    graphData: [
      {
        chartlabel: ['2023/08/25', '2023/08/26', '2023/08/27', '2023/08/28', '2023/08/29', '2023/08/30', '2023/08/31'],
        data: [
          {
            name: 'Sales',
            data: [54, 97, 82, 83, 147, 115, 146],
          },
        ],
        dataType: 'Week',
      },
      {
        chartlabel: ['2023/08/18', '2023/08/19', '2023/08/20', '2023/08/21', '2023/08/22', '2023/08/23', '2023/08/24'],
        data: [
          {
            name: 'Sales',
            data: [74, 77, 114, 119, 131, 124, 79],
          },
        ],
        dataType: 'Two Week Ago',
      },
      {
        chartlabel: [
          '2023/8/25 - 2023/8/31',
          '2023/8/18 - 2023/8/24',
          '2023/8/11 - 2023/8/17',
          '2023/8/4 - 2023/8/10',
          '2023/7/28 - 2023/8/3',
          '2023/7/21 - 2023/7/27',
          '2023/7/14 - 2023/7/20',
          '2023/7/7 - 2023/7/13',
          '2023/6/30 - 2023/7/6',
          '2023/6/23 - 2023/6/29',
          '2023/6/16 - 2023/6/22',
          '2023/6/9 - 2023/6/15',
        ],
        data: [
          {
            name: 'Sales',
            data: [96, 46, 41, 150, 70, 38, 108, 67, 148, 62, 90, 98],
          },
        ],
        dataType: 'Last 12 Weeks',
      },
      {
        chartlabel: ['Jan', 'feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'August', 'Sept', 'Oct', 'Nov', 'Dec'],
        data: [
          {
            name: 'Sales',
            data: [695, 567, 767, 978, 946, 835, 623, 852, 702, 530, 690, 972],
          },
        ],
        dataType: 'Months',
      },
    ],
  };
  return {
    events: {
      allEvents: [],
      error: '',
      toast: {},
      totalData: 0,
      loading: true,
    },
    allEventsData: [],
    eventAnalytics: analyticsdata,
    analyticsLoading: true,
    singleEvent: {},
    singleEventLoading: true
  };
}

function createExtraActions() {
  return {
    createEvents: createEvents(),
    fetchEvents: fetchEvents(),
    deleteEvents: deleteEvents(),
    updateEvents: updateEvents(),
    fetchEventsAnalytics: fetchEventsAnalytics(),
    fetchEventById: fetchEventById(),
  };
}

// create api
function createEvents() {
  return createAsyncThunk(`${name}/createEvents`, async (obj) => {
    try {
      const response = await axios.post(HOST_API.concat(`/event`), obj, {
        headers: { Authorization: `Bearer ${localStorage.getItem('custom-auth-token')}` },
    });
      return response;
    } catch (err) {
      return err;
    }
  });
}
function fetchEvents() {
  return createAsyncThunk(`${name}/fetchEvents`, async (data) => {
    try {
      const response = await axios.get(
        HOST_API.concat(
          `/event?page=${data.page}&limit=${data.limit}&search=${data.name}&courseID=${data.courseId}&instructorID=${data.instructorId}&courseCategoryID=${data.courseCategoryId}&countryID=${data.countryId}&timezone=${data.timezone}&status=${data.status}`
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

function fetchEventById() {
  return createAsyncThunk(`${name}/fetchEventById`, async (id) => {
    try {
      const response = await axios.get(HOST_API.concat(`/event/${id}`), {
        headers: { Authorization: `Bearer ${localStorage.getItem('custom-auth-token')}` },
    });
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  });
}

function fetchEventsAnalytics() {
  return createAsyncThunk(`${name}/fetchEventsAnalytics`, async (eventId) => {
    try {
      const response = await axios.get(HOST_API.concat(`/event/analytics/${eventId}`), {
        headers: { Authorization: `Bearer ${localStorage.getItem('custom-auth-token')}` },
    });
      return response.data;
    } catch (err) {
      return err;
    }
  });
}

function deleteEvents() {
  return createAsyncThunk(`${name}/deleteEvents`, async (id) => {
    try {
      const response = await axios.delete(HOST_API.concat(`/event/${id}`), {
        headers: { Authorization: `Bearer ${localStorage.getItem('custom-auth-token')}` },
    });
      return response.data;
    } catch (err) {
      return err;
    }
  });
}
function updateEvents() {
  return createAsyncThunk(`${name}/updateEvents`, async (data) => {
    try {
      const response = await axios.put(HOST_API.concat(`/event/${data.id}`), data, {
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
    ...createEvents(),
    ...fetchEvents(),
    ...deleteEvents(),
    ...updateEvents(),
    ...fetchEventsAnalyticsReducer(),
    ...fetchEventById(),
  };

  function createEvents() {
    const { pending, fulfilled, rejected } = extraActions.createEvents;
    return {
      [pending]: (state) => {
        state.events = { loading: true, allEvents: state.events.allEvents || [], totalData: state.events.totalData };
      },
      [fulfilled]: (state, action) => {
        state.events.loading=false;
       if(action.payload?.data?.event){
        state.events = {
          allEvents: [...state.events.allEvents, action.payload?.data?.data?.event] ,
          totalData: state.events.totalData + 1,
          toast: { message: 'events Added Successfully', variant: 'success' },
        };
       }
      
      },
      [rejected]: (state, action) => {
        
        state.events = {
          error: action.error.message,
          loading: false,
          allEvents: [],
          totalData: state.events.totalData,
          toast: { message: action?.error?.message || 'Failed to create events!', variant: 'error' },
        };
      },
    };
  }
  function fetchEvents() {
    const { pending, fulfilled, rejected } = extraActions.fetchEvents;

    return {
      [pending]: (state) => {
        state.events = { loading: true, allEvents: state.events.allEvents || [], totalData: state.events.totalData };
        state.allEventsData = state.allEventsData || [];
      },
      [fulfilled]: (state, action) => {
        const { isIndex } = action.meta.arg;
        console.log(action.payload?.data?.data, 'action.payload?.data?.data?.data');
        state.events = {
          allEvents: action.payload?.data?.data|| [],
          loading: false,
          totalData: action?.payload?.totalElements,
          toast: { message: 'events Added Successfully', variant: 'success' },
        };
        state.allEventsData = isIndex ? action?.payload?.eventDTOs : state.allEventsData;
      },
      [rejected]: (state, action) => {
        state.events = {
          error: action.error.message,
          allEvents: state?.events?.allEvents || [],
          totalData: state.events.totalData,
          loading: false,
          toast: { message: action?.error?.message || 'Failed to create events!', variant: 'error' },
        };
        state.allEventsData = state.allEventsData || [];
      },
    };
  }

  function fetchEventById() {
    const { pending, fulfilled, rejected } = extraActions.fetchEventById;

    return {
      [pending]: (state) => {
        state.singleEventLoading = true;
        state.singleEvent = {}
      },
      [fulfilled]: (state, action) => {
        state.singleEvent = action.payload?.eventDTO
        state.singleEventLoading = false;
      },
      [rejected]: (state, action) => {
        state.singleEventLoading = false;
      },
    };
  }

  function fetchEventsAnalyticsReducer() {
    const { pending, fulfilled, rejected } = extraActions.fetchEventsAnalytics;
    return {
      [pending]: (state) => {
        state.analyticsLoading = true;
      },
      [fulfilled]: (state, action) => {
        console.log(action);
        state.eventAnalytics = action?.payload;
        state.analyticsLoading = false;
      },
      [rejected]: (state, action) => {
        state.eventAnalytics = {};
        state.analyticsLoading = false;
        state.analyticsToast = action?.error?.message || 'Failed to fetch analytics data!';
      },
    };
  }

  function deleteEvents() {
    const { pending, fulfilled, rejected } = extraActions.deleteEvents;
    return {
      [pending]: (state) => {
        state.events = { loading: true, allEvents: state.events.allEvents || [], totalData: state.events.totalData };
      },
      [fulfilled]: (state, action) => {
        const deletedId = action?.meta?.arg;
        state.events = {
          allEvents: state?.events?.allEvents?.filter((events) => events.id !== deletedId),
          loading: false,
          totalData: state.events.totalData - 1,
          toast: { message: 'events Added Successfully', variant: 'success' },
        };
      },
      [rejected]: (state, action) => {
        state.events = {
          error: action.error.message,
          allEvents: state?.events?.allEvents,
          loading: false,
          totalData: state.events.totalData,
          toast: { message: action?.error?.message || 'Failed to create events!', variant: 'error' },
        };
      },
    };
  }
  function updateEvents() {
    const { pending, fulfilled, rejected } = extraActions.updateEvents;
    return {
      [pending]: (state) => {
        state.events = { loading: true, allEvents: state.events.allEvents || [] };
      },
      [fulfilled]: (state, action) => {
        state.events.loading=false;
        if(action.payload?.data?.data){
          state.events = {
            allEvents: state?.events?.allEvents?.map((item) =>
              item.id === action.payload?.data?.data?.data?.id ? action.payload?.data?.data?.data : item
            ),
            totalData: state.events.totalData,
            toast: { message: 'events Updated Successfully', variant: 'success' },
          };

        }
      
      },
      [rejected]: (state, action) => {
        state.events = {
          error: action.error.message,
          totalData: state.events.totalData,
          allEvents: state?.events?.allEvents,
          loading: false,
          toast: { message: action?.error?.message || 'Failed to create events!', variant: 'error' },
        };
      },
    };
  }
}

// Reducer

// Actions
