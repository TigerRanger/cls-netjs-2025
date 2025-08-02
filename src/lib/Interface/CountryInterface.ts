// CountryInterface.ts
export interface Region {
  id: number;
  code: string;
  name: string;
}

export interface Country {
  id: string;
  full_name_english: string;
  available_regions: Region[] | null;
}

export interface CountryQueryData {
  countries: Country[];
}