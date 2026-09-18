# Video Downloader Web App

A modern, responsive web application for downloading videos from various platforms including YouTube, Facebook, Instagram, TikTok, and more.

## Features

- **Multi-Platform Support**: Download videos from YouTube, Facebook, Instagram, TikTok, Twitter, and direct video URLs
- **Multiple Formats**: Choose from MP4, WebM, and Audio-only (MP3) formats
- **Quality Options**: Select from various quality options (480p, 720p, 1080p, 4K)
- **Modern UI**: Clean, responsive design with Dark/Light theme support
- **Download History**: Track your recent downloads
- **URL Validation**: Automatic detection and validation of video URLs
- **Progress Tracking**: Real-time download progress display
- **Keyboard Shortcuts**: Use Ctrl/Cmd + K to focus the URL input

## Quick Start

### Option 1: Open Directly
Simply open the `index.html` file in your web browser.

```bash
# Navigate to the project directory
cd video-downloader

# Open in browser (on macOS)
open index.html

# Open in browser (on Linux)
xdg-open index.html

# Open in browser (on Windows)
start index.html
```

### Option 2: Local Server
For the best experience, serve the files using a local server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (with http-server)
npx http-server

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## How to Use

1. **Paste Video URL**: Copy the URL of the video you want to download and paste it into the input field
2. **Click Download**: Press the Download button or hit Enter
3. **Select Format**: Choose your preferred video format and quality from the modal
4. **Start Download**: Click "Start Download" to begin the download process

### Platform-Specific Instructions

#### YouTube
- Copy the URL from your browser's address bar
- Example: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
- Supports regular videos, shorts, and live streams

#### Facebook
- Right-click on the video and select "Copy video URL"
- Example: `https://www.facebook.com/watch/?v=123456789`

#### Instagram
- Tap the three dots on the post and select "Copy Link"
- Example: `https://www.instagram.com/reel/Cabcdef123/`

#### TikTok
- Tap the share button and select "Copy Link"
- Example: `https://www.tiktok.com/@username/video/123456789`

## Project Structure

```
video-downloader/
├── index.html          # Main HTML file
├── style.css           # All styles and theming
├── script.js           # Main application logic
├── README.md           # This documentation
└── assets/             # Optional: Store icons, images, etc.
```

## Customization

### Adding New Platforms
To add support for a new platform, edit the `platformConfigs` object in `script.js`:

```javascript
const platformConfigs = {
    // ... existing platforms
    newPlatform: {
        name: 'New Platform',
        urlPatterns: [
            /^https?:\/\/(www\.)?newplatform\.com\/.*/,
        ],
        icon: 'fas fa-video',
        color: '#ff0000'
    }
};
```

### Customizing Themes
Edit the CSS variables in `style.css`:

```css
:root {
    /* Light theme colors */
    --primary-color: #6c5ce7;
    --bg-color: #ffffff;
    /* ... */
}

[data-theme="dark"] {
    /* Dark theme colors */
    --primary-color: #8e44ad;
    --bg-color: #1a1a2e;
    /* ... */
}
```

### Adding New Formats
Edit the `formatConfigs` object in `script.js`:

```javascript
const formatConfigs = {
    // ... existing formats
    newFormat: {
        name: 'New Format',
        mime: 'video/newformat',
        qualities: ['480p', '720p', '1080p']
    }
};
```

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome for Android)

## Technologies Used

- HTML5
- CSS3 (with CSS Variables for theming)
- JavaScript (ES6+)
- Font Awesome Icons

## Notes

### Important Considerations

1. **Legal Compliance**: Ensure you have permission to download videos from the platforms you use. Respect copyright laws and terms of service.

2. **Rate Limiting**: This is a frontend-only implementation. In a production environment, you would need a backend service to handle actual video downloads due to CORS restrictions and API rate limits.

3. **Storage**: Download history is stored in the browser's localStorage and is limited to the most recent 10 downloads.

4. **Performance**: The current implementation uses mock data. In a real application, you would need to:
   - Set up a backend server
   - Use platform APIs or video processing libraries
   - Handle authentication and rate limiting
   - Implement proper error handling

### For Production Use

To make this a fully functional video downloader, you would need to:

1. Set up a backend server (Node.js, Python, PHP, etc.)
2. Use libraries like:
   - `ytdl-core` for YouTube
   - `fluent-ffmpeg` for video processing
   - `express` or similar for the API
3. Handle CORS properly
4. Implement proper authentication
5. Add rate limiting to prevent abuse
6. Consider legal implications

## License

This project is provided as-is for educational purposes. Use responsibly and in compliance with all applicable laws and platform terms of service.

---

**Enjoy downloading videos!** 🎥
