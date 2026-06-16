import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet
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

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };

    const aiMsg = {
      role: "ai",
      text: `🍳 For "${input}" with ${recipe.name}:
Try cooking on medium heat and add seasoning for better taste!`
    };

    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setInput("");
  };

  return (
    <View style={styles.container}>

      {/* TITLE */}
      <Text style={styles.title}>{recipe.name} 🤖 AI Chef</Text>

      {/* CHAT AREA */}
      <ScrollView style={styles.chat}>
        {messages.map((msg, i) => (
          <View
            key={i}
            style={[
              styles.msg,
              msg.role === "user" ? styles.user : styles.ai
            ]}
          >
            <Text style={{ color: "white" }}>{msg.text}</Text>
          </View>
        ))}
      </ScrollView>

      {/* INPUT */}
      <View style={styles.inputBox}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Ask AI Chef..."
          placeholderTextColor="#888"
          style={styles.input}
        />

        <TouchableOpacity onPress={sendMessage} style={styles.button}>
          <Text style={{ color: "black", fontWeight: "bold" }}>
            Send
          </Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b0f14",
    padding: 15
  },

  title: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10
  },

  chat: {
    flex: 1
  },

  msg: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 10
  },

  user: {
    backgroundColor: "#38bdf8",
    alignSelf: "flex-end"
  },

  ai: {
    backgroundColor: "#1f2937",
    alignSelf: "flex-start"
  },

  inputBox: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center"
  },

  input: {
    flex: 1,
    backgroundColor: "#121826",
    padding: 12,
    borderRadius: 10,
    color: "white"
  },

  button: {
    backgroundColor: "#38bdf8",
    padding: 12,
    borderRadius: 10
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0b0f14"
  }
});