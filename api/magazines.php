<?php
header('Content-Type: application/json; charset=utf-8');
require_once '../config/config.php';
require_once '../classes/Magazine.php';

$magazine = new Magazine();

try {
    $magazines = $magazine->getAll();
    
    // Format magazines for frontend
    foreach ($magazines as &$mag) {
        $mag['month_name'] = $magazine->getMonthName($mag['month']);
    }
    
    echo json_encode([
        'success' => true,
        'magazines' => $magazines
    ], JSON_UNESCAPED_UNICODE);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => 'خطا در دریافت مجلات'
    ], JSON_UNESCAPED_UNICODE);
}
?>