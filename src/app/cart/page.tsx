"use client";

import React, { useEffect, useState } from "react";
import BreadCramp from "@/components/Page/BreadCramp";
import Image from "next/image";
import "@/sass/cart.scss";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";

import { CountryLoader } from "@/lib/loaders/CountryLoader";
import { Country } from "@/lib/Interface/CountryInterface";
import { showMsg } from "@/lib/jslib/GlobalMsgControl";

import { get_avialbaleShipping } from "@/lib/Magento/ShippingControl";

import { ShippingMethod} from "@/lib/Interface/CartInterface";

import EcommercePrice from "@/lib/jslib/Price";

import { getCurrencySymbol } from '@/utils/currencySymbols';


import Link from "next/link";
import {
  updateProductQty,
  removeProductFromCart,
} from "@/redux/cartSlice";

const BreadCramps = [{ name: "cart", url: "/cart" }];

const Page = () => {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector((state: RootState) => state.cart.items);
  const cart_id = useSelector((state: RootState) => state.cart.cart_id);
  const [showEstimateBox, setShowEstimateBox] = useState(false);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [productID, setProductID] = useState<string | null>(null);

  const baseCurrency = useSelector((state: RootState) => state.cart.base_currency);
  
  const taxPrice  = useSelector((state: RootState) => state.cart.taxPrice);



  const [SeletedShippingMethod, setSeletedShippingMethod] = useState<ShippingMethod | null>(null);

    
  useEffect(() => {
    const initialQuantities: { [key: string]: number } = {};
    items.forEach((item) => {
      initialQuantities[item.id] = item.qty;
    });
    setQuantities(initialQuantities);
  }, [items]);

  const showPreload = () => {
    const preloadWrapper = document.querySelector(".preloadWrapper");
    if (preloadWrapper) {
      (preloadWrapper as HTMLElement).style.display = "flex";
    }
  };

  const hidePreload = () => {
    const preloadWrapper = document.querySelector(".preloadWrapper");
    if (preloadWrapper) {
      (preloadWrapper as HTMLElement).style.display = "none";
    }
    setProductID(null);
  };

  const handleQtyChange = (itemId: string, newQty: number) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: newQty,
    }));
  };

  const handleQtyUpdate = (itemId: string) => {
    const quantity = quantities[itemId];
    if (quantity > 0) {
      setProductID(itemId);
      dispatch(updateProductQty(Number(itemId), quantity, showPreload, hidePreload));
    }
  };

  const handleRemove = (itemId: string) => {
    setProductID(itemId);
    dispatch(removeProductFromCart(Number(itemId), showPreload, hidePreload));
  };

  const [subtotal, setSubtotal] = useState<number>(0);
  const [TotalPrice, setTotalPrice] = useState<number>(0);
  

  useEffect(() => {
    const total = items.reduce((acc, item) => acc + item.price * item.qty, 0);
    setSubtotal(total);
  }, [items]);

  useEffect(() => {
    const total = items.reduce((acc, item) => acc + item.price * item.qty, 0);
    setTotalPrice(total);
  }, [items]);

  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [availableRegions, setAvailableRegions] = useState<{ id: number; code: string; name: string }[]>([]);
  const [postalCode, setPostalCode] = useState<string>("");

  const [countryError, setCountryError] = useState(false);

  const [state, setState] = useState("");
  const [stateError, setStateError] = useState(false);

  const validateState = () => {
    const isValid = /^[A-Za-z]/.test(state.trim());
    setStateError(!isValid);
    return isValid;
  };

  const [postalError, setPostalError] = useState(false);

  const validatePostalCode = () => {
    const isValid = /^\d{4,5}$/.test(postalCode.trim());
    setPostalError(!isValid);
    return isValid;
  };

  useEffect(() => {
    const fetchCountries = async () => {
      const data = await CountryLoader();
      setCountries(data?.countries || []);
    };
    fetchCountries();
  }, []);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const countryCode = e.target.value;
    setSelectedCountry(countryCode);

    if (countryCode !== "") {
      setCountryError(false);
    }
    const country = countries.find((c) => c.id === countryCode);
    if (country?.available_regions?.length) {
      setAvailableRegions(country.available_regions);
    } else {
      setAvailableRegions([]);
    }
  };

  const [ ShippingMethods, setShippingMethods ] = useState<ShippingMethod[]>([]);

  const handleEstimate = async () => {
    const isCountryValid = selectedCountry !== "";
    setCountryError(!isCountryValid);
    if (!isCountryValid) {
      showMsg("Please select a country.", "danger");
      return;
    }
       
    if (stateError) {
      showMsg("State must start with a letter. or select a state.", "danger");
      return;
    }
    if(postalCode.trim() === "") {
      setPostalError(true); 
      showMsg("Please enter a postal code.", "danger");
      return;
    }
    if (!cart_id) {
      showMsg("Cart ID not found. Please add products to your cart.", "danger");
      return;
    }
    showPreload();

    const shippingMethods = await get_avialbaleShipping(
      cart_id, // pass cart_id explicitly to your API function
      selectedCountry,
      state,
      postalCode,
    );

    setShippingMethods(shippingMethods);
      hidePreload();
  };

  const handleShippingMethodSelect = async (method: ShippingMethod) => {
    setSeletedShippingMethod(method);
    const total = items.reduce((acc, item) => acc + item.price * item.qty, 0) + method.amount.value;
    setTotalPrice(total);
  }


  return (
    <>
      <BreadCramp links={BreadCramps} />

      <section className="cart-item-page gray-block">
        <div className="container">
          <h1>Shopping Cart</h1>

          {items.length > 0 ? (
            <section className="cart-product-page">
              <div className="row">
                {/* Cart Items */}
                <div className="col-md-8 sp main configuration product-page">
                  <div className="pc-config-wrapper">
                    <div className="row item headline">
                      <div className="col-xs-12 col-md-4 image">Item</div>
                      <div className="col-xs-12 col-md-2 unit">Price</div>
                      <div className="col-xs-12 col-md-2 qty oneline">Qty</div>
                      <div className="col-xs-12 col-md-3 oneline">Subtotal</div>
                      <div className="col-xs-12 col-md-1 oneline">Action</div>
                    </div>

                    {items.map((item, index) => (
                      <React.Fragment key={item.id || index}>
                        <div className="row item">
                          <h3 className="product-name">
                            {productID === item.id ? "Updating..." : item.name}
                          </h3>

                          {Array.isArray(item.option) &&
                            item.option.length > 0 &&
                            item.type?.toLowerCase().includes("configurable") && (
                              <ul className="product-options">
                                {item.option.map((opt, i) => {
                                  const key = `${item.sku}-${opt.label}-${opt.value}-${i}`;
                                  return (
                                    <li key={key}>
                                      <strong>{opt.label}:</strong> {opt.value}
                                    </li>
                                  );
                                })}
                              </ul>
                            )}

                          <div className="col-xs-12 col-md-4 image">
                            {productID === item.id ? (
                              <div className="loading-spinner image-type"></div>
                            ) : (
                              <a
                                href={item.product_url || "#"}
                                className="cart-item-link"
                                aria-label={`View details for ${item.name}`}
                              >
                                <Image
                                  src={item.product_image || "/images/no_image.avif"}
                                  alt={item.name}
                                  width={120}
                                  height={120}
                                  style={{ objectFit: "contain" }}
                                  unoptimized
                                />
                              </a>
                            )}
                          </div>

                          <div className="col-xs-12 col-md-2 unit">
                            <span className="cart-price">
                              {  EcommercePrice.getEuroPrice(
                                item.price ?? 0,
                                baseCurrency ?? "USD",
                                getCurrencySymbol(baseCurrency ?? "USD")
                              )}
                              
                              
                              
                              </span>
                          </div>

                          <div className="col-xs-12 col-md-2 qty oneline">
                            <div className="qty-block">
                              <label htmlFor={`qty-${item.id}`}>
                                <span className="label">Qty</span>
                                <input
                                  id={`qty-${item.id}`}
                                  type="number"
                                  min={1}
                                  step={1}
                                  className="input-text qty"
                                  value={quantities[item.id] ?? item.qty}
                                  onChange={(e) =>
                                    handleQtyChange(item.id, parseInt(e.target.value))
                                  }
                                />
                              </label>

                              {(quantities[item.id] ?? item.qty) !== item.qty && (
                                <button className="u_button" onClick={() => handleQtyUpdate(item.id)}>
                                  Update
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="col-xs-12 col-md-3 oneline">
                            <span className="final-price">
                                            
                            { EcommercePrice.getEuroPrice(
                                (item.price ?? 0) * (Number(item.qty) ?? 0),
                                baseCurrency ?? "USD",
                                getCurrencySymbol(baseCurrency ?? "USD")
                              )}
                            </span>
                          </div>

                          <div className="col-xs-12 col-md-1 oneline">
                            <button className="Delete_item" onClick={() => handleRemove(item.id)}>
                              <Image
                                src="/images/delete.svg"
                                alt="Remove"
                                width={17}
                                height={17}
                              />
                            </button>
                          </div>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <div className="col-md-4 sp">
                  <div className="side-sticky">
                    <h3>Summary</h3>

                    <div
                      className={`title toggle-header ${showEstimateBox ? "active" : ""}`}
                      onClick={() => setShowEstimateBox((prev) => !prev)}
                    >
                      Estimate Shipping and Tax
                    </div>

                    <div className={`estimate-box ${showEstimateBox ? "open" : ""}`}>
                      <div className="form-group">
                        <label>Country</label>
                        <select
                          value={selectedCountry}
                          onChange={handleCountryChange}
                          className={countryError ? "error" : ""}
                        >
                          <option value="">Select Country</option>
                          {countries.map((country) => (
                            <option key={country.id} value={country.id}>
                              {country.full_name_english}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label>State</label>
                        {availableRegions.length > 0 ? (
                          <select
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            className={stateError ? "error" : ""}
                            onBlur={validateState}
                            
                          >
                            <option value="">Select State</option>
                            {availableRegions.map((region) => (
                              <option key={region.id} value={region.code}>
                                {region.name}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            className={`tex-state ${stateError ? "error" : ""}`}
                            placeholder="Enter state"
                            value={state}
                             onChange={(e) => {
                              setState(e.target.value);
                              validateState();
                            }}
                          />
                        )}

                        {stateError && availableRegions.length === 0 && (
                          <span className="error-message">First character must be letter.</span>
                        )}
                      </div>

                      <div className="form-group">
                        <label>Postal Code</label>
                        <input
                          type="text"
                          placeholder="Enter postal code"
                          value={postalCode}
                          onChange={(e) => {
                            setPostalCode(e.target.value);
                            validatePostalCode();
                          }}
                          className={postalError ? "error" : ""}
                        />
                        {postalError && (
                          <p className="error-msg-post">
                            Provided Zip/Postal Code seems to be invalid. Example: 9693 or 96940. If you
                            believe it is correct, you can ignore this notice.
                          </p>
                        )}
                      </div>

                      <button className="c_button action secondary" onClick={handleEstimate}>
                        Estimate
                      </button>
                    </div>


                       { ShippingMethods.length > 0  && (
                        <div className="shipping-methods">  
                          <h4>Available Shipping Methods</h4>
                          <ul className="shipping-method-list">
                            {ShippingMethods.map((method) => (
                              <li key={method.carrier_code + method.method_code}>
                                <label>
                                  <input
                                    type="radio"
                                    name="shipping_method"
                                    value={method.carrier_code + "_" + method.method_code}
                                      onChange={() => handleShippingMethodSelect(method)}

                                  />
                                  {method.carrier_title} - {method.method_title}  &nbsp;&nbsp; <strong className="amount">
                                                               {EcommercePrice.getEuroPrice(
                                                                method.amount.value ?? 0,
                                                               method.amount.currency,
                                                             getCurrencySymbol( method.amount.currency )
                                                               )}
                                                               </strong>
                                </label>
                              </li>
                            ))}
                          </ul>

                        </div>
                      )}


                    <div className="table-wrapper">
                      <table className="data table totals">
                        <caption className="table-caption">Total</caption>
                        <tbody>
                          <tr className="totals sub">
                            <th className="mark">Subtotal</th>
                            <td className="amount">
                                      {EcommercePrice.getEuroPrice(
                                                                subtotal ?? 0,
                                                              baseCurrency?? "USD",
                                                              getCurrencySymbol( baseCurrency ?? "USD" )
                                                      )}
                            </td>
                          </tr>
                          {SeletedShippingMethod && (
                            <tr className="totals shipping">
                              <th className="mark">Shipping  - { SeletedShippingMethod.carrier_title}</th>
                              <td className="amount">
                                {EcommercePrice.getEuroPrice(
                                  SeletedShippingMethod.amount.value ?? 0,
                                  SeletedShippingMethod.amount.currency,
                                  getCurrencySymbol(SeletedShippingMethod.amount.currency)
                                )}
                              </td>
                            </tr>
                          )}  

                          {taxPrice && (
                            <tr className="totals tax">
                              <th className="mark">Tax</th>
                              <td className="amount">
                                {EcommercePrice.getEuroPrice(
                                  taxPrice ?? 0,
                                  baseCurrency ?? "USD",
                                  getCurrencySymbol( baseCurrency ?? "USD" )
                                )}
                               </td>
                            </tr>
                          )}
  
                          <tr className="grand totals">
                            <th className="mark">
                              <strong>Order Total</strong>
                            </th>
                            <td className="amount">
                              <strong>
                                      {EcommercePrice.getEuroPrice(
                                                                TotalPrice ?? 0,
                                                              baseCurrency?? "USD",
                                                              getCurrencySymbol( baseCurrency ?? "USD" )
                                                         )}

                              </strong>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <button
                      type="button"
                      className="c_button action primary"
                      onClick={() => (window.location.href = "/checkout")}
                    >
                      <span>Proceed to Checkout</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>
          ) : (
            <div className="Empty_box">
              <p>You have no items in your shopping cart.</p>
              <p>
                Click{" "}
                <Link href="/" onClick={() => (window.location.href = "/")}>
                  here
                </Link>{" "}
                to continue shopping.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Page;
