<?php
require_once 'config/database.php';

class Article {
    private $conn;
    private $table_name = "articles";

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    public function getAll($page = 1, $limit = ITEMS_PER_PAGE, $category = null, $search = null) {
        $offset = ($page - 1) * $limit;
        
        $sql = "SELECT a.*, au.name as author_name, au.image as author_image, 
                       c.name as category_name, c.slug as category_slug, c.color as category_color
                FROM " . $this->table_name . " a
                LEFT JOIN authors au ON a.author_id = au.id
                LEFT JOIN categories c ON a.category_id = c.id
                WHERE a.status = 'published'";
        
        $params = [];
        
        if ($category) {
            $sql .= " AND c.slug = :category";
            $params[':category'] = $category;
        }
        
        if ($search) {
            $sql .= " AND (a.title LIKE :search OR a.content LIKE :search OR au.name LIKE :search)";
            $params[':search'] = '%' . $search . '%';
        }
        
        $sql .= " ORDER BY a.created_at DESC LIMIT :limit OFFSET :offset";
        
        $stmt = $this->conn->prepare($sql);
        
        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }
        
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getCount($category = null, $search = null) {
        $sql = "SELECT COUNT(*) as total FROM " . $this->table_name . " a
                LEFT JOIN authors au ON a.author_id = au.id
                LEFT JOIN categories c ON a.category_id = c.id
                WHERE a.status = 'published'";
        
        $params = [];
        
        if ($category) {
            $sql .= " AND c.slug = :category";
            $params[':category'] = $category;
        }
        
        if ($search) {
            $sql .= " AND (a.title LIKE :search OR a.content LIKE :search OR au.name LIKE :search)";
            $params[':search'] = '%' . $search . '%';
        }
        
        $stmt = $this->conn->prepare($sql);
        
        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }
        
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result['total'];
    }

    public function getById($id) {
        $sql = "SELECT a.*, au.name as author_name, au.image as author_image, au.bio as author_bio,
                       c.name as category_name, c.slug as category_slug, c.color as category_color
                FROM " . $this->table_name . " a
                LEFT JOIN authors au ON a.author_id = au.id
                LEFT JOIN categories c ON a.category_id = c.id
                WHERE a.id = :id AND a.status = 'published'";
        
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        
        $article = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($article) {
            // Increment view count
            $this->incrementViews($id);
            
            // Parse tags
            if ($article['tags']) {
                $article['tags'] = json_decode($article['tags'], true);
            } else {
                $article['tags'] = [];
            }
        }
        
        return $article;
    }

    public function incrementViews($id) {
        $sql = "UPDATE " . $this->table_name . " SET views = views + 1 WHERE id = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
    }

    public function create($data) {
        $sql = "INSERT INTO " . $this->table_name . " 
                (title, slug, excerpt, content, author_id, category_id, featured_image, tags, status) 
                VALUES (:title, :slug, :excerpt, :content, :author_id, :category_id, :featured_image, :tags, :status)";
        
        $stmt = $this->conn->prepare($sql);
        
        $stmt->bindParam(':title', $data['title']);
        $stmt->bindParam(':slug', $data['slug']);
        $stmt->bindParam(':excerpt', $data['excerpt']);
        $stmt->bindParam(':content', $data['content']);
        $stmt->bindParam(':author_id', $data['author_id']);
        $stmt->bindParam(':category_id', $data['category_id']);
        $stmt->bindParam(':featured_image', $data['featured_image']);
        $stmt->bindParam(':tags', $data['tags']);
        $stmt->bindParam(':status', $data['status']);
        
        return $stmt->execute();
    }

    public function update($id, $data) {
        $sql = "UPDATE " . $this->table_name . " 
                SET title = :title, slug = :slug, excerpt = :excerpt, content = :content, 
                    author_id = :author_id, category_id = :category_id, featured_image = :featured_image, 
                    tags = :tags, status = :status, updated_at = CURRENT_TIMESTAMP
                WHERE id = :id";
        
        $stmt = $this->conn->prepare($sql);
        
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':title', $data['title']);
        $stmt->bindParam(':slug', $data['slug']);
        $stmt->bindParam(':excerpt', $data['excerpt']);
        $stmt->bindParam(':content', $data['content']);
        $stmt->bindParam(':author_id', $data['author_id']);
        $stmt->bindParam(':category_id', $data['category_id']);
        $stmt->bindParam(':featured_image', $data['featured_image']);
        $stmt->bindParam(':tags', $data['tags']);
        $stmt->bindParam(':status', $data['status']);
        
        return $stmt->execute();
    }

    public function delete($id) {
        $sql = "DELETE FROM " . $this->table_name . " WHERE id = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }

    public function getAllForAdmin($page = 1, $limit = 20, $search = '', $categoryFilter = null) {
        $offset = ($page - 1) * $limit;
        
        $sql = "SELECT a.*, au.name as author_name, c.name as category_name
                FROM " . $this->table_name . " a
                LEFT JOIN authors au ON a.author_id = au.id
                LEFT JOIN categories c ON a.category_id = c.id
                WHERE 1=1";
        
        $params = [];
        
        if (!empty($search)) {
            $sql .= " AND (a.title LIKE :search OR a.content LIKE :search OR au.name LIKE :search)";
            $params[':search'] = '%' . $search . '%';
        }
        
        if ($categoryFilter) {
            $sql .= " AND a.category_id = :category";
            $params[':category'] = $categoryFilter;
        }
        
        $sql .= " ORDER BY a.created_at DESC LIMIT :limit OFFSET :offset";
        
        $stmt = $this->conn->prepare($sql);
        
        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }
        
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getAdminCount($search = '', $categoryFilter = null) {
        $sql = "SELECT COUNT(*) as total FROM " . $this->table_name . " a
                LEFT JOIN authors au ON a.author_id = au.id
                WHERE 1=1";
        
        $params = [];
        
        if (!empty($search)) {
            $sql .= " AND (a.title LIKE :search OR a.content LIKE :search OR au.name LIKE :search)";
            $params[':search'] = '%' . $search . '%';
        }
        
        if ($categoryFilter) {
            $sql .= " AND a.category_id = :category";
            $params[':category'] = $categoryFilter;
        }
        
        $stmt = $this->conn->prepare($sql);
        
        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }
        
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result['total'];
    }

    public function generateSlug($title) {
        // Simple slug generation for Persian text
        $slug = trim($title);
        $slug = str_replace(' ', '-', $slug);
        $slug = preg_replace('/[^a-zA-Z0-9\-\u0600-\u06FF]/', '', $slug);
        
        // Check if slug exists
        $originalSlug = $slug;
        $counter = 1;
        
        while ($this->slugExists($slug)) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }
        
        return $slug;
    }

    private function slugExists($slug) {
        $sql = "SELECT COUNT(*) as count FROM " . $this->table_name . " WHERE slug = :slug";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':slug', $slug);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result['count'] > 0;
    }
}
?>