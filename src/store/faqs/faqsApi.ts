import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../api/apiClient";

export const faqsApi = createApi({
  reducerPath: "faqsApi",
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    getFaqs: builder.query({
      query: (productId) => ({
        url: `/faqs/${productId}`,
      }),
    }),
    createFaq: builder.mutation({
      query: ({ productId, ...data }) => ({
        url: `/faqs/${productId}`,
        method: "POST",
        body: data,
      }),
    }),
    updateFaq: builder.mutation({
      query: ({ faqId, ...data }) => ({
        url: `/faqs/${faqId}`,
        method: "PATCH",
        body: data,
      }),
    }),
    deleteFaq: builder.mutation({
      query: (faqId) => ({
        url: `/faqs/${faqId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetFaqsQuery,
  useCreateFaqMutation,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
} = faqsApi;
