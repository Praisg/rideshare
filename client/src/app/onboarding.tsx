import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Animated,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import CustomText from '@/components/shared/CustomText';
import { Colors } from '@/utils/Constants';
import { tokenStorage } from '@/store/storage';

const { width, height } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  icon: string;
}

const slides: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Welcome to Ride',
    description: 'Your journey begins here. Experience seamless rides and deliveries at your fingertips.',
    icon: '🚗',
  },
  {
    id: '2',
    title: 'Track in Real-Time',
    description: 'Watch your ride approach with live tracking. Stay informed every step of the way.',
    icon: '📍',
  },
  {
    id: '3',
    title: 'Safe & Secure',
    description: 'Your safety is our priority. Verified drivers and secure payments guaranteed.',
    icon: '🛡️',
  },
];

const Onboarding = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList>(null);

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollTo = () => {
    if (currentIndex < slides.length - 1) {
      slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      handleGetStarted();
    }
  };

  const handleGetStarted = () => {
    tokenStorage.set('onboarding_completed', 'true');
    router.replace('/auth');
  };

  const renderItem = ({ item }: { item: OnboardingSlide }) => (
    <View style={styles.slide}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{item.icon}</Text>
      </View>
      <CustomText variant="h2" fontFamily="Bold" style={styles.title}>
        {item.title}
      </CustomText>
      <CustomText variant="h6" fontFamily="Regular" style={styles.description}>
        {item.description}
      </CustomText>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.gradient_start, Colors.gradient_middle, Colors.gradient_end]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.contentContainer}>
        <FlatList
          data={slides}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          keyExtractor={(item) => item.id}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          ref={slidesRef}
        />
      </View>

      <View style={styles.footer}>
        <BlurView intensity={40} tint="light" style={styles.glassFooter}>
          <View style={styles.pagination}>
            {slides.map((_, index) => {
              const inputRange = [
                (index - 1) * width,
                index * width,
                (index + 1) * width,
              ];

              const dotWidth = scrollX.interpolate({
                inputRange,
                outputRange: [10, 30, 10],
                extrapolate: 'clamp',
              });

              const opacity = scrollX.interpolate({
                inputRange,
                outputRange: [0.3, 1, 0.3],
                extrapolate: 'clamp',
              });

              return (
                <Animated.View
                  key={index.toString()}
                  style={[
                    styles.dot,
                    { width: dotWidth, opacity },
                  ]}
                />
              );
            })}
          </View>

          {currentIndex === slides.length - 1 ? (
            <TouchableOpacity
              style={styles.button}
              onPress={handleGetStarted}
              activeOpacity={0.8}
            >
              <BlurView intensity={60} tint="light" style={styles.buttonBlur}>
                <CustomText variant="h6" fontFamily="Bold" style={styles.buttonText}>
                  Get Started
                </CustomText>
              </BlurView>
            </TouchableOpacity>
          ) : (
            <View style={styles.buttonRow}>
              <TouchableOpacity onPress={handleGetStarted} activeOpacity={0.8}>
                <CustomText variant="h7" fontFamily="Medium" style={styles.skipText}>
                  Skip
                </CustomText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={scrollTo}
                activeOpacity={0.8}
              >
                <BlurView intensity={60} tint="light" style={styles.buttonBlur}>
                  <CustomText variant="h6" fontFamily="Bold" style={styles.buttonText}>
                    Next
                  </CustomText>
                </BlurView>
              </TouchableOpacity>
            </View>
          )}
        </BlurView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  icon: {
    fontSize: 80,
  },
  title: {
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  description: {
    color: Colors.white,
    textAlign: 'center',
    paddingHorizontal: 20,
    opacity: 0.95,
    lineHeight: 24,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  glassFooter: {
    padding: 30,
    overflow: 'hidden',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  dot: {
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.white,
    marginHorizontal: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skipText: {
    color: Colors.white,
    padding: 15,
  },
  button: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  buttonBlur: {
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  buttonText: {
    color: Colors.white,
    textAlign: 'center',
  },
});

export default Onboarding;

