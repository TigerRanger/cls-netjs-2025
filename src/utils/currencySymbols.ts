// src/utils/currencySymbols.ts



export const currencySymbolMap: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    BDT: '৳',
    
    INR: '₹',
    JPY: '¥', // Japan
    CNY: '¥', // China
    RUB: '₽', // Russia 
    KRW: '₩',
    MXN: '$',
    TRY: '₺',
    THB: '฿',
    PHP: '₱',
    SAR: '﷼',
    QAR: '﷼',
    IRR: '﷼', // Iran

    // add more as needed
};


/**
 * Get currency symbol by code, fallback to code itself if not found.
 * @param code Currency code like 'USD'
 * @returns Symbol like '$' or the code if symbol not found
 */
export function getCurrencySymbol(code: string): string {
  return currencySymbolMap[code.toUpperCase()] || code;
}