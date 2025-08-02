import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { showMsg } from '@/lib/jslib/GlobalMsgControl';

import {
  addProductToMagentoCart,
  createGuestCart,
  getCartItems,
  updateProductQtyInMagentoCart,
  removeProductFromMagentoCart,
} from '@/app/lib/actions';

import type { AppDispatch, RootState } from '@/redux/store';

// Magento Cart Item type
interface MagentoCartItem {
  id: string;
  quantity: number;
  row_total?: number;
  prices?: {
    price?: {
      value: number;
      currency: string;
    };
  };
  product: {
    sku: string;
    name: string;
    __typename?: string;
    image?: {
      url?: string;
    };
    custom_image?: string | null;
    canonical_url?: string;
    url_key?: string;
  };
  configurable_options?: Array<{
    id: number;
    option_label: string;
    value_label: string;
    value_id: number;
  }>;
}

interface Option {
  label: string;
  value: string;
  option_id: number;
  option_value: number | string;
}

export interface CartProduct {
  id: string;
  sku: string;
  name: string;
  price: number;
  type: string | null;
  option: Option[] | null | [];
  qty: number;
  price_text: string;
  product_url: string;
  product_image: string;
  is_egis: boolean;
  isLoading: boolean;
  item_id?: string;
}

interface CartState {
  cart_id: string | null;
  items: CartProduct[];
  priceToal?: number | null;
  priceWitoutTAx?: number | null;
  shippipgPrice?: number | null;
  taxPrice?: number | null;
  discountPrice?: number | null;
  shipping_method?: string | null; 
  shipping_method_title?: string  | null;
  shipping_address?: {
    country_code: string;
    state_code: string | null;
    post_code: string | null;
  } | null;
  is_guest: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  isError: boolean;
  isLoading: boolean;
  error: string | null;
  base_currency?: string | null;
  is_guest_checkout_enabled: boolean;
}

const initialState: CartState = {
  cart_id: null,
  items: [],
  priceToal: 0,
  priceWitoutTAx:0,
  shippipgPrice:0,
  taxPrice: 0,
  discountPrice: 0,
  shipping_method: null,
  shipping_method_title: null,
  shipping_address: null,
  is_guest: true,
  status: 'idle',
  isError: false,
  isLoading: false,
  error: null,
  base_currency: null, // Assuming base_currency is part of the cart state
  is_guest_checkout_enabled:false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartId(state, action: PayloadAction<string>) {
      state.cart_id = action.payload;
    },
    setCartItems(state, action: PayloadAction<CartProduct[]>) {
      state.items = action.payload;
    },
    setLoading(state) {
      state.isLoading = true;
      state.status = 'loading';
      state.isError = false;
      state.error = null;
    },
    setSuccess(state) {
      state.isLoading = false;
      state.status = 'succeeded';
      state.isError = false;
      state.error = null;
    },
    setFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.status = 'failed';
      state.isError = true;
      state.error = action.payload;
    },
    clearCart(state) {
      state.items = [];
      state.cart_id = null;
    },

    setCurrency(state, action: PayloadAction<string | null>) {
      state.base_currency = action.payload;
    },

   setpriceToal(state, action: PayloadAction<number | null>) {  
    state.priceToal = action.payload;  
   },

   setPriceWitoutTAx(state, action: PayloadAction<number | null>){
    state.priceWitoutTAx = action.payload;
   },


   setTax(state, action: PayloadAction<number | null>){
    state.taxPrice = action.payload;
   },


    setShippingDetails(state, action: PayloadAction<{method: string | null , title: string | null ,
      shipping_address: { country_code: string; state_code: string | null; post_code: string  | null  } | null,
      priceToal: number | null,
      shippipgPrice: number | null, 
      taxPrice: number | null,
      discountPrice: number | null
    }>) {
      
      state.shipping_method = action.payload.method;
      state.shipping_method_title = action.payload.title;
      state.shipping_address = action.payload.shipping_address;
      state.priceToal = action.payload.priceToal;
      state.shippipgPrice = action.payload.shippipgPrice;
      state.taxPrice = action.payload.taxPrice;
      state.discountPrice = action.payload.discountPrice; 
    },

    clearSippingDetails(state) {
      state.shipping_method = null;
      state.shipping_method_title = null;
      state.shipping_address = null;
      state.shippipgPrice = null;
      state.taxPrice = null;
      state.discountPrice = null;
    }


  },
});

export const {
  setCartId,
  setCartItems,
  setLoading,
  setSuccess,
  setFailure,
  clearCart,
  setTax,
  setpriceToal,
  setPriceWitoutTAx,
  setShippingDetails,
  setCurrency,
  clearSippingDetails
} = cartSlice.actions;

export default cartSlice.reducer;

// Mapper: Magento -> Internal CartProduct
const mapMagentoCartItemsToCartProduct = (items: MagentoCartItem[]): CartProduct[] => {
  // const magento = process.env.MAGENTO_ENDPOINT_SITE ?? '';

  return items.map(item => ({
    id: item.id,
    sku: item.product.sku,
    name: item.product.name,
    price: item.row_total ?? item.prices?.price?.value ?? 0,
    type: item.product.__typename ?? null,
    qty: item.quantity,
    product_image:
      item.product.image?.url
        ? item.product.image.url
        : (item.product.custom_image ?? '') || '/images/no_image.avif',
    product_url: item.product.canonical_url ?? `${item.product.url_key}`,
    price_text: `${item.prices?.price?.currency ?? '$'} ${item.prices?.price?.value ?? 0}`,
    option:
      item.configurable_options?.map(opt => ({
        label: opt.option_label,
        value: opt.value_label,
        option_id: opt.id,
        option_value: opt.value_id.toString(),
      })) ?? [],
    is_egis: false,
    isLoading: false,
    item_id: item.id,
  }));
};

// Thunk: Add product
export const addProductToCart =
  (
    product: CartProduct,
    qty: number,
    showPreload: () => void,
    hidePreload: () => void
  ) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      dispatch(setLoading());
      showPreload();
      product.qty = qty ?? 1;

      
      let cartId = getState().cart.cart_id;
      if (!cartId) {
        cartId = await createGuestCart();
        dispatch(setCartId(cartId));
      }

      await addProductToMagentoCart(cartId, product);
      const data = await getCartItems(cartId);
      const items = data?.cart?.items ?? [];
      const mappedItems = mapMagentoCartItemsToCartProduct(items as MagentoCartItem[]);
      dispatch(setCartItems(mappedItems));
      
      dispatch(setSuccess());
      showMsg(product.name + ' added to cart successfully', 'success');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error adding product to cart';
      dispatch(setFailure(message));
      showMsg(message, 'danger');
    } finally {
      hidePreload();
    }
  };

// Thunk: Update quantity
export const updateProductQty =
  (
    itemId: number,
    quantity: number,
    showPreload: () => void,
    hidePreload: () => void
  ) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      dispatch(setLoading());
      showPreload();
      const cartId = getState().cart.cart_id;
      if (!cartId) throw new Error('No cart ID found');

      await updateProductQtyInMagentoCart(cartId, itemId, quantity);
      const data = await getCartItems(cartId);

     
      const items = data?.cart?.items ?? [];
      const mappedItems = mapMagentoCartItemsToCartProduct(items as MagentoCartItem[]);
      dispatch(setCartItems(mappedItems));
      dispatch(setSuccess());
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error updating product quantity';
      dispatch(setFailure(message));
    } finally {
      hidePreload();
    }
  };

// Thunk: Remove item
export const removeProductFromCart =
  (
    itemId: number,
    showPreload: () => void,
    hidePreload: () => void
  ) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      dispatch(setLoading());
      showPreload();
      const cartId = getState().cart.cart_id;
      if (!cartId) throw new Error('No cart ID found');

      await removeProductFromMagentoCart(cartId, itemId);
       const data = await getCartItems(cartId);
       const items = data?.cart?.items ?? [];
      const mappedItems = mapMagentoCartItemsToCartProduct(items as MagentoCartItem[]);
      dispatch(setCartItems(mappedItems));
      dispatch(setSuccess());
      showMsg('Product deleted successfully', 'info');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error removing product from cart';
      dispatch(setFailure(message));
      showMsg(message, 'danger');
    } finally {
      hidePreload();
    }
  };

// Thunk: Refresh cart
export const fetchCartItems = () => async (dispatch: AppDispatch, getState: () => RootState) => {
  try {
    dispatch(setLoading());
    const cartId = getState().cart.cart_id;
    if (!cartId) {
      dispatch(setCartItems([]));
      dispatch(setSuccess());
      return;
    }
    const data = await getCartItems(cartId);
    const items = data?.cart?.items ?? [];
    const mappedItems = mapMagentoCartItemsToCartProduct(items as MagentoCartItem[]);
    dispatch(setCartItems(mappedItems));
    dispatch(setSuccess());
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error fetching cart items';
    dispatch(setFailure(message));
  }
};

// Thunk: Clear entire cart
export const clearCartItems = () => async (dispatch: AppDispatch, getState: () => RootState) => {
  try {
    dispatch(setLoading());
    const state = getState();
    const cartId = state.cart.cart_id;
    const items = state.cart.items;

    if (!cartId) throw new Error('No cart ID found');

    await Promise.all(
      items
        .filter(item => item.item_id)
        .map(item =>
          removeProductFromMagentoCart(cartId, Number(item.item_id)) as Promise<void>
        )
    );

    dispatch(setCartItems([]));
    dispatch(setSuccess());
    dispatch(clearSippingDetails());
    
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error clearing cart';
    dispatch(setFailure(message));
  }
};

  
 export const getTaxPrice = () => ( getState: () => RootState) => {
    const state = getState();
    const taxPrice = state.cart.taxPrice;
    return taxPrice ;
  }

export const getShippingPrice = () => ( getState: () => RootState) => {
  const state = getState();
  const shippingPrice = state.cart.shippipgPrice;
  return shippingPrice ;
}

export const discountPrice = () => ( getState: () => RootState) => {
  const state = getState();
  const discountPrice = state.cart.discountPrice;
  return discountPrice ;
}

export const getShippingMethod = () => ( getState: () => RootState) => {
  const state = getState();
  const shippingMethod = state.cart.shipping_method;
  return shippingMethod ;
}

export const getShippingMethodTitle = () => ( getState: () => RootState) => {
  const state = getState();
  const shippingMethodTitle = state.cart.shipping_method_title;
  return shippingMethodTitle ;
}

export const getShippingAddress = () => ( getState: () => RootState) => {
  const state = getState();
  const shippingAddress = state.cart.shipping_address;
  return shippingAddress ;
} 


export const getCartId = () => (getState: () => RootState) => {
  const state = getState();
  return state.cart.cart_id;
};

export const getIsGuest = () => (getState: () => RootState) => {
  const state = getState();
  return state.cart.is_guest;
}


export const setBaseCurrency = (currency: string | null) => (dispatch: AppDispatch) => {
  dispatch(setCurrency(currency));
}

export const getBaseCurrency = () => (getState: () => RootState) => {
  const state = getState();
  return state.cart.base_currency;
};