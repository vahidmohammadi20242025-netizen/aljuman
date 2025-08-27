<?php
require_once 'config/config.php';
require_once 'classes/SiteSettings.php';
require_once 'classes/Category.php';

$settings = new SiteSettings();
$category = new Category();

$siteSettings = $settings->getAll();
$categories = $category->getAll();
?>
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($siteSettings['site_name'] ?? 'مجله فرهنگی نور'); ?></title>
    <meta name="description" content="<?php echo htmlspecialchars($siteSettings['site_description'] ?? 'روشنایی دانش و فرهنگ در دنیای مدرن'); ?>">
    
    <?php if (!empty($siteSettings['site_favicon'])): ?>
    <link rel="icon" href="<?php echo htmlspecialchars($siteSettings['site_favicon']); ?>">
    <?php endif; ?>
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=<?php echo urlencode($siteSettings['font_family'] ?? 'Vazirmatn'); ?>:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <style>
        :root {
            --primary-color: <?php echo $siteSettings['primary_color'] ?? '#2563eb'; ?>;
            --secondary-color: <?php echo $siteSettings['secondary_color'] ?? '#1e40af'; ?>;
            --font-family: '<?php echo $siteSettings['font_family'] ?? 'Vazirmatn'; ?>', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        body {
            font-family: var(--font-family);
        }
    </style>
</head>
<body>
    <!-- Header -->
    <header class="header">
        <div class="container">
            <div class="header-content">
                <div class="logo">
                    <?php if (!empty($siteSettings['site_logo'])): ?>
                        <img src="<?php echo htmlspecialchars($siteSettings['site_logo']); ?>" alt="<?php echo htmlspecialchars($siteSettings['site_name']); ?>" class="logo-img">
                    <?php else: ?>
                        <h1><?php echo htmlspecialchars($siteSettings['site_name'] ?? 'مجله فرهنگی نور'); ?></h1>
                    <?php endif; ?>
                </div>
                
                <nav class="header-menu">
                    <ul class="header-menu-list">
                        <li><a href="#home" class="header-menu-link active">صفحه اصلی</a></li>
                        <li><a href="#about" class="header-menu-link">درباره ما</a></li>
                        <li><a href="#magazine" class="header-menu-link">آرشیو مجله</a></li>
                    </ul>
                </nav>

                <div class="header-controls">
                    <div class="search-container">
                        <input type="text" id="searchInput" placeholder="جستجو در مقالات...">
                        <i class="fas fa-search search-icon"></i>
                    </div>
                    <button id="darkModeToggle" class="theme-toggle">
                        <i class="fas fa-moon"></i>
                    </button>
                    <a href="admin/" class="admin-link" title="پنل مدیریت">
                        <i class="fas fa-cog"></i>
                    </a>
                </div>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="main">
        <div class="container">
            <!-- Hero Banner -->
            <section class="hero-banner">
                <div class="hero-content">
                    <h1 class="hero-title"><?php echo htmlspecialchars($siteSettings['site_name'] ?? 'مجله فرهنگی نور'); ?></h1>
                    <p class="hero-subtitle"><?php echo htmlspecialchars($siteSettings['site_description'] ?? 'روشنایی دانش و فرهنگ در دنیای مدرن'); ?></p>
                </div>
                <div class="hero-overlay"></div>
            </section>

            <!-- Filter Bar -->
            <section class="filter-bar">
                <div class="filter-categories">
                    <ul class="filter-category-list">
                        <li><a href="#" data-category="all" class="filter-btn active">همه مقالات</a></li>
                        <?php foreach ($categories as $cat): ?>
                        <li><a href="#" data-category="<?php echo htmlspecialchars($cat['slug']); ?>" class="filter-btn" style="--category-color: <?php echo htmlspecialchars($cat['color']); ?>"><?php echo htmlspecialchars($cat['name']); ?></a></li>
                        <?php endforeach; ?>
                        <li><a href="#favorites" class="filter-btn favorites-nav">
                            <i class="fas fa-heart"></i>
                            علاقه‌مندی‌ها
                            <span class="favorites-count"></span>
                        </a></li>
                    </ul>
                </div>
            </section>

            <!-- Content Sections -->
            <div id="homeSection" class="content-section active">
                <!-- Articles Grid -->
                <section class="articles-grid" id="articlesGrid">
                    <!-- Articles will be loaded here -->
                </section>

                <!-- Pagination -->
                <div class="pagination-container" id="paginationContainer">
                    <!-- Pagination will be loaded here -->
                </div>

                <!-- Loading Spinner -->
                <div class="loading" id="loading">
                    <div class="spinner"></div>
                    <p>در حال بارگذاری...</p>
                </div>

                <!-- Empty State -->
                <div class="empty-state" id="emptyState" style="display: none;">
                    <i class="fas fa-search"></i>
                    <h3>هیچ مقاله‌ای یافت نشد</h3>
                    <p>لطفاً کلمات کلیدی دیگری امتحان کنید یا فیلترها را تغییر دهید</p>
                </div>
            </div>

            <!-- Favorites Section -->
            <div id="favoritesSection" class="content-section">
                <div class="section-header">
                    <h2>مقالات علاقه‌مندی</h2>
                    <p>مقالاتی که برای مطالعه بعدی ذخیره کرده‌اید</p>
                </div>
                <div class="articles-grid" id="favoritesGrid">
                    <!-- Favorite articles will be loaded here -->
                </div>
                <div class="empty-state" id="favoritesEmptyState">
                    <i class="fas fa-heart-broken"></i>
                    <h3>هنوز مقاله‌ای به علاقه‌مندی‌ها اضافه نکرده‌اید</h3>
                    <p>با کلیک بر روی آیکون قلب در مقالات، آنها را به لیست علاقه‌مندی‌هایتان اضافه کنید</p>
                </div>
            </div>

            <!-- About Section -->
            <div id="aboutSection" class="content-section">
                <div class="about-container">
                    <div class="section-header">
                        <h2>درباره <?php echo htmlspecialchars($siteSettings['site_name'] ?? 'مجله فرهنگی نور'); ?></h2>
                        <p>آشنایی با تیم تحریریه و اهداف مجله</p>
                    </div>
                    
                    <div class="about-content">
                        <div class="about-text">
                            <h3>ماموریت ما</h3>
                            <p><?php echo htmlspecialchars($siteSettings['site_description'] ?? 'مجله فرهنگی نور با هدف ارائه محتوای باکیفیت و آموزنده در حوزه‌های مختلف فرهنگی، هنری، علمی و فناوری فعالیت می‌کند.'); ?></p>
                            
                            <h3>تماس با ما</h3>
                            <?php if (!empty($siteSettings['contact_email'])): ?>
                            <p><i class="fas fa-envelope"></i> <?php echo htmlspecialchars($siteSettings['contact_email']); ?></p>
                            <?php endif; ?>
                            <?php if (!empty($siteSettings['contact_phone'])): ?>
                            <p><i class="fas fa-phone"></i> <?php echo htmlspecialchars($siteSettings['contact_phone']); ?></p>
                            <?php endif; ?>
                        </div>
                        
                        <div class="social-section">
                            <h3>شبکه‌های اجتماعی</h3>
                            <div class="social-links">
                                <?php if (!empty($siteSettings['social_telegram'])): ?>
                                <a href="<?php echo htmlspecialchars($siteSettings['social_telegram']); ?>" target="_blank" aria-label="تلگرام"><i class="fab fa-telegram"></i></a>
                                <?php endif; ?>
                                <?php if (!empty($siteSettings['social_instagram'])): ?>
                                <a href="<?php echo htmlspecialchars($siteSettings['social_instagram']); ?>" target="_blank" aria-label="اینستاگرام"><i class="fab fa-instagram"></i></a>
                                <?php endif; ?>
                                <?php if (!empty($siteSettings['social_twitter'])): ?>
                                <a href="<?php echo htmlspecialchars($siteSettings['social_twitter']); ?>" target="_blank" aria-label="توییتر"><i class="fab fa-twitter"></i></a>
                                <?php endif; ?>
                                <?php if (!empty($siteSettings['social_linkedin'])): ?>
                                <a href="<?php echo htmlspecialchars($siteSettings['social_linkedin']); ?>" target="_blank" aria-label="لینکدین"><i class="fab fa-linkedin"></i></a>
                                <?php endif; ?>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Magazine Archive Section -->
            <div id="magazineSection" class="content-section">
                <div class="magazine-container">
                    <div class="section-header">
                        <h2>آرشیو مجله</h2>
                        <p>دانلود نسخه‌های PDF مجله</p>
                    </div>
                    
                    <div class="magazine-grid" id="magazineGrid">
                        <!-- Magazine issues will be loaded here -->
                    </div>
                    
                    <div class="empty-state" id="magazineEmptyState">
                        <i class="fas fa-book-open"></i>
                        <h3>هنوز شماره‌ای از مجله منتشر نشده</h3>
                        <p>به زودی اولین شماره مجله منتشر خواهد شد</p>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <!-- Article Modal -->
    <div class="modal-overlay" id="articleModal">
        <div class="modal">
            <div class="modal-header">
                <button class="modal-close" id="modalClose">
                    <i class="fas fa-times"></i>
                </button>
                <div class="modal-actions">
                    <button class="action-btn" id="shareBtn">
                        <i class="fas fa-share-alt"></i>
                        اشتراک‌گذاری
                    </button>
                    <button class="action-btn favorite-btn" id="favoriteBtn">
                        <i class="far fa-heart"></i>
                        علاقه‌مندی
                    </button>
                </div>
            </div>
            <div class="modal-content" id="modalContent">
                <!-- Article content will be loaded here -->
            </div>
        </div>
    </div>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h3>درباره ما</h3>
                    <p><?php echo htmlspecialchars($siteSettings['site_description'] ?? 'مجله فرهنگی نور مجموعه‌ای از بهترین مقالات فرهنگی و علمی را برای شما فراهم می‌کند'); ?></p>
                </div>
                <div class="footer-section">
                    <h3>دسته‌بندی‌ها</h3>
                    <ul>
                        <?php foreach ($categories as $cat): ?>
                        <li><a href="#" data-category="<?php echo htmlspecialchars($cat['slug']); ?>"><?php echo htmlspecialchars($cat['name']); ?></a></li>
                        <?php endforeach; ?>
                    </ul>
                </div>
                <div class="footer-section">
                    <h3>تماس با ما</h3>
                    <div class="social-links">
                        <?php if (!empty($siteSettings['social_telegram'])): ?>
                        <a href="<?php echo htmlspecialchars($siteSettings['social_telegram']); ?>" target="_blank" aria-label="تلگرام"><i class="fab fa-telegram"></i></a>
                        <?php endif; ?>
                        <?php if (!empty($siteSettings['social_instagram'])): ?>
                        <a href="<?php echo htmlspecialchars($siteSettings['social_instagram']); ?>" target="_blank" aria-label="اینستاگرام"><i class="fab fa-instagram"></i></a>
                        <?php endif; ?>
                        <?php if (!empty($siteSettings['social_twitter'])): ?>
                        <a href="<?php echo htmlspecialchars($siteSettings['social_twitter']); ?>" target="_blank" aria-label="توییتر"><i class="fab fa-twitter"></i></a>
                        <?php endif; ?>
                        <?php if (!empty($siteSettings['social_linkedin'])): ?>
                        <a href="<?php echo htmlspecialchars($siteSettings['social_linkedin']); ?>" target="_blank" aria-label="لینکدین"><i class="fab fa-linkedin"></i></a>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; <?php echo date('Y'); ?> <?php echo htmlspecialchars($siteSettings['site_name'] ?? 'مجله فرهنگی نور'); ?>. <?php echo htmlspecialchars($siteSettings['footer_text'] ?? 'تمامی حقوق محفوظ است.'); ?></p>
            </div>
        </div>
    </footer>

    <script src="assets/js/main.js"></script>
</body>
</html>