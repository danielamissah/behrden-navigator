import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Procedure, UserProgress } from '../types';
import { Translations } from '../i18n/translations';
import { Colors } from '../theme/colors';
import { Language } from '../types';

interface Props {
  procedure: Procedure;
  progress?: UserProgress;
  t: Translations;
  lang: Language;
  onPress: () => void;
}

// Card shown in the procedures list.
// Shows title, summary, difficulty, estimated time, and current progress.
export function ProcedureCard({ procedure, progress, t, lang, onPress }: Props) {
  const title = lang === 'de' ? procedure.title_de : procedure.title_en;
  const summary = lang === 'de' ? procedure.summary_de : procedure.summary_en;

  const completedSteps = progress?.completed_steps.length || 0;
  const totalSteps = procedure.steps.length;
  const progressPct = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  const difficultyColor = {
    easy: Colors.success,
    medium: Colors.accent,
    hard: Colors.error,
  }[procedure.difficulty];

  const difficultyLabel = {
    easy: t.difficultyEasy,
    medium: t.difficultyMedium,
    hard: t.difficultyHard,
  }[procedure.difficulty];

  const statusLabel = progress
    ? progress.status === 'completed'
      ? t.completedLabel
      : t.inProgress
    : null;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>

      {/* Title and status */}
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        {statusLabel && (
          <View style={[
            styles.statusBadge,
            progress?.status === 'completed' ? styles.statusCompleted : styles.statusInProgress,
          ]}>
            <Text style={[
              styles.statusText,
              progress?.status === 'completed' ? styles.statusTextCompleted : styles.statusTextInProgress,
            ]}>
              {statusLabel}
            </Text>
          </View>
        )}
      </View>

      {/* Summary */}
      <Text style={styles.summary} numberOfLines={2}>{summary}</Text>

      {/* Meta row — difficulty, time, steps */}
      <View style={styles.meta}>
        <View style={[styles.pill, { backgroundColor: difficultyColor + '20' }]}>
          <Text style={[styles.pillText, { color: difficultyColor }]}>{difficultyLabel}</Text>
        </View>
        <Text style={styles.metaText}>{procedure.estimated_days} {t.days}</Text>
        <Text style={styles.metaText}>{totalSteps} {t.stepsTitle.toLowerCase()}</Text>
      </View>

      {/* Progress bar — only shown if procedure started */}
      {progress && (
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progressPct}%` as any }]} />
          </View>
          <Text style={styles.progressText}>{completedSteps}/{totalSteps}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 6,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    flex: 1,
    lineHeight: 20,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    flexShrink: 0,
  },
  statusCompleted: { backgroundColor: Colors.successLight },
  statusInProgress: { backgroundColor: Colors.accentLight },
  statusText: { fontSize: 11, fontWeight: '700' },
  statusTextCompleted: { color: Colors.success },
  statusTextInProgress: { color: Colors.warning },
  summary: {
    fontSize: 13,
    color: Colors.textMuted,
    lineHeight: 18,
    marginBottom: 10,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  pill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  pillText: { fontSize: 11, fontWeight: '600' },
  metaText: { fontSize: 12, color: Colors.textMuted },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  progressTrack: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
  },
  progressFill: {
    height: 4,
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 11,
    color: Colors.textMuted,
    width: 30,
    textAlign: 'right',
  },
});