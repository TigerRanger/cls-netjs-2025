"use client";
import React, {  useEffect, useState } from "react";

import { PaymentMethod, ShippingMethod } from "@/lib/Interface/PaymentInterface";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

import Image from "next/image";
import EcommercePrice from "@/lib/jslib/Price";
import { getCurrencySymbol } from "@/utils/currencySymbols";

import CollapsibleContent from "./CollapsibleContent";

interface PaymentProps {
  paymentMethods: PaymentMethod[];
  selectedPaymentMethod: PaymentMethod | null;
  setSelectedPaymentMethod: (method: PaymentMethod) => void;
  shippingMethods?: ShippingMethod[];
  selectedShippingMethod?: ShippingMethod | null;
  setSelectedShippingMethod?: (method: ShippingMethod) => void;
  okBillingAddress: boolean;
  okShippingAddress: boolean;
  agreedToPolicy: boolean;
}

const Payment: React.FC<PaymentProps> = ({
  paymentMethods =[],
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  shippingMethods = [],
  selectedShippingMethod,
  setSelectedShippingMethod,
  okBillingAddress,
  okShippingAddress,
  agreedToPolicy,

}) => {
  const [subtotal, setSubtotal] = useState<number>(0);
  const [Grandtotal, setGrandtotal] = useState<number>(0);
  const items = useSelector((state: RootState) => state.cart.items);
  const baseCurrency = useSelector((state: RootState) => state.cart.base_currency);
  
const [tax, setTax] = useState<number>(
  useSelector((state: RootState) => state.cart.taxPrice) ?? 0
);

useEffect(() => {
  const total = items.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shipping = selectedShippingMethod ? selectedShippingMethod.amount.value : 0;
  const grandtotal = total + shipping;

  setSubtotal(total);
  setGrandtotal(grandtotal);

  setTax(grandtotal * (tax / 100));

  // No need to re-set tax unless it’s being changed here
}, [items, selectedShippingMethod,tax]);

  return (
    <>
      <div className= {`Confirm_box card ${ selectedShippingMethod && selectedPaymentMethod && agreedToPolicy ? 'ok-confirm' : ''}` }>
        <h2 className="card-header">Confirm Your Payment</h2>
        <div className="card-content listing">
          <div className="product_item headline">
            <div className="row product_line">
              <div className="col-xs-4 col-sm-4 image">Product Name</div>
              <div className="col-xs-3 col-sm-3 unit"><span>Price</span></div>
              <div className="col-xs-2 col-sm-2 qty oneline"><span>Qty</span></div>
              <div className="col-xs-3 col-sm-3 subtotal-head"><span>Subtotal</span></div>
            </div>
          </div>

          {items.map((item, index) => (
            <div className="product_item" key={item.id || index}>
              <div className="product_name">
                <span>{index + 1}.</span> {item.name}
              </div>
              {(item.type === "configurable" || item.type === "bundle") && ((item.option ?? []).length > 0) && (
                <div className="product_des"><CollapsibleContent /></div>
              )}
              <div className="row product_line">
                <div className="col-xs-4 col-sm-4 image">
                  <Image
                    src={item.product_image || "/images/no_image.avif"}
                    alt={item.name}
                    width={75}
                    height={75}
                  />
                </div>
                <div className="col-xs-3 col-sm-3 unit">
                  {EcommercePrice.getEuroPrice(
                    item.price ?? 0,
                    baseCurrency ?? "USD",
                    getCurrencySymbol(baseCurrency ?? "USD")
                  )}
                </div>
                <div className="col-xs-2 col-sm-2 qty oneline">{item.qty}</div>
                <div className="col-xs-3 col-sm-3 subtotal">
                  {EcommercePrice.getEuroPrice(
                    (item.price ?? 0) * (item.qty ?? 0),
                    baseCurrency ?? "USD",
                    getCurrencySymbol(baseCurrency ?? "USD")
                  )}
                </div>
              </div>
            </div>
          ))}

          <div className="cart-totals" id="cart_totals">
            <div className="row">
              <div className="col-xs-8">SubTotal : </div>
              <div className="col-xs-4">
                <span className="price subtotal">
                  {EcommercePrice.getEuroPrice(
                    subtotal,
                    baseCurrency ?? "USD",
                    getCurrencySymbol(baseCurrency ?? "USD")
                  )}
                </span>
              </div>
            </div>
             { tax !== 0 && (      
              <div className="row">
                <div className="col-xs-8">Tax : </div>
                <div className="col-xs-4"><span className="price">
                                    {EcommercePrice.getEuroPrice(
                    tax,
                    baseCurrency ?? "USD",
                    getCurrencySymbol(baseCurrency ?? "USD")
                  )}
                  </span></div>
              </div>
             )}
             { selectedShippingMethod && (
              <div className="row">
              <div className="col-xs-8">{ selectedShippingMethod.carrier_title ?? "Shipping Method"} :</div>
              <div className="col-xs-4"><span className="price">
                              {EcommercePrice.getEuroPrice(
                    selectedShippingMethod?.amount.value ?? 0,
                    baseCurrency ?? "USD",
                    getCurrencySymbol(baseCurrency ?? "USD")
                  )}
                </span></div>
              </div>
             )}

            <div className="row">
              <div className="col-xs-8">Grandtotal With Tax</div>
              <div className="col-xs-4"><span className="price" id="total_price_display">
                              {EcommercePrice.getEuroPrice(
                    Grandtotal ?? 0,
                    baseCurrency ?? "USD",
                    getCurrencySymbol(baseCurrency ?? "USD")
                  )}
                </span></div>
            </div>
          </div>

         <div className="cupon_code">
            <button type="button" className="btn btn-cupon">Apply Coupon</button>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Shipping Method */}
        <div className="col-sm-6">
          <div className={`Shipping_Method_box card ${ selectedShippingMethod? 'ok-shipping' : ''}` }>
            <h2 className="card-header">Shipping Method</h2>
            <div className="card-content">
             { okBillingAddress && okShippingAddress &&  (

              <form id="Shipping_M">
                {shippingMethods.map((method) => {
                  const methodKey = `${method.carrier_code}_${method.method_code}`;
                  const imageSrc = `/images/checkout/${methodKey}.png`;
                  return (
                    <div className="radio-group" key={methodKey}>
                      <label htmlFor={methodKey}>
                        <input
                          type="radio"
                          name="shipping1"
                          id={methodKey}
                          value={methodKey}
                          checked={
                            selectedShippingMethod?.carrier_code === method.carrier_code &&
                            selectedShippingMethod?.method_code === method.method_code
                          }
                          onChange={() => setSelectedShippingMethod?.(method)}
                        />
                        <strong>{method.carrier_title}</strong> - {method.method_title}
                        <span className="price-add">
                          {EcommercePrice.getEuroPrice(
                            method.amount?.value ?? 0,
                            baseCurrency ?? "USD",
                            getCurrencySymbol(baseCurrency ?? "USD")
                          )}
                        </span>
                        <Image
                          src={imageSrc}
                          alt={method.carrier_title}
                          width={50}
                          height={30}
                          onError={(e) => {
                            // Hide image if it doesn't exist
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                          }}
                        />
                      </label>
                    </div>
                  );
                })}
              </form>
              )}
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="col-sm-6">
          <div className={`Payment_Method_box card ${ selectedPaymentMethod? 'ok-payment' : ''}` }>
            <h2 className="card-header">Payment Method</h2>
            <div className="card-content">
              <form id="Payment_M">
                {paymentMethods.map((method) => (
                  <div className="radio-group" key={method.code}>
                    <label htmlFor={method.code}>
                      <input
                        type="radio"
                        name="payment1"
                        id={method.code}
                        value={method.code}
                        checked={selectedPaymentMethod?.code === method.code}
                        onChange={() => setSelectedPaymentMethod(method)}
                      />
                      <strong>{method.title}</strong>
                      {method.code === "cashondelivery" && (
                        <span className="price-add"> 8,00€</span>
                      )}
                      <Image
                        src={`/images/checkout/${method.code}.png`}
                        alt={method.title}
                        width={50}
                        height={30}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                        }}
                      />
                    </label>
                  </div>
                ))}
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Payment;
