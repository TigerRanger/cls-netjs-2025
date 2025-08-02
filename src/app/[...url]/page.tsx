
import { sanitizeSearchParams } from "@/lib/jslib/Security";

import PageWithFilter from "@/components/ProductPage/PageWithFilter";

import BreadCramp from "@/components/Page/BreadCramp";

import NotFound from "@/app/not-found";

import fetchProductPage from "@/lib/Apollo/fetchProductPage";

import ProductDetails from "@/components/SingleProduct/ProductDetails";

import PageBuilder from "@/lib/jslib/PageBuilder";

import { fetchMagentoFilterProducts }  from "@/lib/Magento/fetchMagentoFilterProducts";

import {load_category , check_cache} from "@/lib/loaders/categoryLoader";


import {getOnlyMenuData } from "@/lib/loaders/menuLoader";

export const revalidate = 60; // ⬅️ Static cache for 60 seconds if used with fetch

interface DynamicPageProps {
  params: Promise<{ [key: string]: string | string[] }>;
  searchParams?: Promise<Record<string, string | string[]>>;
}

const otherMeta: Record<string, string> = {};

interface ParsedMetaAttribute {
  name?: string;
  content?: string;
  [key: string]: string | undefined;
}

type StructuredDataContent = Record<string, unknown> | Record<string, unknown>[];

interface ParsedMetaItem {
  type: "meta" | "script" | "link" | string;
  attributes?: ParsedMetaAttribute;
  content?: StructuredDataContent | string;
  [key: string]: string | ParsedMetaAttribute | StructuredDataContent | undefined;
}

import { FilterList } from "@/lib/Interface/FilterInterface";

export async function generateMetadata({ params }: DynamicPageProps) {
  const resolvedParams = await params;
  const urlSegments = resolvedParams.url;
  const urlKey = Array.isArray(urlSegments) ? urlSegments.at(-1) ?? "" : urlSegments || "";
  const canonicalUrl = Array.isArray(urlSegments) ? urlSegments.join("/") : urlSegments || "";
  const categories = await getOnlyMenuData();
  const matchedCategory = categories?.find(category => category?.canonical_url === canonicalUrl);

  if (matchedCategory) {
    try {
      const categoryData = await load_category("cat_" + matchedCategory.id);
      const seoData = categoryData?.categoryList[0];
      const parsedMeta = JSON.parse(PageBuilder.fromatMetaData(seoData.meta_extra ?? ''));

      if (Array.isArray(parsedMeta)) {
        parsedMeta.forEach((item: ParsedMetaItem) => {
          if (item.type === "meta" && item.attributes?.name && item.attributes?.content) {
            otherMeta[item.attributes.name] = item.attributes.content;
          }
        });
      }

      return {
        title: seoData.meta_title || seoData?.name,
        description: seoData.meta_descrption || "Meta Description Need to set.",
        ...(seoData?.meta_keywords ? { keywords: seoData.meta_keywords } : {}),
        other: otherMeta,
        alternates: {
          canonical: `${process.env.MAGENTO_ENDPOINT_SITE}/${canonicalUrl}`,
          languages: {
            "en-US": `${process.env.MAGENTO_ENDPOINT_SITE}/${canonicalUrl}`,
          },
        },
      };
    } catch (e) {
      console.error(e);
    }
  } else if (urlKey) {
    const final_url_key = urlKey.split('.')[0];
    let ProductData = await check_cache(final_url_key);
    if (!ProductData) {
      ProductData = await fetchProductPage({ productUrl: final_url_key });
      if (!ProductData || ProductData?.products?.items?.length === 0) {
        return { title: "Page Not Found", description: "The requested page could not be found." };
      }
    }
    const product = ProductData.products.items[0];
    return {
      title: ProductData?.prducts?.meta_title || product?.name || "Single Product",
      description: ProductData?.prducts?.meta_description || product?.name || "Product Description",
      ...(ProductData?.prducts?.meta_keywords ? { keywords: ProductData?.prducts?.meta_keywords } : {}),
      openGraph: {
        title: product?.name || "Single Product",
        description: ProductData?.prducts?.meta_description || product?.name,
        url: `${process.env.MAGENTO_ENDPOINT_SITE}/${final_url_key}`,
        type: "article",
        images: [
          {
            url: product?.media_gallery_entries?.[0]?.file
              ? `${process.env.MAGENTO_ENDPOINT_SITE}${product.media_gallery_entries[0].file}`
              : "/images/no_image.avif",
            alt: product?.name || "Product Image",
          },
        ],
      },
      alternates: {
        canonical: `${process.env.MAGENTO_ENDPOINT_SITE}/${final_url_key}`,
        languages: {
          "en-US": `${process.env.MAGENTO_ENDPOINT_SITE}/${final_url_key}`,
        },
      },
    };
  }

  return { title: "Page Not Found", description: "The requested page could not be found." };
}

export default async function DynamicPage({ params, searchParams }: DynamicPageProps) {
  const resolvedParams = await params;
  const urlSegments = resolvedParams.url;
  const urlKey = Array.isArray(urlSegments) ? urlSegments.at(-1) ?? "" : urlSegments || "";
  const resolvedSearchParams = sanitizeSearchParams(await searchParams);
  const canonicalUrl = Array.isArray(urlSegments) ? urlSegments.join("/") : urlSegments || "";
  const hasSearchParams = Object.keys(resolvedSearchParams).length > 0;

  const categories = await getOnlyMenuData();
  const matchedCategory = categories?.find(category => category?.canonical_url === canonicalUrl);

  if (matchedCategory) {
    try {
      const categorydata = await load_category("cat_" + matchedCategory.id);
      let hasSuffix: string | boolean = false;

      if (Array.isArray(urlSegments) && urlSegments.length >= 2) {
        const lastSegment = urlSegments[urlSegments.length - 1];
        const match = lastSegment.match(/\.[a-zA-Z0-9]+$/);
        hasSuffix = match ? match[0] : false;
      }

      const links = (Array.isArray(urlSegments) ? urlSegments.slice(0, -1) : []).map((urlSegment, index) => ({
        name: urlSegment.charAt(0).toUpperCase() + urlSegment.slice(1),
        url: hasSuffix
          ? `/${(Array.isArray(urlSegments) ? urlSegments.slice(0, index + 1) : []).join("/")}${hasSuffix}`
          : `/${(Array.isArray(urlSegments) ? urlSegments.slice(0, index + 1) : []).join("/")}`,
      }));

      links.push({ name: matchedCategory.name, url: "/" });

      const SeoDat = categorydata?.categoryList[0];
      const parsedJsonString = PageBuilder.fromatMetaData(SeoDat.meta_extra ?? '');
      const parsedData: ParsedMetaItem[] = JSON.parse(parsedJsonString);

      if (Array.isArray(parsedData)) {
        parsedData.forEach((item: ParsedMetaItem) => {
          if (item.type === "meta" && item.attributes?.name && item.attributes?.content) {
            otherMeta[item.attributes.name] = item.attributes.content;
          }
        });
      }

      if (hasSearchParams) {
        const sort = resolvedSearchParams["sort"] ?? "position";
        const direction = resolvedSearchParams["direction"] ?? "ASC";
        const minPrice = parseFloat(Array.isArray(resolvedSearchParams["min_price"]) ? resolvedSearchParams["min_price"][0] : resolvedSearchParams["min_price"] ?? "0");
        const maxPrice = parseFloat(Array.isArray(resolvedSearchParams["max_price"]) ? resolvedSearchParams["max_price"][0] : resolvedSearchParams["max_price"] ?? "0");
        const pageGridsize = resolvedSearchParams["pagesize"] ?? 15;
        const staticKeys = ["sort", "direction", "min_price", "max_price", "page", "pagesize"];
        const Page = resolvedSearchParams["page"] ?? 1;
        const searchfilters: Record<string, string[]> = {};

        Object.entries(resolvedSearchParams).forEach(([key, value]) => {
          if (!staticKeys.includes(key)) {
            if (typeof value === "string") {
              searchfilters[key] = value.split(",").filter(Boolean);
            } else if (Array.isArray(value)) {
              searchfilters[key] = value.flatMap(v => v.split(",")).filter(Boolean);
            }
          }
        });

        const filterListArray: FilterList[] = Object.entries(searchfilters).map(([attribute_code, values]) => ({
          attribute_code,
          count: 0,
          label: attribute_code,
          position: null,
          value: null,
          options: values.map(value => ({ count: 0, label: value, value, active: true }))
        }));

        const filter_data = {
          currentPage: Number(Page) || 1,
          pageSize: Number(pageGridsize),
          sortBy: Array.isArray(sort) ? sort[0] : sort,
          sortDirection: Array.isArray(direction) ? direction[0] : direction,
          categoryId: String(matchedCategory.id),
          filters: filterListArray,
          minPrice: isNaN(minPrice) ? null : Number(minPrice),
          maxPrice: isNaN(maxPrice) ? null : Number(maxPrice),
        };

        const filterProducts = await fetchMagentoFilterProducts(filter_data);

        return (
          <>
            {parsedData.map((item, i) => item.type === 'script' ? <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(item.content) }} /> : null)}
            <BreadCramp links={links} />
            <PageWithFilter CategoryList={SeoDat} Agg={categorydata?.products.aggregations} products={filterProducts} filter_data={filter_data} />
          </>
        );
      }

      return (
        <>
          {parsedData.map((item, i) => item.type === 'script' ? <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(item.content) }} /> : null)}
          <BreadCramp links={links} />
          <PageWithFilter CategoryList={SeoDat} Agg={categorydata?.products.aggregations} products={categorydata?.products} filter_data={null} />
        </>
      );
    } catch (e) {
      console.log(e);
    }
  } else {
    if (!urlKey) return <NotFound />;
    const final_url_key = urlKey.split('.')[0];
    let ProductData = await check_cache(final_url_key);
    if (!ProductData) {
      ProductData = await fetchProductPage({ productUrl: final_url_key });
      if (!ProductData || ProductData?.products.items.length === 0) {
        return <NotFound />;
      }
    }
    return <ProductDetails product={ProductData?.products.items[0] || null} urlkey={urlKey} />;
  }
  return <NotFound />;
}