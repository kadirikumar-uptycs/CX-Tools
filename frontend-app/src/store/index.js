import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import authReducer from "./authSlice";
import migrationSlice from "./migrationSlice";
import updationSlice from './updationSlice';

const store = configureStore({
    reducer: {
        user: userReducer,
        auth: authReducer,
        migration: migrationSlice,
        updation: updationSlice,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    })
})

export default store;