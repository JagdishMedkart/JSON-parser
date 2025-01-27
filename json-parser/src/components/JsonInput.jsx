"use client";
import React, { useEffect, useState } from "react";

const JsonInput = () => {
  const [encodedUrl, setEncodedUrl] = useState < string > "";
  const [decodedUrl, setDecodedUrl] = useState < string > "";

  const handleCopy = (ln) => {
    navigator.clipboard.writeText(ln);
    // toast.success("URL Copied");
  };

  return (
    <div>
      <div>
        <label>Enter Encoded URL</label>
        <textarea
          rows={6}
          cols={100}
          placeholder="Enter encoded URL...."
          value={encodedUrl}
          onChange={(e) => setEncodedUrl(e.target.value)}
        />
      </div>
      <button
        onClick={() => {
          setDecodedUrl(decodeURIComponent(encodedUrl));
        }}
      >
        Decode
      </button>
      <div>
        <div>
          <button
            onClick={() => {
              handleCopy(decodedUrl);
            }}
          ></button>
        </div>
        <textarea
          rows={6}
          cols={100}
          placeholder="decoded URL...."
          value={decodedUrl}
          onChange={(e) => setDecodedUrl(e.target.value)}
        />
      </div>
    </div>
  );
};

export default JsonInput;
