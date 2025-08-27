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

$article = new Article();

$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 20;
$search = isset($_GET['search']) ? trim($_GET['search']) : '';
$categoryFilter = isset($_GET['category']) ? (int)$_GET['category'] : null;

try {
    $articles = $article->getAllForAdmin($page, $limit, $search, $categoryFilter);
    $total = $article->getAdminCount($search, $categoryFilter);
    $totalPages = ceil($total / $limit);
    
    // Format articles for admin panel
    foreach ($articles as &$art) {
        if ($art['tags']) {
            $art['tags'] = json_decode($art['tags'], true);
        } else {
            $art['tags'] = [];
        }
    }
    
    echo json_encode([
        'success' => true,
        'articles' => $articles,
        'pagination' => [
            'current_page' => $page,
            'total_pages' => $totalPages,
            'total_items' => $total,
            'items_per_page' => $limit,
            'has_next' => $page < $totalPages,
            'has_prev' => $page > 1
        ]
    ], JSON_UNESCAPED_UNICODE);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => 'خطا در دریافت مقالات'
    ], JSON_UNESCAPED_UNICODE);
}
?>