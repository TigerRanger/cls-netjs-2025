import React from "react";
import BlogCard from "@/components/BlogCard";

import style from "@/sass/homeBlog.module.scss";

import { PostEdge } from "@/lib/Interface/HomeInterface";

interface PostInterface {
    BlogTitle: string;
    BlogParagraph: string;
    PostsData: PostEdge[]; // Ensure this is an array
}

const HomeBlog: React.FC<PostInterface> = ({BlogTitle, BlogParagraph , PostsData }) => {
  

 // Check if Posts is defined and is an array
   if (!PostsData || !PostsData.length) {
     return <div>No blog posts available.</div>;
  }

  return (
    <section className={`${style["blog-block"]} offer-block`}>
      <div className="container-fluid">
        {(BlogTitle &&
            <h2 className="feature_heading" dangerouslySetInnerHTML={{ __html: BlogTitle }} />
        )}
        {(BlogParagraph &&
        <p className={style["blog-p"]}>{BlogParagraph}</p>
        )}

        <div className={style["blog-card-container"]}>
          <div className={`row ${style["no-gap"]}`}>
            {PostsData.map((post) => (
               <BlogCard key={ post?.node.id} PostEdge={post} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeBlog;
