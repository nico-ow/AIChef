import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";

export default function RecipeScreen({ route }: any) {
  const recipe = route?.params?.recipe;

  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");

  if (!recipe) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "white" }}>No recipe data found</Text>
      </View>
    );
  }

  const recipeName = recipe.title || recipe.name;

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };

    const aiMsg = {
      role: "ai",
      text: `🍳 AI Chef Tip for "${input}" using ${recipeName}:
\n👉 Cook it slowly on medium heat
👉 Taste and adjust seasoning
👉 Add fresh herbs for better flavor`,
    };

    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setInput("");
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* HEADER */}
      <Text style={styles.title}>
        🤖 AI Chef Assistant
      </Text>

      <Text style={styles.subtitle}>
        Cooking: {recipeName}
      </Text>

      {/* CHAT */}
      <ScrollView style={styles.chat}>
        {messages.map((msg, i) => (
          <View
            key={i}
            style={[
              styles.msg,
              msg.role === "user" ? styles.user : styles.ai,
            ]}
          >
            <Text style={styles.msgText}>{msg.text}</Text>
          </View>
        ))}
      </ScrollView>

      {/* INPUT */}
      <View style={styles.inputBox}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Ask AI Chef..."
          placeholderTextColor="#64748b"
          style={styles.input}
        />

        <TouchableOpacity onPress={sendMessage} style={styles.button}>
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b0f14",
    padding: 15,
  },

  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 10,
  },

  subtitle: {
    color: "#94a3b8",
    textAlign: "center",
    marginBottom: 10,
    marginTop: 5,
  },

  chat: {
    flex: 1,
    marginTop: 10,
  },

  msg: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    maxWidth: "85%",
  },

  user: {
    backgroundColor: "#38bdf8",
    alignSelf: "flex-end",
  },

  ai: {
    backgroundColor: "#1f2937",
    alignSelf: "flex-start",
  },

  msgText: {
    color: "white",
    fontSize: 14,
    lineHeight: 18,
  },

  inputBox: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    paddingTop: 10,
  },

  input: {
    flex: 1,
    backgroundColor: "#111827",
    padding: 12,
    borderRadius: 12,
    color: "white",
  },

  button: {
    backgroundColor: "#38bdf8",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },

  buttonText: {
    color: "#0b0f14",
    fontWeight: "900",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0b0f14",
  },
});