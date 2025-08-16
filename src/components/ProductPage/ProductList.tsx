"use client";

import React, { useEffect, useState, useRef , useCallback } from 'react';
import Image from 'next/image';
import {useDispatch } from "react-redux";

import gridSvg from "../../../public/svg-icon/grid-white.svg";
import listSvg from "../../../public/svg-icon/list-white.svg";
import plusSvg from "../../../public/svg-icon/cart-main.svg";



const  PhoneSvg = "/svg-icon/phone.svg";
const ConfigSvg = "/svg-icon/config.svg";
const ClockSvg = "/images/clock.svg";
const CartPlus = "/images/cart_plus.svg";

import FallbackImage from "../Helper/FallbackImage";
import EcommercePrice from "@/lib/jslib/Price";
import { showMsg } from '@/lib/jslib/GlobalMsgControl';

import ProductFilter from '@/components/ProductPage/ProductFilter';
import PaginationProduct from '../PaginationProduct';

import { Product, page_info } from "@/lib/Interface/MagentoCatResponse";
import { addProductToCart } from "@/redux/cartSlice";
import {  AppDispatch } from "@/redux/store";
import { fetchMagentoProducts } from "@/app/lib/actions";

import { getCurrencySymbol } from '@/utils/currencySymbols';

import {Aggregation , FilterList , CustomFilter } from "@/lib/Interface/FilterInterface";

const sort_by_fixed = [
  { value: 'position', label: 'Position' },
  { value: 'name', label: 'Product Name' },
  { value: 'price', label: 'Price' },
];

interface ProductListProps {
  products: Product[];
  info: page_info | null;
  type: boolean;
  total: number;
  filters: Aggregation[] | null;
  magento: string;
  phone: string;
  Category_id?: string;
  page_sort_data: {
    default_sort_by: string;
    default_sort_direction: string;
    grid_per_page: number;
    grid_per_page_values: number[];
  };
  filter_data : CustomFilter | null;
  Currency_code: string;
}

const ProductList: React.FC<ProductListProps> = ({
  products: initialProducts,
  info,
  type,
  total,
  filters,
  magento,
  phone,
  Category_id,
  page_sort_data,
  filter_data,
  Currency_code
}) => {

  const url_filters = filter_data?.filters ?? [];
  const infoPageSize = info?.page_size ?? 15;

  const filtersWithActive = filters
    ? filters.map((agg) => {
        const urlFilter = url_filters.find(
          (f) => f.attribute_code === agg.attribute_code
        );
        return {
          ...agg,
          options: agg.options.map((opt) => ({
            ...opt,
            active:
              urlFilter?.options.some((fOpt) => fOpt.value === opt.value) ||
              false,
          })),
        };
      })
    : [];


const NZpriceFilter = filters?.find((filter) => filter.attribute_code === "price") ?? null;
const firstValue = NZpriceFilter?.options?.[0]?.value ?? "0_0";
const lastValue = NZpriceFilter?.options?.[NZpriceFilter.options.length - 1]?.value ?? "0_1000";
// Extract min from the first value (e.g., "20_30" → 20)
const NZMinPrice = parseInt(firstValue.split("_")[0], 10) || 0;
// Extract max from the last value (e.g., "80_90" → 90)
const NZMaxPrice = parseInt(lastValue.split("_")[1], 10) || 1000;


  const [sortValue, setSortValue] = useState(page_sort_data?.default_sort_by || "position");
  const [sortDirection, setSortDirection] = useState(page_sort_data?.default_sort_direction || "ASC");
  const [gridPerPage, setGridPerPage] = useState(page_sort_data?.grid_per_page || 12);
  const [gridPerPageValues] = useState(page_sort_data?.grid_per_page_values || [12, 24, 36]);
  const [gridMode, setGridMode] = useState(true);

  const [totalCount, setTotalCount] = useState<number>(total);
  const [currentPage, setCurrentPage] = useState<number>(info?.current_page || 1);
  const [totalPages, setTotalPages] = useState<number>(info?.total_pages || 1);
  const [pageSize, setPageSize] = useState<number>(infoPageSize || 12);

  const [products, setProducts] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [productID, setProductID] = useState<string | null>(null);

  const [maxPrice , SetmaxPrice] = useState<number>(0);
  const [minPrice , SetminPrice] = useState<number>(0);

  const [activeFilters, setactiveFilters] = useState<FilterList[] | []>([]);

  const dispatch = useDispatch<AppDispatch>();

  const setMaxMin = async ( max:number , min:number ) => {
    SetmaxPrice(max);
    SetminPrice(min);
  }

  const userTriggeredRef = useRef(false);

  const updateProductLayout = useCallback(async () => {
    try {
      if (!userTriggeredRef.current) return;

      if (Category_id && Category_id !== "") {
        setLoading(true);
        showPreload();

        const result = await fetchMagentoProducts({
          currentPage,
          pageSize: gridPerPage,
          sortBy: sortValue,
          sortDirection,
          categoryId: Category_id ?? '',
          filters: activeFilters ?? [],
          minPrice,
          maxPrice,
        });

        setProducts(result?.items ?? []);
        setLoading(false);
        setTotalCount(result?.total_count ?? 0);
        setCurrentPage(result?.page_info.current_page ?? 1);
        setTotalPages(result?.page_info.total_pages ?? 1);
        setPageSize(result?.page_info.page_size ?? info?.page_size ?? 15);

        const productListElement = document.querySelector('.product_list_wrapper');
        if (productListElement) {
          productListElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        const params = new URLSearchParams();
        if (currentPage > 1) {
          params.set("page", String(currentPage));
        }
        if (sortValue) {
          params.set("sort", sortValue);
          params.set("direction", sortDirection.toLowerCase());
        }
        if (gridPerPage) {
          params.set("pagesize", String(gridPerPage));
        }
        if (minPrice !== undefined && maxPrice !== undefined) {
          params.set("min_price", String(minPrice));
          params.set("max_price", String(maxPrice));
        }
        activeFilters.forEach((filter) => {
          const selectedValues = filter.options.map((o) => o.value).join(',');
          if (selectedValues) {
            params.set(filter.attribute_code, selectedValues);
          }
        });

        const cleanPath = window.location.href.split(/[?#]/)[0];
        const newUrl = `${cleanPath}?${params.toString()}`;
        window.history.pushState({}, '', newUrl);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      showMsg("Something went wrong while updating the product list", "alert");
    } finally {
      userTriggeredRef.current = false;
      hidePreload();
    }
  }, [
    currentPage,
    sortValue,
    sortDirection,
    gridPerPage,
    activeFilters,
    maxPrice,
    minPrice,
    Category_id,
    info?.page_size // ✅ fixed missing dependency
  ]);

  useEffect(() => {
    updateProductLayout();
  }, [updateProductLayout]);

  const handleAddToCart = (product: Product, qty: number) => (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setProductID(String(product.id));
    const cartProduct = {
      id: String(product.id),
      sku: product.sku,
      name: product.name,
      price: product.final_price ?? 0,
      type: product.product_type ?? null,
      option: [],
      qty: qty ?? 1,
      price_text: '',
      product_url: product.canonical_url ?? '',
      product_image: product.image?.url
        ? magento + '/pub/media/catalog/product/' + product.image?.url
        : product.custom_image ?? '',
      is_egis: false,
      isLoading: false,
    };
    dispatch(addProductToCart(cartProduct, qty, showPreload, hidePreload));
  };

  const triggerUserAction = () => {
    userTriggeredRef.current = true;
  };

  const gridUpdate = (data: number) => {
    userTriggeredRef.current = true;
    setGridPerPage(data);
    setCurrentPage(1);
  };

  const setSortValueHandler = (value: string) => {
    userTriggeredRef.current = true;
    setSortValue(value);
    setCurrentPage(1);
  };

  const toggleSortDirection = () => {
    userTriggeredRef.current = true;
    setSortDirection((prev) => (prev === "ASC" ? "DESC" : "ASC"));
  };

  const UpdatePagination = (c_page: number) => {
    userTriggeredRef.current = true;
    setCurrentPage(c_page);
  };

  const showPreload = () => {
    const preloadWrapper = document.querySelector('.preloadWrapper');
    if (preloadWrapper) {
      (preloadWrapper as HTMLElement).style.display = 'flex';
    }
  };

  const hidePreload = () => {
    const preloadWrapper = document.querySelector('.preloadWrapper');
    if (preloadWrapper) {
      (preloadWrapper as HTMLElement).style.display = 'none';
    }
    setProductID(null);
  };

  useEffect(() => {
    setTimeout(() => {
      setProducts(initialProducts || []);
      setLoading(false);
    }, 10);
  }, [initialProducts]);

  const renderPlaceholders = () => {
    return Array.from({ length: 12 }).map((_, index) => (
      <div key={index} className="col-lg-3 col-md-4 col-sm-6 p-grid">
        <div className="product-box">
          <div className="product-item">
            <div className="image-placeholder placeholder-glow" />
            <h5 className="card-title placeholder-glow">
              <span className="placeholder"></span>
            </h5>
            <p className="card-text placeholder-wave">
              <span className="placeholder col-7"></span>
              <span className="placeholder col-4"></span>
              <span className="placeholder col-6"></span>
              <span className="placeholder col-8"></span>
            </p>
            <a href="#" tabIndex={-1} className="btn btn-primary disabled placeholder"></a>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <>
      <div className="tool_box">
        <div className="filter-wrapper">
          {type && (
            <ProductFilter
              filters={
                url_filters.length > 0
                  ? (filtersWithActive
                      ? filtersWithActive.map((agg) => ({
                          ...agg,
                          options: agg.options.map((opt) => ({
                            ...opt,
                            active: opt.active ?? false,
                          })),
                        }))
                      : null)
                  : (filters
                      ? filters.map((agg) => ({
                          ...agg,
                          options: agg.options.map((opt) => ({
                            ...opt,
                            active: opt.active ?? false,
                          })),
                        }))
                      : null)
              }
              setActivefilters={setactiveFilters}
              triggerUserAction={triggerUserAction}
              setMaxMin={setMaxMin}
              activeFilters={activeFilters}
              filter_data ={filter_data}
              NZMaxPrice = {NZMaxPrice}
              NZMinPrice = {NZMinPrice}  
            />
          )}
          <div className="product_counter">
            <div className="list-grid-button">
              <button className={`grid_mode ${gridMode ? "active" : ""}`} onClick={() => setGridMode(true)}>
                <Image src={gridSvg} width={20} height={20} alt="grid_mode" />
              </button>
              <button className={`list_mode ${!gridMode ? "active" : ""}`} onClick={() => setGridMode(false)}>
                <Image src={listSvg} width={20} height={20} alt="list_mode" />
              </button>
            </div>
            <p className="toolbar-amount" id="toolbar-amount">
              {(pageSize ?? 0) >= totalCount ? (
                <>Total Items: <span className="toolbar-number final">{totalCount}</span></>
              ) : (
                <>
                  Items <span className="toolbar-number">
                    {EcommercePrice.current_first_page(currentPage ?? 0, pageSize ?? 0)}
                  </span>-
                  <span className="toolbar-number">
                    {EcommercePrice.current_middle_page(currentPage ?? 0, pageSize ?? 0, totalPages ?? 0, totalCount)}
                  </span> of <span className="toolbar-number final"> {totalCount}</span>
                </>
              )}
            </p>
          </div>
        </div>
        <div className="short_filter">
          <div className="shorter_box">
            Sort by
            <select
              id="sorter"
              data-role="sorter"
              className="sorter-options"
              value={sortValue}
              onChange={(e) => setSortValueHandler(e.target.value)}
            >
              {sort_by_fixed.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <button className={`${sortDirection === 'ASC' ? 'asc' : 'desc'} short_ico`} onClick={toggleSortDirection}>
            <Image src="/images/up-chevron.svg" width={20} height={20} alt="sort-direction" />
          </button>
        </div>
      </div>

      <div className="product-list">
        {loading ? (
          <div className="row">{renderPlaceholders()}</div>
        ) : products && products.length > 0 ? (
          <div className="row">
            {products.map((product) => {
              const regular = product.price?.regularPrice?.amount?.value ?? 0;
              const final = product.final_price ?? 0;
              const discount = regular && final < regular
                ? Math.round(((regular - final) / regular) * 100)
                : 0;
              return (
                
                <div key={product.id} className={gridMode ? "col-xl-2p col-lg-3 col-md-4 col-sm-6 p-grid" : "col-12"}>
                  <div className={gridMode ? "product-item product-box" : "list-mode product-item product-box"}>
                    {discount > 0 && <div className="ribbon">{discount}% OFF</div>}
                    <div className="product-image-holder">
                 
                      <FallbackImage
                        src={product.image?.url ? magento + '/pub/media/catalog/product/' + product.image?.url : product.custom_image}
                        fallbackSrc="/images/no_image.avif"
                        class_name='product-image'
                        alt={product?.image?.label ?? product.name}
                        width={200}
                        height={200}
                      />
                    </div>



                  <a href={`/${product.canonical_url}`} className="product-name" >
                    {product.name}
                  </a>


                      {typeof product?.short_description?.html === 'string' && product.short_description.html.length > 0 && (
                        <div className="product-desc" dangerouslySetInnerHTML={{ __html: product.short_description.html }} />
                      )}


                  <div className="cs-delivery-info">
                      <Image src={ClockSvg} width={17} height={20} alt="CLS Computer" />
                      <span>Lieferzeit 6-8 Werktage</span>
                  </div>

                <div className="button-wrapper">

                      {final > 0 ? (
                        <div className="price-wrapper">
                          {discount > 0 && (
                            <span className="old-price">
                              {EcommercePrice.getEuroPrice(
                                regular,
                                Currency_code,
                                getCurrencySymbol(Currency_code)
                                )}
                            </span>
                          )}
                          <span className="price">
                            {EcommercePrice.getEuroPrice(final,Currency_code,
                              getCurrencySymbol(Currency_code)
                            )}
                          </span>
                        </div>
                      ) : (
                        <span className="call-for-price">Call for Price</span>
                      )}

                      {final > 0 ? (
                        product.product_type === 'configurable' || product.product_type === 'bundle' ? (
                          <a href={`/${product.canonical_url}`} className="config-btn">
                            <Image src={ConfigSvg} width={27} height={27} alt="Configure" /> Configure
                          </a>
                        ) : (
                          <div className="att-to-group">
                          <button className="addto-btn" onClick={handleAddToCart(product, 1)}>
                             {productID !== String(product.id) ? (
                              <>
                                <Image src={CartPlus} width={37} height={35} alt="Add to product" />
                                
                              </>
                            ) : (
                              <>
                                <span className="loading-spinner"></span> Adding...
                              </>
                            )}
                          </button>
                              <div className="cs-product-tile__main-bottom">
                                <span className="cs-product-tile__details-link-span">Mehr</span>
                              </div>
                          </div>
                        )
                      ) : (
                        <a href={`tel:${phone ?? ''}`} className="call-price">
                          <Image src={PhoneSvg} width={17} height={17} alt="Call" /> {phone || 'Call Us'}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p>No products available.</p>
        )}
      </div>

      <div className='pagination-wrapper'>
        {info && (
          <div className="pagination">
            <span className="page-info">
              <PaginationProduct Totalitems={totalCount} currentPage={currentPage} pageSize={gridPerPage} update={UpdatePagination} />
            </span>
            <div className="page-size-selector">
              <label htmlFor="page-size">Items per page:</label>
              <select
                id="page-size"
                value={gridPerPage}
                onChange={(e) => gridUpdate(Number(e.target.value))}
              >
                {gridPerPageValues.map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductList;