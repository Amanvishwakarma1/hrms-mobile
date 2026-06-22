import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { USER_CONFIG } from "@/constants/UserRoles";

export default function AttendanceMap({ history, selectedDate }: { history: any[], selectedDate: string }) {
  const dayRecords = history.filter(item => item.date === selectedDate);
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📍 Geofence Monitoring (Web Preview)</Text>
      <Text style={styles.infoText}>
        Interactive maps are only available on mobile devices (iOS/Android).
      </Text>
      
      <View style={styles.card}>
        <Text style={styles.sectionHeader}>Configured Sites ({USER_CONFIG.sites.length}):</Text>
        {USER_CONFIG.sites.map((site, index) => (
          <Text key={index} style={styles.siteText}>
            • {site.name} (Radius: {site.radius}m)
          </Text>
        ))}
        
        {dayRecords.length > 0 ? (
          <>
            <Text style={[styles.sectionHeader, { marginTop: 10 }]}>Today's Records ({dayRecords.length}):</Text>
            {dayRecords.map((item, index) => (
              <Text key={index} style={styles.recordText}>
                • {item.checkIn || 'Checked In'} - {item.checkOut || 'Active'}
              </Text>
            ))}
          </>
        ) : (
          <Text style={styles.noRecordText}>No location history for {selectedDate}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    height: 300, 
    width: '90%', 
    borderRadius: 15, 
    marginTop: 10, 
    backgroundColor: '#fff', 
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    justifyContent: 'center'
  },
  title: { fontSize: 16, fontWeight: '700', color: '#1f2937', marginBottom: 8, textAlign: 'center' },
  infoText: { fontSize: 12, color: '#6b7280', textAlign: 'center', marginBottom: 16 },
  card: { backgroundColor: '#f9fafb', borderRadius: 8, padding: 12 },
  sectionHeader: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 4 },
  siteText: { fontSize: 12, color: '#4b5563' },
  recordText: { fontSize: 12, color: '#10b981' },
  noRecordText: { fontSize: 12, color: '#6b7280', fontStyle: 'italic', marginTop: 4 }
});