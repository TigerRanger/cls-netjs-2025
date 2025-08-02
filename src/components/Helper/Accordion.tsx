'use client';

import { useState } from 'react';
import styles from '@/sass/Accordion.module.scss'; // make sure you create this SCSS file

interface AccordionItem {
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
}

export default function Accordion({ items }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={styles.accordionWrapper}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div key={index} className={styles.item}>
            <button
              className={styles.toggle}
              onClick={() => toggleAccordion(index)}
              aria-expanded={isOpen}
            >
              <span className={styles.title}>{item.question}</span>
              <span className={`${styles.icon} ${isOpen ? styles.open : ''}`}>
                {isOpen ? '−' : '+'}
              </span>
            </button>
            {isOpen && (
              <div className={styles.content}>
                <p>{item.answer}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
