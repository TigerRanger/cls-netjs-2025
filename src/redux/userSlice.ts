import { createSlice, PayloadAction } from "@reduxjs/toolkit"; // Import from Redux Toolkit

import { MagentoAddress } from "@/types/next-auth";

interface UserState {
  user_id: string | null;
  is_guest: boolean;
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
  email: string | null;
  billing_address?: MagentoAddress | null;
  shipping_address?: MagentoAddress | null;
}

const initialState: UserState = {
  user_id: null,
  is_guest: true,
  firstName: "",
  lastName: "",
  avatar: "",
  email: "",
  billing_address: null,
  shipping_address: null,
};

// Create the user slice
const userSlice = createSlice({
  name: "user", // Changed name to 'user' instead of 'cart' for better context
  initialState,
  reducers: {
    generateSession: (state) => {
      // Only generate if user_id is null
      if (!state.user_id) {
        state.user_id = `CLS-NEXT-${Date.now()}`;
      }
    },

    updateUser: (
      state,
      action: PayloadAction<{
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        avatar: string;
        billing_address?: MagentoAddress | null;
        shipping_address?: MagentoAddress | null;
      }>
    ) => {
      const { id, firstName, lastName, email, avatar, billing_address, shipping_address } = action.payload;

      state.user_id = id;
      state.is_guest = false;
      state.firstName = firstName;
      state.lastName = lastName;
      state.avatar = avatar;
      state.email = email;
      state.billing_address = billing_address ?? null;
      state.shipping_address = shipping_address ?? null;
    },

    resetUser: (state) => {
      // Reset to initial state and generate a new session
      Object.assign(state, initialState);
      state.user_id = `CLS-NEXT-${Date.now()}`; // Generate a new user_id during reset
    },

    updateBillingAddress: (state, action: PayloadAction<MagentoAddress>) => {
      state.billing_address = action.payload;
    },

    updateShippingAddress: (state, action: PayloadAction<MagentoAddress>) => {
      state.shipping_address = action.payload;
    },


  },
});

// Selector to get the user state
export const getUser = (state: { user: UserState }) => state.user;



// Export actions and reducer
export const {
  generateSession,
  updateUser,
  resetUser,
  updateBillingAddress,
  updateShippingAddress
} = userSlice.actions;

export default userSlice.reducer;
