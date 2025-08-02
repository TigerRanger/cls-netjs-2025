import { Address } from "@/lib/Interface/AddressInterface";

/**
 * Remove HTML tags and basic HTML entities from a string.
 */
export const stripHtml = (str: string): string => {
  if (!str) return "";
  let sanitized = str.replace(/<[^>]*>/g, ""); // Remove HTML tags
  sanitized = sanitized.replace(/&[^;\s]+;/g, ""); // Remove HTML entities
  return sanitized;
};

/**
 * Check if a string is valid: not empty, cleaned, and ≤ 50 characters.
 */
export const isValidString = (str?: string | null): boolean => {
  if (!str) return false;
  const cleaned = stripHtml(str).trim();
  return cleaned.length > 0 && cleaned.length <= 50;
};

/**
 * Validate Address fields with HTML stripping and length check.
 */
export const isAddressValid = (address: Address, prefix = ""): boolean => {
  const isValidStreet =
    Array.isArray(address.street) &&
    address.street.length > 0 &&
    isValidString(address.street[0]);

  const addressKeys: (keyof Address)[] = [
    "firstname",
    "lastname",
    "city",
    "postcode",
    "street",
    "region",
    "country",
  ];

  if (prefix) {
    addressKeys.forEach((key) => {
      const input = document.getElementById(`${prefix}${key}`) as HTMLInputElement | null;
      if (input) {
        const value = address[key];
        let valid = true;

        if (Array.isArray(value)) {
          valid = value.length > 0 && isValidString(value[0]);
        } else if (typeof value === "string") {
          valid = isValidString(value);
        }

        input.classList.toggle("has-error", !valid);
      }
    });
  }

  return (
    isValidString(address.firstname) &&
    isValidString(address.lastname) &&
    isValidStreet &&
    isValidString(address.city) &&
    isValidString(address.postcode) &&
    isValidString(address.region) &&
    isValidString(address.street[0]) &&
    isValidString(address.country)
  );
};
