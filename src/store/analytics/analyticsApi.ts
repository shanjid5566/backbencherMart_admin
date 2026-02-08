import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../api/apiClient";

export const analyticsApi = createApi({
  reducerPath: "analyticsApi",
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    getMonthlyRevenue: builder.query({
      query: (months = 12) => ({
        url: "/admin/analytics/monthly-revenue",
        params: { months },
      }),
    }),
    getSalesByCategory: builder.query({
      query: () => ({
        url: "/admin/analytics/sales-by-category",
      }),
    }),
    getBusinessMetrics: builder.query({
      query: () => ({
        url: "/admin/analytics/business-metrics",
      }),
    }),
  }),
});

export const {
  useGetMonthlyRevenueQuery,
  useGetSalesByCategoryQuery,
  useGetBusinessMetricsQuery,
} = analyticsApi;
