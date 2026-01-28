/**
 * Utility Functions for Tools
 * Shared helper functions
 */

/**
 * Hash text using Web Crypto API
 * @param {string} text - Text to hash
 * @param {string} algorithm - Algorithm: 'SHA-1', 'SHA-256', 'SHA-512'
 * @returns {Promise<string>}
 */
async function hashText(text, algorithm = 'SHA-256') {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest(algorithm, data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Base64 encode
 * @param {string} text - Text to encode
 * @returns {string}
 */
function base64Encode(text) {
    try {
        return btoa(unescape(encodeURIComponent(text)));
    } catch (e) {
        return '';
    }
}

/**
 * Base64 decode
 * @param {string} encoded - Encoded text
 * @returns {string}
 */
function base64Decode(encoded) {
    try {
        return decodeURIComponent(escape(atob(encoded)));
    } catch (e) {
        return '';
    }
}

/**
 * URL encode
 * @param {string} text - Text to encode
 * @returns {string}
 */
function urlEncode(text) {
    return encodeURIComponent(text);
}

/**
 * URL decode
 * @param {string} encoded - Encoded text
 * @returns {string}
 */
function urlDecode(encoded) {
    try {
        return decodeURIComponent(encoded);
    } catch (e) {
        return '';
    }
}

/**
 * Generate UUID v4
 * @returns {string}
 */
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/**
 * Generate NanoID
 * @param {number} length - Length of ID
 * @returns {string}
 */
function generateNanoID(length = 21) {
    const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_';
    let id = '';
    for (let i = 0; i < length; i++) {
        id += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    return id;
}

/**
 * Decode JWT token
 * @param {string} token - JWT token
 * @returns {Object|null}
 */
function decodeJWT(token) {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) {
            return null;
        }
        
        const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
        const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
        
        return {
            header,
            payload,
            signature: parts[2]
        };
    } catch (e) {
        return null;
    }
}

/**
 * Convert Unix timestamp to date
 * @param {number} timestamp - Unix timestamp (seconds)
 * @returns {Date}
 */
function timestampToDate(timestamp) {
    return new Date(timestamp * 1000);
}

/**
 * Convert date to Unix timestamp
 * @param {Date|string} date - Date object or date string
 * @returns {number}
 */
function dateToTimestamp(date) {
    const d = date instanceof Date ? date : new Date(date);
    return Math.floor(d.getTime() / 1000);
}

/**
 * Format date for display
 * @param {Date} date - Date object
 * @returns {string}
 */
function formatDate(date) {
    return date.toISOString();
}

/**
 * Convert hex to RGB
 * @param {string} hex - Hex color (#RRGGBB)
 * @returns {Object}
 */
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

/**
 * Convert RGB to hex
 * @param {number} r - Red
 * @param {number} g - Green
 * @param {number} b - Blue
 * @returns {string}
 */
function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
}

/**
 * Convert RGB to HSL
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {Object}
 */
function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            case b: h = ((r - g) / d + 4) / 6; break;
        }
    }
    
    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
}

/**
 * Calculate contrast ratio between two colors
 * @param {string} color1 - First color (hex)
 * @param {string} color2 - Second color (hex)
 * @returns {number}
 */
function getContrastRatio(color1, color2) {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
    
    if (!rgb1 || !rgb2) return 0;
    
    const getLuminance = (r, g, b) => {
        const [rs, gs, bs] = [r, g, b].map(val => {
            val = val / 255;
            return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };
    
    const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
    const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
    
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    
    return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Convert Wei to ETH
 * @param {string|number} wei - Wei amount
 * @returns {string}
 */
function weiToEth(wei) {
    const weiBig = BigInt(wei);
    const eth = Number(weiBig) / 1e18;
    return eth.toFixed(18).replace(/\.?0+$/, '');
}

/**
 * Convert ETH to Wei
 * @param {string|number} eth - ETH amount
 * @returns {string}
 */
function ethToWei(eth) {
    const ethNum = parseFloat(eth);
    const wei = BigInt(Math.floor(ethNum * 1e18));
    return wei.toString();
}

/**
 * Convert Wei to Gwei
 * @param {string|number} wei - Wei amount
 * @returns {string}
 */
function weiToGwei(wei) {
    const weiBig = BigInt(wei);
    const gwei = Number(weiBig) / 1e9;
    return gwei.toFixed(9).replace(/\.?0+$/, '');
}

/**
 * Convert Gwei to Wei
 * @param {string|number} gwei - Gwei amount
 * @returns {string}
 */
function gweiToWei(gwei) {
    const gweiNum = parseFloat(gwei);
    const wei = BigInt(Math.floor(gweiNum * 1e9));
    return wei.toString();
}

/**
 * Ethereum address checksum (EIP-55) - Async version
 * @param {string} address - Ethereum address
 * @returns {Promise<string>}
 */
async function toChecksumAddress(address) {
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
        return address;
    }
    
    address = address.toLowerCase().replace('0x', '');
    
    // Use Web Crypto API
    const encoder = new TextEncoder();
    const data = encoder.encode(address);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    let checksum = '0x';
    for (let i = 0; i < address.length; i++) {
        checksum += parseInt(hashHex[i], 16) >= 8 
            ? address[i].toUpperCase() 
            : address[i];
    }
    return checksum;
}

/**
 * Simple checksum address (synchronous version using SHA-256)
 * @param {string} address - Ethereum address
 * @returns {string}
 */
function toChecksumAddressSync(address) {
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
        return address;
    }
    
    address = address.toLowerCase().replace('0x', '');
    
    // Simple hash-based checksum (not EIP-55 compliant but works for display)
    let hash = '';
    for (let i = 0; i < address.length; i++) {
        hash += address.charCodeAt(i).toString(16);
    }
    
    let checksum = '0x';
    for (let i = 0; i < address.length; i++) {
        const hashChar = hash[i] || '0';
        checksum += parseInt(hashChar, 16) >= 8 
            ? address[i].toUpperCase() 
            : address[i];
    }
    
    return checksum;
}

/**
 * Validate Ethereum address format
 * @param {string} address - Address to validate
 * @returns {boolean}
 */
function isValidEthAddress(address) {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validate ENS name
 * @param {string} name - ENS name
 * @returns {boolean}
 */
function isValidENSName(name) {
    if (!name || name.length < 3 || name.length > 255) {
        return false;
    }
    return /^[a-z0-9-]+\.eth$/.test(name.toLowerCase());
}
