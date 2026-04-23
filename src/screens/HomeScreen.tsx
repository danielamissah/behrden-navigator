import React, { useState, useMemo } from 'react';
import {
  View, Text, FlatList, TextInput,
  TouchableOpacity, StyleSheet, ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PROCEDURES, CATEGORIES } from '../data/procedures';
import { ProcedureCard } from '../components/ProcedureCard';
import { LanguageToggle } from '../components/LanguageToggle';
import { useTranslation } from '../i18n/useTranslation';
import { useAppStore } from '../store/useAppStore';
import { Colors } from '../theme/colors';

export function HomeScreen() {
  const { t, lang } = useTranslation();
  const progress = useAppStore((s) => s.progress);
  const navigation = useNavigation<any>();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // Filter procedures by search query and active category
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
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.appName}>{t.appName}</Text>
          <Text style={styles.greeting}>{t.homeGreeting}</Text>
        </View>
        <LanguageToggle />
      </View>

      {/* Search */}
      <View style={styles.searchWrapper}>
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder={t.searchPlaceholder}
          placeholderTextColor={Colors.textLight}
        />
      </View>

      {/* Category chips */}
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

      {/* Procedure list */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <ProcedureCard
            procedure={item}
            progress={progress[item.id]}
            t={t}
            lang={lang}
            onPress={() => navigation.navigate('ProcedureDetail', { procedureId: item.id })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No procedures found</Text>
          </View>
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
  appName: { fontSize: 12, fontWeight: '700', color: Colors.primary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 },
  greeting: { fontSize: 22, fontWeight: '800', color: Colors.text },
  searchWrapper: { padding: 16, backgroundColor: Colors.white },
  searchInput: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryScroll: { backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border },
  categoryContent: { paddingHorizontal: 16, paddingBottom: 12, gap: 8, flexDirection: 'row' },
  categoryChip: {
    paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: 20, backgroundColor: Colors.surface,
    borderWidth: 1.5, borderColor: 'transparent',
  },
  categoryChipActive: { backgroundColor: Colors.primaryLight, borderColor: Colors.primary },
  categoryText: { fontSize: 13, fontWeight: '500', color: Colors.textMuted },
  categoryTextActive: { color: Colors.primary, fontWeight: '700' },
  list: { padding: 16 },
  empty: { padding: 40, alignItems: 'center' },
  emptyText: { fontSize: 15, color: Colors.textMuted },
});