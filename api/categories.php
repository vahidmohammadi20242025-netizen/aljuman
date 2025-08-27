<?php
header('Content-Type: application/json; charset=utf-8');
require_once '../config/config.php';
require_once '../classes/Category.php';

$category = new Category();

try {
    $categories = $category->getAll();
    
    echo json_encode([
        'success' => true,
        'categories' => $categories
    ], JSON_UNESCAPED_UNICODE);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => 'خطا در دریافت دسته‌بندی‌ها'
    ], JSON_UNESCAPED_UNICODE);
}
?>