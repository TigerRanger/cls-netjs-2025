'use client'

import React, { useEffect, useState } from 'react';
import "@/sass/home_service.scss";

interface PromoInf {
  Promo: string
}

const HomeService: React.FC<PromoInf> = ({ Promo }) => {
  const [content, setContent] = useState<string | null>(null)
  useEffect(() => {
    // Simulate client-side loading
    const timeout = setTimeout(() => {
      setContent(Promo)
    }, 0) // simulate delay; in real case, this could be a fetch

    return () => clearTimeout(timeout)
  }, [Promo])

  return (
    <section className="service-section">
      {content ? (
        <div dangerouslySetInnerHTML={{ __html: content }} />
      ) : (
        <div className="container">

                <div className='row'>
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="col-lg-3 col-md-4 col-sm-6 ">
                            <div className="service-box">
                                <div className="icon-holder">
                                    
                                </div>
                                <p>Loading...</p>
                            </div>
                        </div>
                    ))}

                </div>    
         </div>
        
      )}
    </section>
  )
}

export default HomeService
