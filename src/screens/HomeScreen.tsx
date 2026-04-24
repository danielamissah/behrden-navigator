import React, { useState, useMemo } from 'react';
import {
  View, Text, FlatList, TextInput,
  TouchableOpacity, StyleSheet, ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PROCEDURES, CATEGORIES } from '../data/procedures';
import { ProcedureCard } from '../components/ProcedureCard';
import { LanguageToggle } from '../components/LanguageToggle';
import { FadeInView, SlideUpView } from '../components/Animated';
import { useTranslation } from '../i18n/useTranslation';
import { useAppStore } from '../store/useAppStore';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';

export function HomeScreen() {
  const { t, lang } = useTranslation();
  const progress = useAppStore((s) => s.progress);
  const navigation = useNavigation<any>();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered = useMemo(() => {
    return PROCEDURES.filter((p) => {
      const title = lang === 'de' ? p.title_de : p.title_en;
      const summary = lang === 'de' ? p.summary_de : p.summary_en;
      const matchesSearch =
        !search ||
        title.toLowerCase().includes(search.toLowerCase()) ||
        summary.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        activeCategory === 'all' || p.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory, lang]);

  return (
    <View style={styles.root}>
      {/* Header with fade-in */}
      <FadeInView style={styles.header}>
        <View>
          <Text style={styles.appName}>{t.appName}</Text>
          <Text style={styles.greeting}>{t.homeGreeting}</Text>
        </View>
        <LanguageToggle />
      </FadeInView>

      {/* Search with slide-up */}
      <SlideUpView delay={80} style={styles.searchWrapper}>
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder={t.searchPlaceholder}
          placeholderTextColor={Colors.textLight}
        />
      </SlideUpView>

      {/* Category chips */}
      <SlideUpView delay={140}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryContent}
        >
          {CATEGORIES.map((cat) => {
            const label = lang === 'de' ? cat.label_de : cat.label_en;
            const active = cat.id === activeCategory;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.categoryChip, active && styles.categoryChipActive]}
                onPress={() => setActiveCategory(cat.id)}
              >
                <Text style={[styles.categoryText, active && styles.categoryTextActive]}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </SlideUpView>

      {/* Procedure list — each card slides in with stagger */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item, index }) => (
          <SlideUpView delay={200 + index * 50}>
            <ProcedureCard
              procedure={item}
              progress={progress[item.id]}
              t={t}
              lang={lang}
              onPress={() => navigation.navigate('ProcedureDetail', { procedureId: item.id })}
            />
          </SlideUpView>
        )}
        ListEmptyComponent={
          <FadeInView style={styles.empty}>
            <Text style={styles.emptyText}>No procedures found</Text>
          </FadeInView>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surface },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    paddingTop: 60,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  appName: {
    fontSize: Typography.size.xs,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  greeting: {
    fontSize: Typography.size.xxl,
    fontFamily: Typography.fontFamily.black,
    color: Colors.text,
  },
  searchWrapper: {
    padding: 16,
    backgroundColor: Colors.white,
  },
  searchInput: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: Typography.size.base,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryScroll: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  categoryContent: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: 4,
    gap: 8,
    flexDirection: 'row',
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  categoryChipActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  categoryText: {
    fontSize: Typography.size.sm,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.textMuted,
  },
  categoryTextActive: {
    color: Colors.primary,
    fontFamily: Typography.fontFamily.bold,
  },
  list: { padding: 16 },
  empty: { padding: 40, alignItems: 'center' },
  emptyText: {
    fontSize: Typography.size.md,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.textMuted,
  },
});