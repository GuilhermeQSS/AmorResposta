ALTER TABLE funcionarios
    MODIFY COLUMN fun_id INT NOT NULL AUTO_INCREMENT;

ALTER TABLE beneficiarios
    MODIFY COLUMN ben_id INT NOT NULL AUTO_INCREMENT;

ALTER TABLE documentos
    MODIFY COLUMN doc_id INT NOT NULL AUTO_INCREMENT;

ALTER TABLE doacoes
    MODIFY COLUMN doa_id INT NOT NULL AUTO_INCREMENT,
    MODIFY COLUMN doa_doadorNome VARCHAR(100) NULL,
    CHANGE COLUMN doc_dataEntrega doa_dataEntrega DATE NULL,
    ADD COLUMN doa_origem VARCHAR(100) NULL AFTER doa_dataEntrega,
    ADD COLUMN doa_formaEntrega VARCHAR(45) NULL AFTER doa_origem,
    ADD COLUMN doa_tipo VARCHAR(45) NULL AFTER doa_formaEntrega,
    ADD COLUMN doa_observacao VARCHAR(255) NULL AFTER doa_tipo;
