import React, { useRef, useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  Dimensions, TouchableOpacity, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { OnboardingSlide } from '../components/OnboardingSlide';
import { ScalePressable } from '../components/Animated';
import { Typography } from '../theme/typography';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    title: 'German bureaucracy\nmade simple',
    description: 'Anmeldung, Aufenthaltstitel, Steuernummer — we guide you through every German office procedure step by step.',
    illustration: '📋',
  },
  {
    title: 'Every document,\nexactly what you need',
    description: 'Know exactly which documents to bring, in what format, and where to get them — before you leave home.',
    illustration: '✅',
  },
  {
    title: 'Ask anything,\nget answers instantly',
    description: 'Our AI assistant speaks plain English and answers any question about German bureaucracy — anytime.',
    illustration: '💬',
  },
];

interface Props {
  onDone: () => void;
}

export function OnboardingScreen({ onDone }: Props) {
  const scrollRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const buttonScale = useRef(new Animated.Value(1)).current;
  const dotsAnim = useRef(SLIDES.map(() => new Animated.Value(0))).current;

  const isLast = currentIndex === SLIDES.length - 1;

  // Animate dot widths when index changes
  useEffect(() => {
    SLIDES.forEach((_, i) => {
      Animated.timing(dotsAnim[i], {
        toValue: i === currentIndex ? 1 : 0,
        duration: 250,
        useNativeDriver: false,
      }).start();
    });
  }, [currentIndex]);

  function goToNext() {
    if (!isLast) {
      const next = currentIndex + 1;
      scrollRef.current?.scrollTo({ x: next * width, animated: true });
      setCurrentIndex(next);
    } else {
      onDone();
    }
  }

  function onScroll(event: any) {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    if (index !== currentIndex) setCurrentIndex(index);
  }

  return (
    // Full-screen teal gradient — matches reference design exactly
    <LinearGradient
      colors={['#0D8A94', '#0D5C63']}
      style={styles.root}
      start={{ x: 0.3, y: 0 }}
      end={{ x: 0.7, y: 1 }}
    >
      {/* Slides */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScroll}
        scrollEventThrottle={16}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        {SLIDES.map((slide, index) => (
          <OnboardingSlide
            key={index}
            {...slide}
            active={index === currentIndex}
          />
        ))}
      </ScrollView>

      {/* Dots — animated width like the reference */}
      <View style={styles.dots}>
        {SLIDES.map((_, index) => {
          const dotWidth = dotsAnim[index].interpolate({
            inputRange: [0, 1],
            outputRange: [8, 24],
          });
          const dotOpacity = dotsAnim[index].interpolate({
            inputRange: [0, 1],
            outputRange: [0.4, 1],
          });
          return (
            <Animated.View
              key={index}
              style={[styles.dot, { width: dotWidth, opacity: dotOpacity }]}
            />
          );
        })}
      </View>

      {/* Bottom section — white button like reference */}
      <View style={styles.bottom}>
        <ScalePressable onPress={goToNext} style={styles.btnWrapper}>
          <View style={styles.btn}>
            <Text style={styles.btnText}>
              {isLast ? 'GET STARTED' : 'NEXT'}
            </Text>
          </View>
        </ScalePressable>

        {/* Skip — only on first two slides, subtle white text */}
        {!isLast && (
          <TouchableOpacity onPress={onDone} style={styles.skipBtn}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'flex-start',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 7,
    paddingVertical: 20,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
  },
  bottom: {
    paddingHorizontal: 32,
    paddingBottom: 56,
    gap: 16,
    alignItems: 'center',
  },
  btnWrapper: {
    width: '100%',
  },
  btn: {
    backgroundColor: 'white',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  btnText: {
    fontSize: Typography.size.base,
    fontFamily: Typography.fontFamily.bold,
    color: '#0D5C63',
    letterSpacing: 1.5,
  },
  skipBtn: {
    padding: 8,
  },
  skipText: {
    fontSize: Typography.size.base,
    fontFamily: Typography.fontFamily.medium,
    color: 'rgba(255,255,255,0.65)',
  },
});