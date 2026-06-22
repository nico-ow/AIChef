<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "", "aichef_db");

if ($conn->connect_error) {
    echo json_encode(["error" => "DB connection failed"]);
    exit();
}

$result = $conn->query("SELECT * FROM recipes ORDER BY id DESC");

$recipes = [];

while ($row = $result->fetch_assoc()) {
    $recipes[] = $row;
}

echo json_encode($recipes);
?>