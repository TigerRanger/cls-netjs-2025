 const  CountryQuery = `
        query GetCountries {
        countries {
            id
            full_name_english
            available_regions {
            id
            code
            name
            }
        }
    }

`;
export default CountryQuery;