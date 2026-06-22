import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";

import { registerUser } from "../services/auth";

export default function RegisterScreen({ navigation }: any) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!username || !email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await registerUser(username, email, password);

      if (res.success) {
        Alert.alert("Success", "Account created!");
        navigation.navigate("Login");
      } else {
        Alert.alert("Error", res.message || "Registration failed");
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Network Error", "Please try again");
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>

      {/* LOGO PLACE (OPTIONAL) */}
      <Image
        source={require("../assets/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Create Account</Text>

      <Text style={styles.subtitle}>
        Join AI Chef and start cooking smarter
      </Text>

      {/* INPUTS */}
      <TextInput
        placeholder="Username"
        placeholderTextColor="#94a3b8"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        placeholder="Email"
        placeholderTextColor="#94a3b8"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#94a3b8"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      {/* BUTTON */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#0b0f14" />
        ) : (
          <Text style={styles.buttonText}>Register</Text>
        )}
      </TouchableOpacity>

      {/* LOGIN LINK */}
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>

    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b0f14",
    justifyContent: "center",
    padding: 25,
    alignItems: "center",
  },

  logo: {
    width: 90,
    height: 90,
    marginBottom: 10,
  },

  title: {
    fontSize: 30,
    color: "white",
    fontWeight: "900",
    textAlign: "center",
  },

  subtitle: {
    color: "#94a3b8",
    textAlign: "center",
    marginBottom: 25,
    marginTop: 5,
  },

  input: {
    backgroundColor: "#111827",
    color: "white",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    width: "100%",
    fontSize: 15,
  },

  button: {
    backgroundColor: "#38bdf8",
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
    alignItems: "center",
    width: "100%",
  },

  buttonText: {
    fontWeight: "900",
    fontSize: 16,
    color: "#0b0f14",
  },

  link: {
    color: "#38bdf8",
    marginTop: 20,
    fontWeight: "600",
  },
});