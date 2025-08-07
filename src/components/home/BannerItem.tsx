'use client';
import React, { useEffect, useState } from 'react';

interface BannerItemProps {
  banner: string;
  title: string;
  paragraph: string;
  show_banner: boolean | string;
  banner_before_title: boolean | string;
}

const BannerItem: React.FC<BannerItemProps> = ({
  title,
  paragraph,
  banner,
  show_banner,
  banner_before_title,
}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay (you can remove this in production)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // 1 second delay

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-48 bg-gray-200 rounded-lg" />
        <div className="h-6 w-1/2 bg-gray-300 rounded" />
        <div className="h-4 w-3/4 bg-gray-300 rounded" />
      </div>
    );
  }

  return (
    <>
      {banner_before_title === '1' && show_banner === '1' && banner && (
        <div className="Banner_section_sp">
          <div dangerouslySetInnerHTML={{ __html: banner }} />
        </div>
      )}

      {title && <h2 className="feature_heading" dangerouslySetInnerHTML={{ __html: title }} />}

        {paragraph && <p>{paragraph}</p>}
        
      {banner_before_title !== '1' && show_banner === '1' && banner && (
        <div className="Banner_section_sp">
          <div dangerouslySetInnerHTML={{ __html: banner }} />
        </div>
      )}
    </>
  );
};

export default BannerItem;
