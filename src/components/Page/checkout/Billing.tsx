import React from 'react'
import Login from './Login'
import BillingAddress from './BillingAddress'
import ShippingAddress from './ShippingAddress'

import { Address } from "@/lib/Interface/AddressInterface";

interface BillingProps {
  Billing_address: Address;
  setbillingAddress: (address: Address) => void;
  is_allow_guest_checkout: boolean;
  Shipping_address: Address;
  setShippingAddress: (address: Address) => void;
  hadleShippingBillingSame?: () => void; // Optional prop for handling shipping and billing address same
  shippingBillingSame?: boolean; // Optional prop to manage the state of shipping and billing address being the same
  okBillingAddress?: boolean; // Optional prop to indicate if billing address is valid
  okShippingAddress?: boolean; // Optional prop to indicate if shipping address is valid
  setCustomerEmail?: (email: string) => void; // Optional prop to set customer email
  customerEmail?: string; // Optional prop for customer email

  okLoginGuest : boolean;
  isGuest: boolean;
  setIsGuest: (isGuest: boolean) => void;
  
}

const Billing = ({ is_allow_guest_checkout , Billing_address , setbillingAddress , Shipping_address , setShippingAddress  , hadleShippingBillingSame, shippingBillingSame ,
okBillingAddress , okShippingAddress , setCustomerEmail, customerEmail ,  okLoginGuest , isGuest , setIsGuest

 }: BillingProps) => {
  return (
    <>

      <Login is_allow_guest_checkout={is_allow_guest_checkout}
                setCustomerEmail={setCustomerEmail}
                customerEmail={customerEmail}
                okLoginGuest= {okLoginGuest}
                isGuest={isGuest}
                setIsGuest={setIsGuest}
      />
          
          
          <BillingAddress Billing_address={Billing_address} 
          setbillingAddress={setbillingAddress} hadleShippingBillingSame={hadleShippingBillingSame}
          okBillingAddress={okBillingAddress} 

          />

          { shippingBillingSame === false && (
          <ShippingAddress Shipping_address={Shipping_address} setShippingAddress={setShippingAddress} 
          okShippingAddress={okShippingAddress}
          />
          )}
    </>
  );
};

export default Billing;