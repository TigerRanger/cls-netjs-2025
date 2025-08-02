import React from 'react';

import style from "@/sass/breadcramp.module.scss"

type Link = {
  name: string;
  url: string;
};

type BreadCrampProps = {
  links: Link[];
};

const BreadCramp: React.FC<BreadCrampProps> = ({ links }) => {
  // Prepend the Home link to the links array
  const fullLinks = [{ name: 'Home', url: `/` }, ...links];

  // Generate the breadcrumb schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: fullLinks.map((link, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@id': `${process.env.__NEXT_PRIVATE_ORIGIN}`+link.url,
        name: link.name,
      },
    })),
  };

  return (<>
    <section className={style['bradcrump-master']}>   
       <div className='container'>
           <nav className={style["breadcramp-box"]}>
               <ul className="breadcrumb-list">
               {fullLinks.map((link, index) => (
                   <li key={index} className={style["breadcrumbs__item"]}>
                   {index < fullLinks.length - 1 ? (
                       <>
                       <a href={link.url}>{link.name}</a>
                       </>
                   ) : (
                       (<span className={style.active}>{link.name}</span>) // Last item displayed as text
                   )}
                   </li>
               ))}
               </ul>
           </nav>
     </div>

     <script type="application/ld+json"  dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}/>
     </section>
  </>);
};
export default BreadCramp;
