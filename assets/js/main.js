// Main JavaScript for Persian Magazine Website
class PersianMagazine {
    constructor() {
        this.currentSection = 'home';
        this.currentFilter = 'all';
        this.currentSearchTerm = '';
        this.currentPage = 1;
        this.isLoading = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupTheme();
        this.showSection('home');
        this.setupModalEvents();
        this.updateFavoritesCount();
    }

    setupEventListeners() {
        // Header menu links
        document.querySelectorAll('.header-menu-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                if (href === '#home') {
                    this.showSection('home');
                } else if (href === '#about') {
                    this.showSection('about');
                } else if (href === '#magazine') {
                    this.showSection('magazine');
                }
                this.updateActiveHeaderMenu(link);
            });
        });

        // Category filter buttons
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
                this.updateActiveFilter(btn);
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
                    this.currentPage = 1;
                    this.loadArticles();
                }, 300);
            });
        }

        // Dark mode toggle
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            darkModeToggle.addEventListener('click', this.toggleTheme.bind(this));
        }
    }

    setupModalEvents() {
        const articleModal = document.getElementById('articleModal');
        const modalClose = document.getElementById('modalClose');
        
        if (modalClose) {
            modalClose.addEventListener('click', () => this.closeModal());
        }

        if (articleModal) {
            articleModal.addEventListener('click', (e) => {
                if (e.target === articleModal) this.closeModal();
            });
        }

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && articleModal && articleModal.classList.contains('active')) {
                this.closeModal();
            }
        });
    }

    setupTheme() {
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

    updateActiveHeaderMenu(activeLink) {
        document.querySelectorAll('.header-menu-link').forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }

    updateActiveFilter(activeBtn) {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        activeBtn.classList.add('active');
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
            this.currentPage = 1;
            this.loadArticles();
        } else if (sectionName === 'favorites') {
            this.loadFavorites();
        } else if (sectionName === 'magazine') {
            this.loadMagazines();
        }
    }

    filterByCategory(category) {
        this.currentFilter = category;
        this.currentPage = 1;
        if (this.currentSection === 'home') {
            this.loadArticles();
        }
    }

    async loadArticles() {
        if (this.isLoading) return;
        
        this.showLoading(true);
        this.isLoading = true;

        try {
            const params = new URLSearchParams({
                page: this.currentPage,
                category: this.currentFilter,
                search: this.currentSearchTerm
            });

            const response = await fetch(`api/articles.php?${params}`);
            const data = await response.json();

            if (data.success) {
                this.renderArticles(data.articles);
                this.renderPagination(data.pagination);
                
                if (data.articles.length === 0) {
                    this.showEmptyState(true);
                } else {
                    this.showEmptyState(false);
                }
            } else {
                this.showToast('خطا در بارگذاری مقالات', 'error');
            }
        } catch (error) {
            console.error('Error loading articles:', error);
            this.showToast('خطا در اتصال به سرور', 'error');
        } finally {
            this.showLoading(false);
            this.isLoading = false;
        }
    }

    async loadFavorites() {
        const favoriteIds = this.getFavoriteIds();
        if (favoriteIds.length === 0) {
            document.getElementById('favoritesGrid').innerHTML = '';
            document.getElementById('favoritesEmptyState').style.display = 'block';
            return;
        }

        this.showLoading(true);

        try {
            const promises = favoriteIds.map(id => 
                fetch(`api/article.php?id=${id}`).then(res => res.json())
            );
            
            const results = await Promise.all(promises);
            const articles = results
                .filter(result => result.success)
                .map(result => result.article);

            this.renderFavorites(articles);
            document.getElementById('favoritesEmptyState').style.display = articles.length === 0 ? 'block' : 'none';
        } catch (error) {
            console.error('Error loading favorites:', error);
            this.showToast('خطا در بارگذاری علاقه‌مندی‌ها', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    async loadMagazines() {
        try {
            const response = await fetch('api/magazines.php');
            const data = await response.json();

            if (data.success) {
                this.renderMagazines(data.magazines);
                document.getElementById('magazineEmptyState').style.display = 
                    data.magazines.length === 0 ? 'block' : 'none';
            }
        } catch (error) {
            console.error('Error loading magazines:', error);
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

        articlesGrid.classList.add('fade-in');
        setTimeout(() => articlesGrid.classList.remove('fade-in'), 500);
    }

    renderFavorites(articles) {
        const favoritesGrid = document.getElementById('favoritesGrid');
        if (!favoritesGrid) return;

        favoritesGrid.innerHTML = '';

        articles.forEach(article => {
            const articleCard = this.createArticleCard(article);
            favoritesGrid.appendChild(articleCard);
        });
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

    renderPagination(pagination) {
        const paginationContainer = document.getElementById('paginationContainer');
        if (!paginationContainer || pagination.total_pages <= 1) {
            paginationContainer.innerHTML = '';
            return;
        }

        let paginationHTML = '<div class="pagination">';
        
        // Previous button
        if (pagination.has_prev) {
            paginationHTML += `<button class="pagination-btn" onclick="persianMagazine.goToPage(${pagination.current_page - 1})">
                <i class="fas fa-chevron-right"></i>
            </button>`;
        } else {
            paginationHTML += `<button class="pagination-btn disabled">
                <i class="fas fa-chevron-right"></i>
            </button>`;
        }

        // Page numbers
        const startPage = Math.max(1, pagination.current_page - 2);
        const endPage = Math.min(pagination.total_pages, pagination.current_page + 2);

        if (startPage > 1) {
            paginationHTML += `<button class="pagination-btn" onclick="persianMagazine.goToPage(1)">1</button>`;
            if (startPage > 2) {
                paginationHTML += `<span class="pagination-dots">...</span>`;
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            const activeClass = i === pagination.current_page ? 'active' : '';
            paginationHTML += `<button class="pagination-btn ${activeClass}" onclick="persianMagazine.goToPage(${i})">${i}</button>`;
        }

        if (endPage < pagination.total_pages) {
            if (endPage < pagination.total_pages - 1) {
                paginationHTML += `<span class="pagination-dots">...</span>`;
            }
            paginationHTML += `<button class="pagination-btn" onclick="persianMagazine.goToPage(${pagination.total_pages})">${pagination.total_pages}</button>`;
        }

        // Next button
        if (pagination.has_next) {
            paginationHTML += `<button class="pagination-btn" onclick="persianMagazine.goToPage(${pagination.current_page + 1})">
                <i class="fas fa-chevron-left"></i>
            </button>`;
        } else {
            paginationHTML += `<button class="pagination-btn disabled">
                <i class="fas fa-chevron-left"></i>
            </button>`;
        }

        // Page info
        paginationHTML += `<div class="pagination-info">
            صفحه ${pagination.current_page} از ${pagination.total_pages} 
            (${pagination.total_items} مقاله)
        </div>`;

        paginationHTML += '</div>';
        paginationContainer.innerHTML = paginationHTML;
    }

    goToPage(page) {
        this.currentPage = page;
        this.loadArticles();
        
        // Scroll to top of articles
        const articlesGrid = document.getElementById('articlesGrid');
        if (articlesGrid) {
            articlesGrid.scrollIntoView({ behavior: 'smooth' });
        }
    }

    createArticleCard(article) {
        const card = document.createElement('div');
        card.className = 'article-card';
        card.addEventListener('click', () => this.openArticleModal(article.id));

        const defaultAvatar = 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150';
        const authorPhoto = article.author_image || defaultAvatar;

        card.innerHTML = `
            <div class="card-header">
                <img src="${authorPhoto}" alt="${article.author_name}" class="author-avatar" loading="lazy">
                <div class="author-info">
                    <h4>${article.author_name}</h4>
                    <span class="article-date">${article.formatted_date}</span>
                </div>
            </div>
            <div class="card-content">
                <h3 class="card-title">${article.title}</h3>
                <p class="card-excerpt">${article.excerpt}</p>
                <div class="card-footer">
                    <div class="card-tags">
                        ${article.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <span class="category-badge" style="background-color: ${article.category_color || '#2563eb'}">${article.category_name}</span>
                </div>
            </div>
        `;

        return card;
    }

    createMagazineCard(magazine) {
        const card = document.createElement('div');
        card.className = 'magazine-card';

        const defaultCover = 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400';
        const coverImage = magazine.cover_image || defaultCover;

        card.innerHTML = `
            <img src="${coverImage}" alt="${magazine.title}" class="magazine-cover" loading="lazy">
            <div class="magazine-info">
                <h3 class="magazine-title">${magazine.title}</h3>
                <p class="magazine-date">${magazine.month_name} ${magazine.year}</p>
                <p class="magazine-description">${magazine.description || ''}</p>
                <div class="magazine-actions">
                    <button class="download-btn" onclick="window.open('${magazine.pdf_file}', '_blank')">
                        <i class="fas fa-download"></i>
                        دانلود PDF
                    </button>
                </div>
            </div>
        `;

        return card;
    }

    async openArticleModal(articleId) {
        try {
            const response = await fetch(`api/article.php?id=${articleId}`);
            const data = await response.json();

            if (data.success) {
                this.showArticleModal(data.article);
            } else {
                this.showToast('خطا در بارگذاری مقاله', 'error');
            }
        } catch (error) {
            console.error('Error loading article:', error);
            this.showToast('خطا در اتصال به سرور', 'error');
        }
    }

    showArticleModal(article) {
        const modal = document.getElementById('articleModal');
        const modalContent = document.getElementById('modalContent');
        if (!modal || !modalContent) return;

        const defaultAvatar = 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150';
        const authorPhoto = article.author_image || defaultAvatar;

        modalContent.innerHTML = `
            <div class="modal-article-header">
                <h1 class="modal-article-title">${article.title}</h1>
                <div class="modal-article-meta">
                    <img src="${authorPhoto}" alt="${article.author_name}" class="author-avatar">
                    <div class="author-info">
                        <h4>${article.author_name}</h4>
                        <span class="article-date">${article.formatted_date}</span>
                    </div>
                    <span class="category-badge" style="background-color: ${article.category_color || '#2563eb'}">${article.category_name}</span>
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

        // Update favorite button
        const favoriteBtn = document.getElementById('favoriteBtn');
        if (favoriteBtn) {
            const isFavorited = this.isFavorite(article.id);
            favoriteBtn.classList.toggle('active', isFavorited);
            const icon = favoriteBtn.querySelector('i');
            icon.className = isFavorited ? 'fas fa-heart' : 'far fa-heart';
            favoriteBtn.dataset.articleId = article.id;
            
            favoriteBtn.replaceWith(favoriteBtn.cloneNode(true));
            const newFavoriteBtn = document.getElementById('favoriteBtn');
            newFavoriteBtn.addEventListener('click', () => this.toggleFavorite());
        }

        // Update share button
        const shareBtn = document.getElementById('shareBtn');
        if (shareBtn) {
            shareBtn.dataset.articleId = article.id;
            shareBtn.dataset.articleTitle = article.title;
            shareBtn.dataset.articleExcerpt = article.excerpt;
            
            shareBtn.replaceWith(shareBtn.cloneNode(true));
            const newShareBtn = document.getElementById('shareBtn');
            newShareBtn.addEventListener('click', () => this.shareArticle());
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

        const isFavorited = this.isFavorite(articleId);
        const icon = favoriteBtn.querySelector('i');

        if (isFavorited) {
            this.removeFavorite(articleId);
            favoriteBtn.classList.remove('active');
            icon.className = 'far fa-heart';
            this.showToast('مقاله از علاقه‌مندی‌ها حذف شد');
        } else {
            this.addFavorite(articleId);
            favoriteBtn.classList.add('active');
            icon.className = 'fas fa-heart';
            this.showToast('مقاله به علاقه‌مندی‌ها اضافه شد');
        }
        
        this.updateFavoritesCount();
        
        if (this.currentSection === 'favorites') {
            this.loadFavorites();
        }
    }

    shareArticle() {
        const shareBtn = document.getElementById('shareBtn');
        const articleTitle = shareBtn.dataset.articleTitle;
        const articleExcerpt = shareBtn.dataset.articleExcerpt;
        
        const shareData = {
            title: articleTitle,
            text: articleExcerpt,
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
            const textArea = document.createElement('textarea');
            textArea.value = shareText;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showToast('لینک مقاله کپی شد');
        }
    }

    // Favorites management
    getFavoriteIds() {
        try {
            return JSON.parse(localStorage.getItem('persianMagazineFavorites')) || [];
        } catch {
            return [];
        }
    }

    addFavorite(articleId) {
        const favorites = this.getFavoriteIds();
        if (!favorites.includes(articleId)) {
            favorites.push(articleId);
            localStorage.setItem('persianMagazineFavorites', JSON.stringify(favorites));
        }
    }

    removeFavorite(articleId) {
        const favorites = this.getFavoriteIds();
        const index = favorites.indexOf(articleId);
        if (index !== -1) {
            favorites.splice(index, 1);
            localStorage.setItem('persianMagazineFavorites', JSON.stringify(favorites));
        }
    }

    isFavorite(articleId) {
        return this.getFavoriteIds().includes(articleId);
    }

    updateFavoritesCount() {
        const favoritesCount = document.querySelector('.favorites-count');
        const count = this.getFavoriteIds().length;
        
        if (favoritesCount) {
            favoritesCount.textContent = count;
            favoritesCount.classList.toggle('show', count > 0);
        }
    }

    showLoading(show) {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.classList.toggle('active', show);
        }
    }

    showEmptyState(show) {
        const emptyState = document.getElementById('emptyState');
        if (emptyState) {
            emptyState.style.display = show ? 'block' : 'none';
        }
    }

    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--success-color)' : 'var(--error-color)'};
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize the magazine when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.persianMagazine = new PersianMagazine();
});

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
    
    .pagination-dots {
        padding: 0 var(--spacing-sm);
        color: var(--text-muted);
    }
`;
document.head.appendChild(style);