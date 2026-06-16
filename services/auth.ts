import AsyncStorage from "@react-native-async-storage/async-storage";

const USERS_KEY = "users";
const SESSION_KEY = "session_user";

// 👤 USER TYPE
type User = {
  email: string;
  password: string;
};

// 🔐 REGISTER
export async function registerUser(email: string, password: string) {
  const users: User[] = await getUsers();

  const exists = users.find((u: User) => u.email === email);
  if (exists) return { success: false, message: "User already exists" };

  const newUser: User = { email, password };

  await AsyncStorage.setItem(
    USERS_KEY,
    JSON.stringify([...users, newUser])
  );

  return { success: true };
}

// 🔑 LOGIN
export async function loginUser(email: string, password: string) {
  const users: User[] = await getUsers();

  const user = users.find(
    (u: User) => u.email === email && u.password === password
  );

  if (!user) {
    return { success: false, message: "Invalid credentials" };
  }

  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(user));

  return { success: true, user };
}

// 🚪 LOGOUT
export async function logoutUser() {
  await AsyncStorage.removeItem(SESSION_KEY);
}

// 👤 GET SESSION USER
export async function getSessionUser() {
  const data = await AsyncStorage.getItem(SESSION_KEY);
  return data ? JSON.parse(data) : null;
}

// 📦 GET USERS
async function getUsers(): Promise<User[]> {
  const data = await AsyncStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
}