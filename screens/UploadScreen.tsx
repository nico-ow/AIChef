import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import * as ImagePicker from "expo-image-picker";

const API_URL = "http://192.168.254.110/AIChef/api";

export default function UploadScreen({ navigation }: any) {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  /* ================= PICK IMAGE ================= */
  const pickImage = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission required", "Allow photo access");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setImageUri(asset.uri);
      setImageBase64(asset.base64 ?? null);
    }
  };

  /* ================= UPLOAD ================= */
  const handlePost = async () => {
    if (!title || !imageBase64) {
      Alert.alert("Missing data", "Please add title and image");
      return;
    }

    setLoading(true);

    try {
      const formBody = new URLSearchParams();
      formBody.append("title", title);
      formBody.append("time", time);
      formBody.append("difficulty", difficulty);
      formBody.append("ingredients", ingredients);
      formBody.append("instructions", instructions);
      formBody.append("image", imageBase64);

      const res = await fetch(`${API_URL}/upload.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formBody.toString(),
      });

      const data = await res.json();

      if (data.success) {
        Alert.alert("Success", "Recipe uploaded!");

        setTitle("");
        setTime("");
        setDifficulty("");
        setIngredients("");
        setInstructions("");
        setImageUri(null);
        setImageBase64(null);

        navigation.navigate("Main", {
          screen: "Home",
          params: { refresh: Date.now() },
        });
      } else {
        Alert.alert("Upload failed", data.message || "Error");
      }
    } catch (err) {
      console.log("UPLOAD ERROR:", err);
      Alert.alert("Error", "Network error");
    }

    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.header}>🍳 Upload Recipe</Text>
          <Text style={styles.subHeader}>
            Share your best dish with the world
          </Text>

          {/* IMAGE PICKER */}
          <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.image} />
            ) : (
              <Text style={styles.placeholder}>
                Tap to select an image
              </Text>
            )}
          </TouchableOpacity>

          {/* INPUTS */}
          <TextInput
            placeholder="Recipe Title"
            placeholderTextColor="#94a3b8"
            style={styles.input}
            value={title}
            onChangeText={setTitle}
          />

          <TextInput
            placeholder="Cooking Time (e.g. 30 mins)"
            placeholderTextColor="#94a3b8"
            style={styles.input}
            value={time}
            onChangeText={setTime}
          />

          <TextInput
            placeholder="Difficulty (Easy / Medium / Hard)"
            placeholderTextColor="#94a3b8"
            style={styles.input}
            value={difficulty}
            onChangeText={setDifficulty}
          />

          <TextInput
            placeholder="Ingredients"
            placeholderTextColor="#94a3b8"
            style={[styles.input, styles.multi]}
            value={ingredients}
            onChangeText={setIngredients}
            multiline
          />

          <TextInput
            placeholder="Instructions"
            placeholderTextColor="#94a3b8"
            style={[styles.input, styles.multi]}
            value={instructions}
            onChangeText={setInstructions}
            multiline
          />

          {/* BUTTON */}
          <TouchableOpacity
            style={styles.btn}
            onPress={handlePost}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#0b0f14" />
            ) : (
              <Text style={styles.btnText}>POST RECIPE</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b0f14",
    padding: 20,
  },

  header: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 10,
  },

  subHeader: {
    color: "#94a3b8",
    textAlign: "center",
    marginBottom: 20,
    marginTop: 5,
  },

  imageBox: {
    height: 200,
    backgroundColor: "#111827",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#1f2937",
  },

  image: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
  },

  placeholder: {
    color: "#64748b",
  },

  input: {
    backgroundColor: "#111827",
    color: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    fontSize: 15,
  },

  multi: {
    height: 90,
    textAlignVertical: "top",
  },

  btn: {
    backgroundColor: "#38bdf8",
    padding: 16,
    borderRadius: 14,
    marginTop: 10,
    alignItems: "center",
  },

  btnText: {
    fontWeight: "900",
    fontSize: 16,
    color: "#0b0f14",
  },
});