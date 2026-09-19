/**
 * App Constants and Configurations
 */

// Platform Configurations
const PLATFORMS = {
  youtube: {
    name: 'YouTube',
    urlPatterns: [
      /^https?:\/\/(www\.)?youtube\.com\/watch\?v=([^&\s]+)/,
      /^https?:\/\/(www\.)?youtu\.be\/([^\?\s]+)/,
      /^https?:\/\/(www\.)?youtube\.com\/shorts\/([^\?\s]+)/,
    ],
    icon: 'youtube',
    color: '#ff0000',
    supports: ['mp4', 'webm', 'audio'],
  },
  facebook: {
    name: 'Facebook',
    urlPatterns: [
      /^https?:\/\/(www\.)?facebook\.com\/.*\/videos\/([^\/\s]+)/,
      /^https?:\/\/(www\.)?fb\.watch\/([^\/\s]+)/,
    ],
    icon: 'facebook',
    color: '#1877f2',
    supports: ['mp4', 'audio'],
  },
  instagram: {
    name: 'Instagram',
    urlPatterns: [
      /^https?:\/\/(www\.)?instagram\.com\/reel\/([^\/\s]+)/,
      /^https?:\/\/(www\.)?instagram\.com\/p\/([^\/\s]+)/,
      /^https?:\/\/(www\.)?instagram\.com\/tv\/([^\/\s]+)/,
    ],
    icon: 'instagram',
    color: '#e4405f',
    supports: ['mp4', 'audio'],
  },
  tiktok: {
    name: 'TikTok',
    urlPatterns: [
      /^https?:\/\/(www\.)?tiktok\.com\/(@[^\/\s]+\/video\/)?([^\?\s]+)/,
      /^https?:\/\/vm\.tiktok\.com\/([^\/\s]+)/,
    ],
    icon: 'tiktok',
    color: '#000000',
    supports: ['mp4', 'audio'],
  },
  twitter: {
    name: 'Twitter',
    urlPatterns: [
      /^https?:\/\/(www\.)?twitter\.com\/.*\/status\/([^\/\s]+)/,
      /^https?:\/\/(www\.)?x\.com\/.*\/status\/([^\/\s]+)/,
    ],
    icon: 'twitter',
    color: '#1da1f2',
    supports: ['mp4', 'audio'],
  },
  vimeo: {
    name: 'Vimeo',
    urlPatterns: [
      /^https?:\/\/(www\.)?vimeo\.com\/([^\/\s]+)/,
    ],
    icon: 'vimeo',
    color: '#1ab7ea',
    supports: ['mp4', 'audio'],
  },
  dailymotion: {
    name: 'Dailymotion',
    urlPatterns: [
      /^https?:\/\/(www\.)?dailymotion\.com\/video\/([^\/\s]+)/,
    ],
    icon: 'dailymotion',
    color: '#00aaff',
    supports: ['mp4', 'audio'],
  },
};

// Format Configurations
const FORMATS = {
  mp4: {
    name: 'MP4',
    mime: 'video/mp4',
    icon: 'file-video',
    qualities: ['144p', '240p', '360p', '480p', '720p', '1080p', '4K', '8K'],
  },
  webm: {
    name: 'WebM',
    mime: 'video/webm',
    icon: 'file-video',
    qualities: ['360p', '480p', '720p', '1080p'],
  },
  audio: {
    name: 'Audio Only',
    mime: 'audio/mp3',
    icon: 'file-audio',
    qualities: ['128kbps', '192kbps', '256kbps', '320kbps'],
  },
};

// Quality Labels
const QUALITY_LABELS = {
  '144p': '144p (Low)',
  '240p': '240p',
  '360p': '360p (SD)',
  '480p': '480p (SD)',
  '720p': '720p (HD)',
  '1080p': '1080p (Full HD)',
  '4K': '4K (Ultra HD)',
  '8K': '8K (Ultra HD)',
  '128kbps': '128 kbps',
  '192kbps': '192 kbps',
  '256kbps': '256 kbps',
  '320kbps': '320 kbps (High)',
};

// Storage Keys
const STORAGE_KEYS = {
  THEME: 'theme',
  DOWNLOAD_HISTORY: 'downloadHistory',
  FAVORITES: 'favorites',
  SETTINGS: 'appSettings',
};

// Default Settings
const DEFAULT_SETTINGS = {
  defaultFormat: 'mp4',
  defaultQuality: '720p',
  autoDownload: false,
  saveToGallery: true,
  notifications: true,
  darkMode: false,
};

// API Endpoints (for future backend integration)
const API_ENDPOINTS = {
  BASE_URL: 'https://api.videodownloader.com',
  DOWNLOAD: '/api/download',
  INFO: '/api/info',
  SEARCH: '/api/search',
};

// Error Messages
const ERROR_MESSAGES = {
  INVALID_URL: 'Please enter a valid video URL',
  UNSUPPORTED_PLATFORM: 'This platform is not supported yet',
  NETWORK_ERROR: 'Please check your internet connection',
  DOWNLOAD_FAILED: 'Failed to download video',
  PERMISSION_DENIED: 'Storage permission is required to save videos',
  NO_SPACE: 'Insufficient storage space',
  INVALID_FORMAT: 'Selected format is not available for this video',
};

// Success Messages
const SUCCESS_MESSAGES = {
  DOWNLOAD_STARTED: 'Download started!',
  DOWNLOAD_COMPLETE: 'Download complete!',
  COPIED_TO_CLIPBOARD: 'Copied to clipboard',
  SAVED_TO_GALLERY: 'Saved to gallery',
  THEME_CHANGED: 'Theme changed successfully',
};

// App Info
const APP_INFO = {
  NAME: 'Video Downloader',
  VERSION: '1.0.0',
  DESCRIPTION: 'Download videos from your favorite platforms',
  AUTHOR: 'Vibe Code',
  CONTACT: 'support@videodownloader.com',
};

// Platform Icons (for FontAwesome)
const PLATFORM_ICONS = {
  youtube: 'youtube',
  facebook: 'facebook',
  instagram: 'instagram',
  tiktok: 'tiktok',
  twitter: 'twitter',
  vimeo: 'vimeo',
  dailymotion: 'dailymotion',
};

// Format Icons (for FontAwesome)
const FORMAT_ICONS = {
  mp4: 'file-video',
  webm: 'file-video',
  audio: 'file-audio',
};

export {
  PLATFORMS,
  FORMATS,
  QUALITY_LABELS,
  STORAGE_KEYS,
  DEFAULT_SETTINGS,
  API_ENDPOINTS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  APP_INFO,
  PLATFORM_ICONS,
  FORMAT_ICONS,
};
