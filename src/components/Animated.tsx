import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle } from 'react-native';

// FadeInView — fades in its children when mounted.
// Used for screen entrances and list items appearing.
interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  style?: ViewStyle;
}

export function FadeInView({ children, delay = 0, duration = 280, style }: FadeInProps) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration,
      delay,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[{ opacity }, style]}>
      {children}
    </Animated.View>
  );
}

// SlideUpView — slides up from below and fades in simultaneously.
// Used for cards and modal-like content appearing.
interface SlideUpProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  style?: ViewStyle;
}

export function SlideUpView({ children, delay = 0, duration = 320, style }: SlideUpProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[{ opacity, transform: [{ translateY }] }, style]}>
      {children}
    </Animated.View>
  );
}

// ScalePressable — subtle scale-down on press for interactive elements.
// Wraps a child and animates it on press in/out.
interface ScaleProps {
  children: React.ReactNode;
  onPress: () => void;
  style?: ViewStyle;
  activeOpacity?: number;
}

export function ScalePressable({ children, onPress, style }: ScaleProps) {
  const scale = useRef(new Animated.Value(1)).current;

  function pressIn() {
    Animated.spring(scale, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 50,
      bounciness: 0,
    }).start();
  }

  function pressOut() {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 2,
    }).start();
  }

  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <Animated.View
        // @ts-ignore — onStartShouldSetResponder gives us press events
        onStartShouldSetResponder={() => true}
        onResponderGrant={pressIn}
        onResponderRelease={() => { pressOut(); onPress(); }}
        onResponderTerminate={pressOut}
      >
        {children}
      </Animated.View>
    </Animated.View>
  );
}

// StaggeredList — animates list items in one by one with a stagger delay.
// Wraps each child in a SlideUpView with incrementing delay.
interface StaggeredProps {
  children: React.ReactNode[];
  baseDelay?: number;
  stagger?: number;
}

export function StaggeredList({ children, baseDelay = 0, stagger = 60 }: StaggeredProps) {
  return (
    <>
      {children.map((child, index) => (
        <SlideUpView key={index} delay={baseDelay + index * stagger}>
          {child}
        </SlideUpView>
      ))}
    </>
  );
}