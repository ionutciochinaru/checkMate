import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Dimensions } from 'react-native';
import { useThemedStyles, useTheme } from '../hooks/useTheme';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming, 
  runOnJS 
} from 'react-native-reanimated';

export interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message?: string;
  buttons?: AlertButton[];
  onDismiss?: () => void;
}

const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  title,
  message,
  buttons = [{ text: 'OK' }],
  onDismiss
}) => {
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(visible);
  
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);
  const translateY = useSharedValue(20);

  useEffect(() => {
    if (visible) {
      setIsVisible(true);
      const duration = theme.reducedMotion ? 0 : 200;
      
      opacity.value = withTiming(1, { duration });
      scale.value = withSpring(1, { 
        damping: theme.reducedMotion ? 100 : 15,
        stiffness: theme.reducedMotion ? 100 : 150 
      });
      translateY.value = withTiming(0, { duration });
    } else {
      const duration = theme.reducedMotion ? 0 : 150;
      
      opacity.value = withTiming(0, { duration });
      scale.value = withTiming(0.8, { duration });
      translateY.value = withTiming(20, { duration }, () => {
        runOnJS(setIsVisible)(false);
      });
    }
  }, [visible, theme.reducedMotion]);

  const handleButtonPress = (button: AlertButton) => {
    if (button.onPress) {
      button.onPress();
    }
    if (onDismiss) {
      onDismiss();
    }
  };

  const animatedOverlayStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const animatedContentStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value }
    ],
    opacity: opacity.value,
  }));

  const styles = useThemedStyles((theme) => StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    container: {
      backgroundColor: theme.colors.surface,
      borderWidth: 2,
      borderColor: theme.colors.accent,
      minWidth: 280,
      maxWidth: Dimensions.get('window').width - 40,
      shadowColor: theme.colors.accent,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: theme.isDark ? 0.3 : 0.15,
      shadowRadius: 8,
      elevation: 8,
      borderRadius: theme.borderRadius.md,
    },
    header: {
      backgroundColor: theme.colors.accent,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    title: {
      fontFamily: 'JetBrainsMono_700Bold',
      fontSize: 14 * 1.0,
      color: theme.colors.background,
      letterSpacing: 1,
      fontWeight: '800',
      flex: 1,
    },
    titleIcon: {
      fontFamily: 'JetBrainsMono_700Bold',
      fontSize: 12 * 1.0,
      color: theme.colors.background,
      letterSpacing: 0.5,
      marginLeft: 8,
    },
    content: {
      padding: 16,
    },
    message: {
      fontFamily: 'JetBrainsMono_500Medium',
      fontSize: 12 * 1.0,
      color: theme.colors.text,
      letterSpacing: 0.3,
      lineHeight: 18 * 1.0,
      marginBottom: message ? 16 : 0,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 8,
      marginTop: 8,
    },
    button: {
      backgroundColor: theme.colors.surfaceVariant,
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingHorizontal: 16,
      paddingVertical: 8,
      minWidth: 80,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.borderRadius.md,
    },
    buttonCancel: {
      backgroundColor: theme.colors.surfaceVariant,
      borderColor: theme.colors.textMuted,
    },
    buttonDestructive: {
      backgroundColor: theme.colors.danger,
      borderColor: theme.colors.danger,
    },
    buttonDefault: {
      backgroundColor: theme.colors.accent,
      borderColor: theme.colors.accent,
    },
    buttonText: {
      fontFamily: 'JetBrainsMono_700Bold',
      fontSize: 11 * 1.0,
      color: theme.colors.text,
      letterSpacing: 0.5,
      fontWeight: '700',
    },
    buttonTextCancel: {
      color: theme.colors.textMuted,
    },
    buttonTextDestructive: {
      color: theme.colors.background,
    },
    buttonTextDefault: {
      color: theme.colors.background,
    },
    singleButtonContainer: {
      justifyContent: 'center',
    },
  }));

  if (!isVisible) return null;

  const getAlertIcon = () => {
    if (title.toLowerCase().includes('error') || title.toLowerCase().includes('invalid')) {
      return '[ERR]';
    }
    if (title.toLowerCase().includes('delete') || buttons.some(b => b.style === 'destructive')) {
      return '[!]';
    }
    if (buttons.length > 1) {
      return '[?]';
    }
    return '[i]';
  };

  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="none"
      onRequestClose={onDismiss}
    >
      <Animated.View style={[styles.overlay, animatedOverlayStyle]}>
        <Animated.View style={[styles.container, animatedContentStyle]}>
          {/* Terminal-style header */}
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{title.toUpperCase()}</Text>
              <Text style={styles.titleIcon}>{getAlertIcon()}</Text>
            </View>
          </View>

          {/* Content */}
          <View style={styles.content}>
            {message && (
              <Text style={styles.message}>{message}</Text>
            )}

            {/* Buttons */}
            <View style={[
              styles.buttonContainer,
              buttons.length === 1 && styles.singleButtonContainer
            ]}>
              {buttons.map((button, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.button,
                    button.style === 'cancel' && styles.buttonCancel,
                    button.style === 'destructive' && styles.buttonDestructive,
                    (button.style === 'default' || !button.style) && styles.buttonDefault,
                  ]}
                  onPress={() => handleButtonPress(button)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.buttonText,
                    button.style === 'cancel' && styles.buttonTextCancel,
                    button.style === 'destructive' && styles.buttonTextDestructive,
                    (button.style === 'default' || !button.style) && styles.buttonTextDefault,
                  ]}>
                    {button.text.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

interface AlertState {
  visible: boolean;
  title: string;
  message?: string;
  buttons?: AlertButton[];
}

class AlertManager {
  private static instance: AlertManager;
  private alertComponent: React.RefObject<any> | null = null;
  private currentAlert: AlertState | null = null;
  private onDismissCallback: (() => void) | null = null;

  static getInstance(): AlertManager {
    if (!AlertManager.instance) {
      AlertManager.instance = new AlertManager();
    }
    return AlertManager.instance;
  }

  setAlertComponent(component: React.RefObject<any>) {
    this.alertComponent = component;
  }

  show(title: string, message?: string, buttons?: AlertButton[]) {
    if (!this.alertComponent?.current) {
      return;
    }

    this.currentAlert = {
      visible: true,
      title,
      message,
      buttons
    };

    this.alertComponent.current.showAlert(this.currentAlert);
  }

  hide() {
    if (this.alertComponent?.current) {
      this.alertComponent.current.hideAlert();
    }
    this.currentAlert = null;
  }
}

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const alertRef = React.useRef<any>(null);
  const [alertState, setAlertState] = useState<AlertState>({
    visible: false,
    title: '',
    message: '',
    buttons: []
  });

  useEffect(() => {
    AlertManager.getInstance().setAlertComponent(alertRef);
  }, []);

  React.useImperativeHandle(alertRef, () => ({
    showAlert: (alert: AlertState) => {
      setAlertState(alert);
    },
    hideAlert: () => {
      setAlertState(prev => ({ ...prev, visible: false }));
    }
  }));

  const handleDismiss = () => {
    setAlertState(prev => ({ ...prev, visible: false }));
  };

  return (
    <>
      {children}
      <CustomAlert
        visible={alertState.visible}
        title={alertState.title}
        message={alertState.message}
        buttons={alertState.buttons}
        onDismiss={handleDismiss}
      />
    </>
  );
};

export const showAlert = (title: string, message?: string, buttons?: AlertButton[]) => {
  AlertManager.getInstance().show(title, message, buttons);
};

export default CustomAlert;