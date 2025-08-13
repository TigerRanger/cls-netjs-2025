import React from "react";
import ServiceCard from "@/components/ServiceCard";


import { OtherSiteItem } from "@/lib/Interface/HomeInterface";

interface PostInterface {
    siteTitle?: string; // Optional site title
    site_p: string; // Site description or paragraph
    type:string
    PostsData: OtherSiteItem[]; // Ensure this is an array
    auto: string; // Auto slide setting
    site: string; // Site identifier
}

import ServiceCardSlider from "@/components/ServiceCardSlider";

const ProfessionalService: React.FC<PostInterface> = ({ siteTitle ,site_p , type ,auto, PostsData ,site}) => {
 // Check if Posts is defined and is an array
 
 if (!PostsData || !PostsData.length) {
    return <div className="container-fluid offer-block">No Service available.</div>;
 }

 return (
   <section className="blog-block offer-block professional-service">
     <div className="container-fluid">

        {( siteTitle &&
         <h2 className="feature_heading" dangerouslySetInnerHTML={{ __html: siteTitle }} />
        )}
        {( site_p &&
        <p className="feature_para" dangerouslySetInnerHTML={{ __html: site_p }} />
        )}
       <div className="service-card-container">

        {type === "1" ? (
          <div className="service-card-slider">
             <ServiceCardSlider
                 PostsData={PostsData}
              site={site}
              auto={auto}
            /> 
          </div>
        ) : (
          <div className="row no-gap">
            {PostsData.map((post) => (
              <ServiceCard key={post?.id} OtherSiteItem={post} site={site ?? ""} />
            ))}
          </div>
        )}

       </div>
     </div>
   </section>
 );
};


export default ProfessionalService


