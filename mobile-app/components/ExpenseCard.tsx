import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export interface Expense {
  id: string;
  category: string;
  amount: number;
  description: string;
  invoiceUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

interface ExpenseCardProps {
  expense: Expense;
}

export default function ExpenseCard({ expense }: ExpenseCardProps) {
  const getStatusColor = (status: Expense['status']) => {
    switch (status) {
      case 'approved':
        return '#2e7d32';
      case 'rejected':
        return '#c62828';
      default:
        return '#f57c00';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <View style={styles.card}>
      {expense.invoiceUrl ? (
        <Image source={{ uri: expense.invoiceUrl }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={[styles.image, styles.placeholderImage]}>
          <Text style={styles.placeholderText}>No Invoice</Text>
        </View>
      )}
      
      {/* FIXED: Changed <div> to <View> */}
      <View style={styles.detailsContainer}>
        {/* FIXED: Changed <div> to <View> */}
        <View style={styles.headerRow}>
          <Text style={styles.category} numberOfLines={1}>{expense.category}</Text>
          <Text style={styles.amount}>${expense.amount.toFixed(2)}</Text>
        </View>
        
        {expense.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {expense.description}
          </Text>
        ) : null}

        {/* FIXED: Changed <div> to <View> */}
        <View style={styles.footerRow}>
          <Text style={styles.date}>{formatDate(expense.createdAt)}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(expense.status) + '15' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(expense.status) }]}>
              {expense.status.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  image: {
    width: 90,
    height: '100%',
    minHeight: 100,
  },
  placeholderImage: {
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 11,
    color: '#9e9e9e',
  },
  detailsContainer: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  category: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    flex: 1,
    marginRight: 8,
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a73e8',
  },
  description: {
    fontSize: 13,
    color: '#616161',
    marginBottom: 8,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  date: {
    fontSize: 12,
    color: '#9e9e9e',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});