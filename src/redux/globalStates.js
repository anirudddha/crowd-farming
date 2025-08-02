import { createSlice, configureStore } from '@reduxjs/toolkit';

const endpoint = createSlice({
    name: 'endpoint',
    initialState: {
        endpoint: 'https://crowd-farming-backend.onrender.com/api',
        // endpoint: 'http://localhost:5000/api',
    },
    reducers: {

    }
})

const cartNumber = createSlice({
    name: "cartNumber",
    initialState: {
        count: 0
    },
    reducers: {
        increase: (state) => {
            state.count++;
        },
        setNumber: (state, action) => {
            state.count = action.payload;
        },
        decrease: (state) => {
            state.count--;
        }
    }

})
export const { increase, setNumber, decrease } = cartNumber.actions;

const store = configureStore({
    reducer: {
        endpoint: endpoint.reducer,
        cartCount: cartNumber.reducer
    }
})

export default store;