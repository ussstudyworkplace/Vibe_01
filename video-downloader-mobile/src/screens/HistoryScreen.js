/**
 * History Screen
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  Share,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useTheme } from '../contexts/ThemeContext';
import { useStyles } from '../utils/styles';
import { formatDate, truncate } from '../utils/helpers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../utils/constants';
import Toast from 'react-native-toast-message';
import RNFS from 'react-native-fs';

const HistoryScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const styles = useStyles(theme);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load download history
  useEffect(() => {
    loadHistory();
  }, []);

  // Check for new download from route params
  useEffect(() => {
    if (route.params?.download) {
      addToHistory(route.params.download);
    }
  }, [route.params]);

  // Load history from storage
  const loadHistory = async () => {
    try {
      const savedHistory = await AsyncStorage.getItem(STORAGE_KEYS.DOWNLOAD_HISTORY);
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add to history
  const addToHistory = async (download) => {
    const newHistory = [download, ...history];
    
    // Keep only last 20 downloads
    if (newHistory.length > 20) {
      newHistory.pop();
    }
    
    setHistory(newHistory);
    
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.DOWNLOAD_HISTORY,
        JSON.stringify(newHistory)
      );
    } catch (error) {
      console.error('Error saving history:', error);
    }
  };

  // Delete item from history
  const deleteItem = async (id) => {
    Alert.alert(
      'Delete Download',
      'Are you sure you want to delete this download from history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const newHistory = history.filter(item => item.id !== id);
            setHistory(newHistory);
            
            try {
              await AsyncStorage.setItem(
                STORAGE_KEYS.DOWNLOAD_HISTORY,
                JSON.stringify(newHistory)
              );
              Toast.show({
                type: 'success',
                text1: 'Deleted',
                text2: 'Download removed from history',
              });
            } catch (error) {
              console.error('Error deleting from history:', error);
            }
          },
        },
      ]
    );
  };

  // Clear all history
  const clearAllHistory = async () => {
    Alert.alert(
      'Clear All History',
      'Are you sure you want to clear all download history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            setHistory([]);
            
            try {
              await AsyncStorage.removeItem(STORAGE_KEYS.DOWNLOAD_HISTORY);
              Toast.show({
                type: 'success',
                text1: 'Cleared',
                text2: 'All download history has been cleared',
              });
            } catch (error) {
              console.error('Error clearing history:', error);
            }
          },
        },
      ]
    );
  };

  // Share download
  const shareDownload = async (item) => {
    try {
      const fileExists = await RNFS.exists(item.path);
      
      if (!fileExists) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'File not found',
        });
        return;
      }

      await Share.share({
        message: `Check out this video: ${item.title}`,
        url: `file://${item.path}`,
        type: 'video/*',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'Failed to share',
      });
    }
  };

  // Re-download
  const reDownload = (item) => {
    navigation.navigate('Download', {
      url: '',
      platform: item.platform,
    });
    Toast.show({
      type: 'info',
      text1: 'Tip',
      text2: 'Paste the video URL to download again',
    });
  };

  // Render history item
  const renderHistoryItem = ({ item }) => (
    <View style={[styles.card, styles.mb12]}>
      <View style={styles.row}>
        {/* Thumbnail */}
        <Image
          source={{ uri: item.thumbnail || 'https://via.placeholder.com/120x80/6c5ce7/ffffff?text=Video' }}
          style={{
            width: 100,
            height: 70,
            borderRadius: 8,
            marginRight: 12,
            backgroundColor: theme.colors.backgroundSecondary,
          }}
          resizeMode="cover"
        />
        
        {/* Info */}
        <View style={[styles.flex, { marginRight: 8 }]}>
          <Text
            style={[styles.text, { fontWeight: '600' }]}
            numberOfLines={1}
          >
            {truncate(item.title, 40)}
          </Text>
          <View style={[styles.row, styles.mt4]}>
            <Text style={[styles.textSmall, { color: theme.colors.textLight }]}>
              {item.quality} • {item.format.toUpperCase()}
            </Text>
          </View>
          <Text style={[styles.textSmall, { color: theme.colors.textLight }]}>
            {formatDate(item.timestamp)}
          </Text>
        </View>
        
        {/* Actions */}
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.iconButton, { padding: 8 }]}
            onPress={() => shareDownload(item)}
          >
            <Icon name="share-alt" size={18} color={theme.colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconButton, { padding: 8 }]}
            onPress={() => reDownload(item)}
          >
            <Icon name="download" size={18} color={theme.colors.success} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconButton, { padding: 8 }]}
            onPress={() => deleteItem(item.id)}
          >
            <Icon name="trash" size={18} color={theme.colors.error} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // Empty state
  const renderEmptyState = () => (
    <View style={[styles.emptyState, { paddingTop: 60 }]}>
      <Icon name="history" size={60} color={theme.colors.textLight} />
      <Text style={[styles.emptyStateText, styles.mt16]}>
        No download history yet
      </Text>
      <Text style={[styles.textSmall, styles.textCenter, styles.mt8]}>
        Your downloaded videos will appear here
      </Text>
      <TouchableOpacity
        style={[styles.button, styles.mt16]}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.buttonText}>Download a Video</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.containerNoPadding, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.rowBetween, styles.p16, styles.mb16]}>
        <Text style={[styles.textTitle]}>Download History</Text>
        {history.length > 0 && (
          <TouchableOpacity
            style={{
              padding: 8,
              borderRadius: 8,
              backgroundColor: theme.colors.card,
            }}
            onPress={clearAllHistory}
          >
            <Icon name="trash" size={20} color={theme.colors.error} />
          </TouchableOpacity>
        )}
      </View>

      {/* History List */}
      {isLoading ? (
        <View style={[styles.loading, { paddingTop: 60 }]}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : history.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={history}
          renderItem={renderHistoryItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.p16}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default HistoryScreen;
