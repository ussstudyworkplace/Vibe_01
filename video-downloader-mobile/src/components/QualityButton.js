/**
 * Quality Button Component
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useStyles } from '../utils/styles';
import { QUALITY_LABELS } from '../utils/constants';

const QualityButton = ({ quality, isSelected, onPress, disabled = false }) => {
  const { theme } = useTheme();
  const styles = useStyles(theme);
  const label = QUALITY_LABELS[quality] || quality;

  return (
    <TouchableOpacity
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
          opacity: disabled ? 0.6 : 1,
        },
      ]}
      onPress={onPress}
      disabled={disabled}
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

export default QualityButton;
