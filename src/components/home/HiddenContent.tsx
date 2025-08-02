"use client";

import { useState, useRef, useEffect } from "react";
import PageBuilder from '@/lib/jslib/PageBuilder';

interface HiddenContentProps {
  content: string;
}

const HiddenContent = ({ content }: HiddenContentProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.height = isExpanded
        ? `${contentRef.current.scrollHeight}px`
        : "0px";
    }
  }, [isExpanded]);

  if (!content) return null;

  return (
    <>
      <div
        ref={contentRef}
        className={`hidden-container ${isExpanded ? "show" : "hide"}`}
        dangerouslySetInnerHTML={{ __html: PageBuilder.reove_css_tag(content) }}
       />

      <div className="btn-container">
        <button className="common-btn hidden-btn" onClick={handleToggle}>
          {isExpanded ? "Hide More..." : "Read More..."}
        </button>
      </div>
    </>
  );
};

export default HiddenContent;
