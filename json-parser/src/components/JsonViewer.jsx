import React, { useState } from "react";
import { useAppSelector } from "@/lib/store";
import { useAppDispatch } from "@/lib/store";
import { setToggleExpand } from "@/lib/features/jsonParsing/jsonParsingSlice";
import styles from "@/styles/JsonViewer.module.scss";
import toast, { Toaster } from "react-hot-toast";

const JsonViewer = ({ data, level = 0, parentKey = "" }) => {
    try {
        const dispatch = useAppDispatch();
        const expandedKeys = useAppSelector(
            (state) => state.jsonParsing.expandedKeys
        );
        console.log(expandedKeys);

        const toggleNode = (key) => {
            dispatch(setToggleExpand(key));
        };

        const isObjectOrArray = (value) =>
            typeof value === "object" && value !== null;

        if (isObjectOrArray(data)) {
            const isExpanded = expandedKeys[parentKey] ?? false;

            return (
                <div
                    className={styles.jsonBlock}
                    style={{ marginLeft: `${level * 10}px` }}
                >
                    <div className={styles.innerDiv}>
                        <button
                            onClick={() => toggleNode(parentKey)}
                            className={styles.toggleButton}
                        >
                            {isExpanded ? "-" : "+"}
                        </button>
                        <span className={styles.jsonKey}>
                            {Array.isArray(data) ? "[Array]" : "{Object}"}
                        </span>
                    </div>
                    {isExpanded && (
                        <div className={styles.jsonContent}>
                            {Object.entries(data).map(([key, value], index) => (
                                <div key={index} className={styles.jsonItem}>
                                    <span className={styles.jsonKey}>
                                        {key}:{" "}
                                    </span>
                                    <JsonViewer
                                        data={value}
                                        level={level + 1}
                                        parentKey={`${parentKey}.${key}`}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            );
        } else {
            return <span className={styles.jsonValue}>{data}</span>;
        }
    } catch (error) {
        toast.error(error.message);
    }
};

export default function Json() {
    let data;
    try {
        const jsonInputState = useAppSelector(
            (state) => state.jsonParsing.jsonInput
        );
        data = JSON.parse(jsonInputState);

        console.log("passed values = ", jsonInputState);
    } catch (error) {
        toast.error(error.message);
    }

    return (
        <div className={styles.container}>
            <div className={styles.jsonViewer}>
                <JsonViewer data={data} />
            </div>
            <Toaster />
        </div>
    );
}
