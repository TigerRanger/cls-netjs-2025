export interface Address {
  firstname: string | null;
  lastname: string | null;
  street: string[];              // Required for Magento; typically an array with 1-2 elements
  company?: string | null;
  city: string | null;
  region: string | null;         // Region name, e.g., "California"
  region_id?: number | null;     // Region ID (used in Magento GraphQL)
  postcode: string | null;
  country: string | null;        // Country code, e.g., "US"
  telephone: string | null;
}

