import React, { useMemo } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, Linking,
} from 'react-native';
import { OFFICES } from '../data/procedures';
import { useTranslation } from '../i18n/useTranslation';
import { useAppStore } from '../store/useAppStore';
import { haversineDistance, formatDistance } from '../utils/distance';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { FadeInView, SlideUpView, ScalePressable } from '../components/Animated';

export function OfficesScreen() {
  const { t } = useTranslation();
  // Subscribing directly to userLocation means this component re-renders
  // the moment location is resolved in App.tsx — no manual refresh needed
  const userLocation = useAppStore((s) => s.userLocation);

  const officesWithDistance = useMemo(() => {
    return OFFICES.map((office) => {
      if (!userLocation) {
        return { ...office, distance: null, distanceKm: Infinity };
      }
      const km = haversineDistance(
        userLocation.lat,
        userLocation.lng,
        office.lat,
        office.lng
      );
      return {
        ...office,
        distance: formatDistance(km),
        distanceKm: km,
      };
    }).sort((a, b) => a.distanceKm - b.distanceKm);
    // Re-runs automatically when userLocation changes in the store
  }, [userLocation]);

  return (
    <View style={styles.root}>
      <FlatList
        data={officesWithDistance}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <FadeInView>
            <View style={styles.header}>
              <Text style={styles.title}>{t.officesTitle}</Text>
              <Text style={styles.subtitle}>{t.officesSubtitle}</Text>

              {/* Location status pill */}
              {userLocation ? (
                <View style={styles.locationPill}>
                  <Text style={styles.locationText}>
                    Sorted by distance from your location
                  </Text>
                </View>
              ) : (
                <View style={[styles.locationPill, styles.locationPillMuted]}>
                  <Text style={styles.locationTextMuted}>
                    Allow location access for nearest offices
                  </Text>
                </View>
              )}
            </View>
          </FadeInView>
        }
        renderItem={({ item, index }) => (
          <SlideUpView delay={index * 80}>
            <OfficeCard office={item as any} t={t} />
          </SlideUpView>
        )}
      />
    </View>
  );
}

function OfficeCard({ office, t }: { office: any; t: any }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitles}>
          <Text style={styles.officeName}>{office.name}</Text>
          <Text style={styles.officeType}>{office.type}</Text>
        </View>
        <View style={styles.badges}>
          <View style={styles.cityBadge}>
            <Text style={styles.cityText}>{office.city}</Text>
          </View>
          {office.distance && (
            <View style={styles.distanceBadge}>
              <Text style={styles.distanceText}>{office.distance}</Text>
            </View>
          )}
        </View>
      </View>

      <Text style={styles.address}>{office.address}</Text>

      {office.hours && office.hours.length > 0 && (
        <View style={styles.hoursBox}>
          <Text style={styles.hoursTitle}>{t.officeHours}</Text>
          {office.hours.map((h: any) => (
            <View key={h.day} style={styles.hoursRow}>
              <Text style={styles.hoursDay}>{h.day}</Text>
              <Text style={styles.hoursTime}>{h.open} – {h.close}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.actions}>
        {office.phone && (
          <ScalePressable
            onPress={() => Linking.openURL(`tel:${office.phone}`)}
            style={styles.actionWrapper}
          >
            <View style={styles.actionBtn}>
              <Text style={styles.actionBtnText}>{t.officeCall}</Text>
            </View>
          </ScalePressable>
        )}
        {office.booking_url && (
          <ScalePressable
            onPress={() => Linking.openURL(office.booking_url)}
            style={styles.actionWrapper}
          >
            <View style={[styles.actionBtn, styles.actionBtnPrimary]}>
              <Text style={[styles.actionBtnText, styles.actionBtnTextPrimary]}>
                {t.officeBook}
              </Text>
            </View>
          </ScalePressable>
        )}
        {office.website && (
          <ScalePressable
            onPress={() => Linking.openURL(office.website)}
            style={styles.actionWrapper}
          >
            <View style={styles.actionBtn}>
              <Text style={styles.actionBtnText}>{t.officeWebsite}</Text>
            </View>
          </ScalePressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surface },
  list: { padding: 16, paddingTop: 0 },
  header: { paddingTop: 60, paddingBottom: 16 },
  title: {
    fontSize: Typography.size.xxxl,
    fontFamily: Typography.fontFamily.black,
    color: Colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: Typography.size.base,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.textMuted,
    marginBottom: 10,
  },
  locationPill: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  locationPillMuted: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  locationText: {
    fontSize: Typography.size.xs,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.primary,
  },
  locationTextMuted: {
    fontSize: Typography.size.xs,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.textMuted,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
    gap: 8,
  },
  cardTitles: { flex: 1 },
  officeName: {
    fontSize: Typography.size.md,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.text,
    marginBottom: 2,
  },
  officeType: {
    fontSize: Typography.size.xs,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.primary,
  },
  badges: { gap: 4, alignItems: 'flex-end' },
  cityBadge: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  cityText: {
    fontSize: Typography.size.xs,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.primary,
  },
  distanceBadge: {
    backgroundColor: Colors.accentLight,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  distanceText: {
    fontSize: Typography.size.xs,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.warning,
  },
  address: {
    fontSize: Typography.size.sm,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.textMuted,
    marginBottom: 10,
  },
  hoursBox: {
    backgroundColor: Colors.surface,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  hoursTitle: {
    fontSize: Typography.size.xs,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  hoursDay: {
    fontSize: Typography.size.sm,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.text,
  },
  hoursTime: {
    fontSize: Typography.size.sm,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.textMuted,
  },
  actions: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  actionWrapper: { flexShrink: 0 },
  actionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  actionBtnPrimary: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  actionBtnText: {
    fontSize: Typography.size.sm,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.text,
  },
  actionBtnTextPrimary: { color: Colors.white },
});