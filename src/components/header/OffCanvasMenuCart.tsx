"use client";

import React, { memo, useState } from "react";
import Image from "next/image";
import crossSvg from "../../../public/svg-icon//cross-close.svg";
import plusSvg from "../../../public/svg-icon//plus.svg";
import minusSvg from "../../../public/svg-icon//minus.svg";
import { showMsg } from '@/lib/jslib/GlobalMsgControl';
import { Modal, Button } from "react-bootstrap";

import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";

import EcommercePrice from "@/lib/jslib/Price";


import Link from "next/link";

import { getCurrencySymbol } from '@/utils/currencySymbols';

import {
  updateProductQty,
  removeProductFromCart,
  clearCart,
} from "@/redux/cartSlice";

interface OffCanvasMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const OffCanvasMenuCart: React.FC<OffCanvasMenuProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector((state: RootState) => state.cart.items);

  const cart = useSelector((state: RootState) => state.cart);

  console.log(cart);

  const baseCurrency = useSelector((state: RootState) => state.cart.base_currency);
  // const baseCurrency) || getBaseCurrency();

  const [ productID , setProductID] = useState<string | null>(null);


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
     setProductID(null); // Reset productID after hiding preload
  };

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleIncreaseQty = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (item) {
      setProductID(id); 
      dispatch(updateProductQty(Number(item.id), item.qty + 1 ,showPreload, hidePreload));
    }
  };

  const handleDecreaseQty = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (item && item.qty > 1) {
      setProductID(id); 
      dispatch(updateProductQty(Number(item.id), item.qty - 1, showPreload, hidePreload));
    }
  };

  const handleRemoveItem = (id: string) => {
     setProductID(id); 
    dispatch(removeProductFromCart(Number(id),showPreload, hidePreload));
  };

  const doClearCart = async () => {
    try {
      dispatch(clearCart());
      showMsg('Product Cart Cleared!', 'success');
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onClose();
    } catch {
        showMsg('Failed to clear cart. Please try again.', 'error');
      } finally {
        setShowConfirmModal(false);
      }
  };

  return (
    <>
      {/* 🧼 Confirm Modal */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Clear Cart</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to remove all items from your cart?</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={doClearCart}>
            Yes
          </Button>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            No
          </Button>

        </Modal.Footer>
      </Modal>

    

      {items.length > 0 && (
        <div className="item_highlight">
          {items.length}
        </div>
      )}

      <div className="white-text">
        <p className="big">Cart</p>
        <p className="small">{items.length} {items.length === 1 ? "item" : "items"}</p>
      </div>

      <div
        className={`overlay ${isOpen ? "open" : ""}`}
        onClick={onClose}
        aria-hidden={isOpen ? "false" : "true"}
        tabIndex={-1}
      />

      <aside
        className={`offCanvasMenu ${isOpen ? "open" : ""}`}
        aria-modal={isOpen}
        role="dialog"
        aria-labelledby="cart-heading"
      >
        <div className="cart_headline" id="cart-heading">
          Shopping Cart
          <button
            className="closeButton"
            onClick={onClose}
            aria-label="Close cart"
            type="button"
          >
            <Image src={crossSvg} alt="Close" width={17} height={17} />
          </button>
        </div>

        <div className="item_qty_total" aria-live="polite" aria-atomic="true">
          {items.length} {items.length === 1 ? "item" : "items"}
        </div>

        {items.length === 0 ? (
          <div className="empty_cart">
            <p>Your cart is empty.</p>
            <button
              type="button"
              className="button button-2 button-continue"
              onClick={onClose}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <ul className="cart-items-list" role="list" aria-label="Cart items list">
              {items.map((item) => (
                <li key={item.id} className="cart-item" role="listitem">
                  <div className="cart-item-name">{ productID === String(item.id) ?  "Updating...." : item.name }</div>
                  <div className="cart-item-details">
                    <div className="cart-item-image">

                    {  productID === String(item.id)  ?(
                        <span className="loading-spinner image-type"></span>
                      ):
                        (<a href={item.product_url} className="cart-item-link" aria-label={`View details for ${item.name}`}>
                          <Image
                            src={item.product_image || "/images/no_image.avif"}
                            alt={item.name}
                            width={63}
                            height={63}
                            style={{ objectFit: "contain" }}
                            unoptimized={true}
                          />
                        </a>)
                     }
                    </div>

                    <div className="cart-item-qty-control" role="group" aria-label={`Quantity controls for ${item.name}`}>
                      <button
                        className="cart-item-decrease"
                        onClick={() => handleDecreaseQty(item.id)}
                        aria-label={`Decrease quantity of ${item.name}`}
                        type="button"
                        disabled={item.qty <= 1}
                      >
                        <Image src={minusSvg} alt="minus" width={15} height={15} />
                      </button>
                      <span className="qty" aria-live="polite" aria-atomic="true">
                        {item.qty}
                      </span>
                      <button
                        className="cart-item-increase"
                        onClick={() => handleIncreaseQty(item.id)}
                        aria-label={`Increase quantity of ${item.name}`}
                        type="button"
                      >
                        <Image src={plusSvg} alt="plus" width={35} height={35} />
                      </button>
                    </div>

                    <div className="cart-item-price" aria-label={`Total price for ${item.name}`}>
                            { EcommercePrice.getEuroPrice(
                                (item.price ?? 0) * (Number(item.qty) ?? 0),
                                baseCurrency ?? "USD",
                                getCurrencySymbol( baseCurrency ?? "USD")
                              )}
                    </div>

                    <button
                      className="cart-item-remove"
                      onClick={() => handleRemoveItem(item.id)}
                      aria-label={`Remove ${item.name} from cart`}
                      type="button"
                    >
                      <Image src="/images/delete.svg" alt="Remove" width={17} height={17} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="cart-actions-final">
              <div className="subtotal_bar">

                <button
                  type="button"
                  className="button button-remove-all"
                  onClick={() => setShowConfirmModal(true)}
                >
                  Remove All
                </button>

                <div className="subtotal_container">
                  <div className="subtotal_text">Subtotal:</div>
                  <div className="subtotal_value">
                            { EcommercePrice.getEuroPrice(
                                items.reduce((total, item) => total + item.price * item.qty, 0),
                                baseCurrency ?? "USD",
                                getCurrencySymbol( baseCurrency ?? "USD")
                              )}
                  </div>
                </div>
              </div>

              <div className="final_bar">
                <Link passHref href="/cart" onClick={() => window.location.href = "/cart"} className="button button-2 button-view-cart">
                  View Cart
                </Link>

                <Link passHref href="/checkout" onClick={() => window.location.href = "/checkout"} className="button button-2 button-checkout">
                  Checkout
                </Link>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
};

export default memo(OffCanvasMenuCart);
