<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "", "aichef_db");

$email = $_POST['email'];
$password = $_POST['password'];

$result = $conn->query("SELECT * FROM users WHERE email='$email'");

if ($result->num_rows > 0) {
  $user = $result->fetch_assoc();

  if (password_verify($password, $user['password'])) {

    // 🔐 SIMPLE TOKEN (upgrade to JWT later)
    $token = bin2hex(random_bytes(32));

    // optional: store token in DB (recommended)
    $conn->query("
      UPDATE users 
      SET token='$token' 
      WHERE id={$user['id']}
    ");

    echo json_encode([
      "success" => true,
      "user" => [
        "id" => $user['id'],
        "username" => $user['username'],
        "email" => $user['email'],
        "token" => $token
      ]
    ]);

  } else {
    echo json_encode([
      "success" => false,
      "message" => "Wrong password"
    ]);
  }

} else {
  echo json_encode([
    "success" => false,
    "message" => "User not found"
  ]);
}
?>