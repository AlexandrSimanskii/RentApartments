import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./users/userSlise";

export default configureStore({
  reducer: {
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
