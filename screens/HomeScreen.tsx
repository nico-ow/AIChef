import { API_URL, BASE_URL } from "../config/api";
import React, { useEffect, useState, useRef } from "react";
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
  Animated,
  Pressable,
} from "react-native";

import { logoutUser } from "../services/auth";
import { getFavorites, toggleFavorite } from "../services/favorites";

const { width, height } = Dimensions.get("window");

export default function HomeScreen({ navigation }: any) {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState<number[]>([]);

  const lastTap = useRef(0);

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const showHeart = () => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(300),
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  const fetchRecipes = async () => {
    try {
      const res = await fetch(`${API_URL}/get_recipes.php`);
      const data = await res.json();
      setRecipes(data || []);
    } catch (err) {
      console.log("FETCH ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    const favs = await getFavorites();
    setSaved((favs || []).map((x: any) => Number(x.id)));
  };

  useEffect(() => {
    fetchRecipes();
    loadFavorites();
  }, []);

  const handleToggleFavorite = async (item: any) => {
    const updated = await toggleFavorite(item);
    setSaved((updated || []).map((x: any) => Number(x.id)));
  };

  const handleTap = (item: any) => {
    const now = Date.now();

    if (now - lastTap.current < 300) {
      handleToggleFavorite(item);
      showHeart();
    }

    lastTap.current = now;
  };

  const handleLogout = async () => {
    await logoutUser();
    navigation.replace("Login");
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#38bdf8" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* HEART ANIMATION */}
      <Animated.View
        style={[
          styles.heartPopup,
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        <Text style={{ fontSize: 80 }}>❤️</Text>
      </Animated.View>

      {/* TOP BAR */}
      <View style={styles.topBar}>
        <Text style={styles.brand}>PIC DISH</Text>

        <View style={styles.topActions}>
          <TouchableOpacity onPress={() => navigation.navigate("Favorites")}>
            <Text style={styles.favText}>❤️</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.logoutText}>⎋</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* FEED */}
      <FlatList
        data={recipes}
        keyExtractor={(item) => String(item.id)}
        pagingEnabled
        snapToInterval={height}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const isSaved = saved.includes(Number(item.id));

          return (
            <Pressable onPress={() => handleTap(item)} style={styles.card}>
              
              {/* ✅ FIXED IMAGE PATH */}
              <Image
                source={{
                  uri: item.image
                    ? `${BASE_URL}/${item.image}`
                    : "https://via.placeholder.com/500",
                }}
                style={styles.image}
              />

              <View style={styles.overlay} />

              <View style={styles.content}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.meta}>
                  ⏱ {item.time} • 🔥 {item.difficulty}
                </Text>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity onPress={() => handleToggleFavorite(item)}>
                  <Text style={{ fontSize: 26 }}>
                    {isSaved ? "❤️" : "🤍"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("Recipe", {
                      recipe: item,
                      mode: "cook",
                    })
                  }
                >
                  <Text style={{ fontSize: 22 }}>🍳</Text>
                </TouchableOpacity>
              </View>
            </Pressable>
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
    backgroundColor: "#000",
  },

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },

  topBar: {
    position: "absolute",
    top: 60,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    alignItems: "center",
    zIndex: 10,
  },

  brand: {
    color: "#38bdf8",
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 2,
  },

  topActions: {
    flexDirection: "row",
    gap: 18,
  },

  favText: {
    color: "#fff",
    fontSize: 22,
  },

  logoutText: {
    color: "#fff",
    fontSize: 22,
  },

  card: {
    width,
    height,
  },

  image: {
    width: "100%",
    height: "100%",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
  },

  content: {
    position: "absolute",
    bottom: 120,
    left: 20,
  },

  title: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "800",
  },

  meta: {
    color: "#ddd",
    marginTop: 5,
  },

  actions: {
    position: "absolute",
    right: 20,
    bottom: 140,
    gap: 18,
    alignItems: "center",
  },

  heartPopup: {
    position: "absolute",
    top: "40%",
    left: "40%",
    zIndex: 100,
  },
});