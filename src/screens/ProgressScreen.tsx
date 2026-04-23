import React from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PROCEDURES } from '../data/procedures';
import { ProcedureCard } from '../components/ProcedureCard';
import { useTranslation } from '../i18n/useTranslation';
import { useAppStore } from '../store/useAppStore';
import { Colors } from '../theme/colors';

export function ProgressScreen() {
  const { t, lang } = useTranslation();
  const { progress, clearAllProgress } = useAppStore();
  const navigation = useNavigation<any>();

  // Only show procedures the user has started
  const activeProcedures = PROCEDURES.filter((p) => progress[p.id]);

  function confirmClear() {
    Alert.alert(
      'Reset all progress?',
      'This will remove all your procedure progress. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: clearAllProgress },
      ]
    );
  }

  if (activeProcedures.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyTitle}>{t.progressEmpty}</Text>
        <Text style={styles.emptyHint}>{t.progressEmptyHint}</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <FlatList
        data={activeProcedures}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>{t.progressTitle}</Text>
            <TouchableOpacity onPress={confirmClear}>
              <Text style={styles.clearBtn}>{t.resetProgress}</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => (
          <ProcedureCard
            procedure={item}
            progress={progress[item.id]}
            t={t}
            lang={lang}
            onPress={() => navigation.navigate('ProcedureDetail', { procedureId: item.id })}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surface },
  list: { padding: 16 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingTop: 44,
  },
  title: { fontSize: 24, fontWeight: '800', color: Colors.text },
  clearBtn: { fontSize: 14, color: Colors.error, fontWeight: '600' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40, backgroundColor: Colors.surface },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: Colors.text, marginBottom: 8, textAlign: 'center' },
  emptyHint: { fontSize: 14, color: Colors.textMuted, textAlign: 'center' },
});