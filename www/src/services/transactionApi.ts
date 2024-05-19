import { TopUp, Transfer } from "../types/dto";
import { Response } from "../types/response";
import { authApi } from "./authApi";

const transactionApi = authApi.injectEndpoints({
    endpoints: builder => ({
        topup: builder.mutation<Response<string>, TopUp>({
            query: (arg) => ({
                method: "POST",
                url: "transaction/topup",
                body: arg
            }),
            invalidatesTags: ["historytopup", "user"],
            transformErrorResponse(baseQueryReturnValue, meta) {
                if (meta?.response?.status === 401 || meta?.response?.status == 403) {
                    window.location.href = import.meta.env.VITE_FRONTEND_URL + "/signin"
                }
                if (meta?.response?.status === 500) {
                    window.location.href = import.meta.env.VITE_FRONTEND_URL + "/maintenance"
                }
                if (baseQueryReturnValue.status == "FETCH_ERROR") {
                    window.location.href = import.meta.env.VITE_FRONTEND_URL
                }
                return baseQueryReturnValue

            },
        }),
        transfer: builder.mutation<Response<string>, Transfer>({
            query: (arg) => ({
                url: "transaction/transfer",
                method: "POST",
                body: arg
            }),
            invalidatesTags: ["historytransfer", "user"],
            transformErrorResponse(baseQueryReturnValue, meta) {
                if (meta?.response?.status === 401 || meta?.response?.status == 403) {
                    window.location.href = import.meta.env.VITE_FRONTEND_URL + "/signin"
                }
                if (meta?.response?.status === 500) {
                    window.location.href = import.meta.env.VITE_FRONTEND_URL + "/maintenance"
                }
                if (baseQueryReturnValue.status == "FETCH_ERROR") {
                    window.location.href = import.meta.env.VITE_FRONTEND_URL
                }
                return baseQueryReturnValue

            },
        }),
    })
})

export const { useTopupMutation, useTransferMutation } = transactionApi