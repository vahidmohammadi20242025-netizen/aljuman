// Admin Panel JavaScript
class AdminPanel {
    constructor() {
        this.currentTab = 'articles';
        this.currentPage = 1;
        this.articlesPerPage = 20;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadArticles();
        this.switchTab(this.currentTab);
    }

    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;
                this.switchTab(tab);
            });
        });

        // Add article form
        const addArticleForm = document.getElementById('addArticleForm');
        if (addArticleForm) {
            addArticleForm.addEventListener('submit', this.handleAddArticle.bind(this));
        }

        // Settings form
        const settingsForm = document.getElementById('settingsForm');
        if (settingsForm) {
            settingsForm.addEventListener('submit', this.handleSettings.bind(this));
        }

        // Article search and filter
        const articleSearch = document.getElementById('articleSearch');
        if (articleSearch) {
            let searchTimeout;
            articleSearch.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.currentPage = 1;
                    this.loadArticles();
                }, 300);
            });
        }

        const articleCategoryFilter = document.getElementById('articleCategoryFilter');
        if (articleCategoryFilter) {
            articleCategoryFilter.addEventListener('change', () => {
                this.currentPage = 1;
                this.loadArticles();
            });
        }

        // Auto-generate slug from title
        const articleTitle = document.getElementById('articleTitle');
        const articleSlug = document.getElementById('articleSlug');
        if (articleTitle && articleSlug) {
            articleTitle.addEventListener('input', (e) => {
                if (!articleSlug.value) {
                    articleSlug.value = this.generateSlug(e.target.value);
                }
            });
        }
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        const targetTab = document.getElementById(`${tabName}Tab`);
        if (targetTab) {
            targetTab.classList.add('active');
        } else {
            // Handle tabs with different naming
            const alternativeTab = document.getElementById(`${tabName.replace('-', '')}Tab`);
            if (alternativeTab) {
                alternativeTab.classList.add('active');
            }
        }

        this.currentTab = tabName;

        // Load tab-specific content
        if (tabName === 'articles') {
            this.loadArticles();
        }
    }

    async loadArticles() {
        const search = document.getElementById('articleSearch')?.value || '';
        const categoryFilter = document.getElementById('articleCategoryFilter')?.value || '';
        
        try {
            const params = new URLSearchParams({
                page: this.currentPage,
                search: search,
                category: categoryFilter,
                limit: this.articlesPerPage
            });

            const response = await fetch(`api/admin-articles.php?${params}`);
            const data = await response.json();

            if (data.success) {
                this.renderArticlesTable(data.articles);
                this.renderArticlesPagination(data.pagination);
            } else {
                this.showMessage('خطا در بارگذاری مقالات', 'error');
            }
        } catch (error) {
            console.error('Error loading articles:', error);
            this.showMessage('خطا در اتصال به سرور', 'error');
        }
    }

    renderArticlesTable(articles) {
        const tbody = document.getElementById('articlesTableBody');
        if (!tbody) return;

        tbody.innerHTML = '';

        articles.forEach(article => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <div style="max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                        ${article.title}
                    </div>
                </td>
                <td>${article.author_name || 'نامشخص'}</td>
                <td>${article.category_name || 'نامشخص'}</td>
                <td>
                    <span class="status-badge ${article.status}">
                        ${this.getStatusLabel(article.status)}
                    </span>
                </td>
                <td>${article.views || 0}</td>
                <td>${this.formatDate(article.created_at)}</td>
                <td>
                    <button class="edit-btn" onclick="editArticle(${article.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" onclick="deleteArticle(${article.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    renderArticlesPagination(pagination) {
        const container = document.getElementById('articlesPagination');
        if (!container || pagination.total_pages <= 1) {
            container.innerHTML = '';
            return;
        }

        let html = '<div class="pagination">';
        
        // Previous button
        if (pagination.has_prev) {
            html += `<button class="pagination-btn" onclick="adminPanel.goToPage(${pagination.current_page - 1})">
                <i class="fas fa-chevron-right"></i>
            </button>`;
        } else {
            html += `<button class="pagination-btn disabled">
                <i class="fas fa-chevron-right"></i>
            </button>`;
        }

        // Page numbers
        const startPage = Math.max(1, pagination.current_page - 2);
        const endPage = Math.min(pagination.total_pages, pagination.current_page + 2);

        for (let i = startPage; i <= endPage; i++) {
            const activeClass = i === pagination.current_page ? 'active' : '';
            html += `<button class="pagination-btn ${activeClass}" onclick="adminPanel.goToPage(${i})">${i}</button>`;
        }

        // Next button
        if (pagination.has_next) {
            html += `<button class="pagination-btn" onclick="adminPanel.goToPage(${pagination.current_page + 1})">
                <i class="fas fa-chevron-left"></i>
            </button>`;
        } else {
            html += `<button class="pagination-btn disabled">
                <i class="fas fa-chevron-left"></i>
            </button>`;
        }

        html += '</div>';
        container.innerHTML = html;
    }

    goToPage(page) {
        this.currentPage = page;
        this.loadArticles();
    }

    async handleAddArticle(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const submitBtn = e.target.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> در حال ذخیره...';
        submitBtn.disabled = true;

        try {
            const response = await fetch('api/add-article.php', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                this.showMessage('مقاله با موفقیت اضافه شد', 'success');
                e.target.reset();
                if (this.currentTab === 'articles') {
                    this.loadArticles();
                }
            } else {
                this.showMessage(data.error || 'خطا در افزودن مقاله', 'error');
            }
        } catch (error) {
            console.error('Error adding article:', error);
            this.showMessage('خطا در اتصال به سرور', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    async handleSettings(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const submitBtn = e.target.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> در حال ذخیره...';
        submitBtn.disabled = true;

        try {
            const response = await fetch('api/save-settings.php', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                this.showMessage('تنظیمات با موفقیت ذخیره شد', 'success');
            } else {
                this.showMessage(data.error || 'خطا در ذخیره تنظیمات', 'error');
            }
        } catch (error) {
            console.error('Error saving settings:', error);
            this.showMessage('خطا در اتصال به سرور', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    generateSlug(title) {
        return title
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-\u0600-\u06FF]/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
    }

    getStatusLabel(status) {
        const labels = {
            'published': 'منتشر شده',
            'draft': 'پیش‌نویس',
            'archived': 'آرشیو شده'
        };
        return labels[status] || status;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('fa-IR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    showMessage(message, type = 'success') {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.success-message, .error-message');
        existingMessages.forEach(msg => msg.remove());

        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = type === 'success' ? 'success-message' : 'error-message';
        messageDiv.textContent = message;

        // Insert at the top of the current tab content
        const activeTabContent = document.querySelector('.tab-content.active');
        if (activeTabContent) {
            activeTabContent.insertBefore(messageDiv, activeTabContent.firstChild);
        }

        // Auto remove after 5 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
}

// Global functions for onclick handlers
window.editArticle = async (id) => {
    // Implementation for editing article
    console.log('Edit article:', id);
};

window.deleteArticle = async (id) => {
    if (!confirm('آیا مطمئن هستید که می‌خواهید این مقاله را حذف کنید؟')) {
        return;
    }

    try {
        const response = await fetch('api/delete-article.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id })
        });

        const data = await response.json();

        if (data.success) {
            window.adminPanel.showMessage('مقاله با موفقیت حذف شد', 'success');
            window.adminPanel.loadArticles();
        } else {
            window.adminPanel.showMessage(data.error || 'خطا در حذف مقاله', 'error');
        }
    } catch (error) {
        console.error('Error deleting article:', error);
        window.adminPanel.showMessage('خطا در اتصال به سرور', 'error');
    }
};

window.openCategoryModal = () => {
    // Implementation for category modal
    console.log('Open category modal');
};

window.editCategory = (id) => {
    // Implementation for editing category
    console.log('Edit category:', id);
};

window.deleteCategory = (id) => {
    // Implementation for deleting category
    console.log('Delete category:', id);
};

window.openAuthorModal = () => {
    // Implementation for author modal
    console.log('Open author modal');
};

window.editAuthor = (id) => {
    // Implementation for editing author
    console.log('Edit author:', id);
};

window.deleteAuthor = (id) => {
    // Implementation for deleting author
    console.log('Delete author:', id);
};

window.openMagazineModal = () => {
    // Implementation for magazine modal
    console.log('Open magazine modal');
};

window.editMagazine = (id) => {
    // Implementation for editing magazine
    console.log('Edit magazine:', id);
};

window.deleteMagazine = (id) => {
    // Implementation for deleting magazine
    console.log('Delete magazine:', id);
};

// Initialize admin panel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.adminPanel = new AdminPanel();
});