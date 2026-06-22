<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

$conn = new mysqli("localhost", "root", "", "aichef_db");

$user_id = $_GET['user_id'];

$result = $conn->query("
  SELECT recipes.*
  FROM favorites
  JOIN recipes ON recipes.id = favorites.recipe_id
  WHERE favorites.user_id = $user_id
");

$data = [];

while ($row = $result->fetch_assoc()) {
  $data[] = $row;
}

echo json_encode($data);
?>