<?php
require_once 'config/database.php';

class SiteSettings {
    private $conn;
    private $table_name = "site_settings";

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    public function get($key) {
        $sql = "SELECT setting_value FROM " . $this->table_name . " WHERE setting_key = :key";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':key', $key);
        $stmt->execute();
        
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result ? $result['setting_value'] : null;
    }

    public function getAll() {
        $sql = "SELECT setting_key, setting_value FROM " . $this->table_name;
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        
        $settings = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $settings[$row['setting_key']] = $row['setting_value'];
        }
        
        return $settings;
    }

    public function set($key, $value) {
        $sql = "INSERT INTO " . $this->table_name . " (setting_key, setting_value) 
                VALUES (:key, :value) 
                ON DUPLICATE KEY UPDATE setting_value = :value, updated_at = CURRENT_TIMESTAMP";
        
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':key', $key);
        $stmt->bindParam(':value', $value);
        
        return $stmt->execute();
    }

    public function updateMultiple($settings) {
        $this->conn->beginTransaction();
        
        try {
            foreach ($settings as $key => $value) {
                $this->set($key, $value);
            }
            $this->conn->commit();
            return true;
        } catch (Exception $e) {
            $this->conn->rollback();
            return false;
        }
    }
}
?>