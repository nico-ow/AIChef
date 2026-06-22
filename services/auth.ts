import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://192.168.254.110/AIChef/api";
const SESSION_KEY = "session_user";

/* ================= REGISTER ================= */
export async function registerUser(
  username: string,
  email: string,
  password: string
) {
  try {
    const formBody = new URLSearchParams();
    formBody.append("username", username);
    formBody.append("email", email);
    formBody.append("password", password);

    const res = await fetch(`${API_URL}/register.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formBody.toString(),
    });

    const data = await res.json();
    console.log("REGISTER RESPONSE:", data);

    return data;
  } catch (err) {
    console.log("REGISTER ERROR:", err);
    return {
      success: false,
      message: "Network error",
    };
  }
}

/* ================= LOGIN ================= */
export async function loginUser(email: string, password: string) {
  try {
    const formBody = new URLSearchParams();
    formBody.append("email", email);
    formBody.append("password", password);

    const res = await fetch(`${API_URL}/login.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formBody.toString(),
    });

    const data = await res.json();
    console.log("LOGIN RESPONSE:", data);

    if (data.success) {
      await AsyncStorage.setItem(
        SESSION_KEY,
        JSON.stringify(data.user)
      );
    }

    return data;
  } catch (err) {
    console.log("LOGIN ERROR:", err);
    return {
      success: false,
      message: "Network error",
    };
  }
}

/* ================= SESSION ================= */
export async function getSessionUser() {
  try {
    const data = await AsyncStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.log("SESSION ERROR:", err);
    return null;
  }
}

/* ================= LOGOUT ================= */
export async function logoutUser() {
  try {
    await AsyncStorage.removeItem(SESSION_KEY);
    return { success: true };
  } catch (err) {
    console.log("LOGOUT ERROR:", err);
    return { success: false };
  }
}