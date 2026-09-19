/**
 * Platform Button Component
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useTheme } from '../contexts/ThemeContext';
import { useStyles } from '../utils/styles';
import { PLATFORMS } from '../utils/constants';

const PlatformButton = ({ platformKey, onPress, size = 'medium' }) => {
  const { theme } = useTheme();
  const styles = useStyles(theme);
  const platform = PLATFORMS[platformKey];
  
  if (!platform) return null;

  // Define sizes
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          container: { padding: 8, minWidth: 80 },
          icon: { width: 30, height: 30, iconSize: 16 },
          text: { fontSize: 12 },
        };
      case 'large':
        return {
          container: { padding: 20, minWidth: 150 },
          icon: { width: 60, height: 60, iconSize: 28 },
          text: { fontSize: 16 },
        };
      default: // medium
        return {
          container: { padding: 12, minWidth: 100 },
          icon: { width: 45, height: 45, iconSize: 22 },
          text: { fontSize: 14 },
        };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          alignItems: 'center',
          margin: 4,
          ...sizeStyles.container,
        },
      ]}
      onPress={onPress}
    >
      <View
        style={{
          width: sizeStyles.icon.width,
          height: sizeStyles.icon.height,
          borderRadius: sizeStyles.icon.width / 2,
          backgroundColor: platform.color,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 8,
        }}
      >
        <Icon name={platform.icon} size={sizeStyles.icon.iconSize} color="#ffffff" />
      </View>
      <Text
        style={[
          styles.text,
          { fontWeight: '600', ...sizeStyles.text },
        ]}
        numberOfLines={1}
      >
        {platform.name}
      </Text>
    </TouchableOpacity>
  );
};

export default PlatformButton;
