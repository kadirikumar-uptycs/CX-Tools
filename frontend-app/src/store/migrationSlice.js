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


const fetchResources = createAsyncThunk('migration/fetchSourceResources', async (type, { getState, rejectWithValue }) => {
    const resource = getState().migration?.resource;
    const state = getState().migration[type];
    try {
        const response = await axios.post(`${config.SERVER_BASE_ADDRESS}/getResources/${resource}`, { credentials: state?.credentials }, { withCredentials: true });
        return response.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});


const migrateResources = createAsyncThunk('migration/migrateResources', async (_, { getState, rejectWithValue, dispatch }) => {
    const resource = getState().migration?.resource;
    const { source, target, migrationResourceIds } = getState().migration;
    const payload = {
        sourceCredentials: source?.credentials,
        targetCredentials: target?.credentials,
        resources: source?.data?.filter(resource => migrationResourceIds.includes(resource?.id)),
    }
    try {
        const response = await axios.post(`${config.SERVER_BASE_ADDRESS}/migrateResources/${resource}`, payload, { withCredentials: true });
        // Reload Target Resources
        dispatch(fetchResources('target'));
        return response.data;
    } catch (error) {
        let errorDetails = error?.response?.data?.details;
        let { failed, total } = errorDetails || {};
        if (total && failed < total) {
            // Reload Target Resources after partial success
            dispatch(fetchResources('target'));
        }
        return rejectWithValue(error);
    }
});


const migrationSlice = createSlice({
    name: 'Migration',
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
        builder.addCase(migrateResources.pending, state => {
            state.migrating = true;
            state.migrationErrors = {};
            state.success = false;
        });
        builder.addCase(migrateResources.fulfilled, (state) => {
            state.migrating = false;
            state.success = true;
            state.migrationResourceIds = [];
        });
        builder.addCase(migrateResources.rejected, (state, action) => {
            state.migrating = false;
            state.migrationResourceIds = [];
            state.migrationErrors = action?.payload?.response?.data?.details
                || action?.payload?.message || {};
        });
    },
});

export default migrationSlice.reducer;
export const {
    setCredentials,
    setResourceType,
    pushMigrationResourceId,
    popMigrationResourceId,
    clearMigrationIds,
    RESET,
} = migrationSlice.actions;
export { fetchResources, migrateResources };