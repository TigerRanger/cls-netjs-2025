"use client";

import React, { useState, FormEvent } from "react";

const SubscribeForm: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateEmail(email)) {
      setMessage("Thank you for subscribing!");
      setEmail("");
    } else {
      setMessage("Please enter a valid email address.");
    }
  };

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  return (
    <div className="my_newsletter">

      <h3>Frische News direkt in dein Postfach</h3>
      <p>Immer über Neuigkeiten und aktuelle Aktionen informiert bleiben – mit dem Newsletter von CLS Computer.<br/>Sie können den Newsletter jederzeit kostenlos abbestellen.</p>
      
      <form className="email-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="footer-email"
          id="footer-email"
          placeholder="Ihre E-Mail Adresse"
          className="email-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="submit-btn  cs-newsletter__button">
          <span className="send">
              Abonnieren
          </span>
        </button>
      </form>
      <p id="email-error">{message}</p>
    </div>
  );
};

export default SubscribeForm;
