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
  const [initialRoute, setInitialRoute] =
    useState<keyof RootStackParamList>("Login");

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const session = await getSessionUser();

      if (session) {
        setInitialRoute("Main");
      } else {
        setInitialRoute("Login");
      }
    } catch (error) {
      console.log("SESSION ERROR:", error);
      setInitialRoute("Login");
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#000",
        }}
      >
        <ActivityIndicator
          size="large"
          color="#38bdf8"
        />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
        />

        <Stack.Screen
          name="Register"
          component={RegisterScreen}
        />

        <Stack.Screen
          name="Main"
          component={BottomTabs}
        />

        <Stack.Screen
          name="Recipe"
          component={RecipeScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}