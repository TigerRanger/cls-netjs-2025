"use client";

import React, { useState } from 'react';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';


interface TabsPop{

    details:string ;
    special:string;
}



const TabBlock:React.FC<TabsPop> = ({details , special=null }) => {
  const [fadeClass, setFadeClass] = useState('fade-in');

  // Function to trigger the fade animation
  const handleTabSelect = () => {
    setFadeClass('fade-in'); // Reset the animation class
    setTimeout(() => setFadeClass(''), 300); // Clear it after animation is done (adjust timing to match CSS)
  };

  return (
    <>
      <Tabs onSelect={handleTabSelect}>
        <TabList>
          <Tab><span>Details</span></Tab>
          {
             special!==null && 
             <Tab><span>Specification</span></Tab>
          }

          <Tab><span>Review</span></Tab>
        </TabList>

        <TabPanel>
          <div className={fadeClass} dangerouslySetInnerHTML={{ __html: details }} />
        </TabPanel>

        {
          special!==null && 
        <TabPanel>
          <div className={fadeClass}>Content for Tab 2</div>
        </TabPanel>

        }

        <TabPanel>
          <div className={fadeClass}>Review Block</div>
        </TabPanel>
      </Tabs>

      <style jsx>{`
        .fade-in {
          opacity: 0;
          animation: fadeIn 0.3s ease-in forwards;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};

export default TabBlock;


// Tab has Problem need to use react bootstrap tabs

