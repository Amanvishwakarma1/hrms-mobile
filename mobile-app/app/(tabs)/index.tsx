import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Alert } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { USER_CONFIG } from "@/constants/UserRoles";
import CustomButton from "@/components/CustomButton";
import useAttendance from "@/hooks/useAttendance";
import AttendanceCard from "@/components/AttendanceCard";
import AttendanceHistory from "@/components/AttendanceHistory";
import AttendanceMap from "@/components/AttendanceMap";

export default function HomeScreen() {
  const router = useRouter();
  const { status, setStatus, clockIn, clockOut, checkInTime, checkOutTime, workingHours, attendanceHistory, clearHistory, liveTimer } = useAttendance();
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const onChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShow(false);
    }
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

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
});