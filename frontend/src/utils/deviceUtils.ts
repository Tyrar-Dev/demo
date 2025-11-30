// src/utils/deviceUtils.ts

import { UAParser } from 'ua-parser-js';
import { detectBrowser, detectBrowserFromUA } from './getDeviceFingerprint';

// Định nghĩa kiểu dữ liệu trả về mong muốn
interface DeviceInfo {
    browser: string;
    os: string;
    deviceType: string;
    rawFingerprint: string;
}

/**
 * Giải mã chuỗi fingerprint Base64 và phân tích thông tin thiết bị (Browser, OS, Type).
 * @param fingerprint Chuỗi fingerprint đã mã hóa Base64 từ server.
 * @returns DeviceInfo | null
 */
const getDeviceInfoFromFingerprint = (fingerprint: string): DeviceInfo | null => {
    if (!fingerprint) return null;

    try {
        const decodedString = atob(fingerprint);
        const parts = decodedString.split('|');
        if (parts.length < 1) return null;

        const userAgent = parts[0];
        const parser = new UAParser(userAgent);
        const result = parser.getResult();


        const browserName = result.browser.name || 'Unknown';
        const browserVersion = result.browser.version || '';
        // OS
        const os = result.os.name ? `${result.os.name} ${result.os.version || ''}`.trim() : 'Unknown OS';

        // Device
        let deviceName = 'Desktop';
        if (result.device.type) {
            deviceName = result.device.type.charAt(0).toUpperCase() + result.device.type.slice(1);
            if (result.device.vendor) deviceName = result.device.vendor + ' ' + deviceName;
            if (result.device.model) deviceName += ' ' + result.device.model;
        }

        return {
            browser: `${browserName} ${browserVersion}`.trim(),
            os,
            deviceType: deviceName,
            rawFingerprint: fingerprint,
        };
    } catch (error) {
        console.error("Error decoding or parsing fingerprint:", error);
        return null;
    }
};



export default getDeviceInfoFromFingerprint;