<?php
header('Content-Type: application/json; charset=utf-8');
require_once '../config/config.php';
require_once '../classes/Article.php';

$article = new Article();

$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$category = isset($_GET['category']) && $_GET['category'] !== 'all' ? $_GET['category'] : null;
$search = isset($_GET['search']) ? trim($_GET['search']) : null;

try {
    $articles = $article->getAll($page, ITEMS_PER_PAGE, $category, $search);
    $total = $article->getCount($category, $search);
    $totalPages = ceil($total / ITEMS_PER_PAGE);
    
    // Format articles for frontend
    foreach ($articles as &$art) {
        if ($art['tags']) {
            $art['tags'] = json_decode($art['tags'], true);
        } else {
            $art['tags'] = [];
        }
        
        // Generate excerpt if not exists
        if (empty($art['excerpt'])) {
            $art['excerpt'] = mb_substr(strip_tags($art['content']), 0, 200) . '...';
        }
        
        // Format date
        $art['formatted_date'] = date('j F Y', strtotime($art['created_at']));
        
        // Default author image
        if (empty($art['author_image'])) {
            $art['author_image'] = 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150';
        }
    }
    
    echo json_encode([
        'success' => true,
        'articles' => $articles,
        'pagination' => [
            'current_page' => $page,
            'total_pages' => $totalPages,
            'total_items' => $total,
            'items_per_page' => ITEMS_PER_PAGE,
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