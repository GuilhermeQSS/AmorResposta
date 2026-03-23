CREATE TABLE IF NOT EXISTS documentos (
    doc_id INT AUTO_INCREMENT PRIMARY KEY,
    doc_titulo VARCHAR(255) NOT NULL,
    doc_tipo VARCHAR(100) NOT NULL,
    doc_data_criacao DATE,
    doc_descricao TEXT,
    doc_link VARCHAR(500)
);
