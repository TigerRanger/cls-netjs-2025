export interface AggregationOption {
  count: number;
  label: string;
  value: string;
  active: boolean; // unified to boolean (not boolean | null)
}

export interface Aggregation {
  attribute_code: string;
  count: number;
  label: string;
  position: number;
  options: AggregationOption[];
}

export interface ProductAggregationsResponse {
  products: {
    aggregations: Aggregation[];
  };
}

export interface FilterList {
  attribute_code: string;
  count: number;
  label: string;
  position: string | null;
  value: string | null; // assuming this is required
  options: AggregationOption[];
}

export interface CustomFilter {
  currentPage: number;
  pageSize: number;
  sortBy: string;
  sortDirection: string;
  categoryId: string;
  filters: FilterList[];
  minPrice: number | null;
  maxPrice: number | null;
}
