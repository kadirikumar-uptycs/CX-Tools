import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import authReducer from "./authSlice";
import migrationSlice from "./migrationSlice";

const store = configureStore({
    reducer: {
        user: userReducer,
        auth: authReducer,
        migration: migrationSlice,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    })
})

export default store;