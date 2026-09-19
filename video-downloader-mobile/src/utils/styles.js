/**
 * Global Styles and Theme Styles
 */

import { StyleSheet } from 'react-native';

// Create styles based on theme
const createStyles = (theme) => {
  return StyleSheet.create({
    // Container Styles
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: 16,
    },
    
    containerNoPadding: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    
    // Card Styles
    card: {
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      shadowColor: theme.colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    
    cardSmall: {
      backgroundColor: theme.colors.card,
      borderRadius: 8,
      padding: 12,
      marginBottom: 8,
    },
    
    // Text Styles
    text: {
      color: theme.colors.text,
      fontSize: 14,
      lineHeight: 20,
    },
    
    textLight: {
      color: theme.colors.textLight,
      fontSize: 14,
      lineHeight: 20,
    },
    
    textSmall: {
      color: theme.colors.textLight,
      fontSize: 12,
      lineHeight: 16,
    },
    
    textLarge: {
      color: theme.colors.text,
      fontSize: 18,
      lineHeight: 24,
      fontWeight: '600',
    },
    
    textTitle: {
      color: theme.colors.text,
      fontSize: 20,
      lineHeight: 28,
      fontWeight: '700',
    },
    
    textCenter: {
      textAlign: 'center',
    },
    
    textPrimary: {
      color: theme.colors.primary,
      fontSize: 14,
      fontWeight: '600',
    },
    
    // Button Styles
    button: {
      backgroundColor: theme.colors.primary,
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 24,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 48,
    },
    
    buttonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '600',
    },
    
    buttonSecondary: {
      backgroundColor: theme.colors.backgroundSecondary,
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 24,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 48,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    
    buttonSecondaryText: {
      color: theme.colors.text,
      fontSize: 16,
      fontWeight: '600',
    },
    
    buttonSmall: {
      backgroundColor: theme.colors.primary,
      borderRadius: 6,
      paddingVertical: 8,
      paddingHorizontal: 16,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 36,
    },
    
    buttonSmallText: {
      color: '#ffffff',
      fontSize: 14,
      fontWeight: '600',
    },
    
    buttonOutline: {
      backgroundColor: 'transparent',
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 24,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 48,
      borderWidth: 2,
      borderColor: theme.colors.primary,
    },
    
    buttonOutlineText: {
      color: theme.colors.primary,
      fontSize: 16,
      fontWeight: '600',
    },
    
    // Input Styles
    input: {
      backgroundColor: theme.colors.backgroundSecondary,
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 16,
      color: theme.colors.text,
      fontSize: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    
    inputMultiline: {
      backgroundColor: theme.colors.backgroundSecondary,
      borderRadius: 8,
      padding: 12,
      color: theme.colors.text,
      fontSize: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
      minHeight: 100,
      textAlignVertical: 'top',
    },
    
    // Header Styles
    header: {
      backgroundColor: theme.colors.card,
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    
    headerTitle: {
      color: theme.colors.text,
      fontSize: 20,
      fontWeight: '700',
    },
    
    // Divider
    divider: {
      height: 1,
      backgroundColor: theme.colors.border,
      marginVertical: 8,
    },
    
    // Row
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    
    rowBetween: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    
    rowCenter: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    
    // Flex
    flex: {
      flex: 1,
    },
    
    // Align Items
    center: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    
    // Spacing
    mt4: { marginTop: 4 },
    mt8: { marginTop: 8 },
    mt12: { marginTop: 12 },
    mt16: { marginTop: 16 },
    mt24: { marginTop: 24 },
    
    mb4: { marginBottom: 4 },
    mb8: { marginBottom: 8 },
    mb12: { marginBottom: 12 },
    mb16: { marginBottom: 16 },
    mb24: { marginBottom: 24 },
    
    ml4: { marginLeft: 4 },
    ml8: { marginLeft: 8 },
    ml12: { marginLeft: 12 },
    ml16: { marginLeft: 16 },
    
    mr4: { marginRight: 4 },
    mr8: { marginRight: 8 },
    mr12: { marginRight: 12 },
    mr16: { marginRight: 16 },
    
    // Padding
    p4: { padding: 4 },
    p8: { padding: 8 },
    p12: { padding: 12 },
    p16: { padding: 16 },
    p24: { padding: 24 },
    
    // Badge
    badge: {
      backgroundColor: theme.colors.primary,
      borderRadius: 12,
      paddingVertical: 4,
      paddingHorizontal: 8,
      alignSelf: 'flex-start',
    },
    
    badgeText: {
      color: '#ffffff',
      fontSize: 12,
      fontWeight: '600',
    },
    
    badgeSuccess: {
      backgroundColor: theme.colors.success,
      borderRadius: 12,
      paddingVertical: 4,
      paddingHorizontal: 8,
    },
    
    badgeError: {
      backgroundColor: theme.colors.error,
      borderRadius: 12,
      paddingVertical: 4,
      paddingHorizontal: 8,
    },
    
    // Loading
    loading: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    
    // Empty State
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 40,
    },
    
    emptyStateText: {
      color: theme.colors.textLight,
      fontSize: 16,
      textAlign: 'center',
      marginTop: 16,
    },
    
    // Progress Bar
    progressBar: {
      height: 4,
      backgroundColor: theme.colors.backgroundSecondary,
      borderRadius: 2,
      overflow: 'hidden',
    },
    
    progressFill: {
      height: '100%',
      backgroundColor: theme.colors.primary,
      borderRadius: 2,
    },
    
    // Icon Button
    iconButton: {
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    
    // List Item
    listItem: {
      backgroundColor: theme.colors.card,
      borderRadius: 8,
      padding: 16,
      marginBottom: 8,
      flexDirection: 'row',
      alignItems: 'center',
    },
    
    // Modal
    modal: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: 20,
    },
    
    modalContent: {
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      padding: 20,
    },
    
    // Toast
    toast: {
      backgroundColor: theme.colors.card,
      borderRadius: 8,
      padding: 12,
      marginBottom: 16,
      shadowColor: theme.colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
    },
    
    // Switch
    switch: {
      transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
    },
  });
};

// Light theme styles (default)
const lightStyles = createStyles({
  colors: {
    primary: '#6c5ce7',
    primaryLight: '#a29bfe',
    primaryDark: '#5649c0',
    secondary: '#00cec9',
    background: '#ffffff',
    backgroundSecondary: '#f8f9fa',
    card: '#ffffff',
    text: '#2d3436',
    textLight: '#636e72',
    textDark: '#2d3436',
    border: '#e0e0e0',
    error: '#ff4757',
    success: '#2ed573',
    warning: '#ffa502',
    info: '#1e90ff',
  },
});

// Dark theme styles
const darkStyles = createStyles({
  colors: {
    primary: '#8e44ad',
    primaryLight: '#a29bfe',
    primaryDark: '#732d91',
    secondary: '#16a085',
    background: '#1a1a2e',
    backgroundSecondary: '#16213e',
    card: '#16213e',
    text: '#f5f6fa',
    textLight: '#b2bec3',
    textDark: '#f5f6fa',
    border: '#2d3748',
    error: '#ff6b81',
    success: '#4ecdc4',
    warning: '#ffa502',
    info: '#1e90ff',
  },
});

// Hook to use styles with theme
const useStyles = (theme) => {
  return createStyles(theme);
};

export { createStyles, lightStyles, darkStyles, useStyles };
