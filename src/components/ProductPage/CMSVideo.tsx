'use client';

import { useState } from 'react';
import Image from 'next/image';

interface CategoryVideoProps {
  video_code?: string; // optional to allow fallback
  name: string;
}

const CMSVideo = ({ video_code , name }: CategoryVideoProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const playVideoModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
        <Image 
          className='ccms_video' 
          src="/images/youtube-icon2.svg" 
          width={100} 
          height={100} 
          alt={`${name} video`} 
          onClick={playVideoModal}
        />

      {/* Modal */}
      {isOpen && (
        <div className="video_modal" onClick={closeModal}>
          <div className="video_content" onClick={(e) => e.stopPropagation()}>
            <iframe
              width="800"
              height="450"
              src={`https://www.youtube.com/embed/${video_code}?autoplay=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </>
  );
};

export default CMSVideo;
