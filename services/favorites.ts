import AsyncStorage from "@react-native-async-storage/async-storage";

const FAVORITES_KEY = "@favorites_recipes";

/* ================= GET FAVORITES ================= */
export const getFavorites = async (): Promise<any[]> => {
  try {
    const data = await AsyncStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.log("GET FAVORITES ERROR:", error);
    return [];
  }
};

/* ================= SAVE FAVORITES ================= */
export const saveFavorites = async (favorites: any[]) => {
  try {
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.log("SAVE FAVORITES ERROR:", error);
  }
};

/* ================= TOGGLE FAVORITE ================= */
export const toggleFavorite = async (recipe: any) => {
  try {
    const favorites = await getFavorites();

    const exists = favorites.some(
      (item: any) => Number(item.id) === Number(recipe.id)
    );

    let updated;

    if (exists) {
      updated = favorites.filter(
        (item: any) => Number(item.id) !== Number(recipe.id)
      );
    } else {
      updated = [...favorites, recipe];
    }

    await saveFavorites(updated);
    return updated;
  } catch (error) {
    console.log("TOGGLE FAVORITE ERROR:", error);
    return [];
  }
};

/* ================= REMOVE FAVORITE ================= */
export const removeFavorite = async (id: number) => {
  try {
    const favorites = await getFavorites();

    const updated = favorites.filter(
      (item: any) => Number(item.id) !== Number(id)
    );

    await saveFavorites(updated);
    return updated;
  } catch (error) {
    console.log("REMOVE FAVORITE ERROR:", error);
    return [];
  }
};