// Main JavaScript for Persian Magazine Website
class PersianMagazine {
    constructor() {
        this.currentSection = 'home';
        this.currentFilter = 'all';
        this.currentSearchTerm = '';
        this.isLoading = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupTheme();
        this.showSection('home');
        this.updateStats();
        this.updateFavoritesCount();
        this.setupModalEvents();
    }

    setupEventListeners() {
        // Header menu links
        document.querySelectorAll('.header-menu-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                if (link.getAttribute('href') === '#home') {
                    this.showSection('home');
                } else if (link.getAttribute('href') === '#about') {
                    this.showSection('about');
                } else if (link.getAttribute('href') === '#magazine') {
                    this.showSection('magazine');
                }
                this.updateActiveHeaderMenu(link);
            });
        });

        // Navigation links in header
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                if (link.getAttribute('href') === '#favorites') {
                    this.showSection('favorites');
                } else if (link.getAttribute('href') === '#about') {
                    this.showSection('about');
                } else if (link.getAttribute('href') === '#magazine') {
                    this.showSection('magazine');
                } else {
                    const category = link.dataset.category;
                    this.showSection('home');
                    this.filterByCategory(category);
                }
                this.updateActiveNavigation(link);
            });
        });

        // Category buttons in filter-bar
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                if (btn.getAttribute('href') === '#favorites') {
                    this.showSection('favorites');
                } else {
                    const category = btn.dataset.category;
                    this.showSection('home');
                    this.filterByCategory(category);
                }
                this.updateActiveNavigation(btn);
            });
        });

        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.currentSearchTerm = e.target.value;
                    this.loadArticles();
                }, 300);
            });
        }

        // Dark mode toggle
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            darkModeToggle.addEventListener('click', this.toggleTheme.bind(this));
        }

        // حذف فراخوانی setupModalEvents از اینجا
    }

    updateActiveHeaderMenu(activeLink) {
        document.querySelectorAll('.header-menu-link').forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }

    setupModalEvents() {
        // Close modal button
        const closeModalBtn = document.querySelector('.close-modal-btn');
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => this.closeModal());
        }

        // Modal background click to close
        const articleModal = document.getElementById('articleModal');
        if (articleModal) {
            articleModal.addEventListener('click', (e) => {
                if (e.target === articleModal) this.closeModal();
            });
        }

        // Favorite button
        const favoriteBtn = document.getElementById('favoriteBtn');
        if (favoriteBtn) {
            favoriteBtn.addEventListener('click', () => this.toggleFavorite());
        }

        // Share button
        const shareBtn = document.getElementById('shareBtn');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => this.shareArticle());
        }
    }

    setupMagazineModalEvents() {
        const addMagazineBtn = document.getElementById('addMagazineBtn');
        const magazineModal = document.getElementById('magazineModal');
        const magazineModalClose = document.getElementById('magazineModalClose');
        const magazineForm = document.getElementById('magazineForm');

        if (addMagazineBtn) {
            addMagazineBtn.addEventListener('click', () => {
                if (window.dataManager.checkAdminAuth()) {
                    this.openMagazineModal();
                } else {
                    this.openAdminLoginModal();
                }
            });
        }

        if (magazineModalClose) {
            magazineModalClose.addEventListener('click', () => this.closeMagazineModal());
        }

        if (magazineModal) {
            magazineModal.addEventListener('click', (e) => {
                if (e.target === magazineModal) this.closeMagazineModal();
            });
        }

        if (magazineForm) {
            magazineForm.addEventListener('submit', this.handleMagazineSubmit.bind(this));
        }
    }

    setupAdminLoginModalEvents() {
        const adminLoginModal = document.getElementById('adminLoginModal');
        const adminLoginClose = document.getElementById('adminLoginClose');
        const adminLoginForm = document.getElementById('adminLoginForm');

        if (adminLoginClose) {
            adminLoginClose.addEventListener('click', () => this.closeAdminLoginModal());
        }

        if (adminLoginModal) {
            adminLoginModal.addEventListener('click', (e) => {
                if (e.target === adminLoginModal) this.closeAdminLoginModal();
            });
        }

        if (adminLoginForm) {
            adminLoginForm.addEventListener('submit', this.handleAdminLogin.bind(this));
        }

        // Check admin link
        const adminLink = document.querySelector('.admin-link');
        if (adminLink) {
            adminLink.addEventListener('click', (e) => {
                if (!window.dataManager.checkAdminAuth()) {
                    e.preventDefault();
                    this.openAdminLoginModal();
                }
            });
        }
    }

    setupTheme() {
        // Check for saved theme preference or default to light mode
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            const icon = darkModeToggle.querySelector('i');
            icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }

    updateActiveNavigation(activeLink) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        activeLink.classList.add('active');
    }

    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        // Show target section
        const targetSection = document.getElementById(`${sectionName}Section`);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        this.currentSection = sectionName;

        // Load section-specific content
        if (sectionName === 'home') {
            this.loadArticles();
        } else if (sectionName === 'favorites') {
            this.loadFavorites();
        } else if (sectionName === 'magazine') {
            this.loadMagazines();
        }
    }

    filterByCategory(category) {
        this.currentFilter = category;
        if (this.currentSection === 'home') {
            this.loadArticles();
        }
    }

    async loadArticles() {
        this.showLoading(true);
        
        // Simulate loading delay for better UX
        await new Promise(resolve => setTimeout(resolve, 300));

        let articles;
        
        if (this.currentSearchTerm) {
            articles = window.dataManager.searchArticles(this.currentSearchTerm);
        } else {
            articles = window.dataManager.getArticlesByCategory(this.currentFilter);
        }

        this.renderArticles(articles);
        this.updateArticleCount(articles.length);
        this.showLoading(false);

        if (articles.length === 0) {
            this.showEmptyState(true);
        } else {
            this.showEmptyState(false);
        }
    }

    async loadFavorites() {
        this.showLoading(true);
        
        await new Promise(resolve => setTimeout(resolve, 300));

        const favorites = window.dataManager.getFavorites();
        this.renderFavorites(favorites);
        this.showLoading(false);

        const favoritesEmptyState = document.getElementById('favoritesEmptyState');
        if (favoritesEmptyState) {
            favoritesEmptyState.style.display = favorites.length === 0 ? 'block' : 'none';
        }
    }

    async loadMagazines() {
        const magazines = window.dataManager.getAllMagazines();
        this.renderMagazines(magazines);

        const magazineEmptyState = document.getElementById('magazineEmptyState');
        if (magazineEmptyState) {
            magazineEmptyState.style.display = magazines.length === 0 ? 'block' : 'none';
        }
    }

    renderArticles(articles) {
        const articlesGrid = document.getElementById('articlesGrid');
        if (!articlesGrid) return;

        articlesGrid.innerHTML = '';

        articles.forEach(article => {
            const articleCard = this.createArticleCard(article);
            articlesGrid.appendChild(articleCard);
        });

        // Add animation class
        articlesGrid.classList.add('fade-in');
        setTimeout(() => articlesGrid.classList.remove('fade-in'), 500);
    }

    renderFavorites(favorites) {
        const favoritesGrid = document.getElementById('favoritesGrid');
        if (!favoritesGrid) return;

        favoritesGrid.innerHTML = '';

        favorites.forEach(article => {
            const articleCard = this.createArticleCard(article);
            favoritesGrid.appendChild(articleCard);
        });

        favoritesGrid.classList.add('fade-in');
        setTimeout(() => favoritesGrid.classList.remove('fade-in'), 500);
    }

    renderMagazines(magazines) {
        const magazineGrid = document.getElementById('magazineGrid');
        if (!magazineGrid) return;

        magazineGrid.innerHTML = '';

        magazines.forEach(magazine => {
            const magazineCard = this.createMagazineCard(magazine);
            magazineGrid.appendChild(magazineCard);
        });
    }

    createArticleCard(article) {
        const card = document.createElement('div');
        card.className = 'article-card';
        card.addEventListener('click', () => this.openArticleModal(article));

        const defaultAvatar = 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150';
        const authorPhoto = article.authorPhoto || defaultAvatar;
        const formattedDate = window.dataManager.formatDate(article.createdAt);
        const categoryLabel = window.dataManager.getCategoryLabel(article.category);

        card.innerHTML = `
            <div class="card-header">
                <img src="${authorPhoto}" alt="${article.author}" class="author-avatar" loading="lazy">
                <div class="author-info">
                    <h4>${article.author}</h4>
                    <span class="article-date">${formattedDate}</span>
                </div>
            </div>
            <div class="card-content">
                <h3 class="card-title">${article.title}</h3>
                <p class="card-excerpt">${article.excerpt}</p>
                <div class="card-footer">
                    <div class="card-tags">
                        ${article.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <span class="category-badge ${article.category}">${categoryLabel}</span>
                </div>
            </div>
        `;

        return card;
    }

    createMagazineCard(magazine) {
        const card = document.createElement('div');
        card.className = 'magazine-card';

        const monthName = window.dataManager.getMonthName(magazine.month);
        const defaultCover = 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400';
        const coverImage = magazine.coverImage || defaultCover;

        card.innerHTML = `
            <img src="${coverImage}" alt="${magazine.title}" class="magazine-cover" loading="lazy">
            <div class="magazine-info">
                <h3 class="magazine-title">${magazine.title}</h3>
                <p class="magazine-date">${monthName} ${magazine.year}</p>
                <p class="magazine-description">${magazine.description || ''}</p>
                <div class="magazine-actions">
                    <button class="download-btn" onclick="window.open('${magazine.pdfUrl}', '_blank')">
                        <i class="fas fa-download"></i>
                        دانلود PDF
                    </button>
                    ${window.dataManager.checkAdminAuth() ? `
                        <button class="delete-magazine-btn" onclick="persianMagazine.deleteMagazine('${magazine.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    ` : ''}
                </div>
            </div>
        `;

        return card;
    }

    openArticleModal(article) {
        const modal = document.getElementById('articleModal');
        const modalContent = document.getElementById('modalContent');
        if (!modal || !modalContent) return;

        const formattedDate = window.dataManager.formatDate(article.createdAt);
        const categoryLabel = window.dataManager.getCategoryLabel(article.category);
        const defaultAvatar = 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150';
        const authorPhoto = article.authorPhoto || defaultAvatar;

        modalContent.innerHTML = `
            <div class="modal-article-header">
                <h1 class="modal-article-title">${article.title}</h1>
                <div class="modal-article-meta">
                    <img src="${authorPhoto}" alt="${article.author}" class="author-avatar">
                    <div class="author-info">
                        <h4>${article.author}</h4>
                        <span class="article-date">${formattedDate}</span>
                    </div>
                    <span class="category-badge ${article.category}">${categoryLabel}</span>
                </div>
            </div>
            <div class="modal-article-content">
                ${article.content}
            </div>
            <div class="modal-article-tags">
                <strong>برچسب‌ها:</strong>
                <div class="card-tags">
                    ${article.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        `;

        // Update favorite button state and event
        const favoriteBtn = document.getElementById('favoriteBtn');
        if (favoriteBtn) {
            const isFavorited = window.dataManager.isFavorite(article.id);
            favoriteBtn.classList.toggle('active', isFavorited);
            const icon = favoriteBtn.querySelector('i');
            icon.className = isFavorited ? 'fas fa-heart' : 'far fa-heart';
            favoriteBtn.dataset.articleId = article.id;
            // Remove previous listeners to prevent stacking
            favoriteBtn.replaceWith(favoriteBtn.cloneNode(true));
            const newFavoriteBtn = document.getElementById('favoriteBtn');
            newFavoriteBtn.addEventListener('click', () => this.toggleFavorite());
        }

        // Set article ID for sharing and event
        const shareBtn = document.getElementById('shareBtn');
        if (shareBtn) {
            shareBtn.dataset.articleId = article.id;
            shareBtn.replaceWith(shareBtn.cloneNode(true));
            const newShareBtn = document.getElementById('shareBtn');
            newShareBtn.addEventListener('click', () => this.shareArticle());
        }

        // Close modal button event
        const modalCloseBtn = document.getElementById('modalClose');
        if (modalCloseBtn) {
            modalCloseBtn.replaceWith(modalCloseBtn.cloneNode(true));
            const newModalCloseBtn = document.getElementById('modalClose');
            newModalCloseBtn.addEventListener('click', () => this.closeModal());
        }

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        const modal = document.getElementById('articleModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    toggleFavorite() {
        const favoriteBtn = document.getElementById('favoriteBtn');
        const articleId = favoriteBtn.dataset.articleId;
        
        if (!articleId) return;

        const isFavorited = window.dataManager.isFavorite(articleId);
        const icon = favoriteBtn.querySelector('i');

        if (isFavorited) {
            window.dataManager.removeFavorite(articleId);
            favoriteBtn.classList.remove('active');
            icon.className = 'far fa-heart';
            this.showToast('مقاله از علاقه‌مندی‌ها حذف شد');
        } else {
            window.dataManager.addFavorite(articleId);
            favoriteBtn.classList.add('active');
            icon.className = 'fas fa-heart';
            this.showToast('مقاله به علاقه‌مندی‌ها اضافه شد');
        }
        
        this.updateFavoritesCount();
        
        // Refresh favorites section if currently viewing
        if (this.currentSection === 'favorites') {
            this.loadFavorites();
        }
    }

    shareArticle() {
        const shareBtn = document.getElementById('shareBtn');
        const articleId = shareBtn.dataset.articleId;
        const article = window.dataManager.getArticleById(articleId);
        
        if (!article) return;

        const shareData = {
            title: article.title,
            text: article.excerpt,
            url: window.location.href
        };

        if (navigator.share) {
            navigator.share(shareData).catch(err => {
                console.log('Error sharing:', err);
                this.fallbackShare(shareData);
            });
        } else {
            this.fallbackShare(shareData);
        }
    }

    fallbackShare(shareData) {
        const shareText = `${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(shareText).then(() => {
                this.showToast('لینک مقاله کپی شد');
            });
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = shareText;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showToast('لینک مقاله کپی شد');
        }
    }

    openMagazineModal() {
        const magazineModal = document.getElementById('magazineModal');
        if (magazineModal) {
            magazineModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeMagazineModal() {
        const magazineModal = document.getElementById('magazineModal');
        if (magazineModal) {
            magazineModal.classList.remove('active');
            document.body.style.overflow = 'auto';
            document.getElementById('magazineForm').reset();
        }
    }

    openAdminLoginModal() {
        const adminLoginModal = document.getElementById('adminLoginModal');
        if (adminLoginModal) {
            adminLoginModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeAdminLoginModal() {
        const adminLoginModal = document.getElementById('adminLoginModal');
        if (adminLoginModal) {
            adminLoginModal.classList.remove('active');
            document.body.style.overflow = 'auto';
            document.getElementById('adminLoginForm').reset();
        }
    }

    async handleMagazineSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const magazineData = {
            title: formData.get('title') || document.getElementById('magazineTitle').value,
            month: parseInt(formData.get('month') || document.getElementById('magazineMonth').value),
            year: parseInt(formData.get('year') || document.getElementById('magazineYear').value),
            description: formData.get('description') || document.getElementById('magazineDescription').value,
            coverImage: formData.get('coverImage') || document.getElementById('magazineCover').value,
            pdfUrl: formData.get('pdfUrl') || document.getElementById('magazinePdf').value
        };

        try {
            window.dataManager.addMagazine(magazineData);
            this.showToast('شماره جدید مجله با موفقیت اضافه شد');
            this.closeMagazineModal();
            this.loadMagazines();
            this.updateStats();
        } catch (error) {
            console.error('Error adding magazine:', error);
            this.showToast('خطا در افزودن شماره مجله');
        }
    }

    async handleAdminLogin(e) {
        e.preventDefault();
        
        const username = document.getElementById('adminUsername').value;
        const password = document.getElementById('adminPassword').value;

        if (window.dataManager.adminLogin(username, password)) {
            this.showToast('ورود موفقیت‌آمیز بود');
            this.closeAdminLoginModal();
        } else {
            this.showToast('نام کاربری یا رمز عبور اشتباه است');
        }
    }

    deleteMagazine(magazineId) {
        const magazine = window.dataManager.getMagazineById(magazineId);
        if (!magazine) return;

        const confirmed = confirm(`آیا مطمئن هستید که می‌خواهید "${magazine.title}" را حذف کنید؟`);
        if (!confirmed) return;

        try {
            window.dataManager.deleteMagazine(magazineId);
            this.showToast('شماره مجله با موفقیت حذف شد');
            this.loadMagazines();
            this.updateStats();
        } catch (error) {
            console.error('Error deleting magazine:', error);
            this.showToast('خطا در حذف شماره مجله');
        }
    }

    showLoading(show) {
        const loading = document.getElementById('loading');
        if (loading) {
            if (show) {
                loading.classList.add('active');
            } else {
                loading.classList.remove('active');
            }
        }
    }

    showEmptyState(show) {
        const emptyState = document.getElementById('emptyState');
        if (emptyState) {
            emptyState.style.display = show ? 'block' : 'none';
        }
    }

    updateArticleCount(count) {
        const articleCount = document.getElementById('articleCount');
        if (articleCount) {
            articleCount.textContent = count;
        }
    }

    updateStats() {
        const stats = window.dataManager.getStats();
        
        // Update hero stats
        const heroArticleCount = document.getElementById('heroArticleCount');
        const heroFavoriteCount = document.getElementById('heroFavoriteCount');
        
        if (heroArticleCount) heroArticleCount.textContent = stats.totalArticles;
        if (heroFavoriteCount) heroFavoriteCount.textContent = stats.totalFavorites;
    }

    updateFavoritesCount() {
        const favoritesCount = document.querySelector('.favorites-count');
        const count = window.dataManager.getFavorites().length;
        
        if (favoritesCount) {
            favoritesCount.textContent = count;
            if (count > 0) {
                favoritesCount.classList.add('show');
            } else {
                favoritesCount.classList.remove('show');
            }
        }
    }

    showToast(message) {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--primary-color);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }
}

// Initialize the magazine when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.persianMagazine = new PersianMagazine();
    if (typeof updateFavUI === 'function') updateFavUI();
});

// Global functions for onclick handlers
window.closeMagazineModal = () => {
    if (window.persianMagazine) {
        window.persianMagazine.closeMagazineModal();
    }
};

window.closeAdminLoginModal = () => {
    if (window.persianMagazine) {
        window.persianMagazine.closeAdminLoginModal();
    }
};

// Add CSS animations for toast
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// بستن تمام مودال‌ها
document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-overlay');
      if (modal) modal.classList.remove('active');
    });
  });
  
  // بستن با Escape
  window.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active')
              .forEach(m => m.classList.remove('active'));
    }
  });

// سیستم علاقه‌مندی‌ها (بازنویسی کامل)
const FAVORITES_KEY = 'nourFavorites';

function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
  } catch {
    return [];
  }
}

function setFavorites(favs) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
}

function isFavorite(id) {
  return getFavorites().includes(id);
}

function addFavorite(id) {
  if (!id) return;
  const favs = getFavorites();
  if (!favs.includes(id)) {
    favs.push(id);
    setFavorites(favs);
    updateFavoritesUI();
  }
}

function removeFavorite(id) {
  if (!id) return;
  let favs = getFavorites();
  favs = favs.filter(f => f !== id);
  setFavorites(favs);
  updateFavoritesUI();
}

function updateFavoritesUI() {
  const favs = getFavorites();
  // شمارنده علاقه‌مندی‌ها
  document.querySelectorAll('.favorites-count').forEach(el => {
    el.textContent = favs.length > 0 ? favs.length : '';
    el.classList.toggle('show', favs.length > 0);
  });
  // دکمه قلب در مودال
  const favBtn = document.getElementById('favoriteBtn');
  if (favBtn) {
    favBtn.classList.toggle('active', favs.includes(favBtn.dataset.articleId));
    const icon = favBtn.querySelector('i');
    icon.className = favs.includes(favBtn.dataset.articleId) ? 'fas fa-heart' : 'far fa-heart';
  }
  // بروزرسانی کلاس اصلی
  if (window.persianMagazine) window.persianMagazine.updateFavoritesCount();
}

// هندل کلیک روی دکمه علاقه‌مندی مودال مقاله
document.addEventListener('click', e => {
  const btn = e.target.closest('#favoriteBtn');
  if (btn) {
    const id = btn.dataset.articleId;
    if (!id) return;
    if (isFavorite(id)) {
      removeFavorite(id);
    } else {
      addFavorite(id);
    }
  }
});

// بروزرسانی شمارنده علاقه‌مندی‌ها هنگام بارگذاری صفحه
document.addEventListener('DOMContentLoaded', updateFavoritesUI);