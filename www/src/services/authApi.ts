import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ForgotPassword, Profile, SendEmail, SignInInput, SignUpInput, VerifyPassword } from "../types/dto";
import { Response } from "../types/response";


export const authApi = createApi({
    reducerPath: "authApi",

    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL,
        credentials: "include",
        prepareHeaders: (headers: Headers) => {
            return headers
        }
    }),
    tagTypes: ["user", "historytransfer", "historytopup"],
    endpoints: builder => ({
        signUp: builder.mutation<Response<null>, SignUpInput>({
            query: (user) => ({
                method: "POST",
                url: "register",
                body: user,
            }),
            transformErrorResponse(baseQueryReturnValue) {
                if (baseQueryReturnValue.status == "FETCH_ERROR") {
                    window.location.href = import.meta.env.VITE_FRONTEND_URL
                }
                return baseQueryReturnValue
            },
            invalidatesTags: ["user", "historytopup", "historytransfer"],
        }),
        signIn: builder.mutation<Response<null>, SignInInput>({
            query: (user) => ({
                method: "POST",
                url: "login",
                body: user
            }),
            invalidatesTags: ["user", "historytopup", "historytransfer"],
            transformErrorResponse(baseQueryReturnValue, meta) {
                if (baseQueryReturnValue.status == "FETCH_ERROR") {
                    window.location.href = import.meta.env.VITE_FRONTEND_URL
                }
                return baseQueryReturnValue
            },
        }),
        logout: builder.mutation<Response<null>, void>({
            query: () => ({
                url: "logout",
                method: "DELETE"
            }),
            transformErrorResponse(baseQueryReturnValue, meta) {
                if (meta?.response?.status === 401 || meta?.response?.status == 403) {
                    window.location.href = import.meta.env.VITE_FRONTEND_URL + "/signin"
                }
                if (baseQueryReturnValue.status == "FETCH_ERROR") {
                    window.location.href = import.meta.env.VITE_FRONTEND_URL
                }
                return baseQueryReturnValue

            },
            invalidatesTags: ["user", "historytopup", "historytransfer"],
        }),
        deleteAccount: builder.mutation<Response<null>, VerifyPassword>({
            query: (data) => ({
                url: "user",
                method: "DELETE",
                body: {
                    password: data.password
                }
            }),
            transformErrorResponse(baseQueryReturnValue, meta) {
                if (meta?.response?.status === 401 || meta?.response?.status == 403) {
                    window.location.href = import.meta.env.VITE_FRONTEND_URL + "/signin"
                }
                if (baseQueryReturnValue.status == "FETCH_ERROR") {
                    window.location.href = import.meta.env.VITE_FRONTEND_URL
                }
                return baseQueryReturnValue

            },
            invalidatesTags: ["user", "historytopup", "historytransfer"]
        }),
        sendEmailForgotPassword: builder.mutation<Response<null>, SendEmail>({
            query: data => ({
                url: `confirm/passwordReset`,
                method: "POST",
                credentials: "include",
                body: {
                    email: data.email
                }
            }),
            transformErrorResponse(baseQueryReturnValue, meta) {
                if (baseQueryReturnValue.status == "FETCH_ERROR") {
                    window.location.href = import.meta.env.VITE_FRONTEND_URL
                }
                return baseQueryReturnValue
            },
        }),
        updateUsername: builder.mutation<Response<null>, Pick<Profile, "username" | "password">>({
            query: data => ({
                url: "/username",
                method: "PATCH",
                body: {
                    username: data.username,
                    password: data.password
                }
            }),
            invalidatesTags: ["user"],
            transformErrorResponse(baseQueryReturnValue, meta) {
                if (meta?.response?.status === 401 || meta?.response?.status == 403) {
                    window.location.href = import.meta.env.VITE_FRONTEND_URL + "/signin"
                }
                if (baseQueryReturnValue.status == "FETCH_ERROR") {
                    window.location.href = import.meta.env.VITE_FRONTEND_URL
                }
                return baseQueryReturnValue

            },
        }),
        passwordReset: builder.mutation<Response<null>, ForgotPassword>({
            query: (data) => ({
                method: "PUT",
                url: `passwordChange?token=${data.token}`,
                body: {
                    password: data.password,
                    confirmPassword: data.confirmPassword
                }
            }),
            invalidatesTags: ["user"],
            transformErrorResponse(baseQueryReturnValue, meta) {
                if (baseQueryReturnValue.status == "FETCH_ERROR") {
                    window.location.href = import.meta.env.VITE_FRONTEND_URL
                }
                return baseQueryReturnValue
            },
        })
    }),
})

export const { useSignUpMutation, useSignInMutation, usePasswordResetMutation, useSendEmailForgotPasswordMutation, useUpdateUsernameMutation, useLogoutMutation, useDeleteAccountMutation } = authApi