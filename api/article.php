<?php
header('Content-Type: application/json; charset=utf-8');
require_once '../config/config.php';
require_once '../classes/Article.php';

if (!isset($_GET['id'])) {
    echo json_encode(['success' => false, 'error' => 'شناسه مقاله مشخص نشده'], JSON_UNESCAPED_UNICODE);
    exit;
}

$article = new Article();
$articleData = $article->getById($_GET['id']);

if ($articleData) {
    // Format date
    $articleData['formatted_date'] = date('j F Y', strtotime($articleData['created_at']));
    
    // Default author image
    if (empty($articleData['author_image'])) {
        $articleData['author_image'] = 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150';
    }
    
    echo json_encode([
        'success' => true,
        'article' => $articleData
    ], JSON_UNESCAPED_UNICODE);
} else {
    echo json_encode([
        'success' => false,
        'error' => 'مقاله یافت نشد'
    ], JSON_UNESCAPED_UNICODE);
}
?>