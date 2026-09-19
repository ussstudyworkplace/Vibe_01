/**
 * Home Screen
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useTheme } from '../contexts/ThemeContext';
import { useStyles } from '../utils/styles';
import { validateUrl, getPlatformInfo, truncate } from '../utils/helpers';
import { PLATFORMS } from '../utils/constants';
import Toast from 'react-native-toast-message';

const { width: screenWidth } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const { theme, isDark } = useTheme();
  const styles = useStyles(theme);
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [recentPlatforms, setRecentPlatforms] = useState([]);

  // Load recent platforms from storage
  useEffect(() => {
    // In a real app, you would load this from AsyncStorage
    const platforms = Object.entries(PLATFORMS).slice(0, 4);
    setRecentPlatforms(platforms);
  }, []);

  // Handle URL input
  const handleUrlChange = (text) => {
    setUrl(text);
    if (error) setError('');
  };

  // Validate and navigate to download
  const handleDownload = () => {
    if (!url.trim()) {
      setError('Please enter a video URL');
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter a video URL',
      });
      return;
    }

    const validation = validateUrl(url);
    if (!validation.valid) {
      setError(validation.message);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: validation.message,
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
      navigation.navigate('Download', {
        url: url,
        platform: validation.platform,
      });
    }, 1000);
  };

  // Select platform
  const selectPlatform = (platformKey) => {
    const platform = PLATFORMS[platformKey];
    const exampleUrl = getExampleUrl(platformKey);
    setUrl(exampleUrl);
    Toast.show({
      type: 'info',
      text1: 'Tip',
      text2: `Paste your ${platform.name} video URL`,
    });
  };

  // Get example URL for platform
  const getExampleUrl = (platformKey) => {
    const examples = {
      youtube: 'https://www.youtube.com/watch?v=',
      facebook: 'https://www.facebook.com/watch/?v=',
      instagram: 'https://www.instagram.com/reel/',
      tiktok: 'https://www.tiktok.com/@username/video/',
      twitter: 'https://twitter.com/user/status/',
      vimeo: 'https://vimeo.com/',
      dailymotion: 'https://www.dailymotion.com/video/',
    };
    return examples[platformKey] || '';
  };

  // Get platform icon color
  const getPlatformColor = (platformKey) => {
    return PLATFORMS[platformKey]?.color || theme.colors.primary;
  };

  // Render platform button
  const renderPlatformButton = ({ item }) => {
    const [platformKey, platform] = item;
    return (
      <TouchableOpacity
        style={[
          styles.card,
          {
            flex: 1,
            margin: 4,
            minWidth: (screenWidth - 40) / 2 - 8,
            alignItems: 'center',
            padding: 16,
          },
        ]}
        onPress={() => selectPlatform(platformKey)}
      >
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: getPlatformColor(platformKey),
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 8,
          }}
        >
          <Icon name={platform.icon} size={24} color="#ffffff" />
        </View>
        <Text style={[styles.text, { fontWeight: '600' }]}>
          {truncate(platform.name, 10)}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.containerNoPadding, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={[styles.rowBetween, styles.mb24]}>
          <View>
            <Text style={[styles.textTitle, { color: theme.colors.primary }]}>
              Video
            </Text>
            <Text style={[styles.textTitle, styles.mt4]}>Downloader</Text>
          </View>
          <TouchableOpacity
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: theme.colors.card,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: theme.colors.text,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}
            onPress={() => navigation.navigate('Settings')}
          >
            <Icon name="cog" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        {/* URL Input */}
        <View style={styles.card}>
          <Text style={[styles.text, styles.mb8]}>Enter Video URL</Text>
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
              onChangeText={handleUrlChange}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
              returnKeyType="go"
              onSubmitEditing={handleDownload}
            />
            <TouchableOpacity
              style={[
                styles.button,
                styles.ml8,
                { backgroundColor: isLoading ? theme.colors.border : theme.colors.primary },
              ]}
              onPress={handleDownload}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Icon name="download" size={20} color="#ffffff" />
              )}
            </TouchableOpacity>
          </View>
          {error ? (
            <Text style={[styles.textSmall, { color: theme.colors.error, marginTop: 8 }]}>
              {error}
            </Text>
          ) : null}
        </View>

        {/* Quick Actions */}
        <Text style={[styles.textLarge, styles.mt24, styles.mb12]}>
          Quick Select
        </Text>
        <FlatList
          data={recentPlatforms}
          renderItem={renderPlatformButton}
          keyExtractor={(item) => item[0]}
          numColumns={2}
          contentContainerStyle={styles.mb24}
          scrollEnabled={false}
        />

        {/* Features */}
        <Text style={[styles.textLarge, styles.mb12]}>Supported Platforms</Text>
        <View style={[styles.card, styles.mb24]}>
          {Object.entries(PLATFORMS).map(([key, platform]) => (
            <View
              key={key}
              style={[
                styles.row,
                styles.mb8,
                { alignItems: 'center' },
              ]}
            >
              <View
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: platform.color,
                  marginRight: 12,
                }}
              />
              <Text style={[styles.text, styles.flex]}>{platform.name}</Text>
              <Icon name="check-circle" size={20} color={theme.colors.success} />
            </View>
          ))}
        </View>

        {/* How to Use */}
        <Text style={[styles.textLarge, styles.mb12]}>How to Use</Text>
        <View style={styles.card}>
          <View style={[styles.row, styles.mb16]}>
            <View
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                backgroundColor: theme.colors.primary,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
              }}
            >
              <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>1</Text>
            </View>
            <View style={styles.flex}>
              <Text style={[styles.text, { fontWeight: '600' }]}>
                Copy Video URL
              </Text>
              <Text style={[styles.textSmall, styles.mt4]}>
                From your favorite platform
              </Text>
            </View>
          </View>

          <View style={[styles.row, styles.mb16]}>
            <View
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                backgroundColor: theme.colors.primary,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
              }}
            >
              <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>2</Text>
            </View>
            <View style={styles.flex}>
              <Text style={[styles.text, { fontWeight: '600' }]}>
                Paste URL Above
              </Text>
              <Text style={[styles.textSmall, styles.mt4]}>
                In the input field
              </Text>
            </View>
          </View>

          <View style={styles.row}>
            <View
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                backgroundColor: theme.colors.primary,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
              }}
            >
              <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>3</Text>
            </View>
            <View style={styles.flex}>
              <Text style={[styles.text, { fontWeight: '600' }]}>
                Download & Save
              </Text>
              <Text style={[styles.textSmall, styles.mt4]}>
                Choose format and quality
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default HomeScreen;
