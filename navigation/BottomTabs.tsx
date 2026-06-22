import React, { useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import UploadScreen from "../screens/UploadScreen";

import HomeScreen from "../screens/HomeScreen";
import FavoritesScreen from "../screens/FavoritesScreen";

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  const [saved, setSaved] = useState<number[]>([]);

  const toggleSave = (id: number) => {
    setSaved((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  };

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,

        tabBarStyle: {
          backgroundColor: "#0b0f14",
          borderTopColor: "#111",
          height: 60,
        },

        tabBarActiveTintColor: "#38bdf8",
        tabBarInactiveTintColor: "gray",
      }}
    >

      {/* HOME */}
      <Tab.Screen
        name="Home"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.iconBox,
                focused && styles.activeBox,
              ]}
            >
              <Ionicons
                name="home"
                size={19} // 👈 slightly smaller
                color={color}
                style={styles.iconShift} // 👈 lower icon
              />
            </View>
          ),
        }}
      >
        {(props) => (
          <HomeScreen {...props} saved={saved} toggleSave={toggleSave} />
        )}
      </Tab.Screen>

      <Tab.Screen
  name="Upload"
  component={UploadScreen}
  options={{
    tabBarIcon: ({ color }) => (
      <Ionicons
        name="add-circle"
        size={22}
        color={color}
      />
    ),
  }}
/>

      {/* FAVORITES */}
      <Tab.Screen
        name="Favorites"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.iconBox,
                focused && styles.activeBox,
              ]}
            >
              <Ionicons
                name="heart"
                size={19} // 👈 same fix
                color={color}
                style={styles.iconShift}
              />
            </View>
          ),
        }}
      >
        {(props) => (
          <FavoritesScreen {...props} saved={saved} toggleSave={toggleSave} />
        )}
      </Tab.Screen>

    </Tab.Navigator>
  );
}

/* ================= FIXED STYLES ================= */

const styles = StyleSheet.create({
  iconBox: {
    width: 38,          // 👈 smaller box
    height: 38,         // 👈 lower vertical footprint
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  activeBox: {
    backgroundColor: "rgba(56,189,248,0.15)",
  },

  iconShift: {
    transform: [{ translateY: 1 }], // 👈 lowers icon slightly
  },
});