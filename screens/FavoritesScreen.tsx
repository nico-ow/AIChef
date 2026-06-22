import { API_URL, BASE_URL } from "../config/api";
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
        <View>
          <Text style={styles.brand}>PIC DISH</Text>
          <Text style={styles.title}>Favorites</Text>
        </View>

        <TouchableOpacity
          style={styles.homeBtn}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.homeText}>Home</Text>
        </TouchableOpacity>
      </View>

      {/* EMPTY STATE */}
      {favorites.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No saved recipes yet</Text>
          <Text style={styles.emptySub}>
            Start exploring and tap ❤️ to save meals
          </Text>
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
                  uri: `${BASE_URL}/${item.image}`,
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

                  <TouchableOpacity
                    style={styles.removeBtn}
                    onPress={() => handleRemove(item.id)}
                  >
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
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 15,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },

  /* HEADER */
  header: {
    marginTop: 20,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  brand: {
    color: "#38bdf8",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 2,
  },

  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "900",
  },

  homeBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "rgba(56,189,248,0.15)",
    borderWidth: 1,
    borderColor: "rgba(56,189,248,0.4)",
  },

  homeText: {
    color: "#38bdf8",
    fontWeight: "700",
  },

  /* EMPTY */
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  emptySub: {
    color: "#888",
    fontSize: 13,
    marginTop: 6,
    textAlign: "center",
  },

  /* LIST */
  list: {
    paddingBottom: 30,
  },

  card: {
    width: width - 30,
    marginBottom: 18,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#111",
    alignSelf: "center",
  },

  image: {
    width: "100%",
    height: 180,
  },

  content: {
    padding: 14,
  },

  name: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
  },

  meta: {
    color: "#cbd5e1",
    marginTop: 4,
    marginBottom: 12,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  cookBtn: {
    backgroundColor: "#38bdf8",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },

  cookText: {
    color: "#000",
    fontWeight: "900",
  },

  removeBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ff4d4d",
    backgroundColor: "rgba(255,77,77,0.08)",
  },

  removeText: {
    color: "#ff4d4d",
    fontWeight: "800",
  },
});