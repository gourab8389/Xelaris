// import { configureStore } from "@reduxjs/toolkit";
// import { authApi } from "./api/authApi";
// import { projectsApi } from "./api/projectsApi";
// import { uploadsApi } from "./api/uploadsApi";
// import { chartsApi } from "./api/chartsApi";
// import authSlice from "./slices/authSlice";
// import uiSlice from "./slices/uiSlice";

// export const store = configureStore({
//   reducer: {
//     auth: authSlice,
//     ui: uiSlice,
//     [authApi.reducerPath]: authApi.reducer,
//     [projectsApi.reducerPath]: projectsApi.reducer,
//     [uploadsApi.reducerPath]: uploadsApi.reducer,
//     [chartsApi.reducerPath]: chartsApi.reducer,
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
//       },
//     }).concat(
//       authApi.middleware,
//       projectsApi.middleware,
//       uploadsApi.middleware,
//       chartsApi.middleware
//     ),
// });

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;