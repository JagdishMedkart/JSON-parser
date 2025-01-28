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
    setButtonState,
    setJsonObj,
    removeKeys,
} from "@/lib/features/jsonParsing/jsonParsingSlice";
import styles from "../styles/InputViewer.module.scss";
import toast, { Toaster } from "react-hot-toast";
import Json from "./JsonViewer";

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
    const buttonState = useAppSelector(
        (state) => state.jsonParsing.buttonState
    );
    const jsonObj = useAppSelector((state) => state.jsonParsing.jsonObj);
    const expandedKeys = useAppSelector(
        (state) => state.jsonParsing.expandedKeys
    );
    const dispatch = useAppDispatch();
    let jsonObject;
    let count = 0;

    const handleClear = (src) => {
        if (src === "out") {
            dispatch(setJsonOutput(""));
            dispatch(setOutputRows(10));
            count = 0;
        } else if (src === "in") {
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
        while (num > 0) {
            len++;
            num = Math.floor(num / 10);
        }
        return len;
    };

    const handleCopy = (ln, src) => {
        // console.log("copy line = ", ln);
        if (ln?.length > 0) {
            navigator.clipboard.writeText(ln);
            // console.log(out);
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
        // console.log("total lines = ", count2);
        dispatch(setInputRows(Math.max(count2 + 1, 10)));
        dispatch(setExpandInput(false));
    };

    const handleShrink = (src) => {
        if (src === "in") {
            dispatch(setInputRows(10));
            dispatch(setExpandInput(true));
        } else if (src === "out") {
            dispatch(setOutputRows(10));
            dispatch(setExpandOutput(true));
        }
    };

    const addNumbering = (output) => {
        let res = "1.  ";
        let cnt = 2;
        for (let i of output) {
            res += i;
            if (i == "\n") {
                res += cnt + ".  ";
                cnt++;
            }
        }
        return res;
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
            {/* <p>Helpful tip/caution: Always use given copy buttons only to copy the text... :)</p> */}
            {/* <button className={styles.btn3}
                onClick={() => {
                    dispatch(setButtonState(buttonState));
                }}>
                {buttonState ? "JSON to Object" : "Stringified to JSON"}
            </button> */}
            <div className={styles.toggleSwitch}>
                <input
                    type="checkbox"
                    id="toggleSwitch"
                    checked={buttonState}
                    onChange={() => dispatch(setButtonState(!buttonState))}
                />
                <label htmlFor="toggleSwitch" className={styles.slider}></label>
            </div>
            <h3 className={styles.h3}>{buttonState ? "JSON to Object" : "Stringified to JSON"}</h3>
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
                    placeholder={
                        buttonState ? "Input JSON..." : "Stringified JSON...."
                    }
                    value={jsonInputState}
                    onChange={(e) => {
                        dispatch(setJsonInput(e.target.value));
                        handleClear("out");
                    }
                    }
                />
            </div>
            <button
                className={styles.btn}
                onClick={() => {
                    try {
                        dispatch(removeKeys({}));
                        console.log("removing keys");
                        dispatch(setErrorMessage(""));
                        if (jsonInputState === "") {
                            dispatch(setJsonOutput(""));
                            return;
                        }
                        //let resInput = addNumbering(jsonInputState);
                        dispatch(setJsonInput(jsonInputState));
                        // console.log(jsonInputState);
                        console.log(JSON.stringify(jsonInputState.trim()));
                        // console.log(JSON.parse(JSON.stringify(jsonInputState)));
                        if (buttonState) {
                            jsonObject = JSON.parse(jsonInputState);
                            dispatch(setJsonObj(jsonObject));
                            handleShrink("in");
                            handleShrink("out");
                            console.log("json object = ", jsonObject);
                            console.log("redux object = ", jsonObj);
                            let output = convertObjToString(jsonObject, 1);
                            // console.log("final output = ", output);
                            // let res = addNumbering(output);
                            dispatch(setJsonOutput(output));
                        } else {
                            let tmp = jsonInputState;
                            tmp = tmp.trim();
                            // console.log("tmp = ", tmp);
                            let countOccurence = tmp.split('\\"').length - 1;
                            console.log(countOccurence);
                            if (countOccurence > 0) {
                                if (tmp[0] == "'" || tmp[0] == '"') {
                                    tmp = '"' + tmp.substring(1);
                                } else {
                                    tmp = '"' + tmp;
                                }
                                if (tmp[tmp.length - 1] == "'")
                                    tmp =
                                        tmp.substring(0, tmp.length - 1) + '"';
                                if (tmp[tmp.length - 1] != '"') tmp += '"';
                                dispatch(setJsonInput(tmp));
                            } else {
                                console.log("hello");
                                console.log("tmp = ", tmp);
                                tmp = tmp.trim();
                                if (tmp[0] == '"') {
                                    tmp = "'" + tmp.substring(1);
                                }
                                if (tmp[tmp.length - 1] == '"') {
                                    tmp =
                                        tmp.substring(0, tmp.length - 1) + "'";
                                }
                                tmp = tmp.replaceAll('"', '\\"');
                                tmp = tmp.replaceAll("'", '"');
                                console.log("new tmp = ", tmp);
                            }
                            // console.log(tmp);
                            // console.log(jsonInputState);
                            // console.log(JSON.parse("" + tmp + ""));
                            let output = JSON.parse(tmp);
                            // console.log(output);
                            // let res = addNumbering(output);
                            dispatch(setJsonOutput(output));
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
                    placeholder={
                        buttonState ? "Output Object..." : "Normal JSON...."
                    }
                    value={jsonOutputState}
                    onChange={(e) => dispatch(setJsonOutput(e.target.value))}
                />
            </div>
            <p>
                Helpful tip/caution: Always use given copy buttons only to copy
                the text... :)
            </p>
            <Toaster />
            {jsonInputState && jsonOutputState && buttonState && <Json />}
        </div>
    );
};
export default InputViewer;
