/**
 * Download Screen
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
  Dimensions,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useTheme } from '../contexts/ThemeContext';
import { useStyles } from '../utils/styles';
import { validateUrl, extractVideoId, getYouTubeThumbnail, truncate } from '../utils/helpers';
import { PLATFORMS, FORMATS, QUALITY_LABELS } from '../utils/constants';
import Toast from 'react-native-toast-message';
import RNFS from 'react-native-fs';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const { width: screenWidth } = Dimensions.get('window');

const DownloadScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const styles = useStyles(theme);
  const { url: initialUrl, platform: initialPlatform } = route.params || {};
  
  const [url, setUrl] = useState(initialUrl || '');
  const [platform, setPlatform] = useState(initialPlatform || '');
  const [videoInfo, setVideoInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('mp4');
  const [selectedQuality, setSelectedQuality] = useState('720p');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  // Check and request storage permission
  useEffect(() => {
    const checkStoragePermission = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
          );
          
          if (!granted) {
            const result = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
              {
                title: 'Storage Permission Required',
                message: 'This app needs access to your storage to save downloaded videos',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
              }
            );
            
            if (result !== PermissionsAndroid.RESULTS.GRANTED) {
              Toast.show({
                type: 'error',
                text1: 'Permission Required',
                text2: 'Storage permission is required to save videos',
              });
            }
          }
        } catch (err) {
          console.error('Permission error:', err);
        }
      }
    };

    checkStoragePermission();
  }, []);

  // Fetch video info when URL changes
  useEffect(() => {
    if (url && url.trim()) {
      fetchVideoInfo();
    }
  }, [url]);

  // Fetch video info
  const fetchVideoInfo = async () => {
    const validation = validateUrl(url);
    if (!validation.valid) {
      setError(validation.message);
      setVideoInfo(null);
      return;
    }

    setIsFetching(true);
    setError('');
    setPlatform(validation.platform);

    try {
      // Simulate fetching video info
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const videoId = extractVideoId(url, validation.platform);
      
      // Mock video info
      const mockInfo = {
        id: videoId || Date.now().toString(),
        title: `Sample Video - ${videoId ? videoId.substring(0, 8) : 'Unknown'}`,
        thumbnail: validation.platform === 'youtube' && videoId
          ? getYouTubeThumbnail(videoId)
          : 'https://via.placeholder.com/480x360/6c5ce7/ffffff?text=Video',
        duration: `${Math.floor(Math.random() * 30) + 1}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
        views: Math.floor(Math.random() * 1000000) + 1000,
        platform: validation.platform,
        availableFormats: getAvailableFormats(validation.platform),
      };

      setVideoInfo(mockInfo);
      
      // Set default format and quality
      const availableFormats = mockInfo.availableFormats;
      const firstFormat = Object.keys(availableFormats)[0];
      const firstQuality = availableFormats[firstFormat]?.qualities[0];
      
      setSelectedFormat(firstFormat || 'mp4');
      setSelectedQuality(firstQuality || '720p');
      
    } catch (err) {
      setError('Failed to fetch video information');
      setVideoInfo(null);
      console.error('Error fetching video info:', err);
    } finally {
      setIsFetching(false);
    }
  };

  // Get available formats for the current platform
  const getAvailableFormats = (platformKey) => {
    if (!platformKey || !PLATFORMS[platformKey]) {
      return FORMATS;
    }
    
    const supportedFormats = PLATFORMS[platformKey].supports;
    const available = {};
    
    supportedFormats.forEach(format => {
      if (FORMATS[format]) {
        available[format] = FORMATS[format];
      }
    });
    
    return available;
  };

  // Start download
  const startDownload = async () => {
    if (!videoInfo) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No video information available',
      });
      return;
    }

    setIsLoading(true);
    setProgress(0);

    try {
      // Check permission again
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        );
        
        if (!granted) {
          Toast.show({
            type: 'error',
            text1: 'Permission Required',
            text2: 'Storage permission is required',
          });
          setIsLoading(false);
          return;
        }
      }

      // Simulate download progress
      const downloadPath = `${RNFS.DownloadDirectoryPath}/${videoInfo.title.replace(/[^a-z0-9]/gi, '_')}_${selectedQuality}.${selectedFormat}`;

      Toast.show({
        type: 'info',
        text1: 'Downloading',
        text2: `Starting download: ${truncate(videoInfo.title, 30)}`,
      });

      // Simulate download progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 300));
        setProgress(i);
      }

      // Save to history
      Toast.show({
        type: 'success',
        text1: 'Download Complete',
        text2: `Saved to: ${downloadPath}`,
      });

      // Navigate back
      setTimeout(() => {
        navigation.navigate('History', {
          download: {
            id: Date.now().toString(),
            title: videoInfo.title,
            thumbnail: videoInfo.thumbnail,
            format: selectedFormat,
            quality: selectedQuality,
            duration: videoInfo.duration,
            timestamp: new Date().toISOString(),
            path: downloadPath,
          },
        });
      }, 1000);

    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Download Failed',
        text2: err.message || 'An error occurred during download',
      });
      console.error('Download error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Render format button
  const renderFormatButton = (formatKey) => {
    const format = FORMATS[formatKey];
    const isSelected = selectedFormat === formatKey;
    
    return (
      <TouchableOpacity
        key={formatKey}
        style={[
          {
            padding: 12,
            borderRadius: 8,
            borderWidth: 2,
            borderColor: isSelected ? theme.colors.primary : theme.colors.border,
            backgroundColor: isSelected ? theme.colors.primary : theme.colors.card,
            marginRight: 8,
            minWidth: 100,
            alignItems: 'center',
          },
        ]}
        onPress={() => {
          setSelectedFormat(formatKey);
          // Reset to first quality of this format
          const firstQuality = format.qualities[0];
          setSelectedQuality(firstQuality);
        }}
        disabled={isLoading}
      >
        <Icon
          name={format.icon || 'file'}
          size={20}
          color={isSelected ? '#ffffff' : theme.colors.primary}
        />
        <Text
          style={[
            { marginTop: 4, fontWeight: '600' },
            isSelected ? { color: '#ffffff' } : { color: theme.colors.text },
          ]}
        >
          {format.name}
        </Text>
      </TouchableOpacity>
    );
  };

  // Render quality button
  const renderQualityButton = (quality) => {
    const isSelected = selectedQuality === quality;
    const label = QUALITY_LABELS[quality] || quality;
    
    return (
      <TouchableOpacity
        key={quality}
        style={[
          {
            padding: 10,
            borderRadius: 6,
            borderWidth: 1,
            borderColor: isSelected ? theme.colors.primary : theme.colors.border,
            backgroundColor: isSelected ? theme.colors.primary : theme.colors.card,
            marginRight: 6,
            marginBottom: 6,
            minWidth: 80,
            alignItems: 'center',
          },
        ]}
        onPress={() => setSelectedQuality(quality)}
        disabled={isLoading}
      >
        <Text
          style={[
            { fontSize: 12, fontWeight: '500' },
            isSelected ? { color: '#ffffff' } : { color: theme.colors.text },
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { paddingBottom: 20 }]}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header */}
      <Text style={[styles.textTitle, styles.mb24]}>Download Video</Text>

      {/* URL Input */}
      <View style={styles.card}>
        <Text style={[styles.text, styles.mb8]}>Video URL</Text>
        <View style={styles.row}>
          <TextInput
            style={[
              styles.input,
              styles.flex,
              { color: theme.colors.text },
            ]}
            placeholder="Paste video URL here..."
            placeholderTextColor={theme.colors.textLight}
            value={url}
            onChangeText={setUrl}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            returnKeyType="go"
            onSubmitEditing={fetchVideoInfo}
            editable={!isLoading}
          />
          <TouchableOpacity
            style={[
              styles.button,
              styles.ml8,
              { backgroundColor: isFetching ? theme.colors.border : theme.colors.primary },
            ]}
            onPress={fetchVideoInfo}
            disabled={isFetching || isLoading}
          >
            {isFetching ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Icon name="search" size={20} color="#ffffff" />
            )}
          </TouchableOpacity>
        </View>
        {error ? (
          <Text style={[styles.textSmall, { color: theme.colors.error, marginTop: 8 }]}>
            {error}
          </Text>
        ) : null}
      </View>

      {/* Video Info */}
      {videoInfo && (
        <View style={[styles.card, styles.mt16]}>
          <Text style={[styles.textLarge, styles.mb12]}>Video Information</Text>
          
          {/* Thumbnail */}
          <Image
            source={{ uri: videoInfo.thumbnail }}
            style={{
              width: '100%',
              height: 180,
              borderRadius: 8,
              marginBottom: 12,
              backgroundColor: theme.colors.backgroundSecondary,
            }}
            resizeMode="cover"
          />
          
          {/* Video Details */}
          <Text
            style={[styles.textLarge, styles.mb8]}
            numberOfLines={2}
          >
            {videoInfo.title}
          </Text>
          
          <View style={[styles.rowBetween, styles.mb12]}>
            <View style={styles.row}>
              <Icon name="clock-o" size={16} color={theme.colors.textLight} />
              <Text style={[styles.textSmall, styles.ml4]}>
                {videoInfo.duration}
              </Text>
            </View>
            <View style={styles.row}>
              <Icon name="eye" size={16} color={theme.colors.textLight} />
              <Text style={[styles.textSmall, styles.ml4]}>
                {videoInfo.views >= 1000000 
                  ? `${(videoInfo.views / 1000000).toFixed(1)}M`
                  : videoInfo.views >= 1000
                  ? `${(videoInfo.views / 1000).toFixed(1)}K`
                  : videoInfo.views}
              </Text>
            </View>
            <View style={styles.row}>
              <Icon name="youtube" size={16} color={PLATFORMS[videoInfo.platform]?.color || theme.colors.primary} />
              <Text style={[styles.textSmall, styles.ml4]}>
                {PLATFORMS[videoInfo.platform]?.name || videoInfo.platform}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Format Selection */}
      {videoInfo && (
        <View style={[styles.card, styles.mt16]}>
          <Text style={[styles.textLarge, styles.mb12]}>Select Format</Text>
          
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.mb16}
          >
            {Object.keys(videoInfo.availableFormats).map(renderFormatButton)}
          </ScrollView>

          <Text style={[styles.text, styles.mb8]}>Select Quality</Text>
          <View style={{ flexWrap: 'wrap', flexDirection: 'row' }}>
            {videoInfo.availableFormats[selectedFormat]?.qualities.map(renderQualityButton)}
          </View>
        </View>
      )}

      {/* Download Button */}
      {videoInfo && (
        <TouchableOpacity
          style={[
            styles.button,
            styles.mt16,
            { opacity: isLoading ? 0.7 : 1 },
          ]}
          onPress={startDownload}
          disabled={isLoading}
        >
          {isLoading ? (
            <View style={styles.row}>
              <ActivityIndicator color="#ffffff" />
              <Text style={[styles.buttonText, styles.ml8]}>
                Downloading... {progress}%
              </Text>
            </View>
          ) : (
            <View style={styles.row}>
              <Icon name="download" size={20} color="#ffffff" />
              <Text style={[styles.buttonText, styles.ml8]}>
                Download {selectedQuality} ({selectedFormat.toUpperCase()})
              </Text>
            </View>
          )}
        </TouchableOpacity>
      )}

      {/* Progress Bar */}
      {isLoading && (
        <View style={[styles.card, styles.mt16]}>
          <Text style={[styles.text, styles.mb8]}>Download Progress</Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${progress}%` },
              ]}
            />
          </View>
          <Text style={[styles.textSmall, styles.mt4, styles.textCenter]}>
            {progress}% complete
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

export default DownloadScreen;
