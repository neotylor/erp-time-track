// Base64 Worker for handling large file processing
// Custom Base64 implementation to avoid atob/btoa limitations

class Base64Processor {
  constructor() {
    this.standardChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    this.urlSafeChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  }

  // Encode bytes to Base64 with chunking
  encode(uint8Array, urlSafe = false, lineWrap = false) {
    const chars = urlSafe ? this.urlSafeChars : this.standardChars;
    const padding = urlSafe ? '' : '=';
    let result = '';
    let lineLength = 0;
    
    for (let i = 0; i < uint8Array.length; i += 3) {
      const byte1 = uint8Array[i];
      const byte2 = uint8Array[i + 1] || 0;
      const byte3 = uint8Array[i + 2] || 0;
      
      const encoded = 
        chars[byte1 >> 2] +
        chars[((byte1 & 0x03) << 4) | (byte2 >> 4)] +
        chars[((byte2 & 0x0F) << 2) | (byte3 >> 6)] +
        chars[byte3 & 0x3F];
      
      // Handle padding
      let encodedWithPadding = encoded;
      if (i + 1 >= uint8Array.length) {
        encodedWithPadding = encoded.slice(0, 2) + (urlSafe ? '' : padding + padding);
      } else if (i + 2 >= uint8Array.length) {
        encodedWithPadding = encoded.slice(0, 3) + (urlSafe ? '' : padding);
      }
      
      result += encodedWithPadding;
      lineLength += encodedWithPadding.length;
      
      // Add line breaks every 76 characters if enabled
      if (lineWrap && lineLength >= 76) {
        result += '\n';
        lineLength = 0;
      }
    }
    
    return result;
  }

  // Decode Base64 to bytes
  decode(base64String, urlSafe = false) {
    const chars = urlSafe ? this.urlSafeChars : this.standardChars;
    
    // Remove whitespace and line breaks
    const cleaned = base64String.replace(/\s/g, '');
    
    // Create lookup table
    const lookup = {};
    for (let i = 0; i < chars.length; i++) {
      lookup[chars[i]] = i;
    }
    
    const result = [];
    
    for (let i = 0; i < cleaned.length; i += 4) {
      const char1 = cleaned[i];
      const char2 = cleaned[i + 1];
      const char3 = cleaned[i + 2];
      const char4 = cleaned[i + 3];
      
      const byte1 = lookup[char1];
      const byte2 = lookup[char2];
      const byte3 = lookup[char3];
      const byte4 = lookup[char4];
      
      if (byte1 !== undefined && byte2 !== undefined) {
        result.push((byte1 << 2) | (byte2 >> 4));
      }
      
      if (byte3 !== undefined && char3 !== '=') {
        result.push(((byte2 & 0x0F) << 4) | (byte3 >> 2));
      }
      
      if (byte4 !== undefined && char4 !== '=') {
        result.push(((byte3 & 0x03) << 6) | byte4);
      }
    }
    
    return new Uint8Array(result);
  }
}

const processor = new Base64Processor();

self.onmessage = async function(e) {
  const { type, data, options, chunkSize = 64 * 1024 } = e.data; // 64KB chunks
  
  try {
    if (type === 'encode') {
      const { buffer, urlSafe, lineWrap } = data;
      const uint8Array = new Uint8Array(buffer);
      
      let result = '';
      let processedBytes = 0;
      const totalBytes = uint8Array.length;
      
      // Process in chunks
      for (let offset = 0; offset < totalBytes; offset += chunkSize) {
        const chunk = uint8Array.slice(offset, offset + chunkSize);
        const encoded = processor.encode(chunk, urlSafe, lineWrap);
        result += encoded;
        
        processedBytes += chunk.length;
        
        // Report progress
        self.postMessage({
          type: 'progress',
          progress: (processedBytes / totalBytes) * 100,
          processedBytes,
          totalBytes
        });
        
        // Yield control to prevent blocking
        await new Promise(resolve => setTimeout(resolve, 0));
      }
      
      self.postMessage({
        type: 'complete',
        result: result
      });
      
    } else if (type === 'decode') {
      const { text, urlSafe } = data;
      
      try {
        const decoded = processor.decode(text, urlSafe);
        
        self.postMessage({
          type: 'complete',
          result: decoded.buffer
        });
      } catch (error) {
        self.postMessage({
          type: 'error',
          error: 'Invalid Base64 string: ' + error.message
        });
      }
    }
  } catch (error) {
    self.postMessage({
      type: 'error',
      error: error.message
    });
  }
};