import api from './api';
import { setSecureItem, deleteSecureItem } from '@/utils/storage';

export const loginUser = async (credentials: { email: string, password: string }) => {
  // Use these test credentials: admin@hrms.com / password123
  if (credentials.email === "admin@hrms.com" && credentials.password === "password123") {
    const mockData = { token: "fake-jwt-token", user: { id: "1", name: "Admin" } };
    await setSecureItem('userToken', mockData.token);
    return mockData.user;
  }
  
  const response = await api.post('/auth/login', credentials);
  await setSecureItem('userToken', response.data.token);
  return response.data.user;
};

export const logoutUser = async () => {
  await deleteSecureItem('userToken');
};