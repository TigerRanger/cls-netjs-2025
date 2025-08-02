"use client";

import React, { useState, useEffect } from "react";
import BreadCramp from "@/components/Page/BreadCramp";
import Billing from "@/components/Page/checkout/Billing";
import Payment from "@/components/Page/checkout/Payment";
import "@/sass/checkout.scss";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

import { Address } from "@/lib/Interface/AddressInterface";
import { PaymentMethod, ShippingMethod } from "@/lib/Interface/PaymentInterface";

import { showMsg } from "@/lib/jslib/GlobalMsgControl";

import { getAvailablePaymentMethods } from "@/lib/Magento/getPayment";
import { get_avialbaleShipping } from "@/lib/Magento/ShippingControl";
import { isAddressValid } from "@/utils/addressValidation";


import { Modal, Button } from "react-bootstrap";

import {submitPayment} from "@/lib/Magento/submitPayment";




const BreadCramps = [
  {
    name: "checkout",
    url: "/checkout",
  },
];

const CheckoutPage = () => {
const [agreedToPolicy, setAgreedToPolicy] = useState(false);

const [showAgbModal, setShowAgbModal] = useState(false);

const handleAgbShow = () => setShowAgbModal(true);
const handleAgbClose = () => setShowAgbModal(false);

  const items = useSelector((state: RootState) => state.cart.items);

  useEffect(() => {
    if (items.length <= 0) {
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }
  }, [items]);

  const showPreload = () => {
    if (typeof window !== "undefined") {
      const preloadWrapper = document.querySelector(".preloadWrapper");
      if (preloadWrapper) {
        (preloadWrapper as HTMLElement).style.display = "flex";
      }
    }
  };

  const hidePreload = () => {
    if (typeof window !== "undefined") {
      const preloadWrapper = document.querySelector(".preloadWrapper");
      if (preloadWrapper) {
        (preloadWrapper as HTMLElement).style.display = "none";
      }
    }
  };

  

  const cart_id = useSelector((state: RootState) => state.cart.cart_id);
  
  const billingFromStore = useSelector((state: RootState) => state.user.billing_address);
  const shippingFromStore = useSelector((state: RootState) => state.user.shipping_address);

  const [customerEmail, setCustomerEmail] = useState(useSelector((state: RootState) => state.user.email)??"");
  const [shippingBillingSame, setShippingBillingSame] = useState(useSelector((state: RootState) => state.user.is_guest));
    const [isGuest, setIsGuest] = useState(false);

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);

  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<ShippingMethod | null>(null);

  const [okShippingAddress, setOkShippingAddress] = useState(false);
  const [okBillingAddress, setOkBillingAddress] = useState(false);



  const [billingAddress, setBillingAddress] = useState<Address>({
    firstname: "",
    lastname: "",
    street: [""],
    city: "",
    region: "",
    company: "",
    postcode: "",
    country: "",
    telephone: "",
  });

  const [shippingAddress, setShippingAddress] = useState<Address>({
    firstname: "",
    lastname: "",
    street: [""],
    city: "",
    region: "",
    company: "",
    postcode: "",
    country: "",
    telephone: "",
  });

  useEffect(() => {
    if (!cart_id) return;
    if(paymentMethods.length!=0)return;

    showPreload();
    (async () => {
      try {
        const data = await getAvailablePaymentMethods(cart_id);
        if (data?.success && Array.isArray(data.payment_methods)) {
          setPaymentMethods(data.payment_methods);
        }
      } catch (error) {
        console.error("Failed to fetch payment methods:", error);
      } finally {
        hidePreload();
      }
    })();
  }, [cart_id, , paymentMethods.length]);

  useEffect(() => {
    if (!cart_id) return;
    if (!shippingAddress.country || !shippingAddress.region || !shippingAddress.postcode) return;
    if(shippingMethods.length!=0) return;
    

    showPreload();
    (async () => {
      try {
        const data = await get_avialbaleShipping(
          cart_id,
          shippingAddress.country ?? "",  // ✅ fallback to empty string if null
          shippingAddress.region ?? "",
          shippingAddress.postcode ?? ""
        );
        setShippingMethods(data);
      } catch (error) {
        console.error("Error loading shipping methods:", error);
      } finally {
        hidePreload();
      }
    })();
  }, [
    cart_id,
    okShippingAddress,
    shippingAddress.country,
    shippingAddress.region,
    shippingAddress.postcode,
    shippingMethods.length,
  ]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  useEffect(() => {
      if (billingFromStore) {
        setBillingAddress({
          firstname: billingFromStore.firstname || "",
          lastname: billingFromStore.lastname || "",
          street: billingFromStore.street || [""],
          city: billingFromStore.city || "",
          company: billingFromStore.company ?? "",
          region: billingFromStore.region?.region || "",
          postcode: billingFromStore.postcode || "",
          country: billingFromStore.country_id || "",
          telephone: billingFromStore.telephone || "",
        });
      }

      if (shippingFromStore) {
        setShippingAddress({
          firstname: shippingFromStore.firstname || "",
          lastname: shippingFromStore.lastname || "",
          street: shippingFromStore.street || [""],
          city: shippingFromStore.city || "",
          company: shippingFromStore.company ?? "",
          region: shippingFromStore.region?.region || "",
          postcode: shippingFromStore.postcode || "",
          country: shippingFromStore.country_id || "",
          telephone: shippingFromStore.telephone || "",
        });
      }

  }, [billingFromStore, shippingFromStore]);



  const [okLoginGuest , setokLoginGuest] = useState(false);


useEffect(() => {

    if (customerEmail && validateEmail(customerEmail) && isGuest) {
    setokLoginGuest(true);
  } else {
    setokLoginGuest(false);
  }
}, [customerEmail, isGuest]); // ✅ Correct dependency array



  const handleShippingBillingSame = () => {
    setShippingBillingSame(!shippingBillingSame);
    setShippingAddress(billingAddress);
  };

  const submitPaymentHandler = async () => {

  if(isGuest){
      if(!okLoginGuest){
        showMsg("Please Click Guest Checkout", "danger");
        return;
      }
  }

    if(customerEmail){
     if(!validateEmail(customerEmail)){
        showMsg("Please Enter a Valid Email Address", "danger");
        return;
     }
    }
    else{
        showMsg("Please Enter a Valid Email Address", "danger");
        return;
    }

    if(!okBillingAddress){
        showMsg("Fill up Billing Address", "danger");
        return;
    }
    if(!okShippingAddress){
        showMsg("Fill up Shipping Address", "danger");
        return;
    }

    if(!selectedShippingMethod){
        showMsg("Select Shipping Method", "danger");
        return;
    }

    if(!selectedPaymentMethod){
        showMsg("Select Payment Method", "danger");
        return;
    }

    if(!agreedToPolicy){
        showMsg("Please Agree to Privacy Policy", "danger");
        return;
    }


    try {
        showPreload();
        if (typeof cart_id === "string") {
          const data = await submitPayment({
            cart_id,
            customerEmail,
            billingAddress,
            shippingAddress,
            isGuest,
            selectedShippingMethod,
            selectedPaymentMethod,
            shippingBillingSame,
            agreedToPolicy,
          });

          if(data.success){
            showMsg("All Ok", "success");
          }
        
        } else {
          console.error("cart_id is not a string:", cart_id);
        }
      } catch (error) {
        console.error("Checkout failed:", error);
      } finally {
        hidePreload();
      }


  showMsg("All Ok", "success");






  };

  useEffect(() => {
    setOkBillingAddress(isAddressValid(billingAddress, "billing_"));
    if (shippingBillingSame) {
      setShippingAddress(billingAddress);
      setOkShippingAddress(isAddressValid(billingAddress));
    }
  }, [billingAddress, shippingBillingSame]);

  useEffect(() => {
    if (!shippingBillingSame) {
      setOkShippingAddress(isAddressValid(shippingAddress, "shipping_"));
    }
  }, [shippingAddress, shippingBillingSame]);


  return (
    <>
      <BreadCramp links={BreadCramps} />
      <section className="white-block checkout-page">
        <div className="container">
          <div className="row">
            <div className="col-sm-4">
              <Billing
                is_allow_guest_checkout={Boolean(cart_id)}
                Billing_address={billingAddress}
                setbillingAddress={setBillingAddress}
                Shipping_address={shippingAddress}
                setShippingAddress={setShippingAddress}
                hadleShippingBillingSame={handleShippingBillingSame}
                shippingBillingSame={shippingBillingSame}
                okBillingAddress={okBillingAddress}
                okShippingAddress={okShippingAddress}
                setCustomerEmail={setCustomerEmail}
                customerEmail={customerEmail}
                okLoginGuest={okLoginGuest}
                isGuest={isGuest}
                setIsGuest={setIsGuest}
              />
            </div>
            <div className="col-sm-8">
              <Payment
                paymentMethods={paymentMethods}
                selectedPaymentMethod={selectedPaymentMethod}
                setSelectedPaymentMethod={setSelectedPaymentMethod}
                shippingMethods={shippingMethods}
                selectedShippingMethod={selectedShippingMethod}
                setSelectedShippingMethod={setSelectedShippingMethod}
                okBillingAddress={okBillingAddress}
                okShippingAddress={okShippingAddress}
                agreedToPolicy={agreedToPolicy}

              />

              {selectedPaymentMethod?.code === "banktransfer" && (
                <div className="BankInfo">
                  <h3>Bank Transfer</h3>
                  <p>
                    A bank transfer is the direct transfer of funds from one bank account into another...
                  </p>
                </div>
              )}

              <div className="customer-comment form-group">
                <label htmlFor="customer_comment">
                  <textarea
                    placeholder="Kommentar schreiben"
                    id="customer_comment"
                    className="form-control"
                    name="customer_comment"
                  ></textarea>
                </label>
              </div>

              <div className="control delta2">
                <input type="checkbox" name="agree1" id="agree1" onChange={(e) => setAgreedToPolicy(e.target.checked)} />
                <label className="delta" htmlFor="agree1">
                  I have {" "}
                  <a data-toggle="modal" onClick={(e) => { e.preventDefault(); handleAgbShow(); }} href="#">
                    read
                  </a>{" "}
                  and aggree with the privacy policy.
                  <span style={{ color: "red" }}>*</span>
                </label>
              </div>

              <button
                className="button checkout c_button"
                id="final_checkout"
                type="submit"
                title="Place Order"
                onClick={submitPaymentHandler} // Optional usage
              >
                Kaufen
              </button>
            </div>
          </div>
        </div>
      </section>




<Modal show={showAgbModal} onHide={handleAgbClose} size="lg">
  <Modal.Header closeButton>
    <Modal.Title>Privacy Policy</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <p>
      Your privacy policy content goes here. You can explain how user data is handled,
      your cookie policy, data retention, etc.
    </p>
    <p>
      Example: We use your personal data to process your order and provide a better experience.
    </p>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleAgbClose}>
      Close
    </Button>
  </Modal.Footer>
</Modal>



    </>
  );
};

export default CheckoutPage;
