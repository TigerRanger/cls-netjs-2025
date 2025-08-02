import React from 'react';
import AddressForm from './AddressForm';
import { Address } from "@/lib/Interface/AddressInterface";
interface BillingAddressProps {
  Billing_address: Address;
  setbillingAddress: (address: Address) => void;
  hadleShippingBillingSame?: () => void; // Optional prop for handling shipping and billing address same
  okBillingAddress?: boolean; // Optional prop to indicate if billing address is valid
  

}
const BillingAddress = ({ Billing_address , setbillingAddress , hadleShippingBillingSame , okBillingAddress }: BillingAddressProps) => {
  return (
    <div className={`Login_Box card ${okBillingAddress ? 'ok-address' : ''}` } >
    <h2 className='card-header'>Billing Address</h2>
    <div className='card-content'>
        <form className="form form-billing-address" id="billing_form">
                        <AddressForm
                            address={Billing_address}
                            setAddress={setbillingAddress}
                            prefix="billing_"
                        />
                           <div className="control delta2">
                                <input type="checkbox" name="billing_shipping_same" id="billing_shipping_same" onChange={hadleShippingBillingSame}/>
                                <label className="delta" htmlFor="billing_shipping_same">Meine Rechnungs- und Lieferadresse ist identisch </label>
                            </div>
                        </form>
     </div>        </div>    
  )
}

export default BillingAddress