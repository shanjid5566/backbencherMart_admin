import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./apiClient";

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["User", "Product", "Order", "Review", "FAQ", "Analytics"],
  endpoints: (builder) => ({
    // Dashboard
    getDashboardMetrics: builder.query({
      query: () => "/dashboard/metrics",
    }),

    // Users
    getUsers: builder.query({
      query: (params) => ({
        url: "/users",
        params,
      }),
      providesTags: ["User"],
    }),
    getUserById: builder.query({
      query: (id) => `/users/${id}`,
      providesTags: ["User"],
    }),
    createUser: builder.mutation({
      query: (data) => ({
        url: "/users",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),

    // Products
    getProducts: builder.query({
      query: (params) => ({
        url: "/products",
        params,
      }),
      providesTags: ["Product"],
    }),
    getProductById: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: ["Product"],
    }),
    createProduct: builder.mutation({
      query: (data) => ({
        url: "/products",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),

    // Orders
    getOrders: builder.query({
      query: (params) => ({
        url: "/orders",
        params,
      }),
      providesTags: ["Order"],
    }),
    getOrderById: builder.query({
      query: (id) => `/orders/${id}`,
      providesTags: ["Order"],
    }),
    updateOrderStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/orders/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Order"],
    }),

    // Reviews
    getReviews: builder.query({
      query: (params) => ({
        url: "/reviews",
        params,
      }),
      providesTags: ["Review"],
    }),
    deleteReview: builder.mutation({
      query: (id) => ({
        url: `/reviews/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Review"],
    }),

    // FAQs
    getFAQs: builder.query({
      query: (params) => ({
        url: "/faqs",
        params,
      }),
      providesTags: ["FAQ"],
    }),
    createFAQ: builder.mutation({
      query: (data) => ({
        url: "/faqs",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["FAQ"],
    }),
    updateFAQ: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/faqs/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["FAQ"],
    }),
    deleteFAQ: builder.mutation({
      query: (id) => ({
        url: `/faqs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["FAQ"],
    }),

    // Analytics
    getSalesAnalyticsQuery: builder.query({
      query: (params) => ({
        url: "/analytics/sales",
        params,
      }),
      providesTags: ["Analytics"],
    }),
    getProductAnalyticsQuery: builder.query({
      query: () => "/analytics/products",
      providesTags: ["Analytics"],
    }),
  }),
});

export const {
  useGetDashboardMetricsQuery,
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
  useGetReviewsQuery,
  useDeleteReviewMutation,
  useGetFAQsQuery,
  useCreateFAQMutation,
  useUpdateFAQMutation,
  useDeleteFAQMutation,
  useGetSalesAnalyticsQuery,
  useGetProductAnalyticsQuery,
} = adminApi;
