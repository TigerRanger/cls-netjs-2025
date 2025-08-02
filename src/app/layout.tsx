import type { Metadata } from "next";
import { Sarabun } from "next/font/google";
import "@/sass/global.scss";

import Header from "@/components/header/Header";
import Footer from "@/components/Footer/Footer";
import PageBuilder from "@/lib/jslib/PageBuilder";
import ScrollUp from "@/components/ScrollUp";
import GlobalMsg from "@/components/GlobalMsg";
import Preload from "@/components/Preload";
import ClientProvider from "@/components/ClientProvider";

import { getMenuData } from "@/lib/loaders/menuLoader";

import { store } from "@/redux/store";  // Import Redux store
import { setBaseCurrency } from "@/redux/cartSlice"; 

const sarabun = Sarabun({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "700"],
  display: "swap",
  variable: '--font-sarabun',
});

export const revalidate = 60;

// Define type for parsed metadata items
type MetaScriptItem = {
  type: 'meta' | 'script';
  attributes?: Record<string, string>;
  content?: unknown;
};

export async function generateMetadata(): Promise<Metadata> {
  const menuData = await getMenuData();
  const storeConfig = menuData?.storeConfig ?? undefined;

  return {
    title: storeConfig?.default_title ?? "NextMagento Bazer 1.0.5",
    description: storeConfig?.default_description ?? "High Performance Next.js Theme for Magento 2",
    keywords: storeConfig?.default_keywords ?? "Next.js, Magento 2, Theme, E-commerce",
    alternates: {
      canonical: process.env.MAIN_SITE_URL,
      languages: {
        "en-US": process.env.MAIN_SITE_URL,
      },
    },
    manifest: '/manifest.json',
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const menuData = await getMenuData();
  const storeConfig = menuData?.storeConfig ?? undefined;
  const storeInfo = menuData?.getStoreInfo ?? undefined;
  const categoriList = menuData?.categoryList ?? undefined;

  store.dispatch(setBaseCurrency(storeConfig?.base_currency_code ?? null));
  store.dispatch({
    type: 'cart/setIsGuestCheckoutEnabled',
    payload: storeConfig?.is_guest_checkout_enabled? (storeConfig?.is_guest_checkout_enabled === '1' ? true : false) : false,
  });

  const parsedJsonString = PageBuilder.fromatMetaData(storeConfig?.head_includes ?? '');
  const parsedData: MetaScriptItem[] = JSON.parse(parsedJsonString);

  return (
    <html lang="en">
      <head>
        {storeConfig?.head_shortcut_icon && (
          <link
            rel="shortcut icon"
            href={`${process.env.MAGENTO_ENDPOINT_SITE}/pub/media/favicon/${storeConfig.head_shortcut_icon}`}
          />
        )}

        {parsedData.map((item: MetaScriptItem, index: number) => {
          if (item.type === 'meta' && item.attributes) {
            return <meta key={index} {...item.attributes} />;
          }
          if (item.type === 'script' && item.content) {
            return (
              <script
                key={index}
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(item.content) }}
              />
            );
          }
          return null;
        })}

        <meta property="fb:app_id" content={storeInfo?.faccbook_app_id ??"no_id"} />
      </head>
      <body className={sarabun.variable}>
        <ClientProvider>
          <Header MenuItem={categoriList} StoreConfig={storeConfig} StoreInfo={storeInfo} />
          <Preload />
          {children}
          <GlobalMsg />
          <Footer Setting={storeConfig} StoreInfo={storeInfo} />
        </ClientProvider>

        {storeConfig?.absolute_footer && (
          <div
            className="hidden_block"
            dangerouslySetInnerHTML={{ __html: storeConfig.absolute_footer }}
          />
        )}
        <ScrollUp />
      </body>
    </html>
  );
}
