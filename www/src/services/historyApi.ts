import { excludeRedirectRouteWhenUnauth, route } from "../constant/route";
import {
  HistoryTopUp,
  HistoryTopUps,
  HistoryTransfer,
  HistoryTransfers,
  Response,
} from "../types/response";
import { authApi } from "./authApi";

const historyApi = authApi.injectEndpoints({
  endpoints: (build) => ({
    getHistoryTransfer: build.query<Response<HistoryTransfers[]>, void>({
      query: () => ({
        url: "history/transfer",
        credentials: "include",
      }),
      providesTags: ["historytransfer"],
      transformErrorResponse(baseQueryReturnValue, meta) {
        if (
          (meta?.response?.status === 401 || meta?.response?.status === 403) &&
          !excludeRedirectRouteWhenUnauth.includes(window.location.pathname)
        ) {
          window.location.href =
            import.meta.env.VITE_FRONTEND_URL + route["signin"];
        }
        return baseQueryReturnValue;
      },
    }),
    deleteHistoryTransfer: build.mutation<Response<null>, void>({
      query: () => ({
        url: "history/transfer",
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["historytransfer"],
      transformErrorResponse(baseQueryReturnValue, meta) {
        if (
          (meta?.response?.status === 401 || meta?.response?.status === 403) &&
          !excludeRedirectRouteWhenUnauth.includes(window.location.pathname)
        ) {
          window.location.href =
            import.meta.env.VITE_FRONTEND_URL + route["signin"];
        }

        return baseQueryReturnValue;
      },
    }),
    getHistoryTopUp: build.query<Response<HistoryTopUps[]>, void>({
      query: () => ({
        url: "history/topup",
        credentials: "include",
      }),
      providesTags: ["historytopup"],
      transformErrorResponse(baseQueryReturnValue, meta) {
        if (
          (meta?.response?.status === 401 || meta?.response?.status === 403) &&
          !excludeRedirectRouteWhenUnauth.includes(window.location.pathname)
        ) {
          window.location.href =
            import.meta.env.VITE_FRONTEND_URL + route["signin"];
        }

        return baseQueryReturnValue;
      },
    }),
    deleteHistoryTopUp: build.mutation<Response<null>, void>({
      query: () => ({
        url: "history/topup",
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["historytopup"],
      transformErrorResponse(baseQueryReturnValue, meta) {
        if (
          (meta?.response?.status === 401 || meta?.response?.status === 403) &&
          !excludeRedirectRouteWhenUnauth.includes(window.location.pathname)
        ) {
          window.location.href =
            import.meta.env.VITE_FRONTEND_URL + route["signin"];
        }

        return baseQueryReturnValue;
      },
    }),
    getHistoryTopUpById: build.query<Response<HistoryTopUp>, number>({
      query: (arg) => ({
        url: `history/topup/${arg}`,
        credentials: "include",
      }),
      transformErrorResponse(baseQueryReturnValue, meta) {
        if (
          (meta?.response?.status === 401 || meta?.response?.status === 403) &&
          !excludeRedirectRouteWhenUnauth.includes(window.location.pathname)
        ) {
          window.location.href =
            import.meta.env.VITE_FRONTEND_URL + route["signin"];
        }

        return baseQueryReturnValue;
      },
    }),
    deleteHistoryTopUpById: build.mutation<Response<null>, number>({
      query: (arg) => ({
        url: `history/topup/${arg}`,
        credentials: "include",
        method: "DELETE",
      }),
      invalidatesTags: ["historytopup"],
      transformErrorResponse(baseQueryReturnValue, meta) {
        if (
          (meta?.response?.status === 401 || meta?.response?.status === 403) &&
          !excludeRedirectRouteWhenUnauth.includes(window.location.pathname)
        ) {
          window.location.href =
            import.meta.env.VITE_FRONTEND_URL + route["signin"];
        }

        return baseQueryReturnValue;
      },
    }),
    getHistoryTransferById: build.query<Response<HistoryTransfer>, number>({
      query: (arg) => ({
        url: `history/transfer/${arg}`,
        credentials: "include",
      }),
      transformErrorResponse(baseQueryReturnValue, meta) {
        if (
          (meta?.response?.status === 401 || meta?.response?.status === 403) &&
          !excludeRedirectRouteWhenUnauth.includes(window.location.pathname)
        ) {
          window.location.href =
            import.meta.env.VITE_FRONTEND_URL + route["signin"];
        }
        return baseQueryReturnValue;
      },
    }),
    deleteHistoryTransferById: build.mutation<Response<null>, number>({
      query: (arg) => ({
        url: `history/transfer/${arg}`,
        credentials: "include",
        method: "DELETE",
      }),
      invalidatesTags: ["historytransfer"],
      transformErrorResponse(baseQueryReturnValue, meta) {
        if (
          (meta?.response?.status === 401 || meta?.response?.status === 403) &&
          !excludeRedirectRouteWhenUnauth.includes(window.location.pathname)
        ) {
          window.location.href =
            import.meta.env.VITE_FRONTEND_URL + route["signin"];
        }

        return baseQueryReturnValue;
      },
    }),
  }),
});

export const {
  useGetHistoryTransferQuery,
  useDeleteHistoryTopUpByIdMutation,
  useDeleteHistoryTopUpMutation,
  useDeleteHistoryTransferMutation,
  useDeleteHistoryTransferByIdMutation,
  useGetHistoryTopUpByIdQuery,
  useGetHistoryTopUpQuery,
  useGetHistoryTransferByIdQuery,
} = historyApi;
