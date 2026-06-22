import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';

export default function AttendanceMap({ history, selectedDate }: { history: any[], selectedDate: string }) {
  const mapRef = useRef<MapView>(null);
  const dayRecords = history.filter(item => item.date === selectedDate);
  const path = dayRecords.map(item => ({ latitude: item.coords.lat, longitude: item.coords.lon }));

  useEffect(() => {
    // If we have history for the selected date, zoom into that path
    if (path.length > 0 && mapRef.current) {
      mapRef.current.fitToCoordinates(path, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  }, [selectedDate, history]);

  return (
    <View style={styles.container}>
      <MapView 
        ref={mapRef}
        style={styles.map} 
        showsUserLocation={path.length === 0} // Show blue dot only if no history selected
        initialRegion={{
          latitude: 28.6692, 
          longitude: 77.4538, 
          latitudeDelta: 0.01, 
          longitudeDelta: 0.01,
        }}
      >
        {path.length > 1 && (
          <Polyline coordinates={path} strokeWidth={5} strokeColor="#007AFF" />
        )}
        
        {dayRecords.map((item, index) => (
          <Marker 
            key={index} 
            coordinate={{ latitude: item.coords.lat, longitude: item.coords.lon }} 
            title={item.date}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { height: 300, width: '90%', borderRadius: 15, overflow: 'hidden', marginTop: 10 },
  map: { ...StyleSheet.absoluteFillObject }
});