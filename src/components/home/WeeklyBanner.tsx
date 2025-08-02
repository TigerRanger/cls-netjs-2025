"use client";
import React from 'react'

interface WeeklyBannerProps {
  content: string;
}

const WeeklyBanner = ({ content }: WeeklyBannerProps) => {
  return (
   <div dangerouslySetInnerHTML={{ __html: content ?? '' }}/>
  );
}

export default WeeklyBanner