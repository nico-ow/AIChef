import { API_URL } from "../config/api";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";

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
        `${API_URL}/login.php`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (data.success) {
        await AsyncStorage.setItem("user_id", String(data.user.id));
        await AsyncStorage.setItem("username", String(data.user.username));
        await AsyncStorage.setItem("email", String(data.user.email));

        navigation.replace("Main");
      } else {
        Alert.alert("Login Failed", data.message || "Invalid credentials");
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

      {/* LOGO */}
      <Image
        source={require("../assets/Final.png")}
        style={styles.logoImage}
        resizeMode="contain"
      />

      {/* BRAND NAME */}
      <Text style={styles.appName}>PIC DISH</Text>

      {/* TAGLINE */}
      <Text style={styles.subtitle}>
        Discover • Cook • Share Delicious Recipes
      </Text>

      {/* LOGIN CARD */}
      <View style={styles.card}>

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
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.buttonText}>LOGIN</Text>
          )}
        </TouchableOpacity>

      </View>

      {/* REGISTER */}
      <TouchableOpacity
        onPress={() => navigation.navigate("Register")}
      >
        <Text style={styles.link}>Create new account</Text>
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
    alignItems: "center",
    padding: 25,
  },

  logoImage: {
    width: 110,
    height: 110,
    marginBottom: 10,
  },

  /* 🔥 BRAND STYLE */
  appName: {
    fontSize: 34,
    fontWeight: "900",
    color: "#38bdf8",
    letterSpacing: 2,
    marginBottom: 5,
  },

  subtitle: {
    color: "#94a3b8",
    textAlign: "center",
    marginBottom: 25,
    fontSize: 14,
  },

  /* LOGIN CARD */
  card: {
    width: "100%",
    backgroundColor: "#121826",
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },

  input: {
    backgroundColor: "#0b0f14",
    color: "white",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    fontSize: 15,
  },

  button: {
    backgroundColor: "#38bdf8",
    padding: 15,
    borderRadius: 12,
    marginTop: 5,
    alignItems: "center",
  },

  buttonText: {
    fontWeight: "900",
    fontSize: 15,
    color: "#0b0f14",
    letterSpacing: 1,
  },

  link: {
    textAlign: "center",
    color: "#38bdf8",
    marginTop: 20,
    fontWeight: "600",
  },
});