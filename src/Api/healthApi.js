import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const healthApi = createApi({
  reducerPath: "healthApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/health",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Health"],
  endpoints: (builder) => ({

    createAssessment: builder.mutation({
      query: (body) => ({
        url: "/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Health"],
    }),

    getLatestProfile: builder.query({
      query: () => "/latest",
      providesTags: ["Health"],
    }),

    getHistory: builder.query({
      query: ({ page = 1, limit = 10 } = {}) =>
        `/history?page=${page}&limit=${limit}`,
      providesTags: ["Health"],
    }),

    getProfileById: builder.query({
      query: (id) => `/${id}`,
      providesTags: ["Health"],
    }),

  }),
});

export const {
  useCreateAssessmentMutation,
  useGetLatestProfileQuery,
  useGetHistoryQuery,
  useGetProfileByIdQuery,
} = healthApi;