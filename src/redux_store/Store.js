import { configureStore } from "@reduxjs/toolkit";
import coinReducer from "../redux_store/coinSlice";

const store = configureStore({
  reducer: {
    coinsSlice: coinReducer
  }
});

export default store;
