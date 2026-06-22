<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "", "aichef_db");

if ($conn->connect_error) {
    echo json_encode([
        "success" => false,
        "message" => "DB connection failed"
    ]);
    exit();
}

$title = $_POST['title'] ?? '';
$time = $_POST['time'] ?? '';
$difficulty = $_POST['difficulty'] ?? '';
$ingredients = $_POST['ingredients'] ?? '';
$instructions = $_POST['instructions'] ?? '';
$image = $_POST['image'] ?? '';

if (!$title || !$image) {
    echo json_encode([
        "success" => false,
        "message" => "Missing fields"
    ]);
    exit();
}

/* CREATE UPLOAD FOLDER IF NOT EXISTS */
$uploadDir = "../uploads/";

if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

/* GENERATE IMAGE NAME */
$imageName = time() . "_" . rand(1000, 9999) . ".jpg";
$filePath = $uploadDir . $imageName;

/* CLEAN BASE64 (IMPORTANT FIX) */
$image = str_replace('data:image/jpeg;base64,', '', $image);
$image = str_replace('data:image/png;base64,', '', $image);
$image = str_replace(' ', '+', $image);

/* SAVE IMAGE */
file_put_contents($filePath, base64_decode($image));

/* FINAL URL PATH (IMPORTANT FIX FOR FRONTEND) */
$finalPath = "uploads/" . $imageName;

/* INSERT INTO DB */
$stmt = $conn->prepare("
    INSERT INTO recipes 
    (title, time, difficulty, ingredients, instructions, image)
    VALUES (?, ?, ?, ?, ?, ?)
");

$stmt->bind_param(
    "ssssss",
    $title,
    $time,
    $difficulty,
    $ingredients,
    $instructions,
    $finalPath
);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Recipe uploaded",
        "image" => $finalPath
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Insert failed"
    ]);
}
?>