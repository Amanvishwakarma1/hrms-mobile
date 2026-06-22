import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker, Polyline, Circle } from 'react-native-maps';
import { USER_CONFIG } from "@/constants/UserRoles";

export default function AttendanceMap({ history, selectedDate }: { history: any[], selectedDate: string }) {
  const mapRef = useRef<MapView>(null);
  
  const dayRecords = history.filter(item => item.date === selectedDate);
  const path = dayRecords.map(item => ({
    latitude: item.coords.lat,
    longitude: item.coords.lon
  }));

  // Improved focus logic: Focus on path OR sites
  useEffect(() => {
    if (mapRef.current) {
      if (path.length > 0) {
        mapRef.current.fitToCoordinates(path, { edgePadding: { top: 50, right: 50, bottom: 50, left: 50 }, animated: true });
      } else if (USER_CONFIG.sites.length > 0) {
        // If no path, zoom to the first site
        mapRef.current.animateToRegion({
          latitude: USER_CONFIG.sites[0].lat,
          longitude: USER_CONFIG.sites[0].lon,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        });
      }
    }
  }, [selectedDate, history]);

  return (
    <View style={styles.container}>
      <MapView 
        ref={mapRef}
        style={styles.map} 
        showsUserLocation={true} // Always show user location to compare with geofence
        initialRegion={{
          latitude: USER_CONFIG.sites[0]?.lat || 28.6692, 
          longitude: USER_CONFIG.sites[0]?.lon || 77.4538, 
          latitudeDelta: 0.005, 
          longitudeDelta: 0.005,
        }}
      >
        {/* Draw Operational Site Geofences */}
        {USER_CONFIG.sites.map((site, index) => (
          <React.Fragment key={index}>
            <Circle 
              center={{ latitude: site.lat, longitude: site.lon }}
              radius={site.radius}
              fillColor="rgba(76, 175, 80, 0.3)" 
              strokeColor="rgba(76, 175, 80, 1)"
              strokeWidth={3}
              zIndex={1} // Ensure it draws above ground
            />
            <Marker 
              coordinate={{ latitude: site.lat, longitude: site.lon }}
              title={site.name}
              pinColor="green"
            />
          </React.Fragment>
        ))}

        {/* Draw the footprint path */}
        {path.length > 1 && (
          <Polyline coordinates={path} strokeWidth={5} strokeColor="#FF3B30" />
        )}
        
        {/* Markers for footprint points */}
        {dayRecords.map((item, index) => (
          <Marker 
            key={index} 
            coordinate={{ latitude: item.coords.lat, longitude: item.coords.lon }} 
            title={`Check In: ${item.checkIn}`}
            description={`Check Out: ${item.checkOut}`}
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