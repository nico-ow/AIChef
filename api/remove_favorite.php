<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

$conn = new mysqli("localhost", "root", "", "aichef_db");

$user_id = $_POST['user_id'];
$recipe_id = $_POST['recipe_id'];

$conn->query("
  DELETE FROM favorites 
  WHERE user_id=$user_id AND recipe_id=$recipe_id
");

echo json_encode(["success" => true]);
?>