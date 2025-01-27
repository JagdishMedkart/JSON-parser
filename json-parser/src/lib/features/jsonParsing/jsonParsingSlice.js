import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    jsonInput: "",
    jsonOutput: "",
    jsonObj: { value: {} },
    errorMessage: "",
    outputRow: 10,
    inputRow: 10,
    expandOutput: true,
    expandInput: true,
};

export const jsonSlice = createSlice({
    name: "jsonParsing",
    initialState,
    reducers: {
        setJsonInput: (state, action) => {
            state.jsonInput = action.payload;
        },
        setJsonOutput: (state, action) => {
            state.jsonOutput = action.payload;
        },
        setErrorMessage: (state, action) => {
            state.errorMessage = action.payload;
        },
        setOutputRows: (state, action) => {
            state.outputRow = action.payload;
        },
        setExpandOutput: (state, action) => {
            state.expandOutput = action.payload;
        },
        setInputRows: (state, action) => {
            state.inputRow = action.payload;
        },
        setExpandInput: (state, action) => {
            state.expandInput = action.payload;
        }
    },
});

export const { setJsonInput, setJsonOutput, setErrorMessage, setOutputRows, setExpandOutput, setInputRows, setExpandInput } = jsonSlice.actions;
export const jsonParsingReducer = jsonSlice.reducer;