import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useState } from "react";
import { loginUser } from "@/services/authService";
import { useAuth } from "@/context/AuthContext";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useAuth();

  const handleLogin = async () => {
    try {
      const userData = await loginUser({ email, password });
      setUser(userData);
    } catch (error) {
      Alert.alert("Login Failed", "Invalid credentials.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>HRMS Login</Text>
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.btnText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#f0f8ff" },
  title: { fontSize: 32, fontWeight: "bold", marginBottom: 30, textAlign: "center", color: "#007AFF" },
  input: { backgroundColor: "#fff", padding: 15, borderRadius: 10, marginBottom: 20, borderWidth: 1, borderColor: "#ccc" },
  button: { backgroundColor: "#007AFF", padding: 15, borderRadius: 10 },
  btnText: { color: "#fff", textAlign: "center", fontWeight: "bold" }
});