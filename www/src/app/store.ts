import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../services/authApi";
import userSlice from "../features/user/userSlice";
import darkModeSlice from "../features/web/darkMode";

export const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        user: userSlice,
        darkMode: darkModeSlice
    },
    middleware: getDefaultMiddleware => {
        return getDefaultMiddleware().concat(authApi.middleware)
    }
})
