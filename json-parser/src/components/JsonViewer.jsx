import React, { useState } from "react";
import { useAppSelector } from "@/lib/store";
import { useAppDispatch } from "@/lib/store";
import { setToggleExpand } from "@/lib/features/jsonParsing/jsonParsingSlice";
import styles from "@/styles/JsonViewer.module.scss";

const JsonViewer = ({ data, level = 0, parentKey = "" }) => {
    const dispatch = useAppDispatch();
    const expandedKeys = useAppSelector((state) => state.jsonParsing.expandedKeys);
    console.log(expandedKeys);

    const toggleNode = (key) => {
        dispatch(setToggleExpand(key));
    };

    const isObjectOrArray = (value) =>
        typeof value === "object" && value !== null;

    if (isObjectOrArray(data)) {
        const uniqueKey = `${parentKey}-${level}`;
        const isExpanded = expandedKeys[uniqueKey] ?? false; // Default to expanded

        return (
            <div
                className={styles.jsonBlock} style={{ marginLeft: `${level * 10}px` }}
            >
                <div className={styles.innerDiv}>
                    <button
                        onClick={() => toggleNode(uniqueKey)}
                        className={styles.toggleButton}
                    >
                        {isExpanded ? "-" : "+"}
                    </button>
                    <span
                        className={styles.jsonKey}
                    >
                        {Array.isArray(data) ? "[Array]" : "{Object}"}
                    </span>
                </div>
                {isExpanded && (
                    <div
                        className={styles.jsonContent}
                    >
                        {Object.entries(data).map(([key, value], index) => (
                            <div key={index}
                                className={styles.jsonItem}
                            >
                                <span
                                    className={styles.jsonKey}
                                >{key}: </span>
                                <JsonViewer
                                    data={value}
                                    level={level + 1}
                                    parentKey={`${uniqueKey}-${key}`}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    } else {
        return <span
            className={styles.jsonValue}
        >{data}</span>;
    }
};

export default function Json() {
    const jsonInputState = useAppSelector((state) => state.jsonParsing.jsonInput);
    let data = JSON.parse(jsonInputState);

    console.log("passed values = ", jsonInputState);
    const sampleData = {
        name: "John Doe",
        age: 30,
        address: {
            street: "123 Main St",
            city: "Springfield",
            country: "USA",
        },
        hobbies: ["reading", "traveling", "gaming"],
        education: {
            highSchool: "Springfield High",
            college: {
                name: "Springfield University",
                yearGraduated: 2015,
            },
        },
    };

    return (
        <div
            className={styles.container}
        >
            <div
                className={styles.jsonViewer}
            >
                <JsonViewer data={data} />
            </div>
        </div>
    );
}

