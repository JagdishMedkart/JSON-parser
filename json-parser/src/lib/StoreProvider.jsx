"use client";
import { Provider } from "react-redux";
import { store } from "@/lib/store";
// import { persistStore } from "redux-persist";

export default function StoreProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}
