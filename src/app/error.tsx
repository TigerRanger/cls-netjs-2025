"use client";

import React from 'react';

const Error = () => {
  return (
    <>
      <style jsx>{`
        .error-message {
          color: red;
          font-weight: bold;
          padding: 20px;
          text-align: center;
          background-color: #ffe6e6;
          border: 1px solid red;
          border-radius: 8px;
          min-height: 400px;
          margin:20px;
        }
      `}</style>
      <div className="error-message">
        Something is wrong. Setup is not properly configured.
      </div>
    </>
  );
};

export default Error;
