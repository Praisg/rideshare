import React, { useRef, useCallback, useImperativeHandle } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  PanResponder,
  Animated,
  Dimensions,
} from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface SimpleBottomSheetProps {
  snapPoints: number[];
  initialIndex?: number;
  children: React.ReactNode;
  handleIndicatorStyle?: any;
  style?: any;
  onChange?: (index: number) => void;
  enableOverDrag?: boolean;
  enableDynamicSizing?: boolean;
}

export const SimpleBottomSheet = React.forwardRef<any, SimpleBottomSheetProps>(
  (
    {
      snapPoints,
      initialIndex = 0,
      children,
      handleIndicatorStyle,
      style,
      onChange,
    },
    ref
  ) => {
    const animatedValue = useRef(new Animated.Value(snapPoints[initialIndex])).current;
    const currentSnapIndex = useRef(initialIndex);
    const lastGesture = useRef(0);

    const snapTo = useCallback(
      (index: number) => {
        if (index < 0 || index >= snapPoints.length) return;
        
        currentSnapIndex.current = index;
        const snapPoint = snapPoints[index];
        
        Animated.spring(animatedValue, {
          toValue: snapPoint,
          damping: 20,
          stiffness: 150,
          mass: 0.5,
          useNativeDriver: false,
        }).start(() => {
          onChange?.(index);
        });
      },
      [animatedValue, snapPoints, onChange]
    );

    const panResponder = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, gestureState) => {
          // Only capture if vertical movement is significant
          return Math.abs(gestureState.dy) > 5;
        },
        onPanResponderGrant: () => {
          lastGesture.current = animatedValue._value;
        },
        onPanResponderMove: (_, gestureState) => {
          // Calculate new height based on gesture
          const newHeight = lastGesture.current - gestureState.dy;
          
          // Clamp between min and max snap points
          const minHeight = Math.min(...snapPoints);
          const maxHeight = Math.max(...snapPoints);
          const clampedHeight = Math.max(minHeight, Math.min(maxHeight, newHeight));
          
          animatedValue.setValue(clampedHeight);
        },
        onPanResponderRelease: (_, gestureState) => {
          const currentHeight = animatedValue._value;
          const velocity = -gestureState.vy; // Negative because dy is inverted
          
          // Find closest snap point based on current position and velocity
          let targetIndex = currentSnapIndex.current;
          
          // If velocity is significant, snap in that direction
          if (Math.abs(velocity) > 0.5) {
            if (velocity > 0 && currentSnapIndex.current < snapPoints.length - 1) {
              // Swiping up
              targetIndex = currentSnapIndex.current + 1;
            } else if (velocity < 0 && currentSnapIndex.current > 0) {
              // Swiping down
              targetIndex = currentSnapIndex.current - 1;
            }
          } else {
            // Find nearest snap point
            let minDistance = Infinity;
            snapPoints.forEach((point, index) => {
              const distance = Math.abs(point - currentHeight);
              if (distance < minDistance) {
                minDistance = distance;
                targetIndex = index;
              }
            });
          }
          
          snapTo(targetIndex);
        },
      })
    ).current;

    useImperativeHandle(ref, () => ({
      snapToIndex: (index: number) => {
        snapTo(index);
      },
      close: () => snapTo(0), // Snap to smallest point
    }));

    React.useEffect(() => {
      snapTo(initialIndex);
    }, []);

    const translateY = animatedValue.interpolate({
      inputRange: [Math.min(...snapPoints), Math.max(...snapPoints)],
      outputRange: [SCREEN_HEIGHT - Math.min(...snapPoints), SCREEN_HEIGHT - Math.max(...snapPoints)],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        style={[
          styles.container,
          style,
          {
            transform: [{ translateY }],
          },
        ]}
      >
        <View {...panResponder.panHandlers} style={styles.header}>
          <View style={[styles.handle, handleIndicatorStyle]} />
        </View>
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
          bounces={false}
        >
          {children}
        </ScrollView>
      </Animated.View>
    );
  }
);

export const SimpleBottomSheetScrollView = ({ children, contentContainerStyle }: any) => {
  return <View style={contentContainerStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: SCREEN_HEIGHT,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  header: {
    paddingVertical: 12,
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: 'white',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#DDD',
    borderRadius: 2,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 50,
  },
});
