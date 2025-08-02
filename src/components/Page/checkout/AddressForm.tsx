"use client";

import React, { useEffect, useState, ChangeEvent } from "react";
import { Address } from "@/lib/Interface/AddressInterface";
import { Country, Region } from "@/lib/Interface/CountryInterface";
import { CountryLoader } from "@/lib/loaders/CountryLoader";

interface AddressFormProps {
  address: Address;
  setAddress: (address: Address) => void;
  prefix?: string;
}

const AddressForm = ({ address, setAddress, prefix = "p_" }: AddressFormProps) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);

  // Load countries on first mount
  useEffect(() => {
    const fetchCountries = async () => {
      const data = await CountryLoader();
      setCountries(data?.countries || []);
    };
    fetchCountries();
  }, []);

  // Update regions when address.country or countries change
  useEffect(() => {
    if (!address.country || countries.length === 0) return;
    const selectedCountry = countries.find(c => c.id === address.country);
    setRegions(selectedCountry?.available_regions || []);
  }, [address.country, countries]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAddress({
      ...address,
      [name]: value,
    });
  };

  const handleStreetChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAddress({
      ...address,
      street: [e.target.value],
    });
  };

  const handleCountryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedCountry = e.target.value;
    setAddress({
      ...address,
      country: selectedCountry,
      region: "", // Reset region when country changes
    });
  };

  return (
    <>
      <div className="control required">
        <label className="label" htmlFor={`${prefix}firstname`}>First Name</label>
        <input
          className="input-text"
          id={`${prefix}firstname`}
          name="firstname"
          type="text"
          value={address.firstname || ""}
          onChange={handleChange}
          placeholder="First Name"
          required
        />
      </div>

      <div className="control required">
        <label className="label " htmlFor={`${prefix}lastname`}>Last Name</label>
        <input
          className="input-text"
          id={`${prefix}lastname`}
          name="lastname"
          type="text"
          value={address.lastname || ""}
          onChange={handleChange}
          placeholder="Last Name"
          required
        />
      </div>

      <div className="control ">
        <label className="label" htmlFor={`${prefix}company`}>Company Name</label>
        <input
          className="input-text"
          id={`${prefix}company`}
          name="company"
          type="text"
          value={address.company || ""}
          placeholder="Company Name"
          onChange={handleChange}
        />
      </div>

      <div className="control required">
        <label className="label required" htmlFor={`${prefix}street`}>Street Address</label>
        <input
          className="input-text"
          id={`${prefix}street`}
          name="street"
          type="text"
          value={address.street?.[0] || ""}
          onChange={handleStreetChange}
          placeholder="Street Address"
          required
        />
      </div>

      <div className="control required">
        <label className="label required" htmlFor={`${prefix}region`}>Region / State</label>
        {regions.length > 0 ? (
          <select
            id={`${prefix}region`}
            name="region"
            className="input-text"
            value={address.region || ""}

            onChange={handleChange}
            
            required
          >
            <option value="">Select Region</option>
            {regions.map((r) => (
              <option key={r.id} value={r.name}>
                {r.name}
              </option>
            ))}
          </select>
        ) : (
          <input
            className="input-text"
            id={`${prefix}region`}
            name="region"
            type="text"
            value={address.region || ""}
            onChange={handleChange}
            placeholder="Region / State"
            required
          />
        )}
      </div>

      <div className="control required">
        <label className="label required" htmlFor={`${prefix}city`}>City</label>
        <input
          className="input-text"
          id={`${prefix}city`}
          name="city"
          type="text"
          value={address.city || ""}
          onChange={handleChange}
          placeholder="City"
          required
        />
      </div>

      <div className="control required">
        <label className="label required" htmlFor={`${prefix}postcode`}>Post Code</label>
        <input
          className="input-text"
          id={`${prefix}postcode`}
          name="postcode"
          type="text"
          value={address.postcode || ""}
          onChange={handleChange}
          placeholder="Post Code"
          required
        />
      </div>

      <div className="control required">
        <label className="label required" htmlFor={`${prefix}country`}>Country</label>
        <select
          id={`${prefix}country`}
          name="country"
          className="input-text"
          value={address.country || ""}
          onChange={handleCountryChange}
          
          required
        >
          <option value="">Select Country</option>
          {countries.map((c) => (
            <option key={c.id} value={c.id}>
              {c.full_name_english}
            </option>
          ))}
        </select>
      </div>

      <div className="control">
        <label className="label required" htmlFor={`${prefix}telephone`}>Telephone</label>
        <input
          className="input-text"
          id={`${prefix}telephone`}
          name="telephone"
          type="text"
          value={address.telephone || ""}
          onChange={handleChange}
          placeholder="Telephone"
          required
        />
      </div>
    </>
  );
};

export default AddressForm;
