import {createSlice,configureStore } from '@reduxjs/toolkit';

const endpoint = createSlice({
    name: 'endpoint',
    initialState: {
        endpoint: 'http://localhost:5000/api',
    },
    reducers: {

    }
})

const store = configureStore({
    reducer: {
        endpoint: endpoint.reducer,
    }
})

export default store;