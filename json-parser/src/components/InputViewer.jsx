import React from "react";
import { useAppSelector } from "@/lib/store";
import { useAppDispatch } from "@/lib/store";
import {
  setJsonInput,
  setJsonOutput,
  parseJson,
  setErrorMessage,
  setOutputRows,
  setExpand,
} from "@/lib/features/jsonParsing/jsonParsingSlice";
import styles from "../styles/InputViewer.module.scss";
import toast, { Toaster } from "react-hot-toast";

const InputViewer = () => {
  const jsonInputState = useAppSelector((state) => state.jsonParsing.jsonInput);
  const jsonOutputState = useAppSelector(
    (state) => state.jsonParsing.jsonOutput
  );
  const jsonObj = useAppSelector((state) => state.jsonParsing.jsonObj);
  const errorMessage = useAppSelector(
    (state) => state.jsonParsing.errorMessage
  );
  const outputRow = useAppSelector((state) => state.jsonParsing.outputRow);
  const expand = useAppSelector((state) => state.jsonParsing.expand);
  const dispatch = useAppDispatch();

  const handleCopy = (ln) => {
    navigator.clipboard.writeText(ln);
    if (ln?.length > 0) toast.success("Text Copied!");
  };

  let count = 0;

  const handleClear = () => {
    dispatch(setJsonOutput(""));
    dispatch(setOutputRows(10));
    count = 0;
  };

  const handleExapnd = () => {
    for (let i of jsonOutputState) {
      if (i == "\n") {
        count++;
      }
    }
    console.log("total lines = ", count);
    dispatch(setOutputRows(count + 4));
    dispatch(setExpand(false));
  };

  const handleShrink = () => {
    dispatch(setOutputRows(10));
    dispatch(setExpand(true));
  }

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
            tmp + prop + " : " + convertObjToString(obj[prop], num + 1, prop)
          );
        }
      }
      let tmp = "";
      for (let i = 0; i < num - 1; i++) {
        tmp += "\t";
      }
      for (let i = 0; i < prop2?.length + 3; i++) {
        tmp += " ";
      }
      return "{\n" + string.join(",\n") + "\n" + tmp + "}";
    } else if (typeof obj == "object" && !(obj.join == undefined)) {
      for (let prop in obj) {
        string.push(convertObjToString(obj[prop], num + 1));
      }
      return "[" + string.join(", ") + "]";
    } else if (typeof obj == "function") {
      string.push(obj.toString());
    } else {
      string.push(JSON.stringify(obj));
    }
    return string.join(", \n");
  }

  return (
    <div className={styles.mainDiv}>
      <div className={styles.secondDiv}>
        <textarea
          className={styles.textarea}
          rows={10}
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
            console.log("json object = ", jsonObject);
            let output = convertObjToString(jsonObject, 1);
            console.log("final output = ", output);
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
              handleCopy(jsonOutputState);
            }}
          >
            Copy
          </button>
          <button
            className={styles.btn2}
            onClick={() => {
              handleClear();
            }}
          >
            Clear
          </button>
          <button
            className={styles.btn2}
            onClick={() => {
              expand ? handleExapnd() : handleShrink();
            }}
          >
            {expand ? "Expand" : "Shrink"}
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
      {/* <h3 className={styles.h3}>{errorMessage}</h3> */}
      <Toaster />
    </div>
  );
};
export default InputViewer;
