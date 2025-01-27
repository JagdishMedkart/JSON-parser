import React from "react";
import { useAppSelector } from "@/lib/store";
import { useAppDispatch } from "@/lib/store";
import {
    setJsonInput,
    setJsonOutput,
    setErrorMessage,
    setOutputRows,
    setExpandOutput,
    setInputRows,
    setExpandInput,
} from "@/lib/features/jsonParsing/jsonParsingSlice";
import styles from "../styles/InputViewer.module.scss";
import toast, { Toaster } from "react-hot-toast";

const InputViewer = () => {
    const jsonInputState = useAppSelector(
        (state) => state.jsonParsing.jsonInput
    );
    const jsonOutputState = useAppSelector(
        (state) => state.jsonParsing.jsonOutput
    );
    const errorMessage = useAppSelector(
        (state) => state.jsonParsing.errorMessage
    );
    const outputRow = useAppSelector((state) => state.jsonParsing.outputRow);
    const inputRow = useAppSelector((state) => state.jsonParsing.inputRow);
    const expandOutput = useAppSelector(
        (state) => state.jsonParsing.expandOutput
    );
    const expandInput = useAppSelector(
        (state) => state.jsonParsing.expandInput
    );
    const dispatch = useAppDispatch();

    const handleCopyOutput = (ln) => {
        if (ln?.length > 0) {
            navigator.clipboard.writeText(ln);
            toast.success("Output Text Copied!");
        }
    };

    let count = 0;

    const handleClearOutput = () => {
        dispatch(setJsonOutput(""));
        dispatch(setOutputRows(10));
        count = 0;
    };

    const handleExpandOutput = () => {
        for (let i of jsonOutputState) {
            if (i == "\n") {
                count++;
            }
        }
        console.log("total lines = ", count);
        dispatch(setOutputRows(Math.max(count + 1, 10)));
        dispatch(setExpandOutput(false));
    };

    const handleShrinkOutput = () => {
        dispatch(setOutputRows(10));
        dispatch(setExpandOutput(true));
    };

    const handleCopyInput = (ln) => {
        if (ln?.length > 0) {
            navigator.clipboard.writeText(ln);
            toast.success("Input Text Copied!");
        }
    };

    const handleClearInput = () => {
        dispatch(setJsonInput(""));
        dispatch(setInputRows(10));
        count2 = 0;
    };

    let count2 = 0;

    const handleExpandInput = () => {
        for (let i of jsonInputState) {
            if (i == "\n") {
                count2++;
            }
        }
        console.log("total lines = ", count2);
        dispatch(setInputRows(count2 + 1));
        dispatch(setExpandInput(false));
    };

    const handleShrinkInput = () => {
        dispatch(setInputRows(10));
        dispatch(setExpandInput(true));
    };

    function convertObjToString(obj, num, prop2) {
        let string = [];
        if (obj == undefined) {
            return String(obj);
        } else if (typeof obj == "object" && obj.join == undefined) {
            for (let prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    let tmp = "";
                    for (let i = 0; i < num; i++) {
                        tmp += "\t";
                    }
                    string.push(
                        tmp +
                            prop +
                            " : " +
                            convertObjToString(obj[prop], num + 1, prop)
                    );
                }
            }
            let tmp = "";
            for (let i = 0; i < num - 1; i++) {
                tmp += "\t";
            }
            // for (let i = 0; i < prop2?.length + 3; i++) {
            //     tmp += " ";
            // }
            return "{\n" + string.join(",\n") + "\n" + tmp + "}";
        } else if (typeof obj == "object" && !(obj.join == undefined)) {
            for (let prop in obj) {
                let tmp = "";
                for (let i = 0; i < num; i++) {
                    tmp += "\t";
                }
                string.push(tmp + convertObjToString(obj[prop], num + 1));
            }
            let tmp = "";
            for (let i = 0; i < num - 1; i++) {
                tmp += "\t";
            }
            return "[\n" + string.join(",\n") + "\n" + tmp + "]";
        } else if (typeof obj == "function") {
            string.push(obj.toString());
        } else {
            string.push(JSON.stringify(obj));
        }
        return string.join(", \n");
    }

    return (
        <div className={styles.mainDiv}>
            <div className={styles.secondDiv2}>
                <div className={styles.div3}>
                    <button
                        className={styles.btn2}
                        onClick={() => {
                            handleCopyInput(jsonInputState);
                        }}
                    >
                        Copy
                    </button>
                    <button
                        className={styles.btn2}
                        onClick={() => {
                            handleClearInput();
                        }}
                    >
                        Clear
                    </button>
                    <button
                        className={styles.btn2}
                        onClick={() => {
                            expandInput
                                ? handleExpandInput()
                                : handleShrinkInput();
                        }}
                    >
                        {expandInput ? "Expand" : "Shrink"}
                    </button>
                </div>
                <textarea
                    className={styles.textarea}
                    rows={inputRow}
                    cols={100}
                    placeholder="Enter encoded URL...."
                    value={jsonInputState}
                    onChange={(e) => dispatch(setJsonInput(e.target.value))}
                />
            </div>
            <button
                className={styles.btn}
                onClick={() => {
                    try {
                        dispatch(setErrorMessage(""));
                        if (jsonInputState === "") {
                            dispatch(setJsonOutput(""));
                            return;
                        }
                        const jsonObject = JSON.parse(jsonInputState);
                        handleShrinkInput();
                        handleShrinkOutput();
                        // console.log("json object = ", jsonObject);
                        let output = convertObjToString(jsonObject, 1);
                        // console.log("final output = ", output);
                        dispatch(setJsonOutput(output));
                    } catch (error) {
                        toast.error(error.message);
                        dispatch(setErrorMessage(error.message));
                        dispatch(setJsonOutput(""));
                        dispatch(setOutputRows(10));
                    }
                }}
            >
                Decode
            </button>
            <div className={styles.secondDiv2}>
                <div className={styles.div3}>
                    <button
                        className={styles.btn2}
                        onClick={() => {
                            handleCopyOutput(jsonOutputState);
                        }}
                    >
                        Copy
                    </button>
                    <button
                        className={styles.btn2}
                        onClick={() => {
                            handleClearOutput();
                        }}
                    >
                        Clear
                    </button>
                    <button
                        className={styles.btn2}
                        onClick={() => {
                            expandOutput
                                ? handleExpandOutput()
                                : handleShrinkOutput();
                        }}
                    >
                        {expandOutput ? "Expand" : "Shrink"}
                    </button>
                </div>
                <textarea
                    className={styles.textarea}
                    rows={outputRow}
                    cols={100}
                    placeholder="decoded URL...."
                    value={jsonOutputState}
                    onChange={(e) => dispatch(setJsonOutput(e.target.value))}
                />
            </div>
            <Toaster />
        </div>
    );
};
export default InputViewer;
