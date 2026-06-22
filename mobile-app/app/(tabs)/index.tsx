import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router"; // 1. Import the router
import CustomButton from "@/components/CustomButton";
import useAttendance from "@/hooks/useAttendance";

export default function HomeScreen() {
  const router = useRouter(); // 2. Initialize the router
  const { status, setStatus, clockIn, clockOut, checkInTime, checkOutTime } = useAttendance();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>HRMS Mobile</Text>

      <Text style={styles.status}>
        Status: {status}
      </Text>
      <Text>checkIn: {checkInTime}</Text>
      <Text>checkOut: {checkOutTime}</Text>
      
      <CustomButton
        title="Clock-In"
        onPress={clockIn}
      />

      <CustomButton
        title="Clock Out"
        onPress={clockOut}
      />

      <CustomButton
        title="Apply Leave"
        onPress={() => setStatus("Leave Applied")}
      />

      {/* 3. Updated handler to navigate to your expenses tab page */}
      <CustomButton
        title="Expenses"
        onPress={() => {
          setStatus("Expenses");
          router.push('/expenses');
        }}
      />

      <Text>Welcome Aman ,yash 🚀</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
  },

  status: {
    fontSize: 18,
    color: "green",
    marginBottom: 20,
    fontWeight: "600",
  },
});