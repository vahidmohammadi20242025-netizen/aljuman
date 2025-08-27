// Data Management for Persian Magazine
class DataManager {
    constructor() {
        this.articles = this.loadArticles();
        this.favorites = this.loadFavorites();
        this.initializeDefaultData();
    }

    initializeDefaultData() {
        if (this.articles.length === 0) {
            this.articles = [
                {
                    id: '1',
                    title: 'آینده هوش مصنوعی در ایران',
                    author: 'دکتر علی محمدی',
                    authorPhoto: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=150',
                    category: 'technology',
                    tags: ['هوش مصنوعی', 'فناوری', 'ایران'],
                    content: `
                        <p>بررسی روند توسعه هوش مصنوعی در ایران و چالش‌های پیش رو در این حوزه. این مقاله نگاهی جامع به وضعیت فعلی و آینده فناوری هوش مصنوعی در کشور دارد.</p>
                        
                        <p>هوش مصنوعی یکی از مهم‌ترین فناوری‌های قرن بیست و یکم محسوب می‌شود که در حال تغییر بنیادین دنیای ما است. در ایران نیز این فناوری در حال رشد و توسعه است و آینده‌ای روشن در انتظار آن می‌باشد.</p>
                        
                        <p>در سال‌های اخیر، شاهد رشد قابل توجهی در حوزه هوش مصنوعی در ایران بوده‌ایم. دانشگاه‌ها و مراکز تحقیقاتی کشور در حال کار بر روی پروژه‌های مختلفی هستند که می‌تواند ایران را در مقام یکی از کشورهای پیشرو در این حوزه قرار دهد.</p>
                        
                        <p>چالش‌های موجود شامل کمبود سرمایه‌گذاری، نیاز به نیروی متخصص بیشتر و ضرورت ایجاد زیرساخت‌های مناسب است. اما با وجود این چالش‌ها، پتانسیل بالای کشور در این حوزه قابل انکار نیست.</p>
                        
                        <p>آینده هوش مصنوعی در ایران وابسته به سیاست‌گذاری‌های درست، سرمایه‌گذاری مناسب و تربیت نیروی متخصص است. امیدواریم بتوانیم شاهد رشد بیشتر این فناوری در کشور باشیم.</p>
                    `,
                    createdAt: new Date('2024-01-15').toISOString()
                },
                {
                    id: '2',
                    title: 'هنر معاصر ایران و جهانی شدن',
                    author: 'استاد مریم حسینی',
                    authorPhoto: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
                    category: 'art',
                    tags: ['هنر معاصر', 'ایران', 'جهانی سازی'],
                    content: `
                        <p>نگاهی به تأثیر جهانی شدن بر هنر معاصر ایران و چگونگی حفظ هویت فرهنگی در عین پذیرش تحولات جهانی.</p>
                        
                        <p>هنر معاصر ایران در دوران جهانی شدن با چالش‌ها و فرصت‌های فراوانی روبرو شده است. از یک سو، هنرمندان ایرانی امکان عرضه آثار خود در سطح بین‌المللی را پیدا کرده‌اند و از سوی دیگر، با ضرورت حفظ هویت فرهنگی خود مواجه هستند.</p>
                        
                        <p>هنرمندان معاصر ایران توانسته‌اند ترکیب منحصر به فردی از سنت و مدرنیته ایجاد کنند. آثار آنها در گالری‌ها و موزه‌های معتبر جهان به نمایش درآمده و توجه منتقدان هنری بین‌المللی را جلب کرده است.</p>
                        
                        <p>این موفقیت‌ها نتیجه سال‌ها تلاش و کوشش هنرمندان ایرانی است که علی‌رغم محدودیت‌ها و چالش‌ها، همچنان بر غنای هنر ایرانی می‌افزایند و آن را در سطح جهانی معرفی می‌کنند.</p>
                        
                        <p>آینده هنر معاصر ایران به حمایت بیشتر از هنرمندان، ایجاد بستر مناسب برای عرضه آثار و تعامل بیشتر با جامعه جهانی هنر وابسته است.</p>
                    `,
                    createdAt: new Date('2024-01-20').toISOString()
                },
                {
                    id: '3',
                    title: 'فرهنگ غذایی ایران در قرن نوزدهم',
                    author: 'پروفسور رضا کریمی',
                    authorPhoto: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
                    category: 'culture',
                    tags: ['فرهنگ', 'غذا', 'تاریخ', 'ایران'],
                    content: `
                        <p>مطالعه‌ای درباره تحولات فرهنگ غذایی ایران در قرن نوزدهم و تأثیرات اجتماعی و اقتصادی آن بر جامعه ایرانی.</p>
                        
                        <p>فرهنگ غذایی ایران در قرن نوزدهم دستخوش تحولات عمیقی شد که هنوز هم آثار آن در سفره ایرانی‌ها مشهود است. این تحولات تحت تأثیر عوامل مختلف اجتماعی، اقتصادی و فرهنگی صورت گرفت.</p>
                        
                        <p>ورود محصولات جدید کشاورزی، تغییر در الگوهای تجاری، و تعامل با فرهنگ‌های دیگر باعث شد تا غذاهای جدیدی وارد سفره ایرانی‌ها شود. در همین حال، غذاهای سنتی نیز دستخوش تغییراتی شدند.</p>
                        
                        <p>طبقات اجتماعی مختلف الگوهای متفاوتی از تغذیه داشتند. اشراف و طبقات مرفه امکان دسترسی به غذاهای متنوع‌تر و گران‌تر را داشتند، در حالی که طبقات کارگر و دهقان با محدودیت‌های بیشتری روبرو بودند.</p>
                        
                        <p>این دوران همچنین شاهد تدوین اولین کتاب‌های آشپزی به زبان فارسی بود که نقش مهمی در حفظ و انتقال دانش آشپزی ایرانی داشتند.</p>
                    `,
                    createdAt: new Date('2024-01-25').toISOString()
                },
                {
                    id: '4',
                    title: 'کشفیات جدید در نجوم ایران',
                    author: 'دکتر سارا احمدی',
                    authorPhoto: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=150',
                    category: 'science',
                    tags: ['نجوم', 'علم', 'کشف', 'ایران'],
                    content: `
                        <p>معرفی جدیدترین کشفیات علمی در حوزه نجوم که توسط دانشمندان ایرانی انجام شده و اهمیت آنها در علم جهانی.</p>
                        
                        <p>دانشمندان ایرانی در سال‌های اخیر کشفیات مهمی در حوزه نجوم انجام داده‌اند که مورد توجه جامعه علمی بین‌المللی قرار گرفته است. این کشفیات نشان‌دهنده رشد علم نجوم در ایران است.</p>
                        
                        <p>یکی از مهم‌ترین این کشفیات، شناسایی سیاره‌های فراخورشیدی جدید توسط تیم تحقیقاتی مرصد ملی ایران است. این کشف با استفاده از تکنیک‌های پیشرفته نجومی و همکاری با مراکز بین‌المللی انجام شده است.</p>
                        
                        <p>علاوه بر این، محققان ایرانی در زمینه مطالعه کهکشان‌های دوردست و بررسی ساختار جهان نیز دستاوردهای قابل توجهی داشته‌اند. این تحقیقات به درک بهتر ما از جهان کمک می‌کند.</p>
                        
                        <p>آینده نجوم در ایران با سرمایه‌گذاری بیشتر در تجهیزات، تربیت نیروهای متخصص و توسعه همکاری‌های بین‌المللی روشن خواهد بود.</p>
                    `,
                    createdAt: new Date('2024-02-01').toISOString()
                },
                {
                    id: '5',
                    title: 'برنامه‌نویسی و توسعه نرم‌افزار در ایران',
                    author: 'مهندس امیر رضایی',
                    authorPhoto: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150',
                    category: 'technology',
                    tags: ['برنامه‌نویسی', 'نرم‌افزار', 'فناوری'],
                    content: `
                        <p>بررسی وضعیت صنعت نرم‌افزار در ایران، چالش‌ها و فرصت‌های موجود برای برنامه‌نویسان ایرانی در بازار داخلی و بین‌المللی.</p>
                        
                        <p>صنعت نرم‌افزار در ایران طی دو دهه گذشته رشد چشمگیری داشته است. برنامه‌نویسان ایرانی امروزه نه تنها در بازار داخلی فعالیت می‌کنند، بلکه در پروژه‌های بین‌المللی نیز مشارکت دارند.</p>
                        
                        <p>یکی از نقاط قوت برنامه‌نویسان ایرانی، تسلط بر تکنولوژی‌های مدرن و قابلیت یادگیری سریع است. این ویژگی‌ها باعث شده تا بسیاری از شرکت‌های خارجی با تیم‌های ایرانی همکاری کنند.</p>
                        
                        <p>با این حال، چالش‌هایی نیز وجود دارد. محدودیت‌های بانکی، مشکلات ارتباط با بازارهای خارجی و کمبود سرمایه‌گذاری از جمله این چالش‌هاست.</p>
                        
                        <p>آینده صنعت نرم‌افزار ایران بستگی به حمایت دولت، سرمایه‌گذاری بخش خصوصی و توسعه زیرساخت‌های فناوری اطلاعات دارد.</p>
                    `,
                    createdAt: new Date('2024-02-05').toISOString()
                },
                {
                    id: '6',
                    title: 'خوشنویسی ایرانی در دوران مدرن',
                    author: 'استاد حسن نقاش',
                    authorPhoto: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150',
                    category: 'art',
                    tags: ['خوشنویسی', 'هنر', 'سنت', 'مدرنیته'],
                    content: `
                        <p>تحلیل تطبیقی خوشنویسی سنتی ایران با جنبش‌های مدرن هنری و چگونگی تأثیرگذاری متقابل آنها بر یکدیگر.</p>
                        
                        <p>خوشنویسی ایرانی یکی از کهن‌ترین هنرهای ایران است که در دوران مدرن نیز توانسته جایگاه ویژه خود را حفظ کند. این هنر کهن در تعامل با مدرنیته، تحولات جالبی را تجربه کرده است.</p>
                        
                        <p>خوشنویسان معاصر ایران توانسته‌اند عناصر سنتی خوشنویسی را با تکنیک‌ها و مفاهیم مدرن ترکیب کنند. این ترکیب منجر به خلق آثاری شده که هم ریشه در سنت دارند و هم پاسخگوی نیازهای زمان حاضر هستند.</p>
                        
                        <p>استفاده از ابزارهای دیجیتال، کار بر روی مواد و بسترهای جدید، و تعامل با سایر هنرهای تجسمی از ویژگی‌های خوشنویسی معاصر ایران است.</p>
                        
                        <p>آموزش خوشنویسی در دانشگاه‌ها و موسسات هنری نقش مهمی در انتقال این هنر به نسل‌های آینده دارد.</p>
                    `,
                    createdAt: new Date('2024-02-10').toISOString()
                }
            ];
            this.saveArticles();
        }
        
        // Initialize magazines if empty
        this.magazines = this.loadMagazines();
        if (this.magazines.length === 0) {
            this.magazines = [
                {
                    id: '1',
                    title: 'شماره ۱ - بهمن ۱۴۰۳',
                    month: 11,
                    year: 1403,
                    description: 'اولین شماره مجله فرهنگی نور با محوریت فناوری و هنر معاصر',
                    coverImage: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400',
                    pdfUrl: '#',
                    createdAt: new Date('2024-02-01').toISOString()
                }
            ];
            this.saveMagazines();
        }
    }

    // Article Management
    getAllArticles() {
        return [...this.articles].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    getArticleById(id) {
        return this.articles.find(article => article.id === id);
    }

    getArticlesByCategory(category) {
        if (category === 'all') return this.getAllArticles();
        return this.articles.filter(article => article.category === category)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    searchArticles(query) {
        const searchTerm = query.toLowerCase().trim();
        if (!searchTerm) return this.getAllArticles();

        return this.articles.filter(article => 
            article.title.toLowerCase().includes(searchTerm) ||
            article.content.toLowerCase().includes(searchTerm) ||
            article.author.toLowerCase().includes(searchTerm) ||
            article.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    addArticle(articleData) {
        const newArticle = {
            id: Date.now().toString(),
            ...articleData,
            excerpt: this.generateExcerpt(articleData.content, 200),
            createdAt: new Date().toISOString()
        };
        
        this.articles.unshift(newArticle);
        this.saveArticles();
        return newArticle;
    }

    updateArticle(id, updatedData) {
        const index = this.articles.findIndex(article => article.id === id);
        if (index !== -1) {
            this.articles[index] = {
                ...this.articles[index],
                ...updatedData,
                excerpt: updatedData.content ? this.generateExcerpt(updatedData.content, 200) : this.articles[index].excerpt
            };
            this.saveArticles();
            return this.articles[index];
        }
        return null;
    }

    deleteArticle(id) {
        const index = this.articles.findIndex(article => article.id === id);
        if (index !== -1) {
            const deleted = this.articles.splice(index, 1)[0];
            this.saveArticles();
            // Remove from favorites if exists
            this.removeFavorite(id);
            return deleted;
        }
        return null;
    }

    // Favorites Management
    getFavorites() {
        return this.favorites.map(id => this.getArticleById(id)).filter(Boolean);
    }

    addFavorite(articleId) {
        if (!this.favorites.includes(articleId)) {
            this.favorites.push(articleId);
            this.saveFavorites();
        }
    }

    removeFavorite(articleId) {
        const index = this.favorites.indexOf(articleId);
        if (index !== -1) {
            this.favorites.splice(index, 1);
            this.saveFavorites();
        }
    }

    isFavorite(articleId) {
        return this.favorites.includes(articleId);
    }

    // Magazine Management
    getAllMagazines() {
        return [...this.magazines].sort((a, b) => {
            if (a.year !== b.year) return b.year - a.year;
            return b.month - a.month;
        });
    }

    getMagazineById(id) {
        return this.magazines.find(magazine => magazine.id === id);
    }

    addMagazine(magazineData) {
        const newMagazine = {
            id: Date.now().toString(),
            ...magazineData,
            createdAt: new Date().toISOString()
        };
        
        this.magazines.unshift(newMagazine);
        this.saveMagazines();
        return newMagazine;
    }

    deleteMagazine(id) {
        const index = this.magazines.findIndex(magazine => magazine.id === id);
        if (index !== -1) {
            const deleted = this.magazines.splice(index, 1)[0];
            this.saveMagazines();
            return deleted;
        }
        return null;
    }

    // Statistics
    getStats() {
        const categoryStats = {};
        const categories = ['technology', 'art', 'culture', 'science'];
        
        categories.forEach(category => {
            categoryStats[category] = this.articles.filter(article => article.category === category).length;
        });

        return {
            totalArticles: this.articles.length,
            totalFavorites: this.favorites.length,
            totalMagazines: this.magazines.length,
            categoryStats
        };
    }

    // Category Labels
    getCategoryLabel(category) {
        const labels = {
            'technology': 'فناوری',
            'art': 'هنر',
            'culture': 'فرهنگ',
            'science': 'علم'
        };
        return labels[category] || category;
    }

    // Storage Methods
    loadArticles() {
        try {
            const stored = localStorage.getItem('persianMagazineArticles');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading articles:', error);
            return [];
        }
    }

    saveArticles() {
        try {
            localStorage.setItem('persianMagazineArticles', JSON.stringify(this.articles));
        } catch (error) {
            console.error('Error saving articles:', error);
        }
    }

    loadMagazines() {
        try {
            const stored = localStorage.getItem('persianMagazineMagazines');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading magazines:', error);
            return [];
        }
    }

    saveMagazines() {
        try {
            localStorage.setItem('persianMagazineMagazines', JSON.stringify(this.magazines));
        } catch (error) {
            console.error('Error saving magazines:', error);
        }
    }

    loadFavorites() {
        try {
            const stored = localStorage.getItem('persianMagazineFavorites');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading favorites:', error);
            return [];
        }
    }

    saveFavorites() {
        try {
            localStorage.setItem('persianMagazineFavorites', JSON.stringify(this.favorites));
        } catch (error) {
            console.error('Error saving favorites:', error);
        }
    }

    // Utility Methods
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('fa-IR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    getMonthName(monthNumber) {
        const months = [
            '', 'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
            'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
        ];
        return months[monthNumber] || '';
    }

    generateExcerpt(content, maxLength = 200) {
        const plainText = content.replace(/<[^>]*>/g, '');
        if (plainText.length <= maxLength) return plainText;
        
        return plainText.substring(0, maxLength).trim() + '...';
    }

    // Export/Import functionality for backup
    exportData() {
        return {
            articles: this.articles,
            favorites: this.favorites,
            magazines: this.magazines,
            exportDate: new Date().toISOString()
        };
    }

    importData(data) {
        if (data.articles && Array.isArray(data.articles)) {
            this.articles = data.articles;
            this.saveArticles();
        }
        if (data.favorites && Array.isArray(data.favorites)) {
            this.favorites = data.favorites;
            this.saveFavorites();
        }
        if (data.magazines && Array.isArray(data.magazines)) {
            this.magazines = data.magazines;
            this.saveMagazines();
        }
    }

    // Admin Authentication
    checkAdminAuth() {
        const adminSession = localStorage.getItem('adminSession');
        if (adminSession) {
            const session = JSON.parse(adminSession);
            const now = new Date().getTime();
            if (now - session.timestamp < 24 * 60 * 60 * 1000) { // 24 hours
                return true;
            } else {
                localStorage.removeItem('adminSession');
            }
        }
        return false;
    }

    adminLogin(username, password) {
        // Simple authentication - in production, use proper authentication
        if (username === 'admin' && password === 'admin123') {
            const session = {
                timestamp: new Date().getTime(),
                user: 'admin'
            };
            localStorage.setItem('adminSession', JSON.stringify(session));
            return true;
        }
        return false;
    }

    adminLogout() {
        localStorage.removeItem('adminSession');
    }
}

// Global data manager instance
window.dataManager = new DataManager();