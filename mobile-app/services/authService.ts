import api from './api';
import { setSecureItem, deleteSecureItem } from '@/utils/storage';

export const loginUser = async (credentials: { email: string, password: string }) => {
  // Use these test credentials: admin@hrms.com / password123
  if (credentials.email === "admin@hrms.com" && credentials.password === "password123") {
    const mockData = { 
      token: "fake-jwt-token", 
      user: { id: "1", name: "Admin", email: "admin@hrms.com", role: "admin" } 
    };
    await setSecureItem('userToken', mockData.token);
    await setSecureItem('userProfile', JSON.stringify(mockData.user));
    return { token: mockData.token, ...mockData.user };
  }
  
  // Support employee test credentials: employee@hrms.com / password123
  if (credentials.email === "employee@hrms.com" && credentials.password === "password123") {
    const mockData = { 
      token: "fake-employee-token", 
      user: { id: "2", name: "Employee User", email: "employee@hrms.com", role: "employee" } 
    };
    await setSecureItem('userToken', mockData.token);
    await setSecureItem('userProfile', JSON.stringify(mockData.user));
    return { token: mockData.token, ...mockData.user };
  }
  
  const response = await api.post('/auth/login', credentials);
  const { token, user } = response.data;
  await setSecureItem('userToken', token);
  await setSecureItem('userProfile', JSON.stringify(user));
  return { token, ...user };
};

export const logoutUser = async () => {
  await deleteSecureItem('userToken');
  await deleteSecureItem('userProfile');
};