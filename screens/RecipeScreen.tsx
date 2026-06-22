import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

import { askGemini } from "../services/aiChef";
import { getCache, setCache } from "../utils/aiCache";

type Message = {
  role: "user" | "ai";
  text: string;
};

export default function RecipeScreen({ route, navigation }: any) {

  // ✅ FIX: support both "name" and "title"
  const recipe = route?.params?.recipe;

  const recipeName =
    recipe?.name ||
    recipe?.title ||
    "Unknown Dish";

  const cacheKey = recipeName;

  const [mode, setMode] = useState<"chat" | "cook">("cook");
  const [generatedRecipe, setGeneratedRecipe] = useState("");
  const [steps, setSteps] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!recipe) return;

    const cached = getCache(cacheKey);

    if (cached) {
      setGeneratedRecipe(cached.generatedRecipe || "");
      setSteps(cached.steps || []);
      return;
    }

    generateOnce();
  }, [recipe]);

  const generateOnce = async () => {
    try {
      setLoading(true);

      // ✅ FIX: stronger AI prompt (prevents "undefined dish")
      const prompt = `
You are an expert AI Chef.

Create a cooking guide for this dish: "${recipeName}"

Return clearly:
1. Short description
2. Step-by-step cooking instructions
3. Tips
`;

      const res = await askGemini(prompt, recipeName);

      const stepsArray = (res || "")
        .split("\n")
        .map((s: string) => s.trim())
        .filter(Boolean);

      setGeneratedRecipe(res || "");
      setSteps(stepsArray);
      setCurrentStep(0);

      setCache(cacheKey, {
        generatedRecipe: res,
        steps: stepsArray
      });

    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    setCurrentStep((p) => (p < steps.length - 1 ? p + 1 : p));
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userText = input;
    setInput("");

    setMessages((prev) => [...prev, { role: "user", text: userText }]);

    // ✅ FIX: always send real dish name
    const prompt = `
You are an AI Chef assistant.

Dish: "${recipeName}"

Context:
${generatedRecipe}

User question:
${userText}

Respond clearly and helpful.
`;

    const res = await askGemini(prompt, recipeName);

    setMessages((prev) => [
      ...prev,
      { role: "ai", text: res || "No response" }
    ]);
  };

  if (!recipe) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "white" }}>No recipe found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.title} numberOfLines={1}>
          🍳 {recipeName}
        </Text>
      </View>

      {/* TOGGLE */}
      <View style={styles.toggleWrap}>
        <TouchableOpacity
          style={[styles.pill, mode === "cook" && styles.pillActive]}
          onPress={() => setMode("cook")}
        >
          <Text style={mode === "cook" ? styles.pillActiveText : styles.pillText}>
            🔥 Cook
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.pill, mode === "chat" && styles.pillActive]}
          onPress={() => setMode("chat")}
        >
          <Text style={mode === "chat" ? styles.pillActiveText : styles.pillText}>
            💬 Chat
          </Text>
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator color="#38bdf8" />}

      {/* MAIN */}
      <View style={styles.body}>

        {mode === "cook" && (
          <View style={styles.cookBox}>
            <Text style={styles.step}>
              {steps[currentStep] || "Loading recipe..."}
            </Text>

            <TouchableOpacity style={styles.nextBtn} onPress={nextStep}>
              <Text style={styles.nextText}>Next Step</Text>
            </TouchableOpacity>
          </View>
        )}

        {mode === "chat" && (
          <View style={styles.chatWrapper}>

            <ScrollView style={styles.chatList}>
              {messages.map((m, i) => (
                <View
                  key={i}
                  style={[
                    styles.bubble,
                    m.role === "user" ? styles.user : styles.ai
                  ]}
                >
                  <Text style={{ color: "white" }}>{m.text}</Text>
                </View>
              ))}
            </ScrollView>

            <View style={styles.inputRow}>
              <TextInput
                value={input}
                onChangeText={setInput}
                style={styles.input}
                placeholder="Ask AI Chef..."
                placeholderTextColor="#888"
              />

              <TouchableOpacity onPress={sendMessage}>
                <Text style={styles.send}>Send</Text>
              </TouchableOpacity>
            </View>

          </View>
        )}

      </View>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b0f14",
    paddingHorizontal: 16,
    paddingTop: 50
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },

  header: { marginBottom: 10 },

  title: {
    color: "white",
    fontSize: 22,
    fontWeight: "800",
    marginTop: 8
  },

  backBtn: {
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "rgba(56,189,248,0.18)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(56,189,248,0.6)",
  },

  backText: { color: "#38bdf8", fontWeight: "bold" },

  toggleWrap: {
    flexDirection: "row",
    backgroundColor: "#121826",
    borderRadius: 25,
    padding: 4,
    marginVertical: 10
  },

  pill: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 20
  },

  pillActive: { backgroundColor: "#38bdf8" },

  pillText: { color: "#aaa", fontWeight: "600" },

  pillActiveText: { color: "#000", fontWeight: "800" },

  body: { flex: 1 },

  cookBox: {
    flex: 1,
    justifyContent: "center"
  },

  step: {
    color: "white",
    fontSize: 18,
    lineHeight: 26,
    marginBottom: 20
  },

  nextBtn: {
    backgroundColor: "#38bdf8",
    padding: 14,
    borderRadius: 12,
    alignItems: "center"
  },

  nextText: { color: "#000", fontWeight: "800" },

  chatWrapper: {
    flex: 1,
    justifyContent: "space-between"
  },

  chatList: { flex: 1 },

  bubble: {
    padding: 12,
    marginVertical: 6,
    borderRadius: 12,
    maxWidth: "80%"
  },

  user: {
    backgroundColor: "#38bdf8",
    alignSelf: "flex-end"
  },

  ai: {
    backgroundColor: "#1f2937",
    alignSelf: "flex-start"
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
    marginBottom: 45
  },

  input: {
    flex: 1,
    backgroundColor: "#121826",
    padding: 12,
    borderRadius: 12,
    color: "white"
  },

  send: {
    color: "#38bdf8",
    fontWeight: "800"
  }
});