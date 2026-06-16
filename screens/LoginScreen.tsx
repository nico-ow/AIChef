import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { loginUser } from "../services/auth";
import { RootStackParamList } from "../types/navigation";

type LoginNav = NativeStackNavigationProp<
  RootStackParamList,
  "Login"
>;

type Props = {
  navigation: LoginNav;
};

export default function LoginScreen({
  navigation
}: Props): React.ReactElement {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      alert("Please enter email and password");
      return;
    }

    const res = await loginUser(email, password);

    console.log("LOGIN RESULT:", res);

    if (res.success) {
      navigation.replace("Main");
    } else {
      alert(res.message);
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
      >
        <Text style={styles.buttonText}>
          Login
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Register")}
      >
        <Text style={styles.link}>
          Create account
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b0f14",
    justifyContent: "center",
    padding: 25
  },

  logo: {
    fontSize: 60,
    textAlign: "center",
    marginBottom: 10
  },

  title: {
    fontSize: 32,
    color: "white",
    textAlign: "center",
    fontWeight: "bold"
  },

  subtitle: {
    color: "#94a3b8",
    textAlign: "center",
    marginBottom: 30
  },

  input: {
    backgroundColor: "#121826",
    color: "white",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    fontSize: 16
  },

  button: {
    backgroundColor: "#38bdf8",
    padding: 15,
    borderRadius: 12,
    marginTop: 5
  },

  buttonText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
    color: "#0b0f14"
  },

  link: {
    textAlign: "center",
    color: "#38bdf8",
    marginTop: 20,
    fontWeight: "600"
  }
});