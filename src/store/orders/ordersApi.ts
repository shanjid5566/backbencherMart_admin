import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../api/apiClient";

export const ordersApi = createApi({
  reducerPath: "ordersApi",
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: (params) => ({
        url: "/admin/orders",
        params,
      }),
    }),
    updateOrderStatus: builder.mutation({
      query: ({ orderId, status }) => ({
        url: `/admin/orders/${orderId}/status`,
        method: "PATCH",
        body: { status },
      }),
    }),
  }),
});

export const { useGetOrdersQuery, useUpdateOrderStatusMutation } = ordersApi;
