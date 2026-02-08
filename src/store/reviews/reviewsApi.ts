import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../api/apiClient";

export const reviewsApi = createApi({
  reducerPath: "reviewsApi",
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    getReviews: builder.query({
      query: (params) => ({
        url: "/admin/reviews",
        params,
      }),
    }),
    deleteReview: builder.mutation({
      query: (id) => ({
        url: `/admin/reviews/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const { useGetReviewsQuery, useDeleteReviewMutation } = reviewsApi;
