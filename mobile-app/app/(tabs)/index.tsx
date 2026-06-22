import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Alert } from "react-native";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { USER_CONFIG } from "@/constants/UserRoles";
import CustomButton from "@/components/CustomButton";
import useAttendance from "@/hooks/useAttendance";
import AttendanceCard from "@/components/AttendanceCard";
import AttendanceHistory from "@/components/AttendanceHistory";
import AttendanceMap from "@/components/AttendanceMap";

export default function HomeScreen() {
  const { status, clockIn, clockOut, checkInTime, checkOutTime, workingHours, attendanceHistory, clearHistory } = useAttendance();
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>HRMS Mobile</Text>
      <View style={[styles.badge, { backgroundColor: USER_CONFIG.role === 'OFFICE' ? '#e1f5fe' : '#fff3e0' }]}>
        <Text style={styles.badgeText}>Mode: {USER_CONFIG.role} OPERATOR</Text>
      </View>
      <View style={styles.buttonGroup}>
        <CustomButton title="Clock In" onPress={clockIn} />
        <CustomButton title="Clock Out" onPress={clockOut} />
      </View>
      <AttendanceCard status={status} checkInTime={checkInTime} checkOutTime={checkOutTime} workingHours={workingHours} />
      <AttendanceHistory history={attendanceHistory} />
      <TouchableOpacity style={styles.clearBtn} onPress={() => Alert.alert("Confirm", "Delete all records?", [{ text: "Cancel" }, { text: "Delete", onPress: clearHistory }])}>
        <Text style={styles.clearBtnText}>Clear History</Text>
      </TouchableOpacity>
      <View style={styles.datePickerContainer}>
        <TouchableOpacity style={styles.navBtn} onPress={() => { const d = new Date(date); d.setDate(d.getDate() - 1); setDate(d); }}><Text style={styles.btnText}>◀</Text></TouchableOpacity>
        <TouchableOpacity style={styles.dateDisplay} onPress={() => setShow(true)}><Text style={styles.dateText}>{date.toLocaleDateString()}</Text></TouchableOpacity>
        <TouchableOpacity style={styles.navBtn} onPress={() => { const d = new Date(date); d.setDate(d.getDate() + 1); setDate(d); }}><Text style={styles.btnText}>▶</Text></TouchableOpacity>
      </View>
      {show && <DateTimePicker value={date} mode="date" onChange={(e, d) => { setShow(false); if(d) setDate(d); }} />}
      <AttendanceMap history={attendanceHistory} selectedDate={date.toLocaleDateString()} />
      <Text style={styles.footer}>Welcome Aman, Yash 🚀</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", paddingVertical: 40 },
  title: { fontSize: 32, fontWeight: "bold", marginBottom: 10 },
  badge: { padding: 10, borderRadius: 20, marginBottom: 10 },
  badgeText: { fontWeight: 'bold' },
  buttonGroup: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  clearBtn: { backgroundColor: '#ff3b30', padding: 10, borderRadius: 8, marginTop: 10 },
  clearBtnText: { color: '#fff', fontWeight: 'bold' },
  datePickerContainer: { flexDirection: 'row', alignItems: 'center', gap: 15, marginTop: 20 },
  dateDisplay: { backgroundColor: '#fff', padding: 12, borderRadius: 12, elevation: 4 },
  dateText: { fontWeight: 'bold' },
  navBtn: { backgroundColor: '#007AFF', padding: 12, borderRadius: 12, width: 50, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' },
  footer: { marginTop: 30, color: '#999' }
});