<?php
require_once 'config/database.php';

class Magazine {
    private $conn;
    private $table_name = "magazines";

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    public function getAll() {
        $sql = "SELECT * FROM " . $this->table_name . " ORDER BY year DESC, month DESC";
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
        $sql = "INSERT INTO " . $this->table_name . " 
                (title, description, cover_image, pdf_file, issue_number, month, year) 
                VALUES (:title, :description, :cover_image, :pdf_file, :issue_number, :month, :year)";
        
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':title', $data['title']);
        $stmt->bindParam(':description', $data['description']);
        $stmt->bindParam(':cover_image', $data['cover_image']);
        $stmt->bindParam(':pdf_file', $data['pdf_file']);
        $stmt->bindParam(':issue_number', $data['issue_number']);
        $stmt->bindParam(':month', $data['month']);
        $stmt->bindParam(':year', $data['year']);
        
        return $stmt->execute();
    }

    public function update($id, $data) {
        $sql = "UPDATE " . $this->table_name . " 
                SET title = :title, description = :description, cover_image = :cover_image, 
                    pdf_file = :pdf_file, issue_number = :issue_number, month = :month, year = :year
                WHERE id = :id";
        
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':title', $data['title']);
        $stmt->bindParam(':description', $data['description']);
        $stmt->bindParam(':cover_image', $data['cover_image']);
        $stmt->bindParam(':pdf_file', $data['pdf_file']);
        $stmt->bindParam(':issue_number', $data['issue_number']);
        $stmt->bindParam(':month', $data['month']);
        $stmt->bindParam(':year', $data['year']);
        
        return $stmt->execute();
    }

    public function delete($id) {
        $sql = "DELETE FROM " . $this->table_name . " WHERE id = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }

    public function incrementDownloads($id) {
        $sql = "UPDATE " . $this->table_name . " SET downloads = downloads + 1 WHERE id = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }

    public function getMonthName($monthNumber) {
        $months = [
            1 => 'فروردین', 2 => 'اردیبهشت', 3 => 'خرداد', 4 => 'تیر',
            5 => 'مرداد', 6 => 'شهریور', 7 => 'مهر', 8 => 'آبان',
            9 => 'آذر', 10 => 'دی', 11 => 'بهمن', 12 => 'اسفند'
        ];
        return $months[$monthNumber] ?? '';
    }
}
?>