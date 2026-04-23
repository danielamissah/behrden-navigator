import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { Colors } from '../theme/colors';

// EN/DE pill toggle — same pattern as the Mülltrennung app
export function LanguageToggle() {
  const { language, setLanguage } = useAppStore();

  function toggle() {
    setLanguage(language === 'en' ? 'de' : 'en');
  }

  return (
    <TouchableOpacity style={styles.pill} onPress={toggle} accessibilityLabel="Toggle language">
      <LangOption label="EN" active={language === 'en'} />
      <View style={styles.divider} />
      <LangOption label="DE" active={language === 'de'} />
    </TouchableOpacity>
  );
}

function LangOption({ label, active }: { label: string; active: boolean }) {
  return (
    <View style={[styles.option, active && styles.optionActive]}>
      <Text style={[styles.text, active && styles.textActive]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: 20,
    overflow: 'hidden',
  },
  option: { paddingHorizontal: 10, paddingVertical: 5 },
  optionActive: { backgroundColor: Colors.primary },
  text: { fontSize: 12, fontWeight: '700', color: Colors.primary },
  textActive: { color: '#fff' },
  divider: { width: 1, backgroundColor: Colors.primary },
});