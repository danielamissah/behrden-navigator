import React from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, Linking,
} from 'react-native';
import { OFFICES } from '../data/procedures';
import { useTranslation } from '../i18n/useTranslation';
import { Colors } from '../theme/colors';

export function OfficesScreen() {
  const { t } = useTranslation();

  return (
    <View style={styles.root}>
      <FlatList
        data={OFFICES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>{t.officesTitle}</Text>
            <Text style={styles.subtitle}>{t.officesSubtitle}</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitles}>
                <Text style={styles.officeName}>{item.name}</Text>
                <Text style={styles.officeType}>{item.type}</Text>
              </View>
              <View style={styles.cityBadge}>
                <Text style={styles.cityText}>{item.city}</Text>
              </View>
            </View>

            <Text style={styles.address}>{item.address}</Text>

            {/* Hours */}
            {item.hours && item.hours.length > 0 && (
              <View style={styles.hoursBox}>
                <Text style={styles.hoursTitle}>{t.officeHours}</Text>
                {item.hours.map((h) => (
                  <View key={h.day} style={styles.hoursRow}>
                    <Text style={styles.hoursDay}>{h.day}</Text>
                    <Text style={styles.hoursTime}>{h.open} – {h.close}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Actions */}
            <View style={styles.actions}>
              {item.phone && (
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => Linking.openURL(`tel:${item.phone}`)}
                >
                  <Text style={styles.actionBtnText}>{t.officeCall}</Text>
                </TouchableOpacity>
              )}
              {item.booking_url && (
                <TouchableOpacity
                  style={[styles.actionBtn, styles.actionBtnPrimary]}
                  onPress={() => Linking.openURL(item.booking_url!)}
                >
                  <Text style={[styles.actionBtnText, styles.actionBtnTextPrimary]}>
                    {t.officeBook}
                  </Text>
                </TouchableOpacity>
              )}
              {item.website && (
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => Linking.openURL(item.website!)}
                >
                  <Text style={styles.actionBtnText}>{t.officeWebsite}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surface },
  list: { padding: 16 },
  header: { paddingTop: 44, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '800', color: Colors.text, marginBottom: 4 },
  subtitle: { fontSize: 14, color: Colors.textMuted },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16, padding: 16,
    marginBottom: 12,
    borderWidth: 1, borderColor: Colors.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6, gap: 8 },
  cardTitles: { flex: 1 },
  officeName: { fontSize: 15, fontWeight: '700', color: Colors.text, marginBottom: 2 },
  officeType: { fontSize: 12, color: Colors.primary, fontWeight: '600' },
  cityBadge: { backgroundColor: Colors.primaryLight, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  cityText: { fontSize: 11, color: Colors.primary, fontWeight: '700' },
  address: { fontSize: 13, color: Colors.textMuted, marginBottom: 10 },
  hoursBox: { backgroundColor: Colors.surface, borderRadius: 10, padding: 10, marginBottom: 10 },
  hoursTitle: { fontSize: 11, fontWeight: '700', color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 },
  hoursRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 },
  hoursDay: { fontSize: 12, color: Colors.text, fontWeight: '500' },
  hoursTime: { fontSize: 12, color: Colors.textMuted },
  actions: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  actionBtn: {
    paddingHorizontal: 12, paddingVertical: 7,
    borderRadius: 8, borderWidth: 1, borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  actionBtnPrimary: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  actionBtnText: { fontSize: 13, fontWeight: '600', color: Colors.text },
  actionBtnTextPrimary: { color: Colors.white },
});