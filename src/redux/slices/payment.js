import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { HOST_API } from '../../config';
import axios from 'axios';

const name = 'Payment';
const initialState = {
    isLoading: true,
    paymentLoading: false,
    priceDetails: {},
    orderDetails: {},
    paymentIntent: null,
};

// For Actions
function getPrice() {
    return createAsyncThunk(`${name}/getPrice`, async (obj) => {
        try {
            const response = await axios.get(HOST_API.concat(`/coupon/amount`), {
                params: { eventId: obj.eventId, numberOfParticipants: obj.attendees, currencyId: obj.currencyId, couponCode: obj.coupon }
            });
            return response.data;
        } catch (err) {
            return err;
        }

    })
}

function createOrder() {
    return createAsyncThunk(`${name}/createOrder`, async (obj) => {
        try {
            const response = await axios.post(HOST_API.concat(`/order/create`), obj);
            return response;
        } catch (err) {
            return err;
        }

    })
}

function createWaitlistOrder() {
    return createAsyncThunk(`${name}/createWaitlistOrder`, async (obj) => {
        try {
            const response = await axios.post(HOST_API.concat(`/order/registerWaitList`), obj);
            return response;
        } catch (err) {
            return err;
        }
    })
}

function updateBuyer() {
    return createAsyncThunk(`${name}/updateBuyer`, async ({ values, orderId }) => {
        try {
            const response = await axios.put(HOST_API.concat(`/order/updateBuyer/${orderId}`), values);
            return response;
        } catch (err) {
            return err;
        }

    })
}

function getClientSecret() {
    return createAsyncThunk(`${name}/getClientSecret`, async (obj) => {
        try {
            const response = await axios.get(HOST_API.concat(`/payment/clintSecret`), {
                params: obj
            });
            return response.data;
        } catch (err) {
            return err;
        }

    })
}

function getOrder() {
    return createAsyncThunk(`${name}/getOrder`, async (transId) => {
        try {
            const response = await axios.get(HOST_API.concat(`/payment/afterPayment`), {
                params: { transactionId: transId }
            });
            return response.data;
        } catch (err) {
            return err;
        }

    })
}

function updateOrder() {
    return createAsyncThunk(`${name}/updateOrder`, async ({ formData, orderId }) => {
        try {
            const response = await axios.put(HOST_API.concat(`/order/update/${orderId}`), formData);
            return response;
        } catch (err) {
            return err;
        }

    })
}

function capturePaypal() {
    return createAsyncThunk(`${name}/capturePaypal`, async (transId) => {
        try {
            const response = await axios.post(HOST_API.concat(`/payment/captureOrder`), {}, {
                params: { transactionId: transId }
            });
            return response.data;
        } catch (err) {
            return err;
        }

    })
}

function confirmIntent() {
    return createAsyncThunk(`${name}/confirmIntent`, async (paymentIntent) => {
        try {
            const response = await axios.post(HOST_API.concat(`/payment/confirm-payment-intent`), {}, {
                params: { intentId: paymentIntent }
            });
            return response.data;
        } catch (err) {
            return err;
        }

    })
}

function initiatePaymentIntent() {
    return createAsyncThunk(`${name}/initiatePaymentIntent`, async (obj) => {
        try {
            const response = await axios.post(HOST_API.concat(`/payment/create-payment-intent`), {}, {
                params: obj
            });
            return response.data;
        } catch (err) {
            return err;
        }

    })
}

function sendEmail() {
    return createAsyncThunk(`${name}/sendEmail`, async (id) => {
        try {
            const response = await axios.post(HOST_API.concat(`/email/abandonedCart`), {}, {
                params: { orderId: id }
            })
            return response.data;
        } catch (err) {
            return err;
        }
    })
}



const createExtraActions = () => ({
    createOrder: createOrder(),
    createWaitlistOrder: createWaitlistOrder(),
    getPrice: getPrice(),
    capturePaypal: capturePaypal(),
    getOrder: getOrder(),
    getClientSecret: getClientSecret(),
    confirmIntent: confirmIntent(),
    updateBuyer: updateBuyer(),
    initiatePaymentIntent: initiatePaymentIntent(),
    updateOrder: updateOrder(),
    sendEmail: sendEmail(),
});

const extraActions = createExtraActions();

const createExtraReducers = () => {
    function getPrice() {
        const { fulfilled, pending, rejected } = extraActions.getPrice;
        return {
            [pending]: (state) => {
                state.isLoading = true;
            },
            [fulfilled]: (state, actions) => {
                state.priceDetails = actions.payload;
                state.isLoading = false;
            },
            [rejected]: (state, actions) => {
                state.isLoading = false;
            },
        };
    }

    function getOrder() {
        const { fulfilled, pending, rejected } = extraActions.getOrder;
        return {
            [pending]: (state) => {
                state.isLoading = true;
            },
            [fulfilled]: (state, actions) => {
                state.orderDetails = actions.payload;
                state.isLoading = false;
            },
            [rejected]: (state, actions) => {
                state.isLoading = false;
            },
        };
    }

    function getClientSecret() {
        const { fulfilled, pending, rejected } = extraActions.getClientSecret;
        return {
            [pending]: (state) => {
                state.paymentLoading = true;
            },
            [fulfilled]: (state, actions) => {
                state.paymentLoading = false;
                state.paymentIntent = actions.payload.transactionId;
            },
            [rejected]: (state, actions) => {
                state.paymentLoading = false;
            },
        };
    }

    function capturePaypal() {
        const { fulfilled, pending, rejected } = extraActions.capturePaypal;
        return {
            [pending]: (state) => {
                state.paymentLoading = true;
            },
            [fulfilled]: (state, actions) => {
                state.paymentLoading = false;
            },
            [rejected]: (state, actions) => {
                state.paymentLoading = false;
            },
        };
    }

    function confirmIntent() {
        const { fulfilled, pending, rejected } = extraActions.confirmIntent;
        return {
            [pending]: (state) => {
                state.paymentLoading = true;
            },
            [fulfilled]: (state, actions) => {
                state.paymentLoading = false;
            },
            [rejected]: (state, actions) => {
                state.paymentLoading = false;
            },
        };
    }

    function updateOrder() {
        const { fulfilled, pending, rejected } = extraActions.updateOrder;
        return {
            [pending]: (state) => {
                // state.paymentLoading = true;
            },
            [fulfilled]: (state, action) => {
                state.orderDetails = { ...state.orderDetails, orderParticipantDTOS: action?.payload?.data?.orderDTO?.orderParticipants }
                state.paymentLoading = false;
            },
            [rejected]: (state, actions) => {
                state.paymentLoading = false;
            },
        };
    }

    return {
        ...getPrice(),
        ...getOrder(),
        ...getClientSecret(),
        ...capturePaypal(),
        ...confirmIntent(),
        ...updateOrder()
    };
};

const extraReducers = createExtraReducers();

const slice = createSlice({
    name,
    initialState,
    extraReducers,
});

export const PaymentActions = { ...extraActions, ...slice.actions };
export default slice.reducer;
