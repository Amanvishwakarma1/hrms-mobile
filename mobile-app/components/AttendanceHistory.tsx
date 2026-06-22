import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function AttendanceHistory({ history }: { history: any[] }) {
  return (
    <View style={styles.card}>
      <Text style={styles.heading}>Attendance History</Text>
      
      {/* nestedScrollEnabled is CRITICAL for nested views */}
      <ScrollView 
        style={styles.scrollArea} 
        nestedScrollEnabled={true} 
      >
        {history.map((item: any, index: number) => (
          <View key={index} style={styles.row}>
            <Text style={styles.text}>{item.date}</Text>
            <Text style={styles.text}>{item.checkIn} - {item.checkOut}</Text>
            {item.coords && (
              <Text style={styles.coords}>
                {item.coords.lat.toFixed(2)}, {item.coords.lon.toFixed(2)}
              </Text>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { 
    width: "90%", 
    padding: 15, 
    backgroundColor: "#fff", 
    borderRadius: 12, 
    marginTop: 20,
    // Ensure the card itself doesn't have a fixed height that clips the content
  },
  heading: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  scrollArea: { 
    maxHeight: 200, // This keeps the card size controlled
    width: '100%' 
  },
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingVertical: 12, // Increased padding for better touch
    borderBottomWidth: 1, 
    borderBottomColor: '#eee' 
  },
  text: { fontSize: 14 },
  coords: { fontSize: 10, color: 'gray' }
});