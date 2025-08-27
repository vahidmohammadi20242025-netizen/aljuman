<?php
session_start();
header('Content-Type: application/json; charset=utf-8');

// Check admin authentication
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    echo json_encode(['success' => false, 'error' => 'غیر مجاز'], JSON_UNESCAPED_UNICODE);
    exit;
}

require_once '../../config/config.php';
require_once '../../classes/SiteSettings.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'error' => 'متد نامعتبر'], JSON_UNESCAPED_UNICODE);
    exit;
}

$settings = new SiteSettings();

try {
    $settingsData = [
        'site_name' => trim($_POST['site_name'] ?? ''),
        'site_description' => trim($_POST['site_description'] ?? ''),
        'site_logo' => trim($_POST['site_logo'] ?? ''),
        'site_favicon' => trim($_POST['site_favicon'] ?? ''),
        'primary_color' => trim($_POST['primary_color'] ?? '#2563eb'),
        'secondary_color' => trim($_POST['secondary_color'] ?? '#1e40af'),
        'font_family' => trim($_POST['font_family'] ?? 'Vazirmatn'),
        'social_telegram' => trim($_POST['social_telegram'] ?? ''),
        'social_instagram' => trim($_POST['social_instagram'] ?? ''),
        'social_twitter' => trim($_POST['social_twitter'] ?? ''),
        'social_linkedin' => trim($_POST['social_linkedin'] ?? ''),
        'contact_email' => trim($_POST['contact_email'] ?? ''),
        'contact_phone' => trim($_POST['contact_phone'] ?? ''),
        'footer_text' => trim($_POST['footer_text'] ?? '')
    ];
    
    $result = $settings->updateMultiple($settingsData);
    
    if ($result) {
        echo json_encode([
            'success' => true,
            'message' => 'تنظیمات با موفقیت ذخیره شد'
        ], JSON_UNESCAPED_UNICODE);
    } else {
        throw new Exception('خطا در ذخیره تنظیمات');
    }
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
?>