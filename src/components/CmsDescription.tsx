import Image from 'next/image';
import CategoryVideo from '@/components/ProductPage/CMSVideo';

interface CMSDescriptionProps {
  data: string;
}

import React from 'react';
import ContentCollector , { ContentItem } from '@/lib/jslib/ContentCollector';

const CmsDescription: React.FC<CMSDescriptionProps> = ({ data }) => {

    //let description_data= [] as ContentItem[];
    // Collect content from the description using ContentCollector
    const description_data = new ContentCollector(data).collect() ?? [];

    

  return (
    <div className='cms-description'>
            <div className='product_description'>
                {description_data.map((item, index) => {
                    switch (item.type) {
                    case 'html':
                        return (
                        <div className='description_html' key={index} dangerouslySetInnerHTML={{ __html: item.content }} />
                        );

                      case 'row':
                        return (  
                          <div className='row_container'  key={index}> {foramt_row(item)} </div>
                        );

                        case 'heading':
                        return (
                          <h2 key={index} dangerouslySetInnerHTML={{ __html: item.content }} />
                        );

                    default:
                        return (
                        <div
                            key={index}
                            dangerouslySetInnerHTML={{ __html: item.content }}
                        />
                        );
                    }
                })}
            </div>
    </div>
  )
}


function foramt_row(row: ContentItem) {

  return (
      <>
        {row.children?.map((item, index) => {
                    switch (item.type) {
                    case 'html':
                        return (
                        <div className='html_content' key={index} dangerouslySetInnerHTML={{ __html: item.content }} />
                        );
                      case 'column-group':
                        return (  
                          <div  key={index}>    {foramt_row(item)}  </div>
                        );

                      case 'heading':
                        return (
                          <div className='heading_content' key={index} dangerouslySetInnerHTML={{ __html: item.content }} />
                        );

                        case 'text':
                        return (  
                            <div className='text_content' key={index} dangerouslySetInnerHTML={{ __html: item.content }} />
                        );

                      case 'image':
                        return    process_image(item.content , index );


                      case 'video':
                        return    process_video(item.content , index );


                      case 'column-line':
                        return (  
                          <div className='row'  key={index}>    {foramt_column_line(item)}  </div>
                        );




                    default:
                        return (
                        <div className='other_content' key={index} dangerouslySetInnerHTML={{ __html: item.content }} />
                        );
                    }
                })}
      
     </>
  );
}





function foramt_column_line(row: ContentItem) {

        let className = 'col-sm-6';
        if (row.children && row.children.length === 1) {
          className = 'col-sm-12';
        }
        if (row.children && row.children.length === 3) {
          className = 'col-sm-6 col-md-4';
        }
        if (row.children && row.children.length === 4) {
          className = 'col-md-3 col-sm-6';   
        }


  return (
    <>
        {row.children?.map((item, index) => {
                    switch (item.type) {
                    case 'html':
                        return (
                           <div className='html_content' key={index} dangerouslySetInnerHTML={{ __html: item.content }} />
                        );

                      case 'column':
                        return (  
                          <div className={className} key={index}>     {foramt_column_line(item)}   </div>
                        );

                      case 'heading':
                        return (
                          <div className='heading_content' key={index} dangerouslySetInnerHTML={{ __html: item.content }} />
                        );

                        case 'text':
                        return (  
                            <div className='text_content' key={index} dangerouslySetInnerHTML={{ __html: item.content }} />
                        );

                      case 'image':
                        return    process_image(item.content , index );


                      case 'video':
                        return    process_video(item.content , index );

                    default:
                        return (
                        <div className='other_content' key={index} dangerouslySetInnerHTML={{ __html: item.content }} />
                        );
                    }
                })}
      
    </>
  );
}



function process_image(image: string , index: number) {
   const parts = image.split("#");
   const url = parts[0] || "";
   const alt = parts[1] || "";
   const title = parts[2] || "";

  return (
    <div key={index} className='image_container' style={{ display: 'flex', justifyContent: 'center', alignItems:'center' }}>
        <Image style={{maxWidth:'100%',height:'auto'}} src={url} alt={alt} title={title} width={800} height={400}        
         />
 </div>
  );
}



function process_video(url: string , index: number) {
   
 const parts = url.split("/");

 const code = parts[parts.length - 1] || null;

  if(code) {

  return (
    <div key={index} className='video_container' style={{ display: 'flex', justifyContent: 'center', alignItems:'center' }}>

                   
        <CategoryVideo video_code={code ?? ""} name="CLS Computer" />
                  
         <Image style={{maxWidth:'100%',height:'auto'}} src={`https://img.youtube.com/vi/${code}/maxresdefault.jpg`} alt="CLS" title="CLS" width={1280} height={720}        
         /> 
 </div>
  );
  }
}



export default CmsDescription