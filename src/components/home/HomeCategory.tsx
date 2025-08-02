"use client";

import React from 'react';
import Image from 'next/image';

import { CategoryListItem } from "@/lib/Interface/HomeInterface";
import style from "@/sass/home_category.module.scss";

interface HCategoryPops {
  CatTitle: string;
  CatP: string;
  CatData: CategoryListItem[];
  SiteUrl: string;
}

const default_image = "/category/category_empty.png";


const HomeCategory: React.FC<HCategoryPops> = ({ CatTitle, CatP, CatData , SiteUrl }) => {
  const isLoading = !CatData || CatData.length === 0;

  return (
    <section className={style['featureCategory-section']}>
      <div className='container'>
        {CatTitle && <h2 className={style.category_heading}>{CatTitle}</h2>}
        {CatP && <p>{CatP}</p>}

        <div className='row'>
          {isLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <div className={`col-sm-6 col-md-4 col-lg-3 ${style['cat-box']}`} key={index}>
                <div className={`${style['category-box']} ${style['loading']}`}>
                  <div className={`${style['image-skeleton']} image-placeholder placeholder-glow`}></div>
                  <div className={style['category-name']}>Loading...</div>
                  
                </div>
              </div>
            ))
          ) : (
            CatData.map((item, index) => (
              <div className={`col-sm-6 col-md-4 col-lg-3 ${style['cat-box']}`} key={index}>
                <a
                  className={style['category-box']}
                  href={"/"+item?.canonical_url || "/" + item.url_key}
                >
                  <Image
                    title={item.name}
                    src={item.image ? `${SiteUrl}/pub/${item.image}` : default_image}
                    alt={item.name}
                    width={286}
                    height={143}
                    loading='lazy'
                  />
                  <div className={style['category-name']}>{item.name}</div>
                </a>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default HomeCategory;
