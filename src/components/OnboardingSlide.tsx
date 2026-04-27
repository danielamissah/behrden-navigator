import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Dimensions, Animated,
} from 'react-native';
import { Typography } from '../theme/typography';

const { width, height } = Dimensions.get('window');

interface Props {
  title: string;
  description: string;
  illustration: string;
  active: boolean;
}

// Full-screen teal slide matching the reference design:
// - Entire background is teal gradient
// - Large illustration fills the top 55% of the screen
// - Title and description sit in the lower third in white
// - No card — content sits directly on the teal background
export function OnboardingSlide({ title, description, illustration, active }: Props) {
  const scale = useRef(new Animated.Value(0.85)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (active) {
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          tension: 60,
          friction: 8,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 320,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scale, { toValue: 0.85, duration: 200, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [active]);

  return (
    <View style={[styles.slide, { width }]}>
      {/* Illustration area — top 52% of screen */}
      <Animated.View style={[styles.illustrationArea, { transform: [{ scale }], opacity }]}>
        <Text style={styles.illustration}>{illustration}</Text>
      </Animated.View>

      {/* Text area — bottom section */}
      <Animated.View style={[styles.textArea, { opacity }]}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  slide: {
    height: '100%',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  illustrationArea: {
    width: '100%',
    height: height * 0.42,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.08,
  },
  illustration: {
    fontSize: 140,
    textAlign: 'center',
  },
  textArea: {
    alignItems: 'center',
    paddingHorizontal: 8,
    marginTop: 16,
  },
  title: {
    fontSize: 26,
    fontFamily: Typography.fontFamily.black,
    color: 'white',
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: 14,
  },
  description: {
    fontSize: Typography.size.base,
    fontFamily: Typography.fontFamily.regular,
    color: 'rgba(255,255,255,0.80)',
    textAlign: 'center',
    lineHeight: 22,
  },
});