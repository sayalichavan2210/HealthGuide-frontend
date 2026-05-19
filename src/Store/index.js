import { configureStore } from "@reduxjs/toolkit";
import authReducer          from "../Slice/authSlice";
import { authApi }          from "../Api/authApi";
import { healthApi }        from "@/Api/healthApi";

export const store = configureStore({
  reducer: {
    auth:                  authReducer,
    [authApi.reducerPath]:   authApi.reducer,
    [healthApi.reducerPath]: healthApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(healthApi.middleware),
});

export default store;