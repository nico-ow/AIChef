<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$conn = new mysqli("localhost","root","","aichef_db");

$user_id = $_GET["user_id"] ?? 0;

$sql = "
SELECT r.*
FROM recipes r
INNER JOIN favorites f
ON r.id = f.recipe_id
WHERE f.user_id = '$user_id'
ORDER BY f.created_at DESC
";

$result = $conn->query($sql);

$data = [];

while($row = $result->fetch_assoc()){
    $data[] = $row;
}

echo json_encode($data);
?>