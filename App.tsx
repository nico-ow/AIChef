import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, View } from "react-native";

import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import RecipeScreen from "./screens/RecipeScreen";
import BottomTabs from "./navigation/BottomTabs";

import { RootStackParamList } from "./types/navigation";
import { getSessionUser } from "./services/auth";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    const session = await getSessionUser();
    setUser(session);
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#38bdf8" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>

        {/* AUTH STACK */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />

        {/* MAIN APP (BOTTOM TABS) */}
        <Stack.Screen name="Main" component={BottomTabs} />

        {/* MODAL / DETAIL SCREEN */}
        <Stack.Screen name="Recipe" component={RecipeScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}