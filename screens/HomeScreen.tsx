import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar
} from "react-native";

import { recipes } from "../data/recipes";
import { logoutUser } from "../services/auth";

const { width, height } = Dimensions.get("window");

export default function HomeScreen({ navigation }: any) {
  const [saved, setSaved] = useState<number[]>([]);

  const toggleSave = (id: number) => {
    setSaved((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  };

  const handleLogout = async () => {
    await logoutUser();
    navigation.replace("Login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* LOGOUT BUTTON (SAFE FIXED POSITION) */}
      <TouchableOpacity style={styles.logout} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* SWIPE FEED */}
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id.toString()}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={height}
        snapToAlignment="start"
        renderItem={({ item }) => {
          const isSaved = saved.includes(item.id);

          return (
            <View style={styles.card}>
              {/* BACKGROUND IMAGE */}
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={styles.overlay} />

              {/* CONTENT */}
              <View style={styles.content}>
                <Text style={styles.title}>{item.name}</Text>

                <Text style={styles.meta}>
                  ⏱ {item.time} • 🔥 {item.difficulty}
                </Text>

                <View style={styles.row}>
                  {/* COOK BUTTON */}
                  <TouchableOpacity
                    style={styles.cookBtn}
                    onPress={() =>
                      navigation.navigate("Recipe", {
                        recipe: item,
                        mode: "cook"
                      })
                    }
                  >
                    <Text style={styles.cookText}>🍳 Cook Now</Text>
                  </TouchableOpacity>

                  {/* SAVE BUTTON */}
                  <TouchableOpacity
                    onPress={() => toggleSave(item.id)}
                    style={styles.saveBtn}
                  >
                    <Text style={styles.saveText}>
                      {isSaved ? "❤️" : "🤍"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000"
  },

  card: {
    width,
    height,
    position: "relative",
    justifyContent: "flex-end"
  },

  image: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%"
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.55)"
  },

  content: {
    paddingHorizontal: 22,
    paddingBottom: 110
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white"
  },

  meta: {
    color: "#cbd5e1",
    marginTop: 6,
    fontSize: 14
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    gap: 12
  },

  cookBtn: {
    backgroundColor: "#38bdf8",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 14
  },

  cookText: {
    color: "#000",
    fontWeight: "bold"
  },

  saveBtn: {
    padding: 12
  },

  saveText: {
    fontSize: 24
  },

  logout: {
    position: "absolute",
    top: 50,
    right: 15,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    zIndex: 100
  },

  logoutText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold"
  }
});