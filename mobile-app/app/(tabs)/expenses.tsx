import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { API_BASE_URL } from '@/constants/API';
import ExpenseCard from '@/components/ExpenseCard';

export default function ExpensesScreen() {
  const router = useRouter();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Make sure we are cleanly hitting the endpoint
      const cleanUrl = API_BASE_URL.endsWith('/expenses') 
        ? API_BASE_URL 
        : `${API_BASE_URL}/expenses`;
        
      console.log("Fetching from URL:", cleanUrl);
      
      // UPDATED: Added withCredentials to authenticate through GitHub's port proxy stream
      const response = await axios.get(cleanUrl, {
        withCredentials: true
      });
      
      // Handle both raw arrays or wrapped data objects safely
      const data = Array.isArray(response.data) ? response.data : response.data.expenses || [];
      setExpenses(data);
    } catch (err: any) {
      console.error("Fetch error details:", err.message);
      setError("Failed to load expense logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1a73e8" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Expense Records</Text>
        <TouchableOpacity 
          style={styles.headerButton} 
          onPress={() => router.push('/expense-create')}
        >
          <Text style={styles.headerButtonText}>+ Add New</Text>
        </TouchableOpacity>
      </View>

      {error ? (
        <View style={styles.centerTextContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchExpenses}>
            <Text style={styles.retryButtonText}>Retry Connection</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={expenses}
          keyExtractor={(item: any) => item.id?.toString()}
          renderItem={({ item }) => <ExpenseCard expense={item} />}
          ListEmptyComponent={
            <View style={styles.centerTextContainer}>
              <Text style={styles.emptyText}>No expenses logged yet.</Text>
            </View>
          }
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6', padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f3f4f6' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#111827' },
  headerButton: { backgroundColor: '#1a73e8', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 6 },
  headerButtonText: { color: '#ffffff', fontWeight: '600', fontSize: 14 },
  centerTextContainer: { alignItems: 'center', marginTop: 60, paddingHorizontal: 20 },
  errorText: { color: '#dc2626', fontSize: 16, fontWeight: '500', textAlign: 'center', marginBottom: 12 },
  emptyText: { textAlign: 'center', color: '#6b7280', fontSize: 16 },
  retryButton: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#1a73e8', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6 },
  retryButtonText: { color: '#1a73e8', fontWeight: '600' }
});