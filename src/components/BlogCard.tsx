import React from "react";
import Link from "next/link";
import Image from "next/image";

import { PostEdge } from "@/lib/Interface/HomeInterface";

import style from "@/sass/BlogCard.module.scss";

import  EcommercePrice from "@/lib/jslib/Price";

interface BlogCardProps {
  PostEdge: PostEdge;
}

const BlogCard: React.FC<BlogCardProps> = ({ PostEdge }) => {
  
  return (
    <div className={`col-lg-3 col-md-4 col-sm-6 ${style["blog-col"]}`}>
      <div className={style["blog-card"]}>
        <div className={style["blog-content"]}>
        <Link href={`/blog/${PostEdge.node.slug}`} aria-label={`Read more about ${PostEdge.node.title}`}>
          <div className={style["blog-header-info"]}>
            <Image
              className={style["blog-image"]}
              src={PostEdge.node.featuredImage?.node.sourceUrl ?? "/images/blog_1.webp"} // Fallback to default image
              alt={PostEdge.node.title}
              width={300} // Define appropriate width
              height={200} // Define appropriate height
            />
          </div>
        </Link>
        <div className={style["blog-body-info"]}>
          <div className={style["blog-text"]}>
            <div className={style["a-text"]}>by <strong>Nazmul Alam </strong></div>
            <span className={style["date-text"]}>
              <Image className={style["blog-icon"]} src={"/svg-icon/calender_b.svg"} width={20} height={20} alt="calender"/>{EcommercePrice.format_date(PostEdge.node.date)}</span>
          </div>
            <Link href={`/blog/${PostEdge.node.slug}`} className={style["blog-title"]}>
              {PostEdge.node.title}
            </Link>

            
        </div>
      </div>
      </div>
    </div>
  );
};

export default BlogCard;
