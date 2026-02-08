import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../api/apiClient";

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (params) => ({
        url: "/products",
        params,
      }),
    }),
    createProduct: builder.mutation({
      query: (data) => ({
        url: "/admin/products",
        method: "POST",
        body: data,
      }),
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/admin/products/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/admin/products/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;
