<?php
// Database configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'persian_magazine');
define('DB_USER', 'root');
define('DB_PASS', '');

// Site configuration
define('SITE_URL', 'http://localhost');
define('ADMIN_EMAIL', 'admin@example.com');
define('ITEMS_PER_PAGE', 9);

// Upload directories
define('UPLOAD_DIR', 'uploads/');
define('AUTHOR_IMAGES_DIR', UPLOAD_DIR . 'authors/');
define('MAGAZINE_COVERS_DIR', UPLOAD_DIR . 'magazines/');
define('MAGAZINE_FILES_DIR', UPLOAD_DIR . 'pdf/');

// Create upload directories if they don't exist
if (!file_exists(UPLOAD_DIR)) mkdir(UPLOAD_DIR, 0755, true);
if (!file_exists(AUTHOR_IMAGES_DIR)) mkdir(AUTHOR_IMAGES_DIR, 0755, true);
if (!file_exists(MAGAZINE_COVERS_DIR)) mkdir(MAGAZINE_COVERS_DIR, 0755, true);
if (!file_exists(MAGAZINE_FILES_DIR)) mkdir(MAGAZINE_FILES_DIR, 0755, true);

// Start session
session_start();
?>