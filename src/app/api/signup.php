<?php
header('Content-Type: application/json');
require 'db.php';

$data = json_decode(file_get_contents('php://input'), true);
$nickname = $data['nickname'] ?? '';
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

if (!$nickname || !$email || !$password) {
    echo json_encode(['success' => false, 'message' => 'All fields required']);
    exit;
}

// Check if email exists
$stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
$stmt->execute([$email]);
if ($stmt->fetch()) {
    echo json_encode(['success' => false, 'message' => 'Email already registered']);
    exit;
}

// Hash password
$hash = password_hash($password, PASSWORD_DEFAULT);

// Insert user
$stmt = $pdo->prepare("INSERT INTO users (nickname, email, password) VALUES (?, ?, ?)");
if ($stmt->execute([$nickname, $email, $hash])) {
    echo json_encode(['success' => true, 'message' => 'Signup successful']);
} else {
    echo json_encode(['success' => false, 'message' => 'Signup failed']);
}
