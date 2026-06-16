import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/HomeScreen";
import RecipeScreen from "../screens/RecipeScreen";

const Stack = createNativeStackNavigator();

export default function RecipeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Recipe"
        component={RecipeScreen}
        options={{ title: "Recipe Details" }}
      />
    </Stack.Navigator>
  );
}