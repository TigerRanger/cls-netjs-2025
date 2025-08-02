'use client';

import Accordion from '@/components/Helper/Accordion';

import { parseAccordionData } from '@/utils/parseAccordionData';






interface FAQProps {
  queList :string;
  ansList: string;
}

const FAQPage: React.FC<FAQProps> = ({ queList , ansList }) => {

  const faqData = parseAccordionData(queList,ansList);

  

// Generate FAQPage JSON-LD schema
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": (faqData ? faqData : []).map((item) => ({
    "@type": "Question",
    "name": item.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": item.answer
    }
  }))
};


  return (

    <>

      {faqData && (
        <>
        <h2 className='faq_title'> Feaquinty Ask Question ?</h2>   
        <Accordion items={faqData} />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />

        </>
      )}


    </>
  );
}


export default FAQPage;