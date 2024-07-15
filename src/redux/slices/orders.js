import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


// const initialState = [];
const HOST_API = 'https://zfwppq9jk2.execute-api.us-east-1.amazonaws.com/stg';

const name = 'Orders';
const initialState = createInitialState();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({
  name,
  initialState,
  extraReducers,
});

export const OrderActions = { ...slice.actions, ...extraActions };

export default slice.reducer;

function createInitialState() {
  return {
    orders: {
      allOrders: [],
      error: '',
      toast: {},
      totalData: 0,
    },
    abandonedCart: {
      allOrders: [],
      error: '',
      toast: {},
      totalData: 0,
    },
  };
}

function createExtraActions() {
  return {
    createOrder: createOrder(),
    fetchOrder: fetchOrder(),
    cancelOrder: cancelOrder(),
    deleteorder: deleteorder(),
    updateorder: updateorder(),
    fetchAbandonedCart: fetchAbandonedCart(),
    transferParticipants: transferParticipants(),
    refundOrder: refundOrder(),
    sendEmail: sendEmail(),
  };
}

// create api
function createOrder() {
  return createAsyncThunk(`${name}/createOrder`, async (obj) => {
    try {
      const response = await axios.post(HOST_API.concat(`/order/create/admin`), obj, {
        headers: { Authorization: `Bearer ${localStorage.getItem('custom-auth-token')}` },
    });
      return response;
    } catch (err) {
      return err;
    }
  });
}
function fetchOrder() {
  return createAsyncThunk(`${name}/fetchOrder`, async (data) => {
    try {
      const response = await axios.get(
        HOST_API.concat(
          `/order?limit=${data.limit || 5}&vendorId=${data.vendorId || ''
          }&courseId=${data.courseId || ''}&search=${data.name || ''}&startDate=${data.startDate || ''}&endDate=${data.endDate || ''}`
        ),
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('custom-auth-token')}` },
      }
      );
      console.log(response.data);
      return response.data;
    } catch (err) {
      return err;
    }
  });
}
function fetchAbandonedCart() {
  return createAsyncThunk(`${name}/fetchAbandonedCart`, async (data) => {
    try {
      const response = await axios.get(
        HOST_API.concat(
          `/abandoned-cart?limit=${data.limit}&courseID=${data.courseID}&eventID=${data.eventID}&search=${data.name}&startDate=${data.startDate}&endDate=${data.endDate}`
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
function transferParticipants() {
  return createAsyncThunk(`${name}/transferParticipants`, async (data) => {
    try {
      const response = await axios.put(HOST_API.concat(`/order/transferParticipants`), data, {
        headers: { Authorization: `Bearer ${localStorage.getItem('custom-auth-token')}` },
      });
      return response;
    } catch (err) {
      return err;
    }
  });
}
function cancelOrder() {
  return createAsyncThunk(`${name}/cancelOrder`, async (data) => {
    console.log(data);
    try {
      const response = await axios.put(HOST_API.concat(`/order/cancel/${data.id}`), data, {
        headers: { Authorization: `Bearer ${localStorage.getItem('custom-auth-token')}` },
      });
      return response;
    } catch (err) {
      return err;
    }
  });
}

function deleteorder() {
  return createAsyncThunk(`${name}/deleteorder`, async (id) => {
    try {
      const response = await axios.delete(HOST_API.concat(`/order/delete/${id}`), {
        headers: { Authorization: `Bearer ${localStorage.getItem('custom-auth-token')}` }
      });
      return response;
    } catch (err) {
      return err;
    }
  });
}

function updateorder() {
  return createAsyncThunk(`${name}/updateorder`, async (data) => {
    try {
      const response = await axios.put(HOST_API.concat(`/order/edit/${data.id}`), data, {
        headers: { Authorization: `Bearer ${localStorage.getItem('custom-auth-token')}` },
    });
      return response;
    } catch (err) {
      return err;
    }
  });
}

function refundOrder() {
  return createAsyncThunk(`${name}/refundOrder`, async (obj) => {
    try {
      const response = await axios.post(HOST_API.concat(`/order/refund?orderId=${obj?.id}`), obj?.data, {
        headers: { Authorization: `Bearer ${localStorage.getItem('custom-auth-token')}` },
      });
      return response;
    } catch (err) {
      return err;
    }
  });
}

function sendEmail() {
  return createAsyncThunk(`${name}/sendEmail`, async (obj) => {
    try {
      const response = await axios.post(HOST_API.concat(`/order/sendOrderEmail`), obj, {
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
    ...createOrder(),
    ...fetchOrder(),
    ...fetchAbandonedCart(),
    ...deleteorder(),
    ...updateorder(),
    // ...cancelOrder(),
  };

  function createOrder() {
    const { pending, fulfilled, rejected } = extraActions.createOrder;
    return {
      [pending]: (state) => {
        state.orders = { loading: true, allOrders: state.orders.allOrders || [], totalData: state.orders.totalData };
      },
      [fulfilled]: (state, action) => {
        console.log(action.payload);
        state.orders = {
          allOrders: [...state.orders.allOrders, action?.payload?.data?.orderDTO],
          loading: false,
          totalData: state.orders.totalData + 1,
          toast: { message: 'orders Added Successfully', variant: 'success' },
        };
      },
      [rejected]: (state, action) => {
        state.orders = {
          error: action.error.message,
          loading: false,
          allOrders: [],
          totalData: state.orders.totalData,
          toast: { message: action?.error?.message || 'Failed to create orders!', variant: 'error' },
        };
      },
    };
  }
  function fetchOrder() {
    const { pending, fulfilled, rejected } = extraActions.fetchOrder;
    return {
      [pending]: (state) => {
        state.orders = { loading: true, allOrders: [], totalData: state.orders.totalData };
      },
      [fulfilled]: (state, action) => {
        state.orders = {
          allOrders: action?.payload?.data?.data || [],
          loading: false,
          totalData: action?.payload?.totalElements || 0,
          toast: { message: 'orders Added Successfully', variant: 'success' },
        };
      },
      [rejected]: (state, action) => {
        state.orders = {
          error: action.error.message,
          allOrders: state?.orders?.allOrders,
          totalData: state.orders.totalData,
          loading: false,
          toast: { message: action?.error?.message || 'Failed to create orders!', variant: 'error' },
        };
      },
    };
  }

  // function cancelOrder() {
  //   const { pending, fulfilled, rejected } = extraActions.cancelOrder;
  //   return {
  //     [pending]: (state) => {
  //       state.orders = { loading: true };
  //     },
  //     [fulfilled]: (state, action) => {
  //       console.log(action);
  //       state.orders = {
  //         allOrders: [
  //           ...state?.orders?.allOrders?.filter((order) => order?.id !== action?.payload?.data?.orderDTO?.id),
  //           action?.payload?.data?.orderDTO,
  //         ],
  //         loading: false,
  //         totalData: action?.payload?.totalElements || 0,
  //         toast: { message: 'orders Added Successfully', variant: 'success' },
  //       };
  //     },
  //     [rejected]: (state, action) => {
  //       state.orders = {
  //         error: action.error.message,
  //         allOrders: state?.orders?.allOrders,
  //         totalData: state.orders.totalData,
  //         loading: false,
  //         toast: { message: action?.error?.message || 'Failed to create orders!', variant: 'error' },
  //       };
  //     },
  //   };
  // }
  function fetchAbandonedCart() {
    const { pending, fulfilled, rejected } = extraActions.fetchAbandonedCart;
    return {
      [pending]: (state) => {
        state.abandonedCart = {
          loading: true,
          allOrders: state.abandonedCart.allOrders || [],
          totalData: state.abandonedCart.totalData,
        };
      },
      [fulfilled]: (state, action) => {
        state.abandonedCart = {
          allOrders: action?.payload?.data?.data || [],
          loading: false,
          totalData: action?.payload?.totalElements || 0,
          toast: { message: 'orders Added Successfully', variant: 'success' },
        };
      },
      [rejected]: (state, action) => {
        state.abandonedCart = {
          error: action.error.message,
          allOrders: state?.abandonedCart?.allOrders || [],
          totalData: state.abandonedCart.totalData,
          loading: false,
          toast: { message: action?.error?.message || 'Failed to create orders!', variant: 'error' },
        };
      },
    };
  }
  // function deleteorder() {
  //     const { pending, fulfilled, rejected } = extraActions.deleteorder;
  //     return {
  //         [pending]: (state) => {
  //             state.orders = { loading: true, allOrders: state.orders.allOrders || [], totalData: state.orders.totalData, };
  //         },
  //         [fulfilled]: (state, action) => {
  //             const deletedId = action?.meta?.arg;
  //             state.orders = {
  //                 allOrders: state?.orders?.allOrders?.map((item) => item.id === deletedId ? { ...item, valid: !item.valid } : item) || [],
  //                 loading: false,
  //                 totalData: state.orders.totalData,
  //                 toast: { message: 'orders Added Successfully', variant: 'success', },
  //             };
  //         },
  //         [rejected]: (state, action) => {
  //             state.orders = {
  //                 error: action.error.message,
  //                 allOrders: state?.orders?.allOrders,
  //                 loading: false,
  //                 totalData: state.orders.totalData,
  //                 toast: { message: action?.error?.message || 'Failed to create orders!', variant: 'error', },
  //             };
  //         },
  //     };
  // }
  function updateorder() {
    const { pending, fulfilled, rejected } = extraActions.updateorder;
    return {
      [pending]: (state) => {
        state.orders = { loading: true, allOrders: state.orders.allOrders || [] };
      },
      [fulfilled]: (state, action) => {
        state.orders = {
          allOrders: state?.orders?.allOrders?.map((item) =>
            item.id === action.payload?.data?.orderDTO?.id ? { ...item, ...action.payload?.data?.orderDTO } : item
          ),
          loading: false,
          totalData: state.orders.totalData,
          toast: { message: 'orders Updated Successfully', variant: 'success' },
        };
      },
      [rejected]: (state, action) => {
        state.orders = {
          error: action.error.message,
          totalData: state.orders.totalData,
          allOrders: state?.orders?.allOrders,
          loading: false,
          toast: { message: action?.error?.message || 'Failed to create orders!', variant: 'error' },
        };
      },
    };
  }
}

// Reducer

// Actions
