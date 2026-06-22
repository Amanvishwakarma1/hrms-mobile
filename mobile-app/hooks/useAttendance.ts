import { useState, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { USER_CONFIG } from "@/constants/UserRoles";
import api from "@/services/api"; // Import your new API service

const getDistanceFromLatLonInMeters = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371000;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export default function useAttendance() {
  const [status, setStatus] = useState("Not checked in");
  const [checkInTime, setCheckInTime] = useState("");
  const [checkOutTime, setCheckOutTime] = useState("");
  const [workingHours, setWorkingHours] = useState("");
  const [checkInTimestamp, setCheckInTimestamp] = useState<number | null>(null);
  const [attendanceHistory, setAttendanceHistory] = useState<any[]>([]);
  const [liveTimer, setLiveTimer] = useState("00:00:00");
  
  const locationSubscription = useRef<Location.LocationSubscription | null>(null);

  useEffect(() => { loadData(); return () => stopWatchingLocation(); }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === "Checked In" && checkInTimestamp) {
      interval = setInterval(() => {
        const diffMs = Date.now() - checkInTimestamp;
        if (Math.floor(diffMs / 1000) >= 300) clockOut();
        else {
          const m = Math.floor((Math.floor(diffMs / 1000) % 3600) / 60);
          const s = Math.floor(diffMs / 1000) % 60;
          setLiveTimer(`00:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
        }
      }, 1000);
      startWatchingLocation();
    } else stopWatchingLocation();
    return () => { clearInterval(interval); stopWatchingLocation(); };
  }, [status, checkInTimestamp]);

  const startWatchingLocation = async () => {
    let { status: permStatus } = await Location.requestForegroundPermissionsAsync();
    if (permStatus !== "granted") return;
    locationSubscription.current = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 1 },
      async (loc) => {
        const { latitude, longitude } = loc.coords;
        // FIELD MODE: We now have the logic ready to send to the dashboard API
        if (USER_CONFIG.role === 'FIELD') {
          const site = USER_CONFIG.sites.find(s => getDistanceFromLatLonInMeters(latitude, longitude, s.lat, s.lon) <= s.radius);
          if (site) {
             console.log(`Tracking: Operator at ${site.name}`);
             // Here: await api.post('/attendance/log-location', { ...site, lat: latitude, lon: longitude });
          }
        }
      }
    );
  };

  const stopWatchingLocation = () => { if (locationSubscription.current) { locationSubscription.current.remove(); locationSubscription.current = null; } };

  const loadData = async () => {
    // PRODUCTION NOTE: Replace this with: const { data } = await api.get('/attendance/history');
    const history = await AsyncStorage.getItem("attendanceHistory");
    if (history) setAttendanceHistory(JSON.parse(history));
  };

  const clockIn = async () => {
    try {
      const loc = await Location.getCurrentPositionAsync({});
      // PRODUCTION API CALL
      // await api.post('/attendance/clock-in', { lat: loc.coords.latitude, lon: loc.coords.longitude });
      
      const time = new Date().toLocaleTimeString();
      const timestamp = Date.now();
      setCheckInTimestamp(timestamp); setCheckInTime(time); setStatus("Checked In");
    } catch (e) { console.error("Clock-in failed", e); }
  };

  const clockOut = async () => {
    const loc = await Location.getCurrentPositionAsync({});
    const time = new Date().toLocaleTimeString();
    
    // PRODUCTION API CALL
    // await api.post('/attendance/clock-out', { lat: loc.coords.latitude, lon: loc.coords.longitude });

    setStatus("Checked Out");
    // Clear local state
    setTimeout(async () => { setStatus("Not checked in"); setCheckInTimestamp(null); setLiveTimer("00:00:00"); }, 2000);
  };

  const clearHistory = async () => { await AsyncStorage.removeItem("attendanceHistory"); setAttendanceHistory([]); };

  return { status, setStatus, checkInTime, checkOutTime, workingHours, attendanceHistory, clockIn, clockOut, clearHistory, liveTimer };
}