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

$article = new Article();

try {
    $title = trim($_POST['title'] ?? '');
    $slug = trim($_POST['slug'] ?? '');
    $content = trim($_POST['content'] ?? '');
    $excerpt = trim($_POST['excerpt'] ?? '');
    $authorId = (int)($_POST['author_id'] ?? 0);
    $categoryId = (int)($_POST['category_id'] ?? 0);
    $status = $_POST['status'] ?? 'draft';
    $featuredImage = trim($_POST['featured_image'] ?? '');
    $tags = trim($_POST['tags'] ?? '');
    
    // Validation
    if (empty($title)) {
        throw new Exception('عنوان مقاله الزامی است');
    }
    
    if (empty($content)) {
        throw new Exception('متن مقاله الزامی است');
    }
    
    if ($authorId <= 0) {
        throw new Exception('انتخاب نویسنده الزامی است');
    }
    
    if ($categoryId <= 0) {
        throw new Exception('انتخاب دسته‌بندی الزامی است');
    }
    
    // Generate slug if not provided
    if (empty($slug)) {
        $slug = $article->generateSlug($title);
    } else {
        $slug = $article->generateSlug($slug);
    }
    
    // Generate excerpt if not provided
    if (empty($excerpt)) {
        $excerpt = mb_substr(strip_tags($content), 0, 200) . '...';
    }
    
    // Process tags
    $tagsArray = [];
    if (!empty($tags)) {
        $tagsArray = array_map('trim', explode(',', $tags));
        $tagsArray = array_filter($tagsArray);
    }
    
    $articleData = [
        'title' => $title,
        'slug' => $slug,
        'excerpt' => $excerpt,
        'content' => $content,
        'author_id' => $authorId,
        'category_id' => $categoryId,
        'featured_image' => $featuredImage,
        'tags' => json_encode($tagsArray, JSON_UNESCAPED_UNICODE),
        'status' => $status
    ];
    
    $result = $article->create($articleData);
    
    if ($result) {
        echo json_encode([
            'success' => true,
            'message' => 'مقاله با موفقیت اضافه شد'
        ], JSON_UNESCAPED_UNICODE);
    } else {
        throw new Exception('خطا در ذخیره مقاله');
    }
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
?>