import { View, Text, StyleSheet } from "react-native";

type AttendanceCardProps = {
  status: string;
  checkInTime: string;
  checkOutTime: string;
  workingHours: string;
  liveTimer: string;
};

export default function AttendanceCard({ status, checkInTime, checkOutTime, workingHours, liveTimer }: AttendanceCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.heading}>Attendance</Text>
      
      {status === "Checked In" && (
        <Text style={styles.timer}>Elapsed: {liveTimer} / 00:05:00</Text>
      )}

      <Text style={styles.info}>Status: {status}</Text>
      <Text style={styles.info}>Clock In: {checkInTime || "__"}</Text>
      <Text style={styles.info}>Clock Out: {checkOutTime || "__"}</Text>
      <Text style={styles.info}>Working Hours: {workingHours || "__"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { width: "90%", backgroundColor: "#ffffff", padding: 20, borderRadius: 15, elevation: 5, marginBottom: 20 },
  heading: { fontSize: 20, fontWeight: "bold", marginBottom: 15 },
  timer: { fontSize: 18, fontWeight: "bold", color: "#d32f2f", marginBottom: 10 },
  info: { fontSize: 16, marginBottom: 8 },
});