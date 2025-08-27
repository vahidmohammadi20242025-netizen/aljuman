// Admin Panel JavaScript for Persian Magazine
class AdminPanel {
    constructor() {
        this.currentTab = 'add';
        this.editingArticleId = null;
        this.init();
    }

    init() {
        // Check admin authentication
        if (!window.dataManager.checkAdminAuth()) {
            window.location.href = 'index.html';
            return;
        }
        
        this.setupEventListeners();
        this.loadManageArticles();
        this.updateStats();
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

        // Article form submission
        const articleForm = document.getElementById('articleForm');
        if (articleForm) {
            articleForm.addEventListener('submit', this.handleArticleSubmit.bind(this));
        }

        // Edit form submission
        const editForm = document.getElementById('editForm');
        if (editForm) {
            editForm.addEventListener('submit', this.handleEditSubmit.bind(this));
        }

        // Search and filter in manage tab
        const manageSearch = document.getElementById('manageSearch');
        if (manageSearch) {
            let searchTimeout;
            manageSearch.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.filterManageArticles();
                }, 300);
            });
        }

        const manageCategory = document.getElementById('manageCategory');
        if (manageCategory) {
            manageCategory.addEventListener('change', this.filterManageArticles.bind(this));
        }

        // Edit modal events
        this.setupEditModalEvents();
    }

    setupEditModalEvents() {
        const editModal = document.getElementById('editModal');
        const editModalClose = document.getElementById('editModalClose');

        if (editModalClose) {
            editModalClose.addEventListener('click', () => this.closeEditModal());
        }

        if (editModal) {
            editModal.addEventListener('click', (e) => {
                if (e.target === editModal) this.closeEditModal();
            });
        }

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && editModal && editModal.classList.contains('active')) {
                this.closeEditModal();
            }
        });
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
        document.getElementById(`${tabName}Tab`).classList.add('active');

        this.currentTab = tabName;

        // Refresh content based on active tab
        if (tabName === 'manage') {
            this.loadManageArticles();
        } else if (tabName === 'stats') {
            this.updateStats();
        }
    }

    async handleArticleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const articleData = {
            title: formData.get('title') || document.getElementById('title').value,
            author: formData.get('author') || document.getElementById('author').value,
            authorPhoto: formData.get('authorPhoto') || document.getElementById('authorPhoto').value,
            category: formData.get('category') || document.getElementById('category').value,
            tags: (formData.get('tags') || document.getElementById('tags').value).split(',').map(tag => tag.trim()).filter(Boolean),
            excerpt: formData.get('excerpt') || document.getElementById('excerpt').value,
            content: (formData.get('content') || document.getElementById('content').value).replace(/\n/g, '</p><p>')
        };

        // Wrap content in paragraphs if not already formatted
        if (articleData.content && !articleData.content.includes('<p>')) {
            articleData.content = `<p>${articleData.content}</p>`;
        }

        try {
            const newArticle = window.dataManager.addArticle(articleData);
            this.showMessage('مقاله با موفقیت اضافه شد', 'success');
            e.target.reset();
            
            // Update manage tab if it's visible
            if (this.currentTab === 'manage') {
                this.loadManageArticles();
            }
        } catch (error) {
            console.error('Error adding article:', error);
    init() {
        this.loadArticles();
        this.setupTabs();
        this.setupForm();
        this.setupEditModal();
        this.setupSearch();
        this.updateStats();
    }
        
    setupTabs() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.switchTab(btn.dataset.tab);
            });
        });
                article.title.toLowerCase().includes(searchTerm) ||
                article.author.toLowerCase().includes(searchTerm) ||
    loadArticles() {
        try {
            this.articles = JSON.parse(localStorage.getItem('adminArticles')) || [];
        } catch {
            this.articles = [];
        }
        this.renderArticlesTable();
    }
        this.renderManageTable(articles);
    updateStats() {
        document.getElementById('totalArticles').textContent = this.articles.length;
        document.getElementById('totalCategories').textContent = ['technology','art','culture','science'].length;
        document.getElementById('totalFavorites').textContent = this.getFavoritesCount();
        this.renderCategoryChart();
    }
            tableBody.innerHTML = `
                    </td>
            `;
                    <div style="max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
    renderArticlesTable() {
        const tbody = document.getElementById('articlesTableBody');
        if (!tbody) return;
        tbody.innerHTML = '';
        this.articles.forEach(article => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${article.title}</td>
                <td>${article.author}</td>
                <td>${this.getCategoryLabel(article.category)}</td>
                <td>${this.formatDate(article.createdAt)}</td>
                <td>
                    <button class="edit-btn" data-id="${article.id}"><i class="fas fa-edit"></i></button>
                    <button class="delete-btn" data-id="${article.id}"><i class="fas fa-trash"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });
        this.setupTableActions();
    }
        document.getElementById('editId').value = article.id;
        document.getElementById('editTitle').value = article.title;
        document.getElementById('editAuthor').value = article.author;
        document.getElementById('editAuthorPhoto').value = article.authorPhoto || '';
        document.getElementById('editCategory').value = article.category;
        document.getElementById('editTags').value = article.tags.join(', ');
        
        // Convert HTML back to plain text for editing
        const plainContent = article.content.replace(/<p>/g, '').replace(/<\/p>/g, '\n').trim();
        document.getElementById('editContent').value = plainContent;

        // Show modal
        const editModal = document.getElementById('editModal');
        editModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    async handleEditSubmit(e) {
        e.preventDefault();
        
        const articleId = this.editingArticleId;
        if (!articleId) return;

        const updatedData = {
            title: document.getElementById('editTitle').value,
            author: document.getElementById('editAuthor').value,
            authorPhoto: document.getElementById('editAuthorPhoto').value,
            category: document.getElementById('editCategory').value,
            tags: document.getElementById('editTags').value.split(',').map(tag => tag.trim()).filter(Boolean),
            content: document.getElementById('editContent').value.replace(/\n/g, '</p><p>')
        };

        // Wrap content in paragraphs if not already formatted
        if (updatedData.content && !updatedData.content.includes('<p>')) {
            updatedData.content = `<p>${updatedData.content}</p>`;
        }

        try {
            window.dataManager.updateArticle(articleId, updatedData);
            this.showMessage('مقاله با موفقیت به‌روزرسانی شد', 'success');
            this.closeEditModal();
            this.loadManageArticles();
        } catch (error) {
            console.error('Error updating article:', error);
            this.showMessage('خطا در به‌روزرسانی مقاله', 'error');
        }
    }

    closeEditModal() {
        const editModal = document.getElementById('editModal');
        if (editModal) {
            editModal.classList.remove('active');
            document.body.style.overflow = 'auto';
            this.editingArticleId = null;
        }
    }

    async deleteArticle(articleId) {
        const article = window.dataManager.getArticleById(articleId);
        if (!article) return;

        const confirmed = confirm(`آیا مطمئن هستید که می‌خواهید مقاله "${article.title}" را حذف کنید؟`);
        if (!confirmed) return;

        try {
            window.dataManager.deleteArticle(articleId);
            this.showMessage('مقاله با موفقیت حذف شد', 'success');
            this.loadManageArticles();
            this.updateStats();
        } catch (error) {
            console.error('Error deleting article:', error);
            this.showMessage('خطا در حذف مقاله', 'error');
        }
    }

    updateStats() {
        const stats = window.dataManager.getStats();
        
        // Update stat cards
        const totalArticles = document.getElementById('totalArticles');
        const totalFavorites = document.getElementById('totalFavorites');
        
        if (totalArticles) totalArticles.textContent = stats.totalArticles;
        if (totalFavorites) totalFavorites.textContent = stats.totalFavorites;

        // Update category chart
        this.renderCategoryChart(stats.categoryStats);
    }

    renderCategoryChart(categoryStats) {
        const categoryChart = document.getElementById('categoryChart');
        if (!categoryChart) return;

        const categories = {
            'technology': 'فناوری',
            'art': 'هنر', 
            'culture': 'فرهنگ',
            'science': 'علم'
        };

        categoryChart.innerHTML = '';

        Object.entries(categories).forEach(([key, label]) => {
            const count = categoryStats[key] || 0;
            const statDiv = document.createElement('div');
            statDiv.className = 'category-stat';
            statDiv.innerHTML = `
                <span>${label}</span>
                <span>${count} مقاله</span>
            `;
            categoryChart.appendChild(statDiv);
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

    // Export functionality
    exportData() {
        const data = window.dataManager.exportData();
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `persian-magazine-backup-${new Date().getTime()}.json`;
        link.click();
    }

    // Import functionality
    importData(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                window.dataManager.importData(data);
                this.showMessage('داده‌ها با موفقیت بازیابی شد', 'success');
                this.loadManageArticles();
                this.updateStats();
            } catch (error) {
                console.error('Error importing data:', error);
                this.showMessage('خطا در بازیابی داده‌ها', 'error');
            }
        };
        reader.readAsText(file);
    }
}

// Make functions globally available for onclick handlers
window.adminPanel = null;

// Initialize admin panel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.adminPanel = new AdminPanel();
});

// Global functions for onclick handlers
window.closeEditModal = () => {
    if (window.adminPanel) {
        window.adminPanel.closeEditModal();
    }
};