<?php
session_start();
header('Content-Type: application/json; charset=utf-8');

// Check admin authentication
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    echo json_encode(['success' => false, 'error' => 'غیر مجاز'], JSON_UNESCAPED_UNICODE);
    exit;
}

require_once '../../config/config.php';
require_once '../../classes/Article.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'error' => 'متد نامعتبر'], JSON_UNESCAPED_UNICODE);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$articleId = (int)($input['id'] ?? 0);

if ($articleId <= 0) {
    echo json_encode(['success' => false, 'error' => 'شناسه مقاله نامعتبر'], JSON_UNESCAPED_UNICODE);
    exit;
}

$article = new Article();

try {
    $result = $article->delete($articleId);
    
    if ($result) {
        echo json_encode([
            'success' => true,
            'message' => 'مقاله با موفقیت حذف شد'
        ], JSON_UNESCAPED_UNICODE);
    } else {
        throw new Exception('خطا در حذف مقاله');
    }
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
?>