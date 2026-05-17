<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'db.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Nem vagy bejelentkezve.', 'tickets' => []]);
    exit;
}

$userId = $_SESSION['user_id'];

// GET: list tickets
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $pdo->prepare('
        SELECT j.ID, j.termek_nev, j.termek_leiras, j.ar, j.utas_nev, j.okmany_szam, j.qr_url, j.vasarlas_datum
        FROM Jegy j
        WHERE j.felhasznalo_id = ?
        ORDER BY j.vasarlas_datum DESC
    ');
    $stmt->execute([$userId]);
    $tickets = $stmt->fetchAll();
    echo json_encode(['success' => true, 'tickets' => $tickets]);
    exit;
}

// POST: save new ticket
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $termekNev    = trim($data['termekNev'] ?? '');
    $termekLeiras = trim($data['termekLeiras'] ?? '');
    $ar           = (int)($data['ar'] ?? 0);
    $utasNev      = trim($data['utasNev'] ?? '');
    $okmanySzam   = trim($data['okmanySzam'] ?? '');
    $qrUrl        = trim($data['qrUrl'] ?? '');

    if (!$termekNev || !$utasNev || !$okmanySzam) {
        echo json_encode(['success' => false, 'message' => 'Hiányzó adatok.']);
        exit;
    }

    $stmt = $pdo->prepare('
        INSERT INTO Jegy (felhasznalo_id, termek_nev, termek_leiras, ar, utas_nev, okmany_szam, qr_url, vasarlas_datum)
        VALUES (?, ?, ?, ?, ?, ?, ?, CURDATE())
    ');
    $stmt->execute([$userId, $termekNev, $termekLeiras, $ar, $utasNev, $okmanySzam, $qrUrl]);

    echo json_encode(['success' => true, 'message' => 'Jegy elmentve!']);
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Method not allowed']);
