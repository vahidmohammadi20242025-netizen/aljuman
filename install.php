<?php
require_once 'config/config.php';

try {
    $pdo = new PDO("mysql:host=" . DB_HOST, DB_USER, DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Create database
    $pdo->exec("CREATE DATABASE IF NOT EXISTS " . DB_NAME . " CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    $pdo->exec("USE " . DB_NAME);
    
    // Create tables
    $sql = "
    CREATE TABLE IF NOT EXISTS site_settings (
        id INT PRIMARY KEY AUTO_INCREMENT,
        setting_key VARCHAR(100) UNIQUE NOT NULL,
        setting_value TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS categories (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        description TEXT,
        color VARCHAR(7) DEFAULT '#2563eb',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS authors (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(200) NOT NULL,
        email VARCHAR(200),
        bio TEXT,
        image VARCHAR(500),
        social_links JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS articles (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(500) NOT NULL,
        slug VARCHAR(500) UNIQUE NOT NULL,
        excerpt TEXT,
        content LONGTEXT NOT NULL,
        author_id INT,
        category_id INT,
        featured_image VARCHAR(500),
        tags JSON,
        status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
        views INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE SET NULL,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
        INDEX idx_status (status),
        INDEX idx_created_at (created_at),
        INDEX idx_category (category_id)
    );

    CREATE TABLE IF NOT EXISTS magazines (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(300) NOT NULL,
        description TEXT,
        cover_image VARCHAR(500),
        pdf_file VARCHAR(500),
        issue_number INT,
        month INT,
        year INT,
        downloads INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_year_month (year, month)
    );

    CREATE TABLE IF NOT EXISTS favorites (
        id INT PRIMARY KEY AUTO_INCREMENT,
        session_id VARCHAR(100) NOT NULL,
        article_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
        UNIQUE KEY unique_favorite (session_id, article_id)
    );

    CREATE TABLE IF NOT EXISTS admin_users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(200),
        role ENUM('admin', 'editor') DEFAULT 'admin',
        last_login TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    ";
    
    $pdo->exec($sql);
    
    // Insert default data
    $defaultData = "
    INSERT IGNORE INTO site_settings (setting_key, setting_value) VALUES
    ('site_name', 'مجله فرهنگی نور'),
    ('site_description', 'روشنایی دانش و فرهنگ در دنیای مدرن'),
    ('site_logo', ''),
    ('site_favicon', ''),
    ('primary_color', '#2563eb'),
    ('secondary_color', '#1e40af'),
    ('font_family', 'Vazirmatn'),
    ('social_telegram', ''),
    ('social_instagram', ''),
    ('social_twitter', ''),
    ('social_linkedin', ''),
    ('contact_email', 'info@example.com'),
    ('contact_phone', ''),
    ('footer_text', 'تمامی حقوق محفوظ است.');

    INSERT IGNORE INTO categories (name, slug, description, color) VALUES
    ('فناوری', 'technology', 'مقالات مربوط به فناوری و نوآوری', '#3b82f6'),
    ('هنر', 'art', 'مقالات هنری و فرهنگی', '#ec4899'),
    ('فرهنگ', 'culture', 'مقالات فرهنگی و اجتماعی', '#10b981'),
    ('علم', 'science', 'مقالات علمی و پژوهشی', '#f59e0b');

    INSERT IGNORE INTO authors (name, email, bio, image) VALUES
    ('دکتر علی محمدی', 'ali@example.com', 'دکترای ادبیات فارسی و نویسنده', 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=150'),
    ('مریم حسینی', 'maryam@example.com', 'کارشناس ارشد روزنامه‌نگاری', 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150'),
    ('پروفسور رضا کریمی', 'reza@example.com', 'استاد تاریخ', 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150');

    INSERT IGNORE INTO admin_users (username, password, email) VALUES
    ('admin', '" . password_hash('admin123', PASSWORD_DEFAULT) . "', 'admin@example.com');
    ";
    
    $pdo->exec($defaultData);
    
    echo "<!DOCTYPE html>
    <html lang='fa' dir='rtl'>
    <head>
        <meta charset='UTF-8'>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
        <title>نصب موفق</title>
        <style>
            body { font-family: Tahoma; text-align: center; padding: 50px; background: #f0f0f0; }
            .success { background: white; padding: 30px; border-radius: 10px; max-width: 500px; margin: 0 auto; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .btn { background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px; }
        </style>
    </head>
    <body>
        <div class='success'>
            <h2>✅ نصب با موفقیت انجام شد!</h2>
            <p>پایگاه داده و جداول با موفقیت ایجاد شدند.</p>
            <p><strong>اطلاعات ورود مدیر:</strong></p>
            <p>نام کاربری: admin</p>
            <p>رمز عبور: admin123</p>
            <a href='index.php' class='btn'>مشاهده سایت</a>
            <a href='admin/' class='btn'>ورود به پنل مدیریت</a>
        </div>
    </body>
    </html>";
    
} catch(PDOException $e) {
    echo "خطا در نصب: " . $e->getMessage();
}
?>