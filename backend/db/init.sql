CREATE SCHEMA IF NOT EXISTS `amorresposta` DEFAULT CHARACTER SET utf8;
USE `amorresposta` ;

CREATE TABLE IF NOT EXISTS `beneficiarios` (
  `ben_id` INT NOT NULL AUTO_INCREMENT,
  `ben_nome` VARCHAR(45) NULL,
  `ben_estado` VARCHAR(2) NULL,
  `ben_cidade` VARCHAR(100) NULL,
  `ben_bairro` VARCHAR(100) NULL,
  `ben_rua` VARCHAR(100) NULL,
  `ben_numero` INT NULL,
  `ben_endereco` VARCHAR(255) NULL,
  `ben_telefone` VARCHAR(20) NULL,
  `ben_usuario` VARCHAR(45) NULL,
  `ben_senha` VARCHAR(45) NULL,
  `ben_cpf` VARCHAR(45) NULL,
  PRIMARY KEY (`ben_id`)
);


CREATE TABLE IF NOT EXISTS `documentos` (
  `doc_id` INT NOT NULL AUTO_INCREMENT,
  `doc_descricao` VARCHAR(45) NULL,
  `doc_dataCriacao` DATE NULL,
  `doc_caminho` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`doc_id`)
);

CREATE TABLE IF NOT EXISTS `despesas` (
  `des_id` INT NOT NULL AUTO_INCREMENT,
  `des_valor` DECIMAL(10,2) NULL,
  `des_descricao` VARCHAR(45) NULL,
  `doc_id` INT NULL,
  PRIMARY KEY (`des_id`)
);

CREATE TABLE IF NOT EXISTS `doadores` (
  `doad_id` INT NOT NULL AUTO_INCREMENT,
  `doad_nome` VARCHAR(45) NULL,
  `doad_cpf` VARCHAR(45) NULL,
  `doad_telefone` VARCHAR(45) NULL,
  `doad_endereco` VARCHAR(45) NULL,
  PRIMARY KEY (`doad_id`)
);

CREATE TABLE IF NOT EXISTS `doacoes` (
  `doa_id` INT NOT NULL AUTO_INCREMENT,
  `doa_dataEntrega` DATE NULL,
  `doa_origem` VARCHAR(100) NULL,
  `doa_formaEntrega` VARCHAR(45) NULL,
  `doa_observacao` VARCHAR(255) NULL,
  `doad_id` INT NOT NULL,
  PRIMARY KEY (`doa_id`)
);

CREATE TABLE IF NOT EXISTS `itens` (
  `item_id` INT NOT NULL AUTO_INCREMENT,
  `item_descricao` VARCHAR(45) NULL,
  `item_nome` VARCHAR(45) NULL,
  `item_unidadeMedida` VARCHAR(45) NULL,
  `item_tipo` VARCHAR(45) NULL,
  `item_possuiValidade` TINYINT NULL,
  PRIMARY KEY (`item_id`)
);

CREATE TABLE IF NOT EXISTS `lotes` (
  `lot_id` INT NOT NULL AUTO_INCREMENT,
  `item_id` INT NOT NULL,
  `lot_validade` DATE NULL,
  `lot_qtde` INT NULL,
  PRIMARY KEY (`lot_id`)
);

CREATE TABLE IF NOT EXISTS `entradaDoacoes` (
  `doa_id` INT NOT NULL,
  `lot_id` INT NOT NULL,
  `doc_id` INT NULL,
  PRIMARY KEY (`doa_id`, `lot_id`)
);

CREATE TABLE IF NOT EXISTS `encontros` (
  `enc_id` INT NOT NULL AUTO_INCREMENT,
  `enc_data` DATE NULL,
  `enc_hora` TIME NULL,
  `enc_disponibilidade` CHAR(1) NULL,
  `enc_qtdeMax` INT NULL,
  `enc_qtde` INT NULL,
  `enc_local` VARCHAR(45) NULL,
  `enc_titulo` VARCHAR(100) NULL,
  `enc_descricao` VARCHAR(100) NULL,
  `enc_cancelado` CHAR(1) NOT NULL DEFAULT 'N',
  `enc_motivo_cancelamento` VARCHAR(255) NULL,
  `enc_detalhes_cancelamento` TEXT NULL,
  `enc_data_cancelamento` DATE NULL,
  PRIMARY KEY (`enc_id`)
);

ALTER TABLE `encontros`
  MODIFY COLUMN `enc_disponibilidade` CHAR(1) NULL;

SET @add_enc_cancelado = IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'encontros'
      AND COLUMN_NAME = 'enc_cancelado') = 0,
  'ALTER TABLE encontros ADD COLUMN enc_cancelado CHAR(1) NOT NULL DEFAULT ''N''',
  'SELECT 1'
);
PREPARE stmt FROM @add_enc_cancelado;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @add_enc_motivo_cancelamento = IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'encontros'
      AND COLUMN_NAME = 'enc_motivo_cancelamento') = 0,
  'ALTER TABLE encontros ADD COLUMN enc_motivo_cancelamento VARCHAR(255) NULL',
  'SELECT 1'
);
PREPARE stmt FROM @add_enc_motivo_cancelamento;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @add_enc_detalhes_cancelamento = IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'encontros'
      AND COLUMN_NAME = 'enc_detalhes_cancelamento') = 0,
  'ALTER TABLE encontros ADD COLUMN enc_detalhes_cancelamento TEXT NULL',
  'SELECT 1'
);
PREPARE stmt FROM @add_enc_detalhes_cancelamento;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @add_enc_data_cancelamento = IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'encontros'
      AND COLUMN_NAME = 'enc_data_cancelamento') = 0,
  'ALTER TABLE encontros ADD COLUMN enc_data_cancelamento DATE NULL',
  'SELECT 1'
);
PREPARE stmt FROM @add_enc_data_cancelamento;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

CREATE TABLE IF NOT EXISTS `funcionarios` (
  `fun_id` INT NOT NULL AUTO_INCREMENT,
  `fun_nome` VARCHAR(45) NULL,
  `fun_usuario` VARCHAR(45) NULL,
  `fun_senha` VARCHAR(45) NULL,
  `fun_cargo` CHAR(45) NULL,
  `fun_cpf` VARCHAR(45) NULL,
  `fun_telefone` VARCHAR(45) NULL,
  PRIMARY KEY (`fun_id`)
);

SET @add_fun_cpf = IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'funcionarios'
      AND COLUMN_NAME = 'fun_cpf') = 0,
  'ALTER TABLE funcionarios ADD COLUMN fun_cpf VARCHAR(45) NULL',
  'SELECT 1'
);
PREPARE stmt FROM @add_fun_cpf;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @add_fun_telefone = IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'funcionarios'
      AND COLUMN_NAME = 'fun_telefone') = 0,
  'ALTER TABLE funcionarios ADD COLUMN fun_telefone VARCHAR(45) NULL',
  'SELECT 1'
);
PREPARE stmt FROM @add_fun_telefone;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;


CREATE TABLE IF NOT EXISTS `lotesDoados` (
  `lotd_id` INT NOT NULL,
  `ben_id` INT NOT NULL,
  `data` DATE NULL,
  PRIMARY KEY (`lotd_id`)
);

CREATE TABLE IF NOT EXISTS `lotesDoadosLotes` (
  `lotd_id` INT NOT NULL,
  `lot_id` INT NOT NULL,
  `qtde` INT NULL,
  PRIMARY KEY (`lotd_id`, `lot_id`)
);

CREATE TABLE IF NOT EXISTS `encontrosItens` (
  `enc_id` INT NOT NULL,
  `lot_id` INT NOT NULL,
  `qtde` INT NULL,
  PRIMARY KEY (`enc_id`, `lot_id`)
);

CREATE TABLE IF NOT EXISTS `beneficiariosEncontros` (
  `enc_id` INT NOT NULL,
  `ben_id` INT NOT NULL,
  `participou` TINYINT NULL,
  PRIMARY KEY (`enc_id`, `ben_id`)
);

CREATE TABLE IF NOT EXISTS `funcionariosEncontros` (
  `fun_id` INT NOT NULL,
  `enc_id` INT NOT NULL,
  `participou` TINYINT NULL,
  PRIMARY KEY (`fun_id`, `enc_id`)
);

CREATE TABLE IF NOT EXISTS `participantes` (
  `enc_id` INT NOT NULL,
  `ben_id` INT NOT NULL,
  `participou` CHAR(1) NULL,
  PRIMARY KEY (`enc_id`, `ben_id`)
);

CREATE TABLE IF NOT EXISTS `responsaveis` (
  `fun_id` INT NOT NULL,
  `enc_id` INT NOT NULL,
  `participou` CHAR(1) NULL,
  PRIMARY KEY (`fun_id`, `enc_id`)
);

CREATE TABLE IF NOT EXISTS `materiais` (
  `enc_id` INT NOT NULL,
  `item_id` INT NOT NULL,
  `qtde` INT NULL,
  `utilizado` CHAR(1) NULL,
  PRIMARY KEY (`enc_id`, `item_id`)
);

alter table `despesas`
	add CONSTRAINT `fk_despesas_documentos`
		FOREIGN KEY (`doc_id`) REFERENCES `documentos` (`doc_id`);

alter table `doacoes`
	add CONSTRAINT `fk_doacoes_doador`
		FOREIGN KEY (`doad_id`) REFERENCES `doadores` (`doad_id`);

alter table `lotes`
	add CONSTRAINT `fk_lotes_itens`
		FOREIGN KEY (`item_id`) REFERENCES `itens` (`item_id`);

alter table `lotesDoados`
	add CONSTRAINT `fk_lotesDoados_beneficiarios`
    	FOREIGN KEY (`ben_id`) REFERENCES `beneficiarios` (`ben_id`);

alter table `lotesDoadosLotes`
	add CONSTRAINT `fk_lotesDoadosLotes_lotesDoados`
    	FOREIGN KEY (`lotd_id`) REFERENCES `lotesDoados` (`lotd_id`),
  	add CONSTRAINT `fk_lotesDoadosLotes_lotes`
    	FOREIGN KEY (`lot_id`) REFERENCES `lotes` (`lot_id`);

alter table `entradaDoacoes`
	add	CONSTRAINT `fk_entradaDoacoes_doacoes`
		FOREIGN KEY (`doa_id`) REFERENCES `doacoes` (`doa_id`),
	add	CONSTRAINT `fk_entradaDoacoes_lotes`
		FOREIGN KEY (`lot_id`) REFERENCES `lotes` (`lot_id`),
	add	CONSTRAINT `fk_entradaDoacoes_documentos`
		FOREIGN KEY (`doc_id`) REFERENCES `documentos` (`doc_id`);

alter table `encontrosItens`
	add CONSTRAINT `fk_encontrosItens_encontros`
		FOREIGN KEY (`enc_id`) REFERENCES `encontros` (`enc_id`),
	add CONSTRAINT `fk_encontrosItens_lotes`
		FOREIGN KEY (`lot_id`) REFERENCES `lotes` (`lot_id`);

alter table `beneficiariosEncontros`
	add CONSTRAINT `fk_EParticipantes_Beneficiarios`
		FOREIGN KEY (`ben_id`) REFERENCES `amorresposta`.`beneficiarios` (`ben_id`),
	add CONSTRAINT `fk_Participantes_Encontros`
		FOREIGN KEY (`enc_id`) REFERENCES `amorresposta`.`encontros` (`enc_id`);

alter table `funcionariosEncontros`
	add CONSTRAINT `fk_funcionariosEncontros_encontros`
		FOREIGN KEY (`enc_id`) REFERENCES `encontros` (`enc_id`),
	add CONSTRAINT `fk_funcionariosEncontros_funcionarios`
		FOREIGN KEY (`fun_id`) REFERENCES `funcionarios` (`fun_id`);

INSERT INTO funcionarios (fun_nome, fun_usuario, fun_senha, fun_cargo, fun_cpf, fun_telefone) 
VALUES ("PerfilTeste", "adm", "adm", "Administrador", "99131079032", "1899999999");
