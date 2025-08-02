"use client"
import { useEffect, useState } from "react";
const Preload = () => {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 10); 
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="preloadWrapper" style={{ display: loading ? 'flex' : 'none' }}>
      <div className="loader"></div>
    </div>
  );
};

export default Preload;
