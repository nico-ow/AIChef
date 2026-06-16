import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeScreen from "../screens/HomeScreen";
import FavoritesScreen from "../screens/FavoritesScreen";

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#0b0f14",
          borderTopColor: "#111",
          height: 60
        },
        tabBarActiveTintColor: "#38bdf8",
        tabBarInactiveTintColor: "gray"
      }}
    >

      {/* 🏠 HOME */}
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: "Home" }}
      />

      {/* ❤️ FAVORITES */}
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{ tabBarLabel: "Saved" }}
      />

    </Tab.Navigator>
  );
}