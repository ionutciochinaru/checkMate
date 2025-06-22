import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ActivityIndicator } from 'react-native';
import { useThemedStyles, useTheme } from '../hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { useGoogleCalendarSync } from '../hooks/useGoogleCalendarSync';

interface GoogleCalendarSyncModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function GoogleCalendarSyncModal({
  visible,
  onClose,
}: GoogleCalendarSyncModalProps) {
  const { theme } = useTheme();
  const { signInWithGoogle, syncCalendarEvents, signOut, authState, isLoading } = useGoogleCalendarSync();

  const styles = useThemedStyles((theme) => StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: theme.isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.6)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    container: {
      backgroundColor: theme.colors.surface,
      borderWidth: 2,
      borderColor: theme.colors.accent,
      borderRadius: theme.borderRadius.lg,
      minWidth: 320,
      maxWidth: '90%',
      shadowColor: theme.isDark ? '#000000' : theme.colors.accent,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: theme.isDark ? 0.6 : 0.25,
      shadowRadius: 16,
      elevation: 12,
    },
    header: {
      backgroundColor: theme.colors.accent,
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 2,
      borderBottomColor: theme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
      borderTopLeftRadius: theme.borderRadius.lg,
      borderTopRightRadius: theme.borderRadius.lg,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    title: {
      fontFamily: 'JetBrainsMono_700Bold',
      fontSize: 16,
      color: theme.colors.background,
      letterSpacing: 1.2,
      flex: 1,
    },
    titleIcon: {
      marginLeft: 12,
    },
    closeButton: {
      padding: 4,
    },
    content: {
      padding: 24,
    },
    description: {
      fontFamily: 'JetBrainsMono_500Medium',
      fontSize: 14,
      color: theme.colors.text,
      letterSpacing: 0.4,
      lineHeight: 22,
      marginBottom: 20,
    },
    userInfo: {
      backgroundColor: theme.colors.surfaceVariant,
      borderRadius: theme.borderRadius.md,
      padding: 16,
      marginBottom: 20,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    userInfoText: {
      fontFamily: 'JetBrainsMono_500Medium',
      fontSize: 12,
      color: theme.colors.text,
      letterSpacing: 0.3,
      flex: 1,
    },
    buttonContainer: {
      gap: 12,
    },
    button: {
      backgroundColor: theme.colors.accent,
      borderWidth: 1.5,
      borderColor: theme.colors.accent,
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: theme.borderRadius.md,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      shadowColor: theme.colors.accent,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    buttonSecondary: {
      backgroundColor: 'transparent',
      borderColor: theme.colors.textMuted,
    },
    buttonDanger: {
      backgroundColor: theme.colors.danger,
      borderColor: theme.colors.danger,
    },
    buttonText: {
      fontFamily: 'JetBrainsMono_700Bold',
      fontSize: 12,
      color: theme.colors.background,
      letterSpacing: 0.8,
      fontWeight: '700',
    },
    buttonTextSecondary: {
      color: theme.colors.textMuted,
    },
    buttonTextDanger: {
      color: theme.colors.background,
    },
    loadingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      paddingVertical: 4,
    },
    loadingText: {
      fontFamily: 'JetBrainsMono_500Medium',
      fontSize: 12,
      color: theme.colors.background,
      letterSpacing: 0.5,
    },
    comingSoonContainer: {
      alignItems: 'center',
      paddingVertical: 20,
    },
    comingSoonTitle: {
      fontFamily: 'JetBrainsMono_700Bold',
      fontSize: 18,
      color: theme.colors.text,
      letterSpacing: 1,
      marginBottom: 16,
      textAlign: 'center',
    },
  }));

  const handleSignIn = async () => {
    await signInWithGoogle();
  };

  const handleSync = async () => {
    const result = await syncCalendarEvents();
    if (result.success) {
      onClose();
    }
  };

  const handleSignOut = () => {
    signOut();
  };

  const renderContent = () => {
    return (
      <>
        <View style={styles.comingSoonContainer}>
          <Ionicons 
            name="construct-outline" 
            size={48} 
            color={theme.colors.textMuted}
            style={{ marginBottom: 16 }}
          />
          <Text style={styles.comingSoonTitle}>
            Coming Soon
          </Text>
          <Text style={styles.description}>
            Google Calendar integration will be added in future updates. Stay tuned for automatic event importing and task synchronization!
          </Text>
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.buttonSecondary]}
            onPress={onClose}
          >
            <Ionicons name="checkmark-outline" size={16} color={theme.colors.textMuted} />
            <Text style={[styles.buttonText, styles.buttonTextSecondary]}>Got It</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>GOOGLE CALENDAR</Text>
            <View style={styles.titleIcon}>
              <Text style={{ fontFamily: 'JetBrainsMono_700Bold', fontSize: 14, color: theme.colors.background }}>
                [CAL]
              </Text>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
            >
              <Ionicons name="close" size={20} color={theme.colors.background} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.content}>
            {renderContent()}
          </View>
        </View>
      </View>
    </Modal>
  );
}