import api from './api';
import * as SecureStore from 'expo-secure-store';

export const loginUser = async (credentials: { email: string, password: string }) => {
  // Use these test credentials: admin@hrms.com / password123
  if (credentials.email === "admin@hrms.com" && credentials.password === "password123") {
    const mockData = { token: "fake-jwt-token", user: { id: "1", name: "Admin" } };
    await SecureStore.setItemAsync('userToken', mockData.token);
    return mockData.user;
  }
  
  const response = await api.post('/auth/login', credentials);
  await SecureStore.setItemAsync('userToken', response.data.token);
  return response.data.user;
};

export const logoutUser = async () => {
  await SecureStore.deleteItemAsync('userToken');
};