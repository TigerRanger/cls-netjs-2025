"use client"

import React, { useEffect, useState, useCallback } from "react";

import style from "@/sass/scrollUp.module.scss";

const ScrollUp: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const handleScrollUp = useCallback((e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY;
    setIsVisible(scrollPosition >= 350);
  }, []);

  useEffect(() => {
    document.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return (
    <span
      className={` ${style['ak-scrollup']} ${isVisible ? style["ak-scrollup-show"] : ""}`}
      onClick={handleScrollUp}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 10L1.7625 11.7625L8.75 4.7875V20H11.25V4.7875L18.225 11.775L20 10L10 0L0 10Z"
          fill="currentColor"
        />
      </svg>
    </span>
  );
};

export default ScrollUp;
