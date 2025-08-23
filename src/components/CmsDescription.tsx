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

export default CmsDescription



