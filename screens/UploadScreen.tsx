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
      console.log("UPLOAD RESPONSE:", data);

      if (data.success) {
        Alert.alert("Success", "Recipe uploaded!");

        // reset form
        setTitle("");
        setTime("");
        setDifficulty("");
        setIngredients("");
        setInstructions("");
        setImageUri(null);
        setImageBase64(null);

        // 🚀 INSTANT REFRESH SIGNAL (NO goBack needed)
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
      <ScrollView>
        <Text style={styles.header}>🍳 Upload Recipe</Text>

        {/* IMAGE */}
        <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} />
          ) : (
            <Text style={styles.placeholder}>Tap to select image</Text>
          )}
        </TouchableOpacity>

        <TextInput placeholder="Title" style={styles.input} value={title} onChangeText={setTitle} />
        <TextInput placeholder="Time" style={styles.input} value={time} onChangeText={setTime} />
        <TextInput placeholder="Difficulty" style={styles.input} value={difficulty} onChangeText={setDifficulty} />
        <TextInput placeholder="Ingredients" style={styles.input} value={ingredients} onChangeText={setIngredients} />
        <TextInput placeholder="Instructions" style={styles.input} value={instructions} onChangeText={setInstructions} />

        <TouchableOpacity style={styles.btn} onPress={handlePost} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.btnText}>POST</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 20 },

  header: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 15,
  },

  imageBox: {
    height: 180,
    backgroundColor: "#111",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#222",
  },

  image: {
    width: "100%",
    height: "100%",
    borderRadius: 15,
  },

  placeholder: {
    color: "#888",
  },

  input: {
    backgroundColor: "#111",
    color: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },

  btn: {
    backgroundColor: "#38bdf8",
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
    alignItems: "center",
  },

  btnText: {
    fontWeight: "800",
    color: "#000",
  },
});