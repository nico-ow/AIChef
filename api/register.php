<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$conn = new mysqli("localhost", "root", "", "aichef_db");

// ❌ CHECK DB CONNECTION
if ($conn->connect_error) {
  echo json_encode([
    "success" => false,
    "message" => "Database connection failed"
  ]);
  exit;
}

// ✅ SAFE INPUT (prevents undefined errors)
$username = $_POST['username'] ?? '';
$email = $_POST['email'] ?? '';
$passwordRaw = $_POST['password'] ?? '';

// ❌ VALIDATION
if (!$username || !$email || !$passwordRaw) {
  echo json_encode([
    "success" => false,
    "message" => "Missing fields"
  ]);
  exit;
}

// 🔍 CHECK DUPLICATE EMAIL (SAFE)
$check = $conn->prepare("SELECT id FROM users WHERE email = ?");
$check->bind_param("s", $email);
$check->execute();
$result = $check->get_result();

if ($result->num_rows > 0) {
  echo json_encode([
    "success" => false,
    "message" => "Email already exists"
  ]);
  exit;
}

// 🔐 HASH PASSWORD
$password = password_hash($passwordRaw, PASSWORD_BCRYPT);

// 💾 INSERT USER (SAFE SQL)
$stmt = $conn->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $username, $email, $password);

if ($stmt->execute()) {
  echo json_encode([
    "success" => true,
    "message" => "User created"
  ]);
} else {
  echo json_encode([
    "success" => false,
    "message" => "Insert failed"
  ]);
}

$conn->close();
?>