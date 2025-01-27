import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    jsonInput: "",
    jsonOutput: "",
    jsonObj: {value: {}},
    errorMessage: "",
    outputRow: 10
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
        parseJson: (state) => {
            state.jsonObj = {...state.jsonObj.value, value: JSON.parse(state.jsonInput)};
            console.log(JSON.stringify(state.jsonInput));
            console.log(JSON.parse(state.jsonInput));
            // console.log(ans);
            console.log(state.jsonObj);
        },
        setErrorMessage: (state, action) => {
            state.errorMessage = action.payload;
        },
        setOutputRows: (state, action) => {
            state.outputRow = action.payload;
        }
    },
});

export const { setJsonInput, setJsonOutput, parseJson, setErrorMessage, setOutputRows } = jsonSlice.actions;
export const jsonParsingReducer = jsonSlice.reducer;