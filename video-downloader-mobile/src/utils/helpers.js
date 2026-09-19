/**
 * Helper Functions
 */

import { PLATFORMS, FORMATS, QUALITY_LABELS } from './constants';

// Validate URL
const validateUrl = (url) => {
  if (!url || !url.trim()) {
    return { valid: false, message: 'Please enter a URL' };
  }

  // Check if it's a valid URL format
  try {
    new URL(url);
  } catch (e) {
    return { valid: false, message: 'Invalid URL format' };
  }

  // Check against known platforms
  for (const [platform, config] of Object.entries(PLATFORMS)) {
    for (const pattern of config.urlPatterns) {
      if (pattern.test(url)) {
        return { 
          valid: true, 
          platform: platform,
          message: `Detected ${config.name} URL` 
        };
      }
    }
  }

  // Generic video URL check
  const videoExtensions = ['\.mp4', '\.webm', '\.mov', '\.avi', '\.mkv'];
  for (const ext of videoExtensions) {
    if (new RegExp(ext + '$', 'i').test(url)) {
      return { valid: true, platform: 'direct', message: 'Direct video URL' };
    }
  }

  return { valid: false, message: 'Unsupported platform or URL' };
};

// Extract Video ID
const extractVideoId = (url, platform) => {
  if (!PLATFORMS[platform]) return null;

  for (const pattern of PLATFORMS[platform].urlPatterns) {
    const match = url.match(pattern);
    if (match) {
      for (let i = 1; i < match.length; i++) {
        if (match[i]) return match[i];
      }
      return null;
    }
  }
  return null;
};

// Format Duration (seconds to MM:SS)
const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Format Views
const formatViews = (views) => {
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M`;
  } else if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K`;
  }
  return views.toString();
};

// Format File Size
const formatFileSize = (bytes) => {
  if (bytes >= 1073741824) {
    return `${(bytes / 1073741824).toFixed(2)} GB`;
  } else if (bytes >= 1048576) {
    return `${(bytes / 1048576).toFixed(2)} MB`;
  } else if (bytes >= 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  }
  return `${bytes} B`;
};

// Get Platform Info
const getPlatformInfo = (url) => {
  const validation = validateUrl(url);
  if (validation.valid && validation.platform) {
    return PLATFORMS[validation.platform];
  }
  return null;
};

// Get Available Formats for Platform
const getAvailableFormats = (platform) => {
  if (!platform || !PLATFORMS[platform]) {
    return FORMATS;
  }
  
  const supportedFormats = PLATFORMS[platform].supports;
  const availableFormats = {};
  
  supportedFormats.forEach(format => {
    if (FORMATS[format]) {
      availableFormats[format] = FORMATS[format];
    }
  });
  
  return availableFormats;
};

// Get Quality Label
const getQualityLabel = (quality) => {
  return QUALITY_LABELS[quality] || quality;
};

// Generate Random ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Debounce Function
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Throttle Function
const throttle = (func, limit) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Sleep Function
const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Check if URL is YouTube
const isYouTubeUrl = (url) => {
  return PLATFORMS.youtube.urlPatterns.some(pattern => pattern.test(url));
};

// Get YouTube Video ID
const getYouTubeVideoId = (url) => {
  const videoId = extractVideoId(url, 'youtube');
  return videoId;
};

// Get Thumbnail URL for YouTube
const getYouTubeThumbnail = (videoId, quality = 'maxresdefault') => {
  const qualities = ['maxresdefault', 'hqdefault', 'mqdefault', 'default'];
  
  for (const q of qualities) {
    if (quality === q) {
      return `https://img.youtube.com/vi/${videoId}/${q}.jpg`;
    }
  }
  
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
};

// Get Platform Color
const getPlatformColor = (platform) => {
  if (PLATFORMS[platform]) {
    return PLATFORMS[platform].color;
  }
  return '#6c5ce7';
};

// Format Date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds}s ago`;
  } else if (diffInSeconds < 3600) {
    return `${Math.floor(diffInSeconds / 60)}m ago`;
  } else if (diffInSeconds < 86400) {
    return `${Math.floor(diffInSeconds / 3600)}h ago`;
  } else if (diffInSeconds < 604800) {
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  } else {
    return date.toLocaleDateString();
  }
};

// Capitalize First Letter
const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Truncate Text
const truncate = (text, maxLength) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Is Empty Object
const isEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};

// Clone Object
const clone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

export {
  validateUrl,
  extractVideoId,
  formatDuration,
  formatViews,
  formatFileSize,
  getPlatformInfo,
  getAvailableFormats,
  getQualityLabel,
  generateId,
  debounce,
  throttle,
  sleep,
  isYouTubeUrl,
  getYouTubeVideoId,
  getYouTubeThumbnail,
  getPlatformColor,
  formatDate,
  capitalize,
  truncate,
  isEmpty,
  clone,
};
