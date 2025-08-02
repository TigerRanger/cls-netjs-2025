// Function to sanitize search parameters for security
export const sanitizeSearchParams = (searchParams: Record<string, string | string[]> = {}) => {
    const sanitizeString = (str: string): string =>
      str.replace(/[#@^%]/g, "").slice(0, 20);
  
    return Object.fromEntries(
      Object.entries(searchParams)
        .slice(0, 20) // Keep only first 20 keys
        .map(([key, value]) => [
          sanitizeString(key), 
          Array.isArray(value) 
            ? value.map(val => sanitizeString(val.toString())) // Truncate and sanitize each array item
            : sanitizeString(value.toString()) // Truncate single string values
        ])
    );
  };