import { headers } from 'next/headers';
import { getDeviceType } from '@/lib/jslib/deviceDetection';

import type { Metadata } from "next";
import React from 'react';
import '@/sass/home_basic.scss';

import SliderSection from '@/components/home/SliderSection';
import HomeH1 from '@/components/home/HomeH1';
import HomeService from '@/components/home/HomeService';
import HomeCategory from '@/components/home/HomeCategory';
import WeeklyOffer from '@/components/home/WeeklyOffer';
import DailyOffer from '@/components/home/DailyOffer';
import FeatureSlider from '@/components/home/FeatureSlider';
import BrandSlider from '@/components/home/BrandSlider';
import Map from '@/components/home/Map';
import HomeHidden from '@/components/home/HomeHidden';
import HomeBlog from "@/components/home/HomeBlog";
import HeroMobile from '@/components/home/HeroMobile';

import {
  getHomeData,
  getHomePost
} from '@/lib/loaders/homeLoader';

import { PostsData } from '@/lib/Interface/HomeInterface';
import { HomeSlider as HomeSliderInterfce } from '@/lib/Interface/HomeInterface';

import ProfessionalService from '@/components/home/ProfessionalService';
import PageBuilder from "@/lib/jslib/PageBuilder";

export const revalidate = 60;

// ✅ Type fix for metadata block
interface MetaItem {
  type: 'script' | 'meta';
  content?: unknown;
  attributes?: {
    name?: string;
    content?: string;
  };
}

// ✅ Async Metadata generator
export async function generateMetadata(): Promise<Metadata> {
  const homeData = await getHomeData();
  const parsedJsonString = PageBuilder.fromatMetaData(homeData?.cmsPage.meta_extra ?? '');
  const parsedData: MetaItem[] = JSON.parse(parsedJsonString);

  const otherMeta: Record<string, string> = {};

  if (Array.isArray(parsedData)) {
    parsedData.forEach((item) => {
      if (item.type === "meta" && item.attributes?.name && item.attributes?.content) {
        otherMeta[item.attributes.name] = item.attributes.content;
      }
    });
  }

  return {
    ...(homeData?.cmsPage?.meta_title ? { title: homeData.cmsPage.meta_title } : {}),
    ...(homeData?.cmsPage?.meta_description ? { description: homeData.cmsPage.meta_description } : {}),
    ...(homeData?.cmsPage?.meta_keywords ? { keywords: homeData.cmsPage.meta_keywords } : {}),
    other: otherMeta,
  };
}

const page = async () => {
  
  const homeData = await getHomeData();
  const homePost = await getHomePost();

  const sliderItems = homeData?.sliderItems ?? undefined;
  const HomePageData = homeData?.HomePageData ?? undefined;
  const WeeklyDeals = homeData?.WeeklyOffer ?? undefined;
  const DailyDeals = homeData?.DailyOffer ?? undefined;
  const OtherSides = homeData?.OtherSiteItems ?? undefined;
  const postsData: PostsData = homePost ?? { posts: { edges: [] } };

  const Home_sliders: HomeSliderInterfce[] = Array.isArray(homeData?.HomeSlider)
    ? homeData.HomeSlider
    : homeData?.HomeSlider
      ? [homeData.HomeSlider]
      : [];

  const parsedJsonString = PageBuilder.fromatMetaData(homeData?.cmsPage.meta_extra ?? '');
  const parsedData: MetaItem[] = JSON.parse(parsedJsonString);

  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';
  const deviceType = getDeviceType(userAgent);
  const isMobile = deviceType === 'mobile';
  const sort_orders: string[] | null = HomePageData?.short_map ?? null;
  const site = process.env.MAGENTO_ENDPOINT_SITE;

  return (
    <>
      {Array.isArray(parsedData) &&
        parsedData.map((item, index) => {
          if (item.type === 'script') {
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

      <div className='cms_home'>
        {isMobile ? (
          <HeroMobile SliderItems={Array.isArray(sliderItems) ? sliderItems : []} />
        ) : (
          <SliderSection
            SliderItems={Array.isArray(sliderItems) ? sliderItems : []}
            SideBanner={HomePageData?.home_slider_banner_enable ?? ''}
            BannerBlock={HomePageData?.home_slider_banner_block ?? ''}
            showVmenu={HomePageData?.enable_secondary_menu ?? ''}
            site = {site ?? ""}
          />
        )}

        {sort_orders && Array.isArray(sort_orders) && sort_orders.map((key, index) => (
          <React.Fragment key={index}>
            {key === 'HomeH1' && HomePageData?.show_home_h1 === "1" && (
              <HomeH1 Title={HomePageData.home_h1} Para={HomePageData.home_p} />
            )}

            {key === 'CategoryBlock' && HomePageData?.show_category_list === "1" && (
              <HomeCategory
                CatTitle={HomePageData?.category_title}
                CatP={HomePageData?.category_p}
                CatData={HomePageData?.category_list}
                SiteUrl={site ?? ""}
              />
            )}

            {key === 'PromoBlock' && HomePageData?.show_promo_block === "1" && (
              <HomeService Promo={HomePageData?.promo_block} />
            )}

            {key === 'WeeklyDeals' && WeeklyDeals?.weekly_show === "1" && (
              <WeeklyOffer
                weeklyData={WeeklyDeals}
                mobile={isMobile}
                site={site ?? ""}
                phone={HomePageData?.store_phone ?? ''}
                auto={WeeklyDeals?.auto_slide ?? ''}
              />
            )}

            {key === 'DailyDeals' && DailyDeals?.daily_show === "1" && (
              <DailyOffer
                dailyData={DailyDeals}
                site={site ?? ""}
                phone={HomePageData?.store_phone ?? ''}
                auto={DailyDeals?.auto_slide ?? ''}
              />
            )}

            {key === 'HiddenContent' && HomePageData?.show_visible_content === "1" && (
              <HomeHidden
                visible_title={HomePageData?.visible_title ?? ''}
                visible_content={HomePageData?.visible_content ?? ''}
                hidden_content={homeData?.cmsPage.content ?? 'No content available'}
              />
            )}

            {key === 'Blog' && HomePageData?.show_blog === "1" && !isMobile && (
              <HomeBlog
                BlogTitle={HomePageData.blog_title ?? ''}
                BlogParagraph={HomePageData.blog_p ?? ''}
                PostsData={postsData?.posts?.edges}
              />
            )}

            {key === 'OtherSite' && HomePageData?.show_other_site === "1" && (
              <ProfessionalService
                siteTitle={HomePageData?.other_site_title}
                site_p={HomePageData?.other_site_p}
                type={HomePageData?.other_site_slide_grid}
                auto={HomePageData?.other_site_auto_slide}
                PostsData={OtherSides ?? []}
                site={site ?? ""}
              />
            )}

            {key === 'BrandBlock' && HomePageData?.show_brand === "1" && !isMobile && (
              <BrandSlider
                images={Array.isArray(HomePageData.brand_images)
                  ? HomePageData.brand_images
                  : (HomePageData.brand_images ? [HomePageData.brand_images] : [])}
                site={site ?? ""}
              />
            )}

            {key === 'GoogleMap' && HomePageData?.show_map === "1" && !isMobile && (
              <Map src={HomePageData.map_content ?? ''} width="100%" height="300px" />
            )}

            {key.startsWith('HomeSlider') && Home_sliders.length > 0 && (() => {
              const index = parseInt(key.replace('HomeSlider', ''), 10) - 1;
              const slider = Home_sliders[index];
              if (slider && slider.slider_enable === "1") {
                return (
                  <FeatureSlider
                    key={`FeatureSlider-${index}`}
                    title={slider.slider_title ?? ''}
                    paragaph={slider.slider_p ?? ''}
                    banner={slider.Banner_block ?? ''}
                    show_banner={slider.show_banner ?? ''}
                    banner_before_title={slider.banner_before_title ?? ''}
                    slider_products={slider.slider_products ?? []}
                    auto={slider.auto_slide ?? ''}
                    magento={site ?? ''}
                    phone={HomePageData?.store_phone ?? ''}
                  />
                );
              }
              return null;
            })()}
          </React.Fragment>
        ))}
      </div>
    </>
  );
};

export default page;
