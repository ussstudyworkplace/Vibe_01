/**
 * Settings Screen
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useTheme } from '../contexts/ThemeContext';
import { useStyles } from '../utils/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS, DEFAULT_SETTINGS } from '../utils/constants';
import Toast from 'react-native-toast-message';
import { APP_INFO } from '../utils/constants';

const SettingsScreen = ({ navigation }) => {
  const { theme, isDark, toggleTheme } = useTheme();
  const styles = useStyles(theme);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings
  useEffect(() => {
    loadSettings();
  }, []);

  // Load settings from storage
  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Save settings
  const saveSettings = async (newSettings) => {
    setSettings(newSettings);
    
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.SETTINGS,
        JSON.stringify(newSettings)
      );
      Toast.show({
        type: 'success',
        text1: 'Saved',
        text2: 'Settings saved successfully',
      });
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  // Toggle setting
  const toggleSetting = (key) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    saveSettings(newSettings);
  };

  // Change default format
  const changeDefaultFormat = (format) => {
    const newSettings = { ...settings, defaultFormat: format };
    saveSettings(newSettings);
  };

  // Change default quality
  const changeDefaultQuality = (quality) => {
    const newSettings = { ...settings, defaultQuality: quality };
    saveSettings(newSettings);
  };

  // Clear all data
  const clearAllData = async () => {
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to clear all app data including history and settings?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              setSettings(DEFAULT_SETTINGS);
              Toast.show({
                type: 'success',
                text1: 'Cleared',
                text2: 'All app data has been cleared',
              });
            } catch (error) {
              console.error('Error clearing data:', error);
            }
          },
        },
      ]
    );
  };

  // Rate the app
  const rateApp = () => {
    Toast.show({
      type: 'info',
      text1: 'Rate App',
      text2: 'Thank you for your support!',
    });
  };

  // Share the app
  const shareApp = () => {
    Toast.show({
      type: 'info',
      text1: 'Share App',
      text2: 'Share this app with your friends!',
    });
  };

  // Render setting item
  const renderSettingItem = (title, value, onToggle, icon) => (
    <TouchableOpacity
      style={[styles.card, styles.mb12]}
      onPress={onToggle}
    >
      <View style={styles.rowBetween}>
        <View style={styles.row}>
          <Icon name={icon} size={20} color={theme.colors.primary} />
          <Text style={[styles.text, styles.ml12, { fontWeight: '600' }]}>
            {title}
          </Text>
        </View>
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
          thumbColor={value ? theme.colors.primary : theme.colors.border}
          ios_backgroundColor={theme.colors.border}
        />
      </View>
    </TouchableOpacity>
  );

  // Render format option
  const renderFormatOption = (format, isSelected) => (
    <TouchableOpacity
      key={format}
      style={[
        styles.card,
        styles.mb8,
        {
          borderWidth: 2,
          borderColor: isSelected ? theme.colors.primary : theme.colors.border,
          backgroundColor: isSelected ? theme.colors.primary : theme.colors.card,
        },
      ]}
      onPress={() => changeDefaultFormat(format)}
    >
      <View style={styles.rowBetween}>
        <Text
          style={[
            styles.text,
            isSelected ? { color: '#ffffff' } : { color: theme.colors.text },
          ]}
        >
          {format.toUpperCase()}
        </Text>
        {isSelected && (
          <Icon name="check-circle" size={20} color="#ffffff" />
        )}
      </View>
    </TouchableOpacity>
  );

  // Render quality option
  const renderQualityOption = (quality, isSelected) => (
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
          minWidth: 80,
          alignItems: 'center',
        },
      ]}
      onPress={() => changeDefaultQuality(quality)}
    >
      <Text
        style={[
          { fontSize: 12, fontWeight: '500' },
          isSelected ? { color: '#ffffff' } : { color: theme.colors.text },
        ]}
      >
        {quality}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { paddingBottom: 40 }]}
    >
      {/* Header */}
      <Text style={[styles.textTitle, styles.mb24]}>Settings</Text>

      {/* Appearance Section */}
      <Text style={[styles.textLarge, styles.mb12]}>Appearance</Text>
      
      <TouchableOpacity
        style={[styles.card, styles.mb16]}
        onPress={toggleTheme}
      >
        <View style={styles.rowBetween}>
          <View style={styles.row}>
            <Icon name={isDark ? 'moon-o' : 'sun-o'} size={20} color={theme.colors.primary} />
            <Text style={[styles.text, styles.ml12, { fontWeight: '600' }]}>
              Dark Mode
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.textSmall, { color: theme.colors.textLight, marginRight: 8 }]}>
              {isDark ? 'Enabled' : 'Disabled'}
            </Text>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor={isDark ? theme.colors.primary : theme.colors.border}
              ios_backgroundColor={theme.colors.border}
            />
          </View>
        </View>
      </TouchableOpacity>

      {/* Default Settings Section */}
      <Text style={[styles.textLarge, styles.mb12]}>Default Settings</Text>
      
      <View style={[styles.card, styles.mb16]}>
        <Text style={[styles.text, styles.mb8, { fontWeight: '600' }]}>
          Default Format
        </Text>
        <Text style={[styles.textSmall, { color: theme.colors.textLight, marginBottom: 8 }]}>
          Select the default video format
        </Text>
        
        {['mp4', 'webm', 'audio'].map(format =>
          renderFormatOption(format, settings.defaultFormat === format)
        )}
      </View>

      <View style={[styles.card, styles.mb16]}>
        <Text style={[styles.text, styles.mb8, { fontWeight: '600' }]}>
          Default Quality
        </Text>
        <Text style={[styles.textSmall, { color: theme.colors.textLight, marginBottom: 8 }]}>
          Select the default video quality
        </Text>
        
        <View style={{ flexWrap: 'wrap', flexDirection: 'row' }}>
          {['144p', '240p', '360p', '480p', '720p', '1080p'].map(quality =>
            renderQualityOption(quality, settings.defaultQuality === quality)
          )}
        </View>
      </View>

      {/* General Settings Section */}
      <Text style={[styles.textLarge, styles.mb12]}>General Settings</Text>
      
      {renderSettingItem(
        'Auto Download',
        settings.autoDownload,
        () => toggleSetting('autoDownload'),
        'download'
      )}
      
      {renderSettingItem(
        'Save to Gallery',
        settings.saveToGallery,
        () => toggleSetting('saveToGallery'),
        'image'
      )}
      
      {renderSettingItem(
        'Enable Notifications',
        settings.notifications,
        () => toggleSetting('notifications'),
        'bell'
      )}

      {/* Data Section */}
      <Text style={[styles.textLarge, styles.mb12, styles.mt24]}>Data</Text>
      
      <TouchableOpacity
        style={[styles.card, styles.mb8]}
        onPress={clearAllData}
      >
        <View style={styles.rowBetween}>
          <View style={styles.row}>
            <Icon name="database" size={20} color={theme.colors.error} />
            <Text style={[styles.text, styles.ml12, { fontWeight: '600', color: theme.colors.error }]}>
              Clear All Data
            </Text>
          </View>
          <Icon name="chevron-right" size={20} color={theme.colors.textLight} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.card, styles.mb24]}
        onPress={() => navigation.navigate('History')}
      >
        <View style={styles.rowBetween}>
          <View style={styles.row}>
            <Icon name="history" size={20} color={theme.colors.primary} />
            <Text style={[styles.text, styles.ml12, { fontWeight: '600' }]}>
              Manage Download History
            </Text>
          </View>
          <Icon name="chevron-right" size={20} color={theme.colors.textLight} />
        </View>
      </TouchableOpacity>

      {/* About Section */}
      <Text style={[styles.textLarge, styles.mb12]}>About</Text>
      
      <View style={[styles.card, styles.mb16]}>
        <View style={[styles.row, styles.mb12]}>
          <Icon name="info-circle" size={24} color={theme.colors.primary} />
          <Text style={[styles.textTitle, styles.ml8]}>{APP_INFO.NAME}</Text>
        </View>
        
        <View style={[styles.rowBetween, styles.mb8]}>
          <Text style={[styles.textSmall, { color: theme.colors.textLight }]}>
            Version
          </Text>
          <Text style={[styles.textSmall]}>{APP_INFO.VERSION}</Text>
        </View>
        
        <View style={[styles.rowBetween, styles.mb8]}>
          <Text style={[styles.textSmall, { color: theme.colors.textLight }]}>
            Author
          </Text>
          <Text style={[styles.textSmall]}>{APP_INFO.AUTHOR}</Text>
        </View>
        
        <View style={styles.mt12}>
          <Text style={[styles.textSmall, { color: theme.colors.textLight, textAlign: 'center' }]}>
            {APP_INFO.DESCRIPTION}
          </Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.card}>
        <TouchableOpacity
          style={[styles.button, styles.mb12]}
          onPress={rateApp}
        >
          <View style={styles.row}>
            <Icon name="star" size={20} color="#ffffff" />
            <Text style={[styles.buttonText, styles.ml8]}>Rate the App</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.buttonOutline]}
          onPress={shareApp}
        >
          <View style={styles.row}>
            <Icon name="share-alt" size={20} color={theme.colors.primary} />
            <Text style={[styles.buttonOutlineText, styles.ml8]}>Share the App</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default SettingsScreen;
