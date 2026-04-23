import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Linking,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { PROCEDURES } from '../data/procedures';
import { useTranslation } from '../i18n/useTranslation';
import { useAppStore } from '../store/useAppStore';
import { Colors } from '../theme/colors';

export function ProcedureDetailScreen() {
  const { t, lang } = useTranslation();
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { procedureId } = route.params;

  const procedure = PROCEDURES.find((p) => p.id === procedureId);
  const { progress, startProcedure, completeStep, uncompleteStep } = useAppStore();
  const userProgress = progress[procedureId];

  if (!procedure) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Procedure not found</Text>
      </View>
    );
  }

  const title = lang === 'de' ? procedure.title_de : procedure.title_en;
  const summary = lang === 'de' ? procedure.summary_de : procedure.summary_en;

  function handleStart() {
    startProcedure(procedureId);
  }

  function toggleStep(stepId: string) {
    if (!userProgress) startProcedure(procedureId);
    const isCompleted = userProgress?.completed_steps.includes(stepId);
    if (isCompleted) {
      uncompleteStep(procedureId, stepId);
    } else {
      completeStep(procedureId, stepId);
    }
  }

  const completedCount = userProgress?.completed_steps.length || 0;
  const totalSteps = procedure.steps.length;
  const progressPct = totalSteps > 0 ? (completedCount / totalSteps) * 100 : 0;

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>

      {/* Back button */}
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← {t.back}</Text>
      </TouchableOpacity>

      {/* Hero */}
      <View style={styles.hero}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.summary}>{summary}</Text>

        <View style={styles.metaRow}>
          <View style={styles.metaPill}>
            <Text style={styles.metaLabel}>{t.estimatedTime}</Text>
            <Text style={styles.metaValue}>{procedure.estimated_days} {t.days}</Text>
          </View>
          <View style={styles.metaPill}>
            <Text style={styles.metaLabel}>{t.difficulty}</Text>
            <Text style={styles.metaValue}>
              {{ easy: t.difficultyEasy, medium: t.difficultyMedium, hard: t.difficultyHard }[procedure.difficulty]}
            </Text>
          </View>
          <View style={styles.metaPill}>
            <Text style={styles.metaLabel}>Office</Text>
            <Text style={styles.metaValue} numberOfLines={1}>{procedure.office_type}</Text>
          </View>
        </View>
      </View>

      {/* Progress bar */}
      {userProgress && (
        <View style={styles.progressBox}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>{completedCount}/{totalSteps} steps completed</Text>
            <Text style={styles.progressPct}>{Math.round(progressPct)}%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progressPct}%` as any }]} />
          </View>
        </View>
      )}

      {/* Start button */}
      {!userProgress && (
        <TouchableOpacity style={styles.startBtn} onPress={handleStart}>
          <Text style={styles.startBtnText}>{t.startProcedure}</Text>
        </TouchableOpacity>
      )}

      {/* Steps */}
      <Text style={styles.sectionTitle}>{t.stepsTitle}</Text>
      {procedure.steps.map((step, index) => {
        const stepTitle = lang === 'de' ? step.title_de : step.title_en;
        const stepDesc = lang === 'de' ? step.description_de : step.description_en;
        const stepTip = lang === 'de' ? step.tip_de : step.tip_en;
        const isCompleted = userProgress?.completed_steps.includes(step.id) || false;

        return (
          <View key={step.id} style={[styles.stepCard, isCompleted && styles.stepCardDone]}>
            <View style={styles.stepHeader}>
              <View style={[styles.stepNum, isCompleted && styles.stepNumDone]}>
                <Text style={[styles.stepNumText, isCompleted && styles.stepNumTextDone]}>
                  {isCompleted ? '✓' : index + 1}
                </Text>
              </View>
              <Text style={[styles.stepTitle, isCompleted && styles.stepTitleDone]}>
                {stepTitle}
              </Text>
            </View>

            <Text style={styles.stepDesc}>{stepDesc}</Text>

            {stepTip && (
              <View style={styles.tipBox}>
                <Text style={styles.tipLabel}>{t.tip}</Text>
                <Text style={styles.tipText}>{stepTip}</Text>
              </View>
            )}

            {userProgress && (
              <TouchableOpacity
                style={[styles.stepToggle, isCompleted && styles.stepToggleDone]}
                onPress={() => toggleStep(step.id)}
              >
                <Text style={[styles.stepToggleText, isCompleted && styles.stepToggleTextDone]}>
                  {isCompleted ? t.markPending : t.markDone}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        );
      })}

      {/* Required documents */}
      {procedure.required_documents.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>{t.documentsTitle}</Text>
          {procedure.required_documents.map((doc) => {
            const name = lang === 'de' ? doc.name_de : doc.name_en;
            const desc = lang === 'de' ? doc.description_de : doc.description_en;
            return (
              <View key={doc.id} style={styles.docCard}>
                <Text style={styles.docName}>{name}</Text>
                {desc && <Text style={styles.docDesc}>{desc}</Text>}
                {doc.format && (
                  <Text style={styles.docFormat}>{doc.format}</Text>
                )}
                {doc.where_to_get && (
                  <Text style={styles.docWhere}>📍 {doc.where_to_get}</Text>
                )}
              </View>
            );
          })}
        </>
      )}

    </ScrollView>
  );
}

const s = StyleSheet;
const styles = s.create({
  root: { flex: 1, backgroundColor: Colors.surface },
  content: { paddingBottom: 40 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 16, color: Colors.textMuted },
  backBtn: { padding: 20, paddingTop: 60, paddingBottom: 0 },
  backText: { fontSize: 15, color: Colors.primary, fontWeight: '600' },
  hero: { backgroundColor: Colors.white, padding: 20, marginBottom: 8, borderBottomWidth: 1, borderBottomColor: Colors.border },
  title: { fontSize: 22, fontWeight: '800', color: Colors.text, marginBottom: 8, lineHeight: 28 },
  summary: { fontSize: 14, color: Colors.textMuted, lineHeight: 20, marginBottom: 14 },
  metaRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  metaPill: { backgroundColor: Colors.primaryLight, borderRadius: 10, padding: 8, minWidth: 80 },
  metaLabel: { fontSize: 10, color: Colors.primary, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  metaValue: { fontSize: 13, color: Colors.primary, fontWeight: '700' },
  progressBox: { backgroundColor: Colors.white, padding: 16, marginBottom: 8, borderBottomWidth: 1, borderBottomColor: Colors.border },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressLabel: { fontSize: 13, color: Colors.textMuted },
  progressPct: { fontSize: 13, fontWeight: '700', color: Colors.primary },
  progressTrack: { height: 6, backgroundColor: Colors.border, borderRadius: 3 },
  progressFill: { height: 6, backgroundColor: Colors.primary, borderRadius: 3 },
  startBtn: { backgroundColor: Colors.primary, margin: 16, padding: 15, borderRadius: 14, alignItems: 'center' },
  startBtnText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.text, padding: 16, paddingBottom: 8 },
  stepCard: { backgroundColor: Colors.white, marginHorizontal: 16, marginBottom: 10, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: Colors.border },
  stepCardDone: { borderColor: Colors.primary + '40', backgroundColor: Colors.primaryLight + '40' },
  stepHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 8 },
  stepNum: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.border, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  stepNumDone: { backgroundColor: Colors.primary },
  stepNumText: { fontSize: 13, fontWeight: '700', color: Colors.textMuted },
  stepNumTextDone: { color: Colors.white },
  stepTitle: { fontSize: 14, fontWeight: '700', color: Colors.text, flex: 1, lineHeight: 20 },
  stepTitleDone: { color: Colors.primary },
  stepDesc: { fontSize: 13, color: Colors.textMuted, lineHeight: 19, marginBottom: 10 },
  tipBox: { backgroundColor: Colors.accentLight, borderRadius: 10, padding: 10, marginBottom: 10 },
  tipLabel: { fontSize: 11, fontWeight: '700', color: Colors.warning, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 3 },
  tipText: { fontSize: 13, color: Colors.warning, lineHeight: 18 },
  stepToggle: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8, borderWidth: 1.5, borderColor: Colors.primary, alignSelf: 'flex-start' },
  stepToggleDone: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  stepToggleText: { fontSize: 13, fontWeight: '600', color: Colors.primary },
  stepToggleTextDone: { color: Colors.white },
  docCard: { backgroundColor: Colors.white, marginHorizontal: 16, marginBottom: 8, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: Colors.border },
  docName: { fontSize: 14, fontWeight: '700', color: Colors.text, marginBottom: 4 },
  docDesc: { fontSize: 13, color: Colors.textMuted, lineHeight: 18, marginBottom: 4 },
  docFormat: { fontSize: 12, color: Colors.primary, fontWeight: '600', marginBottom: 2 },
  docWhere: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
});