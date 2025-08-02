// components/Map.tsx
import React from "react";

interface MapProps {
  src: string;     // The src URL for the iframe
  width?: string;  // Optional width for the iframe
  height?: string; // Optional height for the iframe
}

const Map: React.FC<MapProps> = ({ src, width = "100%", height = "auto" }) => {
  return (
    <div className="map_box">
      <iframe
        loading="lazy"
        src={src}
        width={width}
        height={height}
        style={{ border: 0 }}
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        title="Google Map"
      />
    </div>
  );
};

export default Map;
