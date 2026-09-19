/**
 * Format Button Component
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useTheme } from '../contexts/ThemeContext';
import { useStyles } from '../utils/styles';
import { FORMATS } from '../utils/constants';

const FormatButton = ({ format, isSelected, onPress, disabled = false }) => {
  const { theme } = useTheme();
  const styles = useStyles(theme);
  const formatInfo = FORMATS[format];
  
  if (!formatInfo) return null;

  return (
    <TouchableOpacity
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
          opacity: disabled ? 0.6 : 1,
        },
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Icon
        name={formatInfo.icon || 'file'}
        size={20}
        color={isSelected ? '#ffffff' : theme.colors.primary}
      />
      <Text
        style={[
          { marginTop: 4, fontWeight: '600' },
          isSelected ? { color: '#ffffff' } : { color: theme.colors.text },
        ]}
      >
        {formatInfo.name}
      </Text>
    </TouchableOpacity>
  );
};

export default FormatButton;
