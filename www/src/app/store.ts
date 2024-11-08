import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../services/authApi";
import userSlice from "../features/user/userSlice";
import darkModeSlice from "../features/web/darkMode";

const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        user: userSlice,
        darkMode: darkModeSlice
    },
    middleware: getDefaultMiddleware => {
        return getDefaultMiddleware().concat(authApi.middleware)
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store