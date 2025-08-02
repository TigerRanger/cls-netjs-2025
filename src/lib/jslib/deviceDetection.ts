// lib/deviceDetection.ts
import { UAParser } from 'ua-parser-js'; // Import the function directly

export const getDeviceType = (userAgent: string) => {
  const parser = new UAParser(userAgent); // Pass user agent string to the function
  const result = parser.getResult(); // Get the parsed result

  // Check if the device is mobile or tablet based on user agent
  if (result.device.type === 'mobile' || result.device.type === 'tablet') {
    return 'mobile';
  }
  return 'desktop';
}; 