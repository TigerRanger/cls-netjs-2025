import  { DefaultUser } from "next-auth";


// Define a Magento-style address type
 interface MagentoAddress {
  id: number;
  customer_id: number;
  region: {
    region_code: string;
    region: string;
    region_id: number;
  };
  region_id: number;
  country_id: string;
  street: string[];
  company?: string;
  telephone: string;
  postcode: string;
  city: string;
  firstname: string;
  lastname: string;
  vat_id?: string;
  default_billing?: boolean;
  default_shipping?: boolean;
}


// Extend NextAuth types
declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    firstName: string;
    lastName: string;
    image?: string;
    token: string; // Magento token
    billing_address: MagentoAddress | null;
    shipping_address: MagentoAddress | null;
  }

  interface Session {
    user: User; // Updated user type in session
  }

  interface Account {
    user?: User; // Add optional user in Account
    token?: string; // Explicitly declare Magento token
  }

  interface JWT {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    picture?: string;
    token: string; // Magento token
    billing_address?: MagentoAddress | null;
    shipping_address?: MagentoAddress | null;
  }

  interface Profile {
    given_name?: string;
    family_name?: string;
    picture?: string;
  }
}
