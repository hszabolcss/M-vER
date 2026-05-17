<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$nev      = trim($data['nev'] ?? '');
$email    = trim($data['email'] ?? '');
$jelszo   = $data['jelszo'] ?? '';

if (!$nev || !$email || !$jelszo) {
    echo json_encode(['success' => false, 'message' => 'Minden mező kitöltése kötelező.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Érvénytelen e-mail cím.']);
    exit;
}

if (strlen($jelszo) < 8) {
    echo json_encode(['success' => false, 'message' => 'A jelszónak legalább 8 karakternek kell lennie.']);
    exit;
}

// Check if email already exists
$stmt = $pdo->prepare('SELECT ID FROM Felhasznalo WHERE email = ?');
$stmt->execute([$email]);
if ($stmt->fetch()) {
    echo json_encode(['success' => false, 'message' => 'Ez az e-mail cím már foglalt.']);
    exit;
}

$hash = password_hash($jelszo, PASSWORD_BCRYPT);

$stmt = $pdo->prepare('INSERT INTO Felhasznalo (nev, email, jelszo_hash) VALUES (?, ?, ?)');
$stmt->execute([$nev, $email, $hash]);
$userId = $pdo->lastInsertId();

session_start();
$_SESSION['user_id'] = $userId;
$_SESSION['user_nev'] = $nev;
$_SESSION['user_email'] = $email;

echo json_encode(['success' => true, 'message' => 'Sikeres regisztráció!', 'nev' => $nev]);
