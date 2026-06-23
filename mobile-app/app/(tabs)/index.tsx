import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Alert, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { USER_CONFIG } from "@/constants/UserRoles";
import CustomButton from "@/components/CustomButton";
import useAttendance from "@/hooks/useAttendance";
import AttendanceCard from "@/components/AttendanceCard";
import AttendanceHistory from "@/components/AttendanceHistory";
import AttendanceMap from "@/components/AttendanceMap";
import { useAuth } from "@/context/AuthContext";
import { logoutUser } from "@/services/authService";
import axios from "axios";
import { API_BASE_URL } from "@/constants/API";

export default function HomeScreen() {
  const router = useRouter();
  const { user, setUser } = useAuth();
  
  // Employee Attendance States & Hooks
  const { status, setStatus, clockIn, clockOut, checkInTime, checkOutTime, workingHours, attendanceHistory, clearHistory, liveTimer } = useAttendance();
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  // Admin Dashboard States
  const [liveAttendance, setLiveAttendance] = useState<any[]>([]);
  const [pendingExpenses, setPendingExpenses] = useState<any[]>([]);
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState<string | null>(null);

  const fetchAdminData = async () => {
    try {
      setAdminLoading(true);
      setAdminError(null);
      
      const cleanAttendanceUrl = `${API_BASE_URL}/admin/attendance/live`;
      const cleanExpensesUrl = `${API_BASE_URL}/admin/expenses`;
      
      const [liveRes, expensesRes] = await Promise.all([
        axios.get(cleanAttendanceUrl, { withCredentials: true }),
        axios.get(cleanExpensesUrl, { withCredentials: true })
      ]);
      
      setLiveAttendance(liveRes.data);
      setPendingExpenses(expensesRes.data.filter((e: any) => e.status === 'pending'));
    } catch (err: any) {
      console.error('Admin fetch error details:', err.message);
      setAdminError('Failed to load admin dashboard data.');
    } finally {
      setAdminLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchAdminData();
    }
  }, [user]);

  const handleExpenseAction = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await axios.put(`${API_BASE_URL}/admin/expenses/${id}/status`, { status }, { withCredentials: true });
      Alert.alert('Success', `Expense claim has been ${status}.`);
      fetchAdminData(); // Refresh the list
    } catch (err: any) {
      console.error('Expense update status error:', err.message);
      Alert.alert('Error', 'Failed to update expense status.');
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
  };

  const onChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShow(false);
    }
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>HRMS Mobile</Text>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutBtnText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Role Badge */}
      <View style={[styles.badge, { backgroundColor: isAdmin ? '#e8f5e9' : '#fff3e0' }]}>
        <Text style={[styles.badgeText, { color: isAdmin ? '#2e7d32' : '#e65100' }]}>
          Mode: {isAdmin ? 'ADMIN' : 'EMPLOYEE'} OPERATOR
        </Text>
      </View>

      {isAdmin ? (
        /* ================== ADMIN DASHBOARD ================== */
        <View style={styles.adminContainer}>
          {adminLoading ? (
            <ActivityIndicator size="large" color="#2e7d32" style={{ marginTop: 40 }} />
          ) : adminError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{adminError}</Text>
              <TouchableOpacity style={styles.retryBtn} onPress={fetchAdminData}>
                <Text style={styles.retryBtnText}>Retry Fetch</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {/* Workforce Metrics Card */}
              <View style={styles.metricsCard}>
                <Text style={styles.sectionTitle}>👥 Workforce Metrics</Text>
                <Text style={styles.metricsCount}>
                  Active Clocked In: {liveAttendance.length}
                </Text>
                <View style={styles.employeeList}>
                  {liveAttendance.length > 0 ? (
                    liveAttendance.map((item: any, idx: number) => (
                      <Text key={item.id || idx} style={styles.employeeNameText}>
                        • {item.User?.name || 'Employee'} (Clocked in: {item.checkIn})
                      </Text>
                    ))
                  ) : (
                    <Text style={styles.emptyText}>No employees currently clocked in.</Text>
                  )}
                </View>
              </View>

              {/* Global Expense Approvals Stream */}
              <Text style={[styles.sectionTitle, { marginTop: 24, alignSelf: 'flex-start', marginLeft: '5%' }]}>
                💳 Pending Expense Claims ({pendingExpenses.length})
              </Text>
              
              {pendingExpenses.length > 0 ? (
                pendingExpenses.map((item: any) => (
                  <View key={item.id} style={styles.approvalCard}>
                    <View style={styles.approvalHeader}>
                      <Text style={styles.employeeName}>{item.User?.name || 'Unknown User'}</Text>
                      <Text style={styles.claimAmount}>${item.amount.toFixed(2)}</Text>
                    </View>
                    <Text style={styles.claimCategory}>Category: {item.category}</Text>
                    {item.description && (
                      <Text style={styles.claimDescription}>Note: {item.description}</Text>
                    )}
                    
                    {item.invoiceUrl && (
                      <TouchableOpacity 
                        style={styles.receiptLinkContainer}
                        onPress={() => Alert.alert('Receipt Attachment', `URL: ${item.invoiceUrl}`)}
                      >
                        <Text style={styles.receiptLinkText}>📄 View Receipt Slip</Text>
                      </TouchableOpacity>
                    )}

                    <View style={styles.actionGroup}>
                      <TouchableOpacity 
                        style={[styles.actionBtn, styles.approveBtn]}
                        onPress={() => handleExpenseAction(item.id, 'approved')}
                      >
                        <Text style={styles.actionBtnText}>Approve</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={[styles.actionBtn, styles.rejectBtn]}
                        onPress={() => handleExpenseAction(item.id, 'rejected')}
                      >
                        <Text style={styles.actionBtnText}>Reject</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              ) : (
                <View style={[styles.approvalCard, { alignItems: 'center', padding: 20 }]}>
                  <Text style={styles.emptyText}>No pending expense approvals.</Text>
                </View>
              )}
            </>
          )}
        </View>
      ) : (
        /* ================== EMPLOYEE DASHBOARD ================== */
        <>
          <View style={styles.buttonGroup}>
            <CustomButton title="Clock In" onPress={clockIn} />
            <CustomButton title="Clock Out" onPress={clockOut} />
          </View>
          <View style={styles.buttonGroup}>
            <CustomButton title="Apply Leave" onPress={() => { if (setStatus) setStatus("Leave Applied"); }} />
            <CustomButton title="Expenses" onPress={() => { if (setStatus) setStatus("Expenses"); router.push('/expenses'); }} />
          </View>
          <AttendanceCard status={status} checkInTime={checkInTime} checkOutTime={checkOutTime} workingHours={workingHours} liveTimer={liveTimer} />
          <AttendanceHistory history={attendanceHistory} />
          <TouchableOpacity style={styles.clearBtn} onPress={() => Alert.alert("Confirm", "Delete all records?", [{ text: "Cancel" }, { text: "Delete", onPress: clearHistory }])}>
            <Text style={styles.clearBtnText}>Clear History</Text>
          </TouchableOpacity>
          <View style={styles.datePickerContainer}>
            <TouchableOpacity style={styles.navBtn} onPress={() => { const d = new Date(date); d.setDate(d.getDate() - 1); setDate(d); }}><Text style={styles.btnText}>◀</Text></TouchableOpacity>
            <TouchableOpacity style={styles.dateDisplay} onPress={() => { if (Platform.OS !== 'web') setShow(true); }}><Text style={styles.dateText}>{date.toLocaleDateString()}</Text></TouchableOpacity>
            <TouchableOpacity style={styles.navBtn} onPress={() => { const d = new Date(date); d.setDate(d.getDate() + 1); setDate(d); }}><Text style={styles.btnText}>▶</Text></TouchableOpacity>
          </View>
          {show && Platform.OS !== 'web' && (
            <View style={Platform.OS === 'ios' ? styles.iosPickerContainer : null}>
              <DateTimePicker 
                value={date} 
                mode="date" 
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onChange} 
              />
              {Platform.OS === 'ios' && (
                <TouchableOpacity style={styles.doneBtn} onPress={() => setShow(false)}>
                  <Text style={styles.doneBtnText}>Done</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          <AttendanceMap history={attendanceHistory} selectedDate={date.toLocaleDateString()} />
          <Text style={styles.footer}>Welcome {user?.name || 'Employee'} 🚀</Text>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", paddingVertical: 40, backgroundColor: "#f3f4f6" },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '90%', marginBottom: 10 },
  title: { fontSize: 28, fontWeight: "bold" },
  logoutBtn: { borderWidth: 1, borderColor: '#ff3b30', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  logoutBtnText: { color: '#ff3b30', fontWeight: 'bold', fontSize: 13 },
  badge: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginBottom: 20 },
  badgeText: { fontWeight: 'bold', fontSize: 13 },
  buttonGroup: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  clearBtn: { backgroundColor: '#ff3b30', padding: 10, borderRadius: 8, marginTop: 10 },
  clearBtnText: { color: '#fff', fontWeight: 'bold' },
  datePickerContainer: { flexDirection: 'row', alignItems: 'center', gap: 15, marginTop: 20 },
  dateDisplay: { backgroundColor: '#fff', padding: 12, borderRadius: 12, elevation: 4 },
  dateText: { fontWeight: 'bold' },
  navBtn: { backgroundColor: '#007AFF', padding: 12, borderRadius: 12, width: 50, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' },
  footer: { marginTop: 30, color: '#999' },
  iosPickerContainer: {
    backgroundColor: '#ffffff',
    width: '90%',
    borderRadius: 12,
    padding: 10,
    marginVertical: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  doneBtn: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 10,
  },
  doneBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  
  // Admin Styles
  adminContainer: { width: '90%', alignItems: 'center' },
  errorContainer: { alignItems: 'center', marginVertical: 30 },
  errorText: { color: '#ff3b30', marginBottom: 10, fontWeight: '500' },
  retryBtn: { backgroundColor: '#007AFF', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  retryBtnText: { color: '#fff', fontWeight: 'bold' },
  metricsCard: { backgroundColor: '#fff', width: '100%', padding: 16, borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1f2937', marginBottom: 12 },
  metricsCount: { fontSize: 24, fontWeight: 'bold', color: '#2e7d32', marginBottom: 12 },
  employeeList: { borderTopWidth: 1, borderTopColor: '#f3f4f6', paddingTop: 8 },
  employeeNameText: { fontSize: 14, color: '#4b5563', paddingVertical: 4 },
  emptyText: { color: '#9ca3af', fontStyle: 'italic', fontSize: 14 },
  approvalCard: { backgroundColor: '#fff', width: '100%', padding: 16, borderRadius: 12, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  approvalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  employeeName: { fontSize: 16, fontWeight: '600', color: '#1f2937' },
  claimAmount: { fontSize: 16, fontWeight: 'bold', color: '#1f2937' },
  claimCategory: { fontSize: 13, color: '#6b7280', marginBottom: 4 },
  claimDescription: { fontSize: 13, color: '#4b5563', fontStyle: 'italic', marginBottom: 8 },
  receiptLinkContainer: { alignSelf: 'flex-start', marginVertical: 6 },
  receiptLinkText: { color: '#007AFF', fontWeight: '500', fontSize: 13 },
  actionGroup: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, marginTop: 12 },
  actionBtn: { flex: 1, padding: 10, borderRadius: 8, alignItems: 'center' },
  approveBtn: { backgroundColor: '#2e7d32' },
  rejectBtn: { backgroundColor: '#d32f2f' },
  actionBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 }
});