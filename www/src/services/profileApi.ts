import { authApi } from "./authApi";
import { Profile } from "../types/dto";
import { FindUserByAccount, Response, User } from "../types/response";
import { excludeRedirectRouteWhenUnauth, route } from "../constant/route";

const profileApi = authApi.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query<Response<User>, void>({
      query: () => ({
        url: "profile/",
      }),
      providesTags: ["user"],
      transformErrorResponse(baseQueryReturnValue, meta) {
        if (
          (meta?.response?.status === 401 || meta?.response?.status === 403) &&
          !excludeRedirectRouteWhenUnauth.includes(window.location.pathname)
        ) {
          window.location.href =
            import.meta.env.VITE_FRONTEND_URL + route["signin"];
        }
        if (
          (baseQueryReturnValue.status == "FETCH_ERROR" ||
            meta?.response?.status === 500) &&
          window.location.pathname != route["maintenance"]
        ) {
          window.location.href =
            import.meta.env.VITE_FRONTEND_URL + route["maintenance"];
        }
        return baseQueryReturnValue;
      },
    }),
    updateName: builder.mutation<Response<string>, Pick<Profile, "name">>({
      query: (rg) => ({
        url: "profile/name",
        method: "PATCH",
        body: {
          name: rg.name,
        },
      }),
      invalidatesTags: ["user"],
      transformErrorResponse(baseQueryReturnValue, meta) {
        if (
          (meta?.response?.status === 401 || meta?.response?.status === 403) &&
          !excludeRedirectRouteWhenUnauth.includes(window.location.pathname)
        ) {
          window.location.href =
            import.meta.env.VITE_FRONTEND_URL + route["signin"];
        }
        if (
          (baseQueryReturnValue.status == "FETCH_ERROR" ||
            meta?.response?.status === 500) &&
          window.location.pathname != route["maintenance"]
        ) {
          window.location.href =
            import.meta.env.VITE_FRONTEND_URL + route["maintenance"];
        }
        return baseQueryReturnValue;
      },
    }),
    updateBio: builder.mutation<Response<null>, Pick<Profile, "bio">>({
      query: (rg) => ({
        url: "profile/bio",
        method: "PATCH",
        body: {
          bio: rg.bio,
        },
      }),
      invalidatesTags: ["user"],
      transformErrorResponse(baseQueryReturnValue, meta) {
        if (
          (meta?.response?.status === 401 || meta?.response?.status === 403) &&
          !excludeRedirectRouteWhenUnauth.includes(window.location.pathname)
        ) {
          window.location.href =
            import.meta.env.VITE_FRONTEND_URL + route["signin"];
        }
        if (
          (baseQueryReturnValue.status == "FETCH_ERROR" ||
            meta?.response?.status === 500) &&
          window.location.pathname != route["maintenance"]
        ) {
          window.location.href =
            import.meta.env.VITE_FRONTEND_URL + route["maintenance"];
        }
        return baseQueryReturnValue;
      },
    }),
    updatePhone: builder.mutation<Response<null>, Pick<Profile, "phoneNumber">>(
      {
        query: (rg) => ({
          url: "profile/phonenumber",
          method: "PATCH",
          body: {
            phone_number: rg.phoneNumber,
          },
        }),
        invalidatesTags: ["user"],
        transformErrorResponse(baseQueryReturnValue, meta) {
          if (
            (meta?.response?.status === 401 ||
              meta?.response?.status === 403) &&
            !excludeRedirectRouteWhenUnauth.includes(window.location.pathname)
          ) {
            window.location.href =
              import.meta.env.VITE_FRONTEND_URL + route["signin"];
          }
          if (
            (baseQueryReturnValue.status == "FETCH_ERROR" ||
              meta?.response?.status === 500) &&
            window.location.pathname != route["maintenance"]
          ) {
            window.location.href =
              import.meta.env.VITE_FRONTEND_URL + route["maintenance"];
          }
          return baseQueryReturnValue;
        },
      }
    ),
    updatePhotoProfile: builder.mutation<
      Response<null>,
      { file: File | undefined; publicId: string }
    >({
      query: (payload) => {
        const file = new FormData();
        file.append("image", payload?.file ? payload?.file : "");
        return {
          url: "profile/photoprofile",
          method: "PATCH",
          body: file,
          headers: {
            "x-data-publicid": payload.publicId,
          },
          timeout: 1000 * 20,
        };
      },
      invalidatesTags: ["user"],
      transformErrorResponse(baseQueryReturnValue, meta) {
        if (
          (meta?.response?.status === 401 || meta?.response?.status === 403) &&
          !excludeRedirectRouteWhenUnauth.includes(window.location.pathname)
        ) {
          window.location.href =
            import.meta.env.VITE_FRONTEND_URL + route["signin"];
        }
        if (
          (baseQueryReturnValue.status == "FETCH_ERROR" ||
            meta?.response?.status === 500) &&
          window.location.pathname != route["maintenance"]
        ) {
          window.location.href =
            import.meta.env.VITE_FRONTEND_URL + route["maintenance"];
        }
        return baseQueryReturnValue;
      },
    }),
    findAccount: builder.mutation<
      Response<FindUserByAccount>,
      { accNum: number }
    >({
      query: (arg) => ({
        url: `profile?accountNumber=${arg.accNum}`,
        method: "GET",
      }),
      transformErrorResponse(baseQueryReturnValue, meta) {
        if (
          (meta?.response?.status === 401 || meta?.response?.status === 403) &&
          !excludeRedirectRouteWhenUnauth.includes(window.location.pathname)
        ) {
          window.location.href =
            import.meta.env.VITE_FRONTEND_URL + route["signin"];
        }
        if (
          (baseQueryReturnValue.status == "FETCH_ERROR" ||
            meta?.response?.status === 500) &&
          window.location.pathname != route["maintenance"]
        ) {
          window.location.href =
            import.meta.env.VITE_FRONTEND_URL + route["maintenance"];
        }
        return baseQueryReturnValue;
      },
    }),
    updateUsername: builder.mutation<
      Response<null>,
      Pick<Profile, "username" | "password">
    >({
      query: (data) => ({
        url: "/username",
        method: "PATCH",
        body: {
          username: data.username,
          password: data.password,
        },
      }),
      invalidatesTags: ["user"],
      transformErrorResponse(baseQueryReturnValue, meta) {
        if (
          (meta?.response?.status === 401 || meta?.response?.status === 403) &&
          !excludeRedirectRouteWhenUnauth.includes(window.location.pathname)
        ) {
          window.location.href =
            import.meta.env.VITE_FRONTEND_URL + route["signin"];
        }
        if (
          (baseQueryReturnValue.status == "FETCH_ERROR" ||
            meta?.response?.status === 500) &&
          window.location.pathname != route["maintenance"]
        ) {
          window.location.href =
            import.meta.env.VITE_FRONTEND_URL + route["maintenance"];
        }
        return baseQueryReturnValue;
        return baseQueryReturnValue;
      },
    }),
  }),
});

export const {
  useGetUserQuery,
  useUpdateBioMutation,
  useUpdateNameMutation,
  useUpdatePhoneMutation,
  useUpdatePhotoProfileMutation,
  useFindAccountMutation,
  useUpdateUsernameMutation,
} = profileApi;
