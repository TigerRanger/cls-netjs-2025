"use client";

import Image from 'next/image';
import React, { useState } from 'react';

import plusSvg from "../../../public/svg-icon/cart-main.svg";
import { Product } from '@/lib/Interface/SingleProductIInterface';
import { addProductToCart } from "@/redux/cartSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";

import { showMsg } from '@/lib/jslib/GlobalMsgControl';

interface Option {
  id: string;
  value_index: number;
}

interface SelectedOptions {
  options: Option[];
}

const ProductAction = ({ product, magento }: { product: Product; magento: string }) => {

  console.log(product);
  console.log(product.variants);
  const dispatch = useDispatch<AppDispatch>();
  const [qty, setQty] = useState<number>(1);
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({ options: [] });
  const handleOptionChange = (attributeCode: string, valueIndex: number) => {
    setSelectedOptions((prev) => {
      const existing = prev.options.find((opt) => opt.id === attributeCode);
      const updatedOptions = existing
        ? prev.options.map((opt) =>
            opt.id === attributeCode ? { id: attributeCode, value_index: valueIndex } : opt
          )
        : [...prev.options, { id: attributeCode, value_index: valueIndex }];
      return { options: updatedOptions };
    });
  };
  const handleQtyChange = (val: number) => {
    setQty((prev) => {
      const newVal = prev + val;
      return newVal < 1 ? 1 : newVal;
    });
  };
  const showPreload = () => {
    const preloadWrapper = document.querySelector('.preloadWrapper');
    if (preloadWrapper) (preloadWrapper as HTMLElement).style.display = 'flex';
  };
  const hidePreload = () => {
    const preloadWrapper = document.querySelector('.preloadWrapper');
    if (preloadWrapper) (preloadWrapper as HTMLElement).style.display = 'none';
  };
  const handleAddToCart = (product: Product) => (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (product?.product_type === "configurable") {
      const requiredOptions = product?.configurable_options?.map((o) => o.attribute_code);
      const selectedKeys = selectedOptions.options.map((opt) => opt.id);
      const isValid = requiredOptions?.every((key) => selectedKeys.includes(key));
      if (!isValid) {
        showMsg("Please select all required product options before adding to cart.", "danger");
        return;
      }
    }
    const optionsArray = selectedOptions.options.map(({ id, value_index }) => {
      const option = product.configurable_options?.find(o => o.attribute_code === id);
      const value = option?.values.find(v => v.value_index === value_index);
      return {
        label: option?.label ?? id,
        value: value?.label ?? value_index.toString(),
        option_id: Number(option?.id),
        option_value: Number(value_index),
      };
    });
    const cartProduct = {
      id: String(product.id),
      sku: product.sku,
      name: product.name,
      price: product.final_price ?? 0,
      type: product?.product_type ?? '',
      option: optionsArray ?? [],
      qty: qty ?? 1,
      price_text: '',
      product_image: magento + product.media_gallery_entries[0]?.file,
      product_url: product.canonical_url ?? '',
      is_egis: false,
      isLoading: false,
    };
    dispatch(addProductToCart(cartProduct, qty, showPreload, hidePreload));
  };
  const isSelected = (attributeCode: string, valueIndex: number) => {
    return selectedOptions.options.some(
      (opt) => opt.id === attributeCode && opt.value_index === valueIndex
    );
  };
  return (
    <>
      {product?.product_type === "configurable" &&
        (product?.configurable_options?.length ?? 0) > 0 && (
          <div className="configurable-options">
            {product.configurable_options?.map((option) => {
              const swatchType = option.values?.[0]?.swatch_data?.__typename;
              return (
                <div key={option.attribute_code} className="configurable-option" style={{ marginBottom: '20px' }}>
                  <h4 className="option-label" style={{ marginBottom: '8px', fontWeight: 'bold' }}>
                    {option.label}
                  </h4>
                  {swatchType === "ImageSwatchData" ? (
                    <div className="option-values" style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
                      {option.values.map((value) => (
                        <label key={value.value_index} className="image-swatch">
                          <input
                            type="radio"
                            name={option.attribute_code}
                            value={value.value_index}
                            style={{ display: "none" }}
                            checked={isSelected(option.attribute_code, value.value_index)}
                            onChange={() => handleOptionChange(option.attribute_code, value.value_index)}
                          />
                          <Image
                            src={value.swatch_data?.value || "/images/no_image.avif"}
                            alt={value.label}
                            title={value.label}
                            width={40}
                            height={40}
                            style={{
                              border: isSelected(option.attribute_code, value.value_index) ? "2px solid #000" : "1px solid #ccc",
                              objectFit: "cover",
                              cursor: "pointer",
                              borderRadius: "4px",
                              padding: "2px",
                            }}
                          />
                        </label>
                      ))}
                    </div>
                  ) : swatchType === "ColorSwatchData" ? (
                    <div className="option-values" style={{ display: "flex", gap: "5px", marginTop: "5px" }}>
                      {option.values.map((value) => (
                        <label
                          key={value.value_index}
                          className="color-swatch"
                          style={{
                            border: isSelected(option.attribute_code, value.value_index) ? "2px solid #000" : "1px solid #fff",
                            display: "inline-block",
                            cursor: "pointer",
                            width: "40px",
                            height: "40px",
                            padding: "3px",
                          }}
                        >
                          <input
                            type="radio"
                            name={option.attribute_code}
                            value={value.value_index}
                            style={{ display: "none" }}
                            checked={isSelected(option.attribute_code, value.value_index)}
                            onChange={() => handleOptionChange(option.attribute_code, value.value_index)}
                          />
                          <span
                            style={{
                              width: "30px",
                              height: "30px",
                              backgroundColor: value.swatch_data?.value,
                              display: "block",
                              boxShadow:"rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"
                            }}
                            title={value.label}
                          />
                        </label>
                      ))}
                    </div>
                  ) : swatchType === "TextSwatchData" ? (
                    <div className="option-values" style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
                      {option.values.map((value) => (
                        <label
                          key={value.value_index}
                          style={{
                            display: "flex",
                            padding: "5px 10px",
                            border: isSelected(option.attribute_code, value.value_index) ? "2px solid #000" : "1px solid #ccc",
                            cursor: "pointer",
                            minWidth: "40px",
                            alignItems: "center",
                            userSelect: "none",
                            justifyContent: "center",
                            fontWeight: 500,
                            borderRadius: "4px",
                            backgroundColor: isSelected(option.attribute_code, value.value_index) ? "#f3f3f3" : "#fff",
                          }}
                        >
                          <input
                            type="radio"
                            name={option.attribute_code}
                            value={value.value_index}
                            style={{ display: "none" }}
                            checked={isSelected(option.attribute_code, value.value_index)}
                            onChange={() => handleOptionChange(option.attribute_code, value.value_index)}
                          />
                          {value.label}
                        </label>
                      ))}
                    </div>
                  ) : (
                    <select
                      onChange={(e) =>
                        handleOptionChange(option.attribute_code, parseInt(e.target.value))
                      }
                      value={
                        selectedOptions.options.find((opt) => opt.id === option.attribute_code)?.value_index ?? ""
                      }
                      style={{
                        padding: "6px 10px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                        minWidth: "120px",
                      }}
                    >
                      <option value="">Select {option.label}</option>
                      {option.values.map((value) => (
                        <option key={value.value_index} value={value.value_index}>
                          {value.label}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              );
            })}
          </div>
        )}

      <div className="add_to_fieldset">
        <div className="field qty">
          <label className="label" htmlFor="qty">
            <span>Qty:</span>
          </label>
          <div className="control">
            <input
              type="number"
              name="qty"
              id="qty"
              title="Qty"
              min={1}
              max={10000}
              value={qty}
              className="input-text qty"
              onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
              data-validate='{"required-number":true,"validate-item-quantity":{"maxAllowed":10000}}'
            />
            <div className="qty-changer">
              <a onClick={() => handleQtyChange(1)} className="qty-inc"></a>
              <a onClick={() => handleQtyChange(-1)} className="qty-dec"></a>
            </div>
          </div>
        </div>

        <div className="actions">
          <button
            type="submit"
            title="Add to Cart"
            className="action primary tocart"
            id="product-addtocart-button"
            onClick={handleAddToCart(product)}
          >
            <Image src={plusSvg} width={25} height={25} alt="Add to product" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default ProductAction;
