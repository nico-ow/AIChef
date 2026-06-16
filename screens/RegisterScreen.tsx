import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { registerUser } from "../services/auth";

export default function RegisterScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    const res = await registerUser(email, password);

    if (res.success) {
      alert("Account created!");
      navigation.navigate("Login");
    } else {
      alert(res.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#aaa"
        style={styles.input}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        style={styles.input}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#0b0f14" },
  title: { fontSize: 28, color: "white", marginBottom: 20, fontWeight: "bold" },
  input: {
    backgroundColor: "#121826",
    color: "white",
    padding: 12,
    marginBottom: 10,
    borderRadius: 10
  },
  button: {
    backgroundColor: "#38bdf8",
    padding: 12,
    borderRadius: 10
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "bold",
    color: "#000"
  }
});