import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from "react-native";

import { useFocusEffect } from "@react-navigation/native";
import { getFavorites, removeFavorite } from "../services/favorites";

const { width } = Dimensions.get("window");

export default function FavoritesScreen({ navigation }: any) {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = async () => {
    setLoading(true);
    const data = await getFavorites();
    setFavorites(data || []);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const handleRemove = async (id: number) => {
    const updated = await removeFavorite(id);
    setFavorites(updated || []);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#38bdf8" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>❤️ Favorites</Text>

        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.back}>Home</Text>
        </TouchableOpacity>
      </View>

      {/* EMPTY */}
      {favorites.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No saved recipes yet</Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image
                source={{
                  uri: `http://192.168.254.110/AIChef/${item.image}`,
                }}
                style={styles.image}
              />

              <View style={styles.content}>
                <Text style={styles.name}>{item.title}</Text>

                <Text style={styles.meta}>
                  ⏱ {item.time} • 🔥 {item.difficulty}
                </Text>

                <View style={styles.row}>
                  <TouchableOpacity
                    style={styles.cookBtn}
                    onPress={() =>
                      navigation.navigate("Recipe", {
                        recipe: item,
                        mode: "cook",
                      })
                    }
                  >
                    <Text style={styles.cookText}>🍳 Cook</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => handleRemove(item.id)}>
                    <Text style={styles.removeText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", paddingHorizontal: 15 },

  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" },

  header: {
    marginTop: 20,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  title: { color: "#fff", fontSize: 24, fontWeight: "800" },

  backBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(56,189,248,0.6)",
    backgroundColor: "rgba(56,189,248,0.08)",
  },

  back: { color: "#38bdf8", fontWeight: "700" },

  empty: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { color: "#888", fontSize: 16 },

  list: { paddingBottom: 30 },

  card: {
    width: width - 30,
    marginBottom: 18,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#111",
    alignSelf: "center",
  },

  image: { width: "100%", height: 180 },

  content: { padding: 14 },

  name: { color: "#fff", fontSize: 20, fontWeight: "800" },

  meta: { color: "#cbd5e1", marginTop: 4, marginBottom: 12 },

  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },

  cookBtn: {
    backgroundColor: "#38bdf8",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },

  cookText: { color: "#000", fontWeight: "800" },

  removeText: { color: "#ff4d4d", fontWeight: "700" },
});