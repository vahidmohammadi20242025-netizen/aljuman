<?php
require_once 'config/database.php';

class Category {
    private $conn;
    private $table_name = "categories";

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    public function getAll() {
        $sql = "SELECT * FROM " . $this->table_name . " ORDER BY name";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getById($id) {
        $sql = "SELECT * FROM " . $this->table_name . " WHERE id = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function getBySlug($slug) {
        $sql = "SELECT * FROM " . $this->table_name . " WHERE slug = :slug";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':slug', $slug);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function create($data) {
        $sql = "INSERT INTO " . $this->table_name . " (name, slug, description, color) 
                VALUES (:name, :slug, :description, :color)";
        
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':name', $data['name']);
        $stmt->bindParam(':slug', $data['slug']);
        $stmt->bindParam(':description', $data['description']);
        $stmt->bindParam(':color', $data['color']);
        
        return $stmt->execute();
    }

    public function update($id, $data) {
        $sql = "UPDATE " . $this->table_name . " 
                SET name = :name, slug = :slug, description = :description, color = :color
                WHERE id = :id";
        
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':name', $data['name']);
        $stmt->bindParam(':slug', $data['slug']);
        $stmt->bindParam(':description', $data['description']);
        $stmt->bindParam(':color', $data['color']);
        
        return $stmt->execute();
    }

    public function delete($id) {
        $sql = "DELETE FROM " . $this->table_name . " WHERE id = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }

    public function getStats() {
        $sql = "SELECT c.name, c.slug, c.color, COUNT(a.id) as article_count
                FROM " . $this->table_name . " c
                LEFT JOIN articles a ON c.id = a.category_id AND a.status = 'published'
                GROUP BY c.id
                ORDER BY c.name";
        
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?>