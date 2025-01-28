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
    setButtonState
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
    const outputRow = useAppSelector((state) => state.jsonParsing.outputRow);
    const inputRow = useAppSelector((state) => state.jsonParsing.inputRow);
    const expandOutput = useAppSelector(
        (state) => state.jsonParsing.expandOutput
    );
    const expandInput = useAppSelector(
        (state) => state.jsonParsing.expandInput
    );
    const buttonState = useAppSelector((state) => state.jsonParsing.buttonState);
    const dispatch = useAppDispatch();

    let count = 0;

    const handleClear = (src) => {
        if(src === "out") {
            dispatch(setJsonOutput(""));
            dispatch(setOutputRows(10));
            count = 0;
        }
        else if(src === "in") {
            dispatch(setJsonInput(""));
            dispatch(setInputRows(10));
            count2 = 0;
        }
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

    const checkCount = (num) => {
        let len = 0;
        while(num > 0) {
            len ++;
            num = Math.floor(num / 10);
        }
        return len;
    }

    const handleCopy = (ln, src) => {
        if (ln?.length > 0) {
            let out = "";
            let count = 1;
            for(let i = 4; i < ln.length; ) {
                out += ln[i];
                if(ln[i] == '\n') {
                    count++;
                    i += checkCount(count) + 3;
                }
                i++;
            }
            navigator.clipboard.writeText(out);
            console.log(out);
            let toastMsg = (src === "in" ? "Input" : "Output") + " Text Copied";
            toast.success(toastMsg);
        }
    };

    let count2 = 0;

    const handleExpandInput = () => {
        for (let i of jsonInputState) {
            if (i == "\n") {
                count2++;
            }
        }
        console.log("total lines = ", count2);
        dispatch(setInputRows(Math.max(count2 + 1, 10)));
        dispatch(setExpandInput(false));
    };

    const handleShrink = (src) => {
        if(src === "in") {
            dispatch(setInputRows(10));
            dispatch(setExpandInput(true));
        }
        else if(src === "out") {
            dispatch(setOutputRows(10));
            dispatch(setExpandOutput(true));
        }
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
            let ans = "[\n" + string.join(",\n") + "\n" + tmp + "]";
            return ans;
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
                            handleCopy(jsonInputState, "in");
                        }}
                    >
                        Copy
                    </button>
                    <button
                        className={styles.btn2}
                        onClick={() => {
                            handleClear("in");
                        }}
                    >
                        Clear
                    </button>
                    <button
                        className={styles.btn2}
                        onClick={() => {
                            expandInput
                                ? handleExpandInput()
                                : handleShrink("in");
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
                        let resInput = "1.  ";
                        let cntInput = 2;
                        for(let i of jsonInputState) {
                            resInput += i;
                            if(i == "\n") {
                                resInput += (cntInput + ".  ");
                                cntInput++;
                            }
                        }
                        dispatch(setJsonInput(resInput));
                        // console.log(jsonInputState);
                        // console.log(JSON.stringify(jsonInputState));
                        // console.log(JSON.parse(JSON.stringify(jsonInputState)));
                        if(buttonState) {
                            const jsonObject = JSON.parse(jsonInputState);
                            handleShrink("in");
                            handleShrink("out");
                            console.log("json object = ", jsonObject);
                            let output = convertObjToString(jsonObject, 1);
                            console.log("final output = ", output);
                            let res = "1.  ";
                            let cnt = 2;
                            for(let i of output) {
                                res += i;
                                if(i == '\n') {
                                    res += (cnt + ".  ");
                                    cnt++;
                                }
                            }
                            console.log(res);
                            dispatch(setJsonOutput(res));
                        }
                        else {
                            dispatch(setJsonOutput(JSON.parse((jsonInputState))));
                        }
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
            <button className={styles.btn}
            onClick = {() => {
                dispatch(setButtonState(buttonState));
            }}>
                {buttonState ? "JSON to Object" : "Stringified to JSON"}
            </button>
            <div className={styles.secondDiv2}>
                <div className={styles.div3}>
                    <button
                        className={styles.btn2}
                        onClick={() => {
                            handleCopy(jsonOutputState, "out");
                        }}
                    >
                        Copy
                    </button>
                    <button
                        className={styles.btn2}
                        onClick={() => {
                            handleClear("out");
                        }}
                    >
                        Clear
                    </button>
                    <button
                        className={styles.btn2}
                        onClick={() => {
                            expandOutput
                                ? handleExpandOutput()
                                : handleShrink("out");
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
