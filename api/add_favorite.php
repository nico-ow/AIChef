<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

$conn = new mysqli("localhost", "root", "", "aichef_db");

$user_id = $_POST['user_id'];
$recipe_id = $_POST['recipe_id'];

// check if exists
$check = $conn->query("
  SELECT * FROM favorites 
  WHERE user_id=$user_id AND recipe_id=$recipe_id
");

if ($check->num_rows > 0) {
  echo json_encode(["success" => false, "message" => "Already saved"]);
  exit;
}

$conn->query("
  INSERT INTO favorites (user_id, recipe_id)
  VALUES ($user_id, $recipe_id)
");

echo json_encode(["success" => true]);
?>