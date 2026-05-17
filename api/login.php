<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'db.php';
session_start();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$data  = json_decode(file_get_contents('php://input'), true);
$email  = trim($data['email'] ?? '');
$jelszo = $data['jelszo'] ?? '';

if (!$email || !$jelszo) {
    echo json_encode(['success' => false, 'message' => 'Töltsd ki az összes mezőt.']);
    exit;
}

$stmt = $pdo->prepare('SELECT ID, nev, email, jelszo_hash FROM Felhasznalo WHERE email = ?');
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user || !password_verify($jelszo, $user['jelszo_hash'])) {
    echo json_encode(['success' => false, 'message' => 'Hibás e-mail cím vagy jelszó.']);
    exit;
}

$_SESSION['user_id']    = $user['ID'];
$_SESSION['user_nev']   = $user['nev'];
$_SESSION['user_email'] = $user['email'];

echo json_encode(['success' => true, 'message' => 'Sikeres bejelentkezés!', 'nev' => $user['nev']]);
