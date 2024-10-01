import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import config from "../config";

const initialState = {
    source: {
        fileName: 'Source Tenant',
        credentials: {},
        loading: false,
        data: [],
        error: '',
        noData: false
    },
    target: {
        fileName: 'Target Tenant',
        credentials: {},
        loading: false,
        data: [],
        error: '',
        noData: false
    },
    migrationResourceIds: [],
    migrating: false,
    migrationErrors: {},
    resource: 'flagProfiles',
    success: false,
}


const fetchResources = createAsyncThunk('updation/fetchSourceResources', async (type, { getState, rejectWithValue }) => {
    const resource = getState().migration?.resource;
    const state = getState().migration[type];
    try {
        const response = await axios.post(`${config.SERVER_BASE_ADDRESS}/getResources/${resource}`, { credentials: state?.credentials }, { withCredentials: true });
        return response.data;
    } catch (error) {
        if (error.response?.status === 401) {
            window.location.replace('/login');
        }
        return rejectWithValue(error);
    }
});


const updationSlice = createSlice({
    name: 'Updation',
    initialState: initialState,
    reducers: {
        setCredentials: (state, action) => {
            let type = action?.payload?.type;
            state[type].credentials = action?.payload?.credentials;
            state[type].fileName = action?.payload?.fileName;
        },
        setResourceType: (state, action) => {
            state.resource = action.payload;
        },
        pushMigrationResourceId: (state, action) => {
            state.migrationResourceIds = [...state.migrationResourceIds, action.payload]
        },
        popMigrationResourceId: (state, action) => {
            state.migrationResourceIds = state.migrationResourceIds.filter(resourceId => resourceId !== action?.payload);
        },
        clearMigrationIds: (state) => {
            state.migrationResourceIds = [];
        },
        RESET: () => initialState
    },
    extraReducers: builder => {
        builder.addCase(fetchResources.pending, (state, action) => {
            const type = action.meta.arg;
            state[type].loading = true;
            state[type].noData = false;
            state.migrationErrors = {};
            state.migrationResourceIds = [];
            state.success = false;
        });
        builder.addCase(fetchResources.fulfilled, (state, action) => {
            const type = action.meta.arg;
            state[type].loading = false;
            state[type].error = '';
            state[type].data = action.payload;
            if (Array.isArray(action.payload) && !action.payload.length) {
                state[type].noData = true;
            }
        });
        builder.addCase(fetchResources.rejected, (state, action) => {
            const type = action.meta.arg;
            console.log(action);
            state[type].loading = false;
            state[type].data = [];
            state[type].error = action?.payload?.response?.data?.message?.detail
                || action?.payload?.response?.data?.message
                || action?.payload?.message;
        });
    },
});

export default updationSlice.reducer;
export const {
    setCredentials,
    setResourceType,
    pushMigrationResourceId,
    popMigrationResourceId,
    clearMigrationIds,
    RESET,
} = updationSlice.actions;
export { fetchResources };