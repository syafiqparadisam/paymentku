import { createSlice } from "@reduxjs/toolkit";

type state = {
    isDark: boolean
}

const initialState: state = {
    isDark: false
}

const darkModeSlice = createSlice({
    name: "darkMode",
    initialState,
    reducers: {
        setDarkMode(state, action) {
            state.isDark = action.payload
        }
    }
})

export const { setDarkMode } = darkModeSlice.actions
export default darkModeSlice.reducer