import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { createHash } from "node:crypto";
import axios from "axios";
import { MagentoAddress } from "@/types/next-auth";
interface ExtendedUser extends User {
  token: string;
  firstName: string;
  lastName: string;
  billing_address: MagentoAddress | null;
  shipping_address: MagentoAddress | null;
}
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        captchaAnswer: { label: "CAPTCHA Answer", type: "text" },
        captchaToken: { label: "CAPTCHA Token", type: "hidden" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const { email, password, captchaAnswer, captchaToken } = credentials;
        const computedToken = createHash("sha256").update(captchaAnswer).digest("hex");

        if (captchaToken !== computedToken) {
          throw new Error("Invalid CAPTCHA");
        }

        try {
          const tokenRes = await axios.post(
            `${process.env.MAGENTO_ENDPOINT_SITE}/rest/V1/integration/customer/token`,
            { username: email, password }
          );

          const token = tokenRes.data;
          const userRes = await axios.get(
            `${process.env.MAGENTO_ENDPOINT_SITE}/rest/V1/customers/me`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const user = userRes.data;
          const addresses = user.addresses as MagentoAddress[] | undefined;
          const billing = addresses?.find(addr => addr.id == user.default_billing) ?? null;
          const shipping = addresses?.find(addr => addr.id == user.default_shipping) ?? null;
          let photo = user?.extension_attributes?.photo || null;
          if (!photo || photo === "null" || photo === "undefined") {
            photo = null;
          }
          return {
            id: String(user.id),
            email: user.email,
            firstName: user.firstname,
            lastName: user.lastname,
            token,
            image: photo,
            billing_address: billing,
            shipping_address: shipping,
          } satisfies ExtendedUser;
        } catch (e: unknown) {
          if (axios.isAxiosError(e)) {
            console.error("Authorize error:", e.response?.data || e.message);
          } else if (e instanceof Error) {
            console.error("Authorize error:", e.message);
          } else {
            console.error("Authorize error:", e);
          }
          return null;
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET || "LG1221387HG",

  session: {
    strategy: "jwt",            // Use JWT-based sessions
    maxAge: 60 * 60 * 24 * 7,   // 7 days (in seconds)
    updateAge: 60 * 60,         // Refresh the session every hour
  },

  jwt: {
    maxAge: 60 * 60 * 24 * 7,   // Also set JWT token lifespan to 7 days
  },

  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google" && profile?.email) {
        try {
          const response = await axios.post(
            `${process.env.MAGENTO_ENDPOINT_SITE}/rest/V1/token/generate/`,
            {
              email: profile.email,
              security: process.env.NEXTJS_SECRET_KEY,
              name: profile.name,
              photo: profile.picture,
            }
          );
          const token = response.data;

          const userRes = await axios.get(
            `${process.env.MAGENTO_ENDPOINT_SITE}/rest/V1/customers/me`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          const user = userRes.data;
          const addresses = user.addresses as MagentoAddress[] | undefined;

          const billing = addresses?.find(addr => addr.id == user.default_billing) ?? null;
          const shipping = addresses?.find(addr => addr.id == user.default_shipping) ?? null;

          account.user = {
            id: String(user.id),
            email: user.email,
            firstName: user.firstname,
            lastName: user.lastname,
            image: user?.extension_attributes?.photo || profile.picture,
            token,
            billing_address: billing,
            shipping_address: shipping,
          } satisfies ExtendedUser;

          account.token = token;
          return true;
        } catch (e: unknown) {
          if (axios.isAxiosError(e)) {
            console.error("Google Sign-In Error:", e.response?.data || e.message);
          } else if (e instanceof Error) {
            console.error("Google Sign-In Error:", e.message);
          } else {
            console.error("Google Sign-In Error:", e);
          }
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user, account }) {
      if (user && "token" in user) {
        const u = user as ExtendedUser;
        token.id = u.id;
        token.email = u.email;
        token.firstName = u.firstName;
        token.lastName = u.lastName;
        token.picture = u.image;
        token.token = u.token;
        token.billing_address = u.billing_address;
        token.shipping_address = u.shipping_address;
      }
      if (account?.user) {
        const u = account.user as ExtendedUser;
        token.billing_address = u.billing_address ?? null;
        token.shipping_address = u.shipping_address ?? null;
      }
      return token;
    },

    async session({ session, token }) {
      const isValidAddress = (address: unknown): address is MagentoAddress => {
        return (
          typeof address === "object" &&
          address !== null &&
          "id" in address &&
          "city" in address &&
          "country_id" in address
        );
      };
      session.user = {
        id: String(token.id),
        email: String(token.email),
        firstName: String(token.firstName),
        lastName: String(token.lastName),
        image: String(token.picture),
        token: String(token.token),
        billing_address: isValidAddress(token.billing_address) ? token.billing_address : null,
        shipping_address: isValidAddress(token.shipping_address) ? token.shipping_address : null,
      };

      return session;
    },
  },
};
