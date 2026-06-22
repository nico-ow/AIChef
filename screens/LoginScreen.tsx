import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
} from "react-native";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import AsyncStorage from "@react-native-async-storage/async-storage";

type LoginNav = NativeStackNavigationProp<
  RootStackParamList,
  "Login"
>;

type Props = {
  navigation: LoginNav;
};

export default function LoginScreen({
  navigation,
}: Props): React.ReactElement {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);

      const res = await fetch(
        "http://192.168.254.110/AIChef/api/login.php",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      console.log("LOGIN RESULT:", data);

      if (data.success) {
        // 🔐 SAVE AUTH DATA
        await AsyncStorage.setItem(
          "user_id",
          String(data.user.id)
        );

        await AsyncStorage.setItem(
          "token",
          String(data.user.token)
        );

        await AsyncStorage.setItem(
          "username",
          String(data.user.username)
        );

        navigation.replace("Main");
      } else {
        Alert.alert("Login Failed", data.message || "Try again");
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Network Error", "Please try again later");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🍳</Text>

      <Text style={styles.title}>AI Chef</Text>

      <Text style={styles.subtitle}>
        Your personal cooking assistant
      </Text>

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

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#0b0f14" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Register")}
      >
        <Text style={styles.link}>Create account</Text>
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
  },

  logo: {
    fontSize: 60,
    textAlign: "center",
    marginBottom: 10,
  },

  title: {
    fontSize: 32,
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },

  subtitle: {
    color: "#94a3b8",
    textAlign: "center",
    marginBottom: 30,
  },

  input: {
    backgroundColor: "#121826",
    color: "white",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    fontSize: 16,
  },

  button: {
    backgroundColor: "#38bdf8",
    padding: 15,
    borderRadius: 12,
    marginTop: 5,
    alignItems: "center",
  },

  buttonText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#0b0f14",
  },

  link: {
    textAlign: "center",
    color: "#38bdf8",
    marginTop: 20,
    fontWeight: "600",
  },
});