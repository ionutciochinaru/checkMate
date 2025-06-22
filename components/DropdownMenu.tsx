import React, { useRef, useEffect, useState, ReactNode } from 'react';
import { View, Modal, StyleSheet, TouchableWithoutFeedback, Dimensions } from 'react-native';
import { useThemedStyles, useTheme } from '../hooks/useTheme';

interface DropdownMenuProps {
  visible: boolean;
  handleClose: () => void;
  handleOpen: () => void;
  trigger: React.ReactNode;
  children: React.ReactNode;
  dropdownWidth?: number;
  position?: 'left' | 'right' | 'center';
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  visible,
  handleOpen,
  handleClose,
  trigger,
  children,
  dropdownWidth = 180,
  position = 'center',
}) => {
  const { theme } = useTheme();
  const triggerRef = useRef<View>(null);
  const [layout, setLayout] = useState({x: 0, y: 0, width: 0});

  const styles = useThemedStyles((theme) => StyleSheet.create({
    modalOverlay: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      backgroundColor: 'transparent',
    },
    menu: {
      position: 'absolute',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      shadowColor: theme.isDark ? '#000000' : '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: theme.isDark ? 0.3 : 0.15,
      shadowRadius: 12,
      elevation: 8,
      overflow: 'hidden',
      zIndex: 99999,
    },
  }));

  useEffect(() => {
    if (triggerRef.current && visible) {
      triggerRef.current.measure((fx, fy, width, height, px, py) => {
        const screenHeight = Dimensions.get('window').height;
        const screenWidth = Dimensions.get('window').width;
        
        let dropdownX = px;
        let dropdownY = py + height + 4;
        
        // Adjust horizontal position based on prop
        if (position === 'right') {
          dropdownX = px + width - dropdownWidth;
        } else if (position === 'center') {
          dropdownX = px + width / 2 - dropdownWidth / 2;
        }
        
        // Ensure dropdown doesn't go off screen
        if (dropdownX + dropdownWidth > screenWidth - 16) {
          dropdownX = screenWidth - dropdownWidth - 16;
        }
        if (dropdownX < 16) {
          dropdownX = 16;
        }
        
        // Check if dropdown would go below screen
        if (dropdownY + 200 > screenHeight - 50) {
          dropdownY = py - 200 - 4; // Show above button
        }
        
        setLayout({
          x: dropdownX,
          y: dropdownY,
          width: dropdownWidth,
        });
      });
    }
  }, [visible, dropdownWidth, position]);

  return (
    <View>
      <TouchableWithoutFeedback onPress={handleOpen}>
        <View ref={triggerRef}>{trigger}</View>
      </TouchableWithoutFeedback>
      {visible && (
        <Modal
          transparent={true}
          visible={visible}
          animationType="fade"
          onRequestClose={handleClose}>
          <TouchableWithoutFeedback onPress={handleClose}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback onPress={() => {}}>
                <View
                  style={[
                    styles.menu,
                    {
                      top: layout.y,
                      left: layout.x,
                      width: layout.width,
                      maxHeight: 240, // Limit height to ensure scrolling
                    },
                  ]}>
                  {children}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </View>
  );
};

export default DropdownMenu;