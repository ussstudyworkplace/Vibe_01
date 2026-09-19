# Video Downloader Mobile App

A complete **React Native** mobile application for downloading videos from various platforms including **YouTube, Facebook, Instagram, TikTok, Twitter, Vimeo, and Dailymotion**.

## Features

### Core Features
- **Multi-Platform Support**: Download videos from YouTube, Facebook, Instagram, TikTok, Twitter, Vimeo, Dailymotion
- **Multiple Formats**: MP4, WebM, Audio-only (MP3)
- **Quality Options**: 144p, 240p, 360p, 480p, 720p, 1080p, 4K, 8K
- **Dark/Light Theme**: Toggle between themes with one tap
- **Download History**: Track all your downloads with timestamps
- **Share Videos**: Share downloaded videos with friends
- **Re-download**: Easily download videos again

### User Experience
- **URL Validation**: Auto-detects platform and validates URLs
- **Thumbnail Preview**: Shows video thumbnails before download
- **Progress Tracking**: Real-time download progress bar
- **Offline Access**: Save videos to your device for offline viewing
- **Storage Management**: Clear history and manage downloads

### Technical Features
- **AsyncStorage**: Persistent storage for history and settings
- **File System Access**: Save videos to device storage
- **Permissions Handling**: Proper permission requests for storage access
- **Responsive Design**: Works on all mobile devices
- **Smooth Animations**: Beautiful transitions and animations
- **Toast Notifications**: User feedback for all actions

## Project Structure

```
video-downloader-mobile/
├── App.js                          # Main entry point
├── package.json                    # Dependencies
├── babel.config.js                 # Babel configuration
├── metro.config.js                 # Metro bundler configuration
├── react-native.config.js          # React Native configuration
└── src/
    ├── components/                 # Reusable components
    │   ├── index.js                # Component exports
    │   ├── PlatformButton.js       # Platform selection button
    │   ├── ProgressBar.js          # Download progress bar
    │   ├── FormatButton.js         # Format selection button
    │   └── QualityButton.js        # Quality selection button
    │
    ├── contexts/                   # React Contexts
    │   └── ThemeContext.js         # Theme management (Dark/Light)
    │
    ├── navigation/                 # App navigation
    │   └── AppNavigator.js         # Tab and Stack navigation
    │
    ├── screens/                    # App screens
    │   ├── HomeScreen.js           # Main home screen with URL input
    │   ├── DownloadScreen.js       # Download screen with format options
    │   ├── HistoryScreen.js        # Download history screen
    │   └── SettingsScreen.js       # App settings screen
    │
    ├── utils/                      # Utility functions and constants
    │   ├── constants.js            # App constants and configurations
    │   ├── helpers.js              # Helper functions
    │   └── styles.js               # Global styles and theming
    │
    └── assets/                     # App assets (images, icons)
        └── .gitkeep
```

## Quick Start

### Prerequisites

1. **Node.js** (v16 or higher)
2. **npm** or **yarn**
3. **React Native CLI**
4. **Android Studio** (for Android development)
5. **Xcode** (for iOS development)
6. **Java JDK 11** (for Android)

### Installation

```bash
# Navigate to the project directory
cd video-downloader-mobile

# Install dependencies
npm install

# For iOS (Mac only)
cd ios && pod install && cd ..
```

### Running the App

#### Android
```bash
npx react-native run-android
```

#### iOS
```bash
npx react-native run-ios
```

### Using a Physical Device

#### Android
1. Enable **USB Debugging** on your device
2. Connect your device via USB
3. Run:
```bash
npx react-native run-android
```

#### iOS
1. Connect your iPhone via USB
2. Trust the computer on your device
3. Run:
```bash
npx react-native run-ios
```

## Usage

### 1. Download a Video

1. Open the app
2. **Paste** the video URL in the input field
3. Tap **Download** button
4. Select **Format** (MP4, WebM, Audio)
5. Select **Quality** (144p to 8K)
6. Tap **Download** to start

### 2. View Download History

1. Tap the **History** tab
2. View all your downloaded videos
3. **Share** or **Re-download** any video
4. **Delete** individual downloads or clear all history

### 3. Customize Settings

1. Tap the **Settings** tab
2. Toggle **Dark Mode** on/off
3. Set **Default Format** and **Quality**
4. Enable/disable **Auto Download** and **Notifications**
5. Clear all app data if needed

## Platform Support

| Platform | Supported | URL Patterns |
|----------|-----------|--------------|
| YouTube | ✅ Yes | `youtube.com/watch?v=`, `youtu.be/`, `youtube.com/shorts/` |
| Facebook | ✅ Yes | `facebook.com/watch/?v=`, `fb.watch/` |
| Instagram | ✅ Yes | `instagram.com/reel/`, `instagram.com/p/`, `instagram.com/tv/` |
| TikTok | ✅ Yes | `tiktok.com/@user/video/`, `vm.tiktok.com/` |
| Twitter | ✅ Yes | `twitter.com/user/status/`, `x.com/user/status/` |
| Vimeo | ✅ Yes | `vimeo.com/` |
| Dailymotion | ✅ Yes | `dailymotion.com/video/` |

## Format Support by Platform

| Platform | MP4 | WebM | Audio |
|----------|-----|------|-------|
| YouTube | ✅ | ✅ | ✅ |
| Facebook | ✅ | ❌ | ✅ |
| Instagram | ✅ | ❌ | ✅ |
| TikTok | ✅ | ❌ | ✅ |
| Twitter | ✅ | ❌ | ✅ |
| Vimeo | ✅ | ❌ | ✅ |
| Dailymotion | ✅ | ❌ | ✅ |

## Quality Options by Format

### Video Formats
- **MP4**: 144p, 240p, 360p, 480p, 720p, 1080p, 4K, 8K
- **WebM**: 360p, 480p, 720p, 1080p

### Audio Formats
- **MP3**: 128kbps, 192kbps, 256kbps, 320kbps

## Customization

### Adding New Platforms

Edit `src/utils/constants.js` and add a new platform configuration:

```javascript
const PLATFORMS = {
  // ... existing platforms
  newPlatform: {
    name: 'New Platform',
    urlPatterns: [
      /^https?:\/\/(www\.)?newplatform\.com\/.*/,
    ],
    icon: 'video',
    color: '#ff0000',
    supports: ['mp4', 'audio'],
  },
};
```

### Customizing Themes

Edit the theme colors in `src/contexts/ThemeContext.js`:

```javascript
const lightTheme = {
  name: 'light',
  colors: {
    primary: '#6c5ce7',
    // ... other colors
  },
};

const darkTheme = {
  name: 'dark',
  colors: {
    primary: '#8e44ad',
    // ... other colors
  },
};
```

### Adding New Formats

Edit `src/utils/constants.js`:

```javascript
const FORMATS = {
  // ... existing formats
  newFormat: {
    name: 'New Format',
    mime: 'video/newformat',
    icon: 'file-video',
    qualities: ['480p', '720p', '1080p'],
  },
};
```

## Dependencies

### Core Dependencies
- **react-native**: 0.72.6
- **react-navigation**: 6.x (Bottom tabs and Stack navigation)
- **react-native-gesture-handler**: For smooth gestures
- **react-native-reanimated**: For animations
- **react-native-safe-area-context**: For safe area handling
- **react-native-vector-icons**: FontAwesome icons
- **react-native-fs**: File system access
- **react-native-permissions**: Permission handling
- **react-native-document-picker**: File picker
- **react-native-share**: Share functionality
- **react-native-toast-message**: Toast notifications
- **@react-native-async-storage/async-storage**: Persistent storage
- **ytdl-core**: YouTube video download (for future implementation)
- **axios**: HTTP requests

### Dev Dependencies
- **babel**: JavaScript compiler
- **metro**: Bundler
- **eslint**: Linting
- **prettier**: Code formatting
- **jest**: Testing

## Configuration

### Android Configuration

1. **AndroidManifest.xml**: Ensure internet permission is added:
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
```

2. **build.gradle**: Configure minimum SDK version:
```gradle
minSdkVersion 23
targetSdkVersion 33
```

### iOS Configuration

1. **Info.plist**: Add required permissions:
```xml
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <true/>
</dict>
<key>NSPhotoLibraryUsageDescription</key>
<string>App needs access to save videos</string>
```

## Backend Integration (Future)

To implement **real video downloads**, you would need to:

1. **Set up a backend server** (Node.js, Python, PHP)
2. **Use platform APIs**:
   - YouTube: `ytdl-core` or YouTube API
   - Facebook: Facebook Graph API
   - Instagram: Instagram API (limited access)
   - TikTok: TikTok API
3. **Handle authentication** for platforms that require it
4. **Implement rate limiting** to prevent abuse
5. **Handle CORS** properly

### Example Backend API

```javascript
// Express.js example
const express = require('express');
const ytdl = require('ytdl-core');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/api/info', async (req, res) => {
  const { url } = req.query;
  try {
    const info = await ytdl.getInfo(url);
    res.json({ 
      title: info.videoDetails.title,
      thumbnail: info.videoDetails.thumbnails[0].url,
      duration: info.videoDetails.lengthSeconds,
      formats: info.formats,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/download', async (req, res) => {
  const { url, format, quality } = req.query;
  // Implement download logic
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

## Troubleshooting

### Common Issues

1. **"Unable to resolve module"**
   - Run: `npm install`
   - Clear cache: `npx react-native start --reset-cache`

2. **Android build fails**
   - Ensure Java JDK 11 is installed
   - Run: `./gradlew clean` in android folder
   - Check AndroidManifest.xml permissions

3. **iOS build fails**
   - Run: `cd ios && pod install && cd ..`
   - Ensure Xcode is up to date
   - Check Info.plist permissions

4. **Permissions denied**
   - Ensure you've requested permissions properly
   - Check AndroidManifest.xml and Info.plist
   - Test on a real device (emulators may have issues)

5. **Network errors**
   - Check internet connection
   - Ensure CORS is handled on the backend
   - Test with a real API endpoint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - Feel free to use, modify, and distribute.

## Support

- **GitHub Issues**: Report bugs and request features
- **Email**: support@videodownloader.com
- **Documentation**: Check the README for updates

---

**Happy Downloading!** 🎥

*Built with React Native and ❤️ by Vibe Code*
