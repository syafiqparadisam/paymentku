import { authApi } from "./authApi";
import { Profile } from '../types/dto';
import { FindUserByAccount, Response, User } from "../types/response";

const profileApi = authApi.injectEndpoints({
    endpoints: (builder) => ({
        getUser: builder.query<Response<User>, void>({
            query: () => ({
                url: "profile/",
            }),
            providesTags: ["user"],
            transformErrorResponse(baseQueryReturnValue, meta) {
                if (meta?.response?.status === 401 || meta?.response?.status === 403) {
                    window.location.href = import.meta.env.VITE_FRONTEND_URL + "/signin"   
                }
                if (baseQueryReturnValue.status == "FETCH_ERROR") {
                    window.location.href = import.meta.env.VITE_FRONTEND_URL
                }
                return baseQueryReturnValue

            },
        }),
        updateName: builder.mutation<Response<string>, Pick<Profile, "name">>({
            query: (rg) => ({
                url: "profile/name",
                method: "PATCH",
                body: {
                    name: rg.name
                },

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
        updateBio: builder.mutation<Response<null>, Pick<Profile, "bio">>({
            query: (rg) => ({
                url: "profile/bio",
                method: "PATCH",
                body: {
                    bio: rg.bio
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
        updatePhone: builder.mutation<Response<null>, Pick<Profile, "phoneNumber">>({
            query: (rg) => ({
                url: "profile/phoneNumber",
                method: "PATCH",
                body: {
                    phoneNumber: rg.phoneNumber
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
        updatePhotoProfile: builder.mutation<Response<null>, { file: File, publicId: string }>({
            query: (payload) => {
                const file = new FormData()
                file.append("image", payload.file)
                return {
                    url: "profile/photoprofile",
                    method: "PATCH",
                    body: file,
                    headers: {
                        'x-data-publicid': payload.publicId
                    },
                    // timeout: 1000 * 20
                }
            },
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
        findAccount: builder.mutation<Response<FindUserByAccount>, { accountNumber: number }>({
            query: arg => ({
                url: `profile/accountNumber`,
                method: "POST",
                headers: {
                },
                body: {
                    accountNumber: arg.accountNumber
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
        }),
    }),

})

export const { useGetUserQuery, useUpdateBioMutation, useUpdateNameMutation, useUpdatePhoneMutation, useUpdatePhotoProfileMutation, useFindAccountMutation } = profileApi