import React from "react";
import Image from "next/image";

import { PostEdge } from "@/lib/Interface/HomeInterface";

import style from "@/sass/BlogCard.module.scss";

import  EcommercePrice from "@/lib/jslib/Price";

interface BlogCardProps {
  PostEdge: PostEdge;
}

const BlogCard: React.FC<BlogCardProps> = ({ PostEdge }) => {

  console.log("PostEdge", PostEdge);
  
  return (
    <div className={`col-lg-4 col-md-4 col-sm-6 ${style["blog-col"]}`}>
      <div className={style["blog-card"]}>
        <div className={style["blog-content"]}>
        <a href={`/blog/${PostEdge.node.slug}`} aria-label={`Read more about ${PostEdge.node.title}`}>
          <div className={style["blog-header-info"]}>
            <Image
              className={style["blog-image"]}
              src={PostEdge.node.featuredImage?.node.sourceUrl ?? "/images/blog_1.webp"} // Fallback to default image
              alt={PostEdge.node.title}
              width={300} // Define appropriate width
              height={200} // Define appropriate height
            />
          </div>
        </a>
        <div className={style["blog-body-info"]}>
             <h3 className={style["blog-h3"]}> {PostEdge.node.title}</h3>
    
          <p className={style["blog-p"]}>
                              {PostEdge.node.excerpt 
                    ? PostEdge.node.excerpt
                        .replace(/<[^>]+>/g, "") // remove HTML tags
                        .replace(/Read more/gi, "") // remove "Read more" (case-insensitive)
                        .trim()
                    : "No description available."
                  }
          </p>
            
            <a className={style['category-button']} href=""> Mehr </a>
        
      </div>
      </div>
   </div> 
   </div>
  );
};

export default BlogCard;
