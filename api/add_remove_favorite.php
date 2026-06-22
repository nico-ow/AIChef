<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "", "aichef_db");

$user_id = $_POST['user_id'];
$recipe_id = $_POST['recipe_id'];

$check = $conn->query("
  SELECT * FROM favorites 
  WHERE user_id=$user_id AND recipe_id=$recipe_id
");

if ($check->num_rows > 0) {
    // REMOVE
    $conn->query("
      DELETE FROM favorites 
      WHERE user_id=$user_id AND recipe_id=$recipe_id
    ");

    echo json_encode(["action" => "removed"]);
} else {
    // ADD
    $conn->query("
      INSERT INTO favorites (user_id, recipe_id)
      VALUES ($user_id, $recipe_id)
    ");

    echo json_encode(["action" => "added"]);
}
?>