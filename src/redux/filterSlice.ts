import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Option {
  count: number;
  label: string;
  value: string;
  active: boolean;
}

interface FilterList {
  attribute_code: string;
  count: number;
  label: string;
  position: string | null;
  options: Option[];
  value:string | null  
}

interface FilterState {
  filters: FilterList[];
}

const initialState: FilterState = {
  filters: [],
};

// Create filterSlice
const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    // Reducer to set filter items
    setFilterItems: (state, action: PayloadAction<FilterList[]>) => {
      // Remove the "category" filter
      let updatedFilters = action.payload.filter((filter) => filter.attribute_code !== "category_uid");

      // Modify the "price" filter to only include "low" and "high" options
      const priceFilterIndex = updatedFilters.findIndex((filter) => filter.attribute_code === "price");

      if (priceFilterIndex !== -1) {
        const priceOptions = updatedFilters[priceFilterIndex].options;

        if (priceOptions.length > 0) {
          // Extract lowest and highest price values
          const lowPrice = priceOptions[0].value.split("_")[0]; // First value in range
          const highPrice = priceOptions[priceOptions.length - 1].value.split("_")[1]; // Last value in range

          // Sum all counts
          const totalCount = priceOptions.reduce((sum, option) => sum + option.count, 0);

          // Create new options array
          const newOptions = [
            { count: totalCount, label: "low", value: lowPrice, active: false },
            { count: totalCount, label: "high", value: highPrice, active: false },
          ];

          // Update price filter without direct mutation
          updatedFilters = updatedFilters.map((filter, index) =>
            index === priceFilterIndex ? { ...filter, options: newOptions } : filter
          );
        }
      }

      state.filters = updatedFilters;
    },

   
    updateOption: (
      state,
      action: PayloadAction<{ attribute_code: string; value: string; active: boolean }>
    ) => {
      const { attribute_code, value, active } = action.payload;

      // Find the filter index
      const filterIndex = state.filters.findIndex((filter) => filter.attribute_code === attribute_code);
      if (filterIndex === -1) return;

      // Update option inside the filter without mutating state
      state.filters = state.filters.map((filter, index) =>
        index === filterIndex
          ? {
              ...filter,
              options: filter.options.map((option) =>
                option.value === value ? { ...option, active } : option
              ),
            }
          : filter
      );
    },

    // Reducer to clear filter items
    clearFilterItems: (state) => {
      state.filters = [];
    },
  },
});

// Export actions
export const { setFilterItems, updateOption, clearFilterItems  } = filterSlice.actions;

// Export the reducer
export const filterReducer = filterSlice.reducer;

// Selector to get all filter items
export const getFilterItems = (state: FilterState): FilterList[] => {
  return state.filters;
};

// Selector to get a single filter item by attribute_code
export const getFilterItemByCode = (state: FilterState, attribute_code: string): FilterList | null => {
  return state.filters.find((item) => item.attribute_code === attribute_code) || null;
};


export const getActiveFilters = (state: FilterState): FilterList[] => {
  return state.filters
    .map((filter) => ({
      ...filter,
      options: filter.options.filter((option) => option.active),
    }))
    .filter((filter) => filter.options.length > 0) ?? [];
};



