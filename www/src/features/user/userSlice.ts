import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { User } from "../../types/response";

export const initialState: User = {
  balance: "0",
  email: "",
  user: "",
  name: "",
  photo_public_id: null,
  accountNumber: 0,
  photo_profile: "",
  phone_number: "",
  bio: "",
  created_at: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.balance = action.payload.balance;
      state.email = action.payload.email;
      state.user = action.payload.user;
      state.name = action.payload.name;
      state.accountNumber = action.payload.accountNumber;
      state.photo_profile = action.payload.photo_profile;
      state.bio = action.payload.bio;
      state.phone_number = action.payload.phone_number;
      state.created_at = action.payload.created_at;
      state.photo_public_id = action.payload.photo_public_id;
    },
    setBio: (state, action: PayloadAction<Pick<User, "bio">>) => {
      state.bio = action.payload.bio;
    },
    setPhoneNumber: (
      state,
      action: PayloadAction<Pick<User, "phone_number">>
    ) => {
      state.phone_number = action.payload.phone_number;
    },
  },
});

export const { setUser, setBio, setPhoneNumber } = userSlice.actions;
export default userSlice.reducer;
