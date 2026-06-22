import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const syncOfflineData = async () => {
  const pendingData = await AsyncStorage.getItem('offlineQueue');
  if (!pendingData) return;

  const queue = JSON.parse(pendingData);
  
  // Try to push to server
  try {
    for (const item of queue) {
      await api.post('/attendance/sync', item);
    }
    // If successful, clear the queue
    await AsyncStorage.removeItem('offlineQueue');
  } catch (e) {
    console.log("Still offline, keeping data in queue.");
  }
};