<?php
session_start();
require_once '../config/config.php';

// Check if user is logged in
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: login.php');
    exit;
}

require_once '../classes/Article.php';
require_once '../classes/Category.php';
require_once '../classes/Author.php';
require_once '../classes/Magazine.php';
require_once '../classes/SiteSettings.php';

$article = new Article();
$category = new Category();
$author = new Author();
$magazine = new Magazine();
$settings = new SiteSettings();

// Get statistics
$totalArticles = $article->getAdminCount();
$totalCategories = count($category->getAll());
$totalAuthors = count($author->getAll());
$totalMagazines = count($magazine->getAll());
$categoryStats = $category->getStats();
?>
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>پنل مدیریت - مجله فرهنگی نور</title>
    <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../assets/css/style.css">
    <link rel="stylesheet" href="assets/css/admin.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <div class="admin-container">
        <!-- Admin Header -->
        <header class="admin-header">
            <div class="admin-nav">
                <h1><i class="fas fa-cog"></i> پنل مدیریت</h1>
                <div class="admin-actions">
                    <span class="admin-welcome">خوش آمدید، <?php echo htmlspecialchars($_SESSION['admin_username']); ?></span>
                    <a href="../index.php" class="back-btn" target="_blank">
                        <i class="fas fa-external-link-alt"></i>
                        مشاهده سایت
                    </a>
                    <a href="logout.php" class="logout-btn">
                        <i class="fas fa-sign-out-alt"></i>
                        خروج
                    </a>
                </div>
            </div>
        </header>

        <!-- Admin Content -->
        <main class="admin-main">
            <!-- Dashboard Stats -->
            <div class="dashboard-stats">
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-newspaper"></i>
                    </div>
                    <div class="stat-content">
                        <h3><?php echo $totalArticles; ?></h3>
                        <p>کل مقالات</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-tags"></i>
                    </div>
                    <div class="stat-content">
                        <h3><?php echo $totalCategories; ?></h3>
                        <p>دسته‌بندی‌ها</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-users"></i>
                    </div>
                    <div class="stat-content">
                        <h3><?php echo $totalAuthors; ?></h3>
                        <p>نویسندگان</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-book"></i>
                    </div>
                    <div class="stat-content">
                        <h3><?php echo $totalMagazines; ?></h3>
                        <p>شماره مجلات</p>
                    </div>
                </div>
            </div>

            <!-- Admin Tabs -->
            <div class="admin-tabs">
                <button class="tab-btn active" data-tab="articles">مدیریت مقالات</button>
                <button class="tab-btn" data-tab="add-article">افزودن مقاله</button>
                <button class="tab-btn" data-tab="categories">دسته‌بندی‌ها</button>
                <button class="tab-btn" data-tab="authors">نویسندگان</button>
                <button class="tab-btn" data-tab="magazines">مجلات</button>
                <button class="tab-btn" data-tab="settings">تنظیمات سایت</button>
            </div>

            <!-- Articles Management Tab -->
            <div class="tab-content active" id="articlesTab">
                <div class="section-header">
                    <h2>مدیریت مقالات</h2>
                    <div class="section-actions">
                        <input type="text" id="articleSearch" placeholder="جستجو در مقالات..." class="search-input">
                        <select id="articleCategoryFilter" class="filter-select">
                            <option value="">همه دسته‌ها</option>
                            <?php foreach ($category->getAll() as $cat): ?>
                            <option value="<?php echo $cat['id']; ?>"><?php echo htmlspecialchars($cat['name']); ?></option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                </div>
                
                <div class="table-container">
                    <table class="data-table" id="articlesTable">
                        <thead>
                            <tr>
                                <th>عنوان</th>
                                <th>نویسنده</th>
                                <th>دسته‌بندی</th>
                                <th>وضعیت</th>
                                <th>بازدید</th>
                                <th>تاریخ ایجاد</th>
                                <th>عملیات</th>
                            </tr>
                        </thead>
                        <tbody id="articlesTableBody">
                            <!-- Articles will be loaded here -->
                        </tbody>
                    </table>
                </div>
                
                <div class="pagination-container" id="articlesPagination">
                    <!-- Pagination will be loaded here -->
                </div>
            </div>

            <!-- Add Article Tab -->
            <div class="tab-content" id="addArticleTab">
                <div class="section-header">
                    <h2>افزودن مقاله جدید</h2>
                </div>
                
                <form class="admin-form" id="addArticleForm">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="articleTitle">عنوان مقاله *</label>
                            <input type="text" id="articleTitle" name="title" required>
                        </div>
                        <div class="form-group">
                            <label for="articleSlug">نامک (اختیاری)</label>
                            <input type="text" id="articleSlug" name="slug" placeholder="به صورت خودکار تولید می‌شود">
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="articleAuthor">نویسنده *</label>
                            <select id="articleAuthor" name="author_id" required>
                                <option value="">انتخاب کنید</option>
                                <?php foreach ($author->getAll() as $auth): ?>
                                <option value="<?php echo $auth['id']; ?>"><?php echo htmlspecialchars($auth['name']); ?></option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="articleCategory">دسته‌بندی *</label>
                            <select id="articleCategory" name="category_id" required>
                                <option value="">انتخاب کنید</option>
                                <?php foreach ($category->getAll() as $cat): ?>
                                <option value="<?php echo $cat['id']; ?>"><?php echo htmlspecialchars($cat['name']); ?></option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="articleStatus">وضعیت</label>
                            <select id="articleStatus" name="status">
                                <option value="draft">پیش‌نویس</option>
                                <option value="published">منتشر شده</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="articleImage">تصویر شاخص (URL)</label>
                            <input type="url" id="articleImage" name="featured_image" placeholder="https://example.com/image.jpg">
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="articleTags">برچسب‌ها (با کامای انگلیسی جدا کنید)</label>
                        <input type="text" id="articleTags" name="tags" placeholder="برنامه‌نویسی, وب, فناوری">
                    </div>

                    <div class="form-group">
                        <label for="articleExcerpt">خلاصه مقاله</label>
                        <textarea id="articleExcerpt" name="excerpt" rows="3" placeholder="خلاصه کوتاهی از مقاله"></textarea>
                    </div>

                    <div class="form-group">
                        <label for="articleContent">متن کامل مقاله *</label>
                        <textarea id="articleContent" name="content" rows="15" required placeholder="متن کامل مقاله را اینجا بنویسید"></textarea>
                    </div>

                    <div class="form-actions">
                        <button type="submit" class="submit-btn">
                            <i class="fas fa-save"></i>
                            ذخیره مقاله
                        </button>
                        <button type="reset" class="reset-btn">
                            <i class="fas fa-undo"></i>
                            پاک کردن فرم
                        </button>
                    </div>
                </form>
            </div>

            <!-- Categories Tab -->
            <div class="tab-content" id="categoriesTab">
                <div class="section-header">
                    <h2>مدیریت دسته‌بندی‌ها</h2>
                    <button class="add-btn" onclick="openCategoryModal()">
                        <i class="fas fa-plus"></i>
                        افزودن دسته‌بندی
                    </button>
                </div>
                
                <div class="table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>نام</th>
                                <th>نامک</th>
                                <th>رنگ</th>
                                <th>تعداد مقالات</th>
                                <th>عملیات</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($categoryStats as $cat): ?>
                            <tr>
                                <td><?php echo htmlspecialchars($cat['name']); ?></td>
                                <td><?php echo htmlspecialchars($cat['slug']); ?></td>
                                <td>
                                    <div class="color-preview" style="background-color: <?php echo htmlspecialchars($cat['color']); ?>"></div>
                                    <?php echo htmlspecialchars($cat['color']); ?>
                                </td>
                                <td><?php echo $cat['article_count']; ?></td>
                                <td>
                                    <button class="edit-btn" onclick="editCategory(<?php echo $cat['id']; ?>)">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="delete-btn" onclick="deleteCategory(<?php echo $cat['id']; ?>)">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Authors Tab -->
            <div class="tab-content" id="authorsTab">
                <div class="section-header">
                    <h2>مدیریت نویسندگان</h2>
                    <button class="add-btn" onclick="openAuthorModal()">
                        <i class="fas fa-plus"></i>
                        افزودن نویسنده
                    </button>
                </div>
                
                <div class="authors-grid">
                    <?php foreach ($author->getAll() as $auth): ?>
                    <div class="author-card">
                        <img src="<?php echo htmlspecialchars($auth['image'] ?: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150'); ?>" 
                             alt="<?php echo htmlspecialchars($auth['name']); ?>" class="author-avatar">
                        <h3><?php echo htmlspecialchars($auth['name']); ?></h3>
                        <p class="author-email"><?php echo htmlspecialchars($auth['email'] ?: 'ایمیل ثبت نشده'); ?></p>
                        <p class="author-bio"><?php echo htmlspecialchars($auth['bio'] ?: 'بیوگرافی ثبت نشده'); ?></p>
                        <div class="author-actions">
                            <button class="edit-btn" onclick="editAuthor(<?php echo $auth['id']; ?>)">
                                <i class="fas fa-edit"></i>
                                ویرایش
                            </button>
                            <button class="delete-btn" onclick="deleteAuthor(<?php echo $auth['id']; ?>)">
                                <i class="fas fa-trash"></i>
                                حذف
                            </button>
                        </div>
                    </div>
                    <?php endforeach; ?>
                </div>
            </div>

            <!-- Magazines Tab -->
            <div class="tab-content" id="magazinesTab">
                <div class="section-header">
                    <h2>مدیریت مجلات</h2>
                    <button class="add-btn" onclick="openMagazineModal()">
                        <i class="fas fa-plus"></i>
                        افزودن شماره جدید
                    </button>
                </div>
                
                <div class="magazines-grid">
                    <?php foreach ($magazine->getAll() as $mag): ?>
                    <div class="magazine-card">
                        <img src="<?php echo htmlspecialchars($mag['cover_image'] ?: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400'); ?>" 
                             alt="<?php echo htmlspecialchars($mag['title']); ?>" class="magazine-cover">
                        <div class="magazine-info">
                            <h3><?php echo htmlspecialchars($mag['title']); ?></h3>
                            <p class="magazine-date"><?php echo $magazine->getMonthName($mag['month']) . ' ' . $mag['year']; ?></p>
                            <p class="magazine-downloads"><?php echo $mag['downloads']; ?> دانلود</p>
                            <div class="magazine-actions">
                                <button class="edit-btn" onclick="editMagazine(<?php echo $mag['id']; ?>)">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="delete-btn" onclick="deleteMagazine(<?php echo $mag['id']; ?>)">
                                    <i class="fas fa-trash"></i>
                                </button>
                                <a href="<?php echo htmlspecialchars($mag['pdf_file']); ?>" target="_blank" class="download-btn">
                                    <i class="fas fa-download"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <?php endforeach; ?>
                </div>
            </div>

            <!-- Settings Tab -->
            <div class="tab-content" id="settingsTab">
                <div class="section-header">
                    <h2>تنظیمات سایت</h2>
                </div>
                
                <form class="admin-form" id="settingsForm">
                    <div class="settings-section">
                        <h3>تنظیمات عمومی</h3>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="siteName">نام سایت</label>
                                <input type="text" id="siteName" name="site_name" value="<?php echo htmlspecialchars($settings->get('site_name') ?: 'مجله فرهنگی نور'); ?>">
                            </div>
                            <div class="form-group">
                                <label for="siteDescription">توضیحات سایت</label>
                                <input type="text" id="siteDescription" name="site_description" value="<?php echo htmlspecialchars($settings->get('site_description') ?: 'روشنایی دانش و فرهنگ در دنیای مدرن'); ?>">
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="siteLogo">لوگوی سایت (URL)</label>
                                <input type="url" id="siteLogo" name="site_logo" value="<?php echo htmlspecialchars($settings->get('site_logo') ?: ''); ?>">
                            </div>
                            <div class="form-group">
                                <label for="siteFavicon">فاو آیکون (URL)</label>
                                <input type="url" id="siteFavicon" name="site_favicon" value="<?php echo htmlspecialchars($settings->get('site_favicon') ?: ''); ?>">
                            </div>
                        </div>
                    </div>

                    <div class="settings-section">
                        <h3>رنگ‌بندی و ظاهر</h3>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="primaryColor">رنگ اصلی</label>
                                <input type="color" id="primaryColor" name="primary_color" value="<?php echo htmlspecialchars($settings->get('primary_color') ?: '#2563eb'); ?>">
                            </div>
                            <div class="form-group">
                                <label for="secondaryColor">رنگ فرعی</label>
                                <input type="color" id="secondaryColor" name="secondary_color" value="<?php echo htmlspecialchars($settings->get('secondary_color') ?: '#1e40af'); ?>">
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="fontFamily">فونت سایت</label>
                            <select id="fontFamily" name="font_family">
                                <option value="Vazirmatn" <?php echo ($settings->get('font_family') === 'Vazirmatn') ? 'selected' : ''; ?>>وزیرمتن</option>
                                <option value="Tahoma" <?php echo ($settings->get('font_family') === 'Tahoma') ? 'selected' : ''; ?>>تاهوما</option>
                                <option value="Yekan" <?php echo ($settings->get('font_family') === 'Yekan') ? 'selected' : ''; ?>>یکان</option>
                            </select>
                        </div>
                    </div>

                    <div class="settings-section">
                        <h3>شبکه‌های اجتماعی</h3>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="socialTelegram">تلگرام</label>
                                <input type="url" id="socialTelegram" name="social_telegram" value="<?php echo htmlspecialchars($settings->get('social_telegram') ?: ''); ?>">
                            </div>
                            <div class="form-group">
                                <label for="socialInstagram">اینستاگرام</label>
                                <input type="url" id="socialInstagram" name="social_instagram" value="<?php echo htmlspecialchars($settings->get('social_instagram') ?: ''); ?>">
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="socialTwitter">توییتر</label>
                                <input type="url" id="socialTwitter" name="social_twitter" value="<?php echo htmlspecialchars($settings->get('social_twitter') ?: ''); ?>">
                            </div>
                            <div class="form-group">
                                <label for="socialLinkedin">لینکدین</label>
                                <input type="url" id="socialLinkedin" name="social_linkedin" value="<?php echo htmlspecialchars($settings->get('social_linkedin') ?: ''); ?>">
                            </div>
                        </div>
                    </div>

                    <div class="settings-section">
                        <h3>اطلاعات تماس</h3>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="contactEmail">ایمیل تماس</label>
                                <input type="email" id="contactEmail" name="contact_email" value="<?php echo htmlspecialchars($settings->get('contact_email') ?: ''); ?>">
                            </div>
                            <div class="form-group">
                                <label for="contactPhone">شماره تماس</label>
                                <input type="text" id="contactPhone" name="contact_phone" value="<?php echo htmlspecialchars($settings->get('contact_phone') ?: ''); ?>">
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="footerText">متن فوتر</label>
                            <input type="text" id="footerText" name="footer_text" value="<?php echo htmlspecialchars($settings->get('footer_text') ?: 'تمامی حقوق محفوظ است.'); ?>">
                        </div>
                    </div>

                    <div class="form-actions">
                        <button type="submit" class="submit-btn">
                            <i class="fas fa-save"></i>
                            ذخیره تنظیمات
                        </button>
                    </div>
                </form>
            </div>
        </main>
    </div>

    <!-- Modals will be added here -->
    
    <script src="assets/js/admin.js"></script>
</body>
</html>