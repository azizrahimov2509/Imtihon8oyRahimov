import { configureStore } from "@reduxjs/toolkit";
import darkModeReducer from "../DarkModeSlice";
import cartReducer from "../cartSlice";

const store = configureStore({
  reducer: {
    darkMode: darkModeReducer,
    cart: cartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
