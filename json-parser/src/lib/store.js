import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { jsonParsingReducer } from "./features/jsonParsing/jsonParsingSlice";

export const store = configureStore({
  reducer: { jsonParsing: jsonParsingReducer },
});

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;