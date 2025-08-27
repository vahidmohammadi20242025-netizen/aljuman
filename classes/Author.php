<?php
require_once 'config/database.php';

class Author {
    private $conn;
    private $table_name = "authors";

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

    public function create($data) {
        $sql = "INSERT INTO " . $this->table_name . " (name, email, bio, image, social_links) 
                VALUES (:name, :email, :bio, :image, :social_links)";
        
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':name', $data['name']);
        $stmt->bindParam(':email', $data['email']);
        $stmt->bindParam(':bio', $data['bio']);
        $stmt->bindParam(':image', $data['image']);
        $stmt->bindParam(':social_links', $data['social_links']);
        
        return $stmt->execute();
    }

    public function update($id, $data) {
        $sql = "UPDATE " . $this->table_name . " 
                SET name = :name, email = :email, bio = :bio, image = :image, 
                    social_links = :social_links, updated_at = CURRENT_TIMESTAMP
                WHERE id = :id";
        
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':name', $data['name']);
        $stmt->bindParam(':email', $data['email']);
        $stmt->bindParam(':bio', $data['bio']);
        $stmt->bindParam(':image', $data['image']);
        $stmt->bindParam(':social_links', $data['social_links']);
        
        return $stmt->execute();
    }

    public function delete($id) {
        $sql = "DELETE FROM " . $this->table_name . " WHERE id = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }
}
?>