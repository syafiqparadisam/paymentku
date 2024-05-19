import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { User } from "../../types/response";

export const initialState: User= {
    balance: 0,
    email: "",
    user: "",
    name: "",
    photo_public_id: null,
    accountNumber: 0,
    photo_profile: "",
    phoneNumber: "",
    bio: "",
    created_at: ""
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state.balance = action.payload.balance
            state.email = action.payload.email
            state.user = action.payload.user
            state.name = action.payload.name
            state.accountNumber = action.payload.accountNumber
            state.photo_profile = action.payload.photo_profile
            state.bio = action.payload.bio
            state.phoneNumber = action.payload.phoneNumber
            state.created_at = action.payload.created_at
            state.photo_public_id = action.payload.photo_public_id
        }
    }
})

export const { setUser } = userSlice.actions
export default userSlice.reducer
