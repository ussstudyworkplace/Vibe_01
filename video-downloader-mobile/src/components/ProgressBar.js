/**
 * Progress Bar Component
 */

import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useStyles } from '../utils/styles';

const ProgressBar = ({ progress, showText = true, text = null }) => {
  const { theme } = useTheme();
  const styles = useStyles(theme);

  return (
    <View>
      {showText && (
        <View style={[styles.rowBetween, styles.mb4]}>
          <Text style={[styles.textSmall, { color: theme.colors.textLight }]}>
            {text || 'Downloading...'}
          </Text>
          <Text style={[styles.textSmall, { color: theme.colors.textLight }]}>
            {progress}%
          </Text>
        </View>
      )}
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { width: `${Math.min(progress, 100)}%` },
          ]}
        />
      </View>
    </View>
  );
};

export default ProgressBar;
