import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import themeReducer from "./slices/themeSlice";
import uiReducer from "./slices/uiSlice";
import { authApi } from "./auth/authApi";
import { usersApi } from "./users/usersApi";
import { productsApi } from "./products/productsApi";
import { ordersApi } from "./orders/ordersApi";
import { reviewsApi } from "./reviews/reviewsApi";
import { faqsApi } from "./faqs/faqsApi";
import { analyticsApi } from "./analytics/analyticsApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    ui: uiReducer,
    [authApi.reducerPath]: authApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [productsApi.reducerPath]: productsApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
    [reviewsApi.reducerPath]: reviewsApi.reducer,
    [faqsApi.reducerPath]: faqsApi.reducer,
    [analyticsApi.reducerPath]: analyticsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      usersApi.middleware,
      productsApi.middleware,
      ordersApi.middleware,
      reviewsApi.middleware,
      faqsApi.middleware,
      analyticsApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
