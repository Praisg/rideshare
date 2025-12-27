import React, { useRef, useCallback, useImperativeHandle } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  PanResponder,
  Animated,
  Dimensions,
  Keyboard,
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
  keyboardBehavior?: 'interactive' | 'fillParent' | 'extend';
  keyboardBlurBehavior?: 'none' | 'restore';
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
      keyboardBehavior = 'interactive',
      keyboardBlurBehavior = 'restore',
    },
    ref
  ) => {
    const animatedValue = useRef(new Animated.Value(snapPoints[initialIndex])).current;
    const currentSnapIndex = useRef(initialIndex);
    const lastGesture = useRef(0);
    const scrollViewRef = useRef<ScrollView>(null);
    const scrollOffset = useRef(0);
    const isScrollEnabled = useRef(true);

    const snapTo = useCallback(
      (index: number) => {
        if (index < 0 || index >= snapPoints.length) return;
        
        currentSnapIndex.current = index;
        const snapPoint = snapPoints[index];
        
        if (keyboardBlurBehavior === 'restore') {
          Keyboard.dismiss();
        }
        
        Animated.spring(animatedValue, {
          toValue: snapPoint,
          damping: 25,
          stiffness: 200,
          mass: 0.8,
          useNativeDriver: false,
        }).start(() => {
          onChange?.(index);
        });
      },
      [animatedValue, snapPoints, onChange, keyboardBlurBehavior]
    );

    const panResponder = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onStartShouldSetPanResponderCapture: () => false,
        onMoveShouldSetPanResponder: (_, gestureState) => {
          const isScrolledToTop = scrollOffset.current <= 0;
          const isDraggingDown = gestureState.dy > 0;
          const isDraggingUp = gestureState.dy < 0;
          const hasSignificantMovement = Math.abs(gestureState.dy) > 8;
          
          if (!hasSignificantMovement) return false;
          
          if (isDraggingDown && isScrolledToTop) {
            return true;
          }
          
          if (isDraggingUp && currentSnapIndex.current < snapPoints.length - 1) {
            return true;
          }
          
          return false;
        },
        onMoveShouldSetPanResponderCapture: () => false,
        onPanResponderGrant: () => {
          lastGesture.current = animatedValue._value;
          isScrollEnabled.current = false;
        },
        onPanResponderMove: (_, gestureState) => {
          const newHeight = lastGesture.current - gestureState.dy;
          
          const minHeight = Math.min(...snapPoints);
          const maxHeight = Math.max(...snapPoints);
          const clampedHeight = Math.max(minHeight, Math.min(maxHeight, newHeight));
          
          animatedValue.setValue(clampedHeight);
        },
        onPanResponderRelease: (_, gestureState) => {
          isScrollEnabled.current = true;
          
          const currentHeight = animatedValue._value;
          const velocity = -gestureState.vy;
          
          let targetIndex = currentSnapIndex.current;
          
          if (Math.abs(velocity) > 0.8) {
            if (velocity > 0 && currentSnapIndex.current < snapPoints.length - 1) {
              targetIndex = currentSnapIndex.current + 1;
            } else if (velocity < 0 && currentSnapIndex.current > 0) {
              targetIndex = currentSnapIndex.current - 1;
            }
          } else {
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
        onPanResponderTerminate: () => {
          isScrollEnabled.current = true;
          snapTo(currentSnapIndex.current);
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
          ref={scrollViewRef}
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          scrollEnabled={isScrollEnabled.current}
          bounces={true}
          scrollEventThrottle={16}
          onScroll={(event) => {
            scrollOffset.current = event.nativeEvent.contentOffset.y;
          }}
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
