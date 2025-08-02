import React from 'react';


import AddressForm from './AddressForm';

import { Address } from "@/lib/Interface/AddressInterface";

interface ShippingAddressProps {
  Shipping_address: Address;
  setShippingAddress: (address: Address) => void;
  okShippingAddress?: boolean; // Optional prop to indicate if shipping address is valid
  
}

const ShippingAddress = ({ Shipping_address , setShippingAddress , okShippingAddress }: ShippingAddressProps) => {
  return (
    <div className={`Login_Box card ${okShippingAddress ? 'ok-address' : ''}` } >
    <h2 className='card-header'>Shipping Address</h2>
         <div className='card-content'>
            <form className="form form-shipping-address" id="shipping_form">
                        <AddressForm
                            address={Shipping_address}
                            setAddress={setShippingAddress}
                            prefix="shipping_"
                        />
             </form>
         </div>       
      </div>    
  )
}

export default ShippingAddress