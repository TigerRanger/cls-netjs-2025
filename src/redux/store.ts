import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, PersistedState, PersistState } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import cartReducer from './cartSlice';
import { filterReducer } from '@/redux/filterSlice';
import userReducer from '@/redux/userSlice';

// Expiration time: 1 day in milliseconds
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

// Combine all reducers
const rootReducer = combineReducers({
  cart: cartReducer,
  user: userReducer,
  filter: filterReducer,
});

export type RootReducerState = ReturnType<typeof rootReducer>;

// Define type that extends PersistedState and adds _persistedAt for cart
type StateWithCartExpiration = PersistedState & {
  cart?: Partial<RootReducerState['cart']> & {
    _persistedAt?: number;
  };
};

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user', 'cart', 'filter'],
  version: 1,
  migrate: async (
    state: StateWithCartExpiration | undefined
  ): Promise<StateWithCartExpiration | undefined> => {
    if (!state) return state;

    const now = Date.now();
    const cartState = state.cart;
    const cartTimestamp = cartState?._persistedAt ?? 0;
    const isCartExpired = now - cartTimestamp > ONE_DAY_MS;

    return {
      ...state,
      cart: isCartExpired
        ? {
            cart_id: null,
            items: [],
            is_guest: true,
            status: 'idle',
            isError: false,
            isLoading: false,
            error: null,
            _persistedAt: now,
          }
        : {
            ...cartState,
            _persistedAt: cartTimestamp || now,
          },
      // Must include the _persist key required by redux-persist
      _persist: state._persist || {
        version: 1,
        rehydrated: false,
      } as PersistState,
    };
  },
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/FLUSH',
          'persist/PAUSE',
          'persist/PURGE',
          'persist/REGISTER',
        ],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;