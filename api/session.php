<?php
header('Content-Type: application/json');
session_start();
if (isset($_SESSION['user_id'])) {
    echo json_encode([
        'loggedIn' => true,
        'nev'      => $_SESSION['user_nev'],
        'email'    => $_SESSION['user_email']
    ]);
} else {
    echo json_encode(['loggedIn' => false]);
}
