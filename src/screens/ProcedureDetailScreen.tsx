import React from 'react';
import {
  View, Text, ScrollView, StyleSheet, Linking,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { PROCEDURES } from '../data/procedures';
import { useTranslation } from '../i18n/useTranslation';
import { useAppStore } from '../store/useAppStore';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { FadeInView, SlideUpView, ScalePressable } from '../components/Animated';

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

      {/* Back */}
      <FadeInView>
        <ScalePressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <View>
            <Text style={styles.backText}>← {t.back}</Text>
          </View>
        </ScalePressable>
      </FadeInView>

      {/* Hero */}
      <SlideUpView delay={60} style={styles.hero}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.summary}>{summary}</Text>
        <View style={styles.metaRow}>
          {[
            { label: t.estimatedTime, value: `${procedure.estimated_days} ${t.days}` },
            { label: t.difficulty, value: { easy: t.difficultyEasy, medium: t.difficultyMedium, hard: t.difficultyHard }[procedure.difficulty] },
            { label: 'Office', value: procedure.office_type },
          ].map(({ label, value }) => (
            <View key={label} style={styles.metaPill}>
              <Text style={styles.metaLabel}>{label}</Text>
              <Text style={styles.metaValue} numberOfLines={1}>{value}</Text>
            </View>
          ))}
        </View>
      </SlideUpView>

      {/* Progress */}
      {userProgress && (
        <SlideUpView delay={120} style={styles.progressBox}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>{completedCount}/{totalSteps} {t.stepsTitle.toLowerCase()} completed</Text>
            <Text style={styles.progressPct}>{Math.round(progressPct)}%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progressPct}%` as any }]} />
          </View>
        </SlideUpView>
      )}

      {/* Start button */}
      {!userProgress && (
        <SlideUpView delay={120} style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
          <ScalePressable onPress={() => startProcedure(procedureId)}>
            <View style={styles.startBtn}>
              <Text style={styles.startBtnText}>{t.startProcedure}</Text>
            </View>
          </ScalePressable>
        </SlideUpView>
      )}

      {/* Steps */}
      <Text style={styles.sectionTitle}>{t.stepsTitle}</Text>
      {procedure.steps.map((step, index) => {
        const stepTitle = lang === 'de' ? step.title_de : step.title_en;
        const stepDesc = lang === 'de' ? step.description_de : step.description_en;
        const stepTip = lang === 'de' ? step.tip_de : step.tip_en;
        const isCompleted = userProgress?.completed_steps.includes(step.id) || false;

        return (
          <SlideUpView key={step.id} delay={160 + index * 60}>
            <View style={[styles.stepCard, isCompleted && styles.stepCardDone]}>
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
                <ScalePressable onPress={() => toggleStep(step.id)}>
                  <View style={[styles.stepToggle, isCompleted && styles.stepToggleDone]}>
                    <Text style={[styles.stepToggleText, isCompleted && styles.stepToggleTextDone]}>
                      {isCompleted ? t.markPending : t.markDone}
                    </Text>
                  </View>
                </ScalePressable>
              )}
            </View>
          </SlideUpView>
        );
      })}

      {/* Documents */}
      {procedure.required_documents.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>{t.documentsTitle}</Text>
          {procedure.required_documents.map((doc, index) => {
            const name = lang === 'de' ? doc.name_de : doc.name_en;
            const desc = lang === 'de' ? doc.description_de : doc.description_en;
            return (
              <SlideUpView key={doc.id} delay={index * 50}>
                <View style={styles.docCard}>
                  <Text style={styles.docName}>{name}</Text>
                  {desc && <Text style={styles.docDesc}>{desc}</Text>}
                  {doc.format && <Text style={styles.docFormat}>{doc.format}</Text>}
                  {doc.where_to_get && <Text style={styles.docWhere}>📍 {doc.where_to_get}</Text>}
                </View>
              </SlideUpView>
            );
          })}
        </>
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surface },
  content: { paddingBottom: 40 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: {
    fontSize: Typography.size.md,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.textMuted,
  },
  backBtn: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 8 },
  backText: {
    fontSize: Typography.size.md,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.primary,
  },
  hero: {
    backgroundColor: Colors.white,
    padding: 20,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: Typography.size.xxl,
    fontFamily: Typography.fontFamily.black,
    color: Colors.text,
    marginBottom: 8,
    lineHeight: 30,
  },
  summary: {
    fontSize: Typography.size.base,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.textMuted,
    lineHeight: 22,
    marginBottom: 14,
  },
  metaRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  metaPill: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 10,
    padding: 8,
    minWidth: 80,
    flex: 1,
  },
  metaLabel: {
    fontSize: Typography.size.xs,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  metaValue: {
    fontSize: Typography.size.sm,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.primary,
  },
  progressBox: {
    backgroundColor: Colors.white,
    padding: 16,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressLabel: {
    fontSize: Typography.size.sm,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.textMuted,
  },
  progressPct: {
    fontSize: Typography.size.sm,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.primary,
  },
  progressTrack: { height: 6, backgroundColor: Colors.border, borderRadius: 3 },
  progressFill: { height: 6, backgroundColor: Colors.primary, borderRadius: 3 },
  startBtn: {
    backgroundColor: Colors.primary,
    margin: 16,
    padding: 15,
    borderRadius: 14,
    alignItems: 'center',
  },
  startBtnText: {
    color: Colors.white,
    fontSize: Typography.size.lg,
    fontFamily: Typography.fontFamily.bold,
  },
  sectionTitle: {
    fontSize: Typography.size.lg,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.text,
    padding: 16,
    paddingBottom: 8,
  },
  stepCard: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  stepCardDone: {
    borderColor: Colors.primary + '40',
    backgroundColor: Colors.primaryLight + '40',
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 8,
  },
  stepNum: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: Colors.border,
    justifyContent: 'center', alignItems: 'center',
    flexShrink: 0,
  },
  stepNumDone: { backgroundColor: Colors.primary },
  stepNumText: {
    fontSize: Typography.size.sm,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.textMuted,
  },
  stepNumTextDone: { color: Colors.white },
  stepTitle: {
    fontSize: Typography.size.base,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.text,
    flex: 1,
    lineHeight: 20,
  },
  stepTitleDone: { color: Colors.primary },
  stepDesc: {
    fontSize: Typography.size.sm,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.textMuted,
    lineHeight: 19,
    marginBottom: 10,
  },
  tipBox: {
    backgroundColor: Colors.accentLight,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  tipLabel: {
    fontSize: Typography.size.xs,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.warning,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  tipText: {
    fontSize: Typography.size.sm,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.warning,
    lineHeight: 18,
  },
  stepToggle: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    alignSelf: 'flex-start',
  },
  stepToggleDone: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  stepToggleText: {
    fontSize: Typography.size.sm,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.primary,
  },
  stepToggleTextDone: { color: Colors.white },
  docCard: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  docName: {
    fontSize: Typography.size.base,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.text,
    marginBottom: 4,
  },
  docDesc: {
    fontSize: Typography.size.sm,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.textMuted,
    lineHeight: 18,
    marginBottom: 4,
  },
  docFormat: {
    fontSize: Typography.size.xs,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.primary,
    marginBottom: 2,
  },
  docWhere: {
    fontSize: Typography.size.xs,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.textMuted,
    marginTop: 2,
  },
});