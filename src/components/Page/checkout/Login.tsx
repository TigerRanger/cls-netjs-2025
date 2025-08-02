"use client";
import React, { useState, useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";

interface LoginProps {
  is_allow_guest_checkout: boolean;
  setCustomerEmail?: (email: string) => void;
  customerEmail?: string;
  okLoginGuest: boolean;
  isGuest: boolean;
  setIsGuest: (isGuest: boolean) => void;
}

const Login = ({ is_allow_guest_checkout, setCustomerEmail, customerEmail ,  okLoginGuest , isGuest , setIsGuest }: LoginProps) => {
  const { data: session } = useSession();
 
  const [emailError, setEmailError] = useState<string | null>(null);
  const [localEmail, setLocalEmail] = useState(customerEmail || "");

  useEffect(() => {
    setLocalEmail(customerEmail || "");
  }, [customerEmail]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLoginClick = useCallback(() => {
    const loginTriggerDiv = document.querySelector<HTMLElement>(
      ".icon-container.btn-top-toogle.user-toogle"
    );
    loginTriggerDiv?.click();
  }, []);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setLocalEmail(email);

    if (email.length > 50) {
      setEmailError("Email must not exceed 50 characters.");
    } else if (email && !validateEmail(email)) {
      setEmailError("Invalid email address.");
    } else {
      setEmailError(null);
      setCustomerEmail?.(email);
    }
  };

  if (!session?.user) {
    return (
      <div className={`Login_Box card ${okLoginGuest ? 'ok-address' : ''}` }>
        <h2 className="card-header">Login Option</h2>
        <div className="card-content">
          {is_allow_guest_checkout ? (
            <div className="customer-form">
              <div className="control">
                <label className="label required" htmlFor="email">
                  E-Mail Adresse
                </label>
                <input
                  className="input-text"
                  placeholder="E-Mail Adresse"
                  type="email"
                  name="email"
                  id="email"
                  value={localEmail}
                  onChange={handleEmailChange}
                  onBlur={() => {
                    // Revalidate on blur
                    if (!validateEmail(localEmail)) {
                      setEmailError("Invalid email address.");
                    } else {
                      setEmailError(null);
                    }
   
                  }}
                />
                {emailError && (
                  <p className="error-message" style={{ color: "red", fontSize: "0.9rem" }}>
                    {emailError}
                  </p>
                )}
              </div>

              <div className="radio-group">
                <label htmlFor="customer_type2">
                  <input
                    type="checkbox"
                    name="customer_account"
                    value="1"
                    id="customer_type2"
                    checked={isGuest}
                    onChange={() => setIsGuest(!isGuest)}
                  />
                  Guest Checkout
                </label>
              </div>

              <button
                className="c_button action-apply"
                type="button"
                onClick={handleLoginClick}
                disabled={!!emailError || !localEmail}
              >
                Login
              </button>
            </div>
          ) : (
            <div className="customer-form">
              <p>
                Please{" "}
                <a href="#" onClick={handleLoginClick} className="login-link">
                  login
                </a>{" "}
                to continue.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default Login;
