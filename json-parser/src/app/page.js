"use client";

import InputViewer from "@/components/InputViewer";
import styles from "./page.module.css";

export default function Home() {
  return (
    <><div className={styles.page}>
      <h1 className={styles.h1}>JSON PARSER</h1>
      <InputViewer />
    </div>
    </>
  );
}
