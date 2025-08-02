'use client';

import { useEffect, useState } from 'react';
import styles from '@/sass/PriceTable.module.scss';
import { Product } from "@/lib/Interface/MagentoCatResponse";
import EcommercePrice from '@/lib/jslib/Price';
import { getCurrencySymbol } from '@/utils/currencySymbols';

interface Ptable {
  products: Product[];
}

export default function PriceTable({ products }: Ptable) {
  const [monthYear, setMonthYear] = useState('');

  useEffect(() => {
    const date = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' });
    setMonthYear(formatter.format(date));
  }, []);

  const topProducts = products.slice(0, 10);
  
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": `Best CCTV Camera Price in Bangladesh – ${monthYear}`,
  "itemListElement": products.slice(0, 10).map((product, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "item": {
      "@type": "Product",
      "name": product.name,
      "offers": {
        "@type": "Offer",
        "price": product.final_price.toFixed(2), // Ensure price is formatted correctly
        "priceCurrency": "BDT",
        "availability": "https://schema.org/InStock"
      }
    }
  }))
};

  return (
    <section className={styles.wrapper}>
      <h2 className={styles.heading}>
        Top CCTV Camera Price in Bangladesh
      </h2>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Best CCTV Camera Price in Bangladesh. {monthYear.toUpperCase()}</th>
              <th>Latest Price</th>
            </tr>
          </thead>
          <tbody>
            {topProducts.map((p, idx) => (
              <tr key={idx}>
                <td>{p.name}</td>
                {p?.final_price === 0 ? (
                  <td>Call for Price</td>
                ) : (
                  <td>{EcommercePrice.getEuroPrice(
                    p?.final_price,
                    p?.price?.regularPrice?.amount.currency ?? '',
                    getCurrencySymbol(p?.price?.regularPrice?.amount.currency ?? '')
                  )}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* SEO Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}
