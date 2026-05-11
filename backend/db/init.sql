CREATE SCHEMA IF NOT EXISTS `amorresposta` DEFAULT CHARACTER SET utf8;
USE `amorresposta` ;

CREATE TABLE IF NOT EXISTS `beneficiarios` (
  `ben_id` INT NOT NULL AUTO_INCREMENT,
  `ben_nome` VARCHAR(45) NOT NULL,

  `ben_cpf` VARCHAR(45) NOT NULL UNIQUE,
  `ben_telefone` VARCHAR(20) NOT NULL,

  `ben_estado` VARCHAR(2) NOT NULL,
	`ben_cidade` VARCHAR(100) NOT NULL,
	`ben_bairro` VARCHAR(100) NOT NULL,
	`ben_rua` VARCHAR(100) NOT NULL,
	`ben_numero` INT NOT NULL,

  `ben_usuario` VARCHAR(45) NOT NULL UNIQUE,
  `ben_senha` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`ben_id`)
);

CREATE TABLE IF NOT EXISTS `documentos` (
  `doc_id` INT NOT NULL AUTO_INCREMENT,
  `doc_descricao` VARCHAR(45) NOT NULL,
  `doc_caminho` VARCHAR(45) NOT NULL UNIQUE,
  PRIMARY KEY (`doc_id`)
);

CREATE TABLE IF NOT EXISTS `despesas` (
  `des_id` INT NOT NULL AUTO_INCREMENT,
  `des_valor` DECIMAL(10,2) NOT NULL,
  `des_descricao` VARCHAR(45) NOT NULL,
  `doc_id` INT NULL,
  PRIMARY KEY (`des_id`)
);

CREATE TABLE IF NOT EXISTS `doadores` (
  `doad_id` INT NOT NULL AUTO_INCREMENT,
  `doad_nome` VARCHAR(45) NOT NULL,

  `doad_cpf` VARCHAR(45) NOT NULL,
  `doad_telefone` VARCHAR(45) NOT NULL,
  
  
  `doad_estado` VARCHAR(2) NOT NULL,
	`doad_cidade` VARCHAR(100) NOT NULL,
	`doad_bairro` VARCHAR(100) NOT NULL,
	`doad_rua` VARCHAR(100) NOT NULL,
	`doad_numero` INT NOT NULL,
  PRIMARY KEY (`doad_id`)
);

CREATE TABLE IF NOT EXISTS `doacoes` (
  `doa_id` INT NOT NULL AUTO_INCREMENT,
  `doa_dataEntrega` DATE NOT NULL,
  `doa_origem` VARCHAR(100) NOT NULL,
  `doa_formaEntrega` VARCHAR(45) NOT NULL,
  `doa_observacao` VARCHAR(255) NOT NULL,

  `doad_id` INT NOT NULL,
  PRIMARY KEY (`doa_id`)
);

CREATE TABLE IF NOT EXISTS `itens` (
  `item_id` INT NOT NULL AUTO_INCREMENT,
  `item_descricao` VARCHAR(45) NOT NULL,
  `item_nome` VARCHAR(45) NOT NULL,
  `item_unidadeMedida` VARCHAR(45) NOT NULL,
  `item_tipo` VARCHAR(45) NOT NULL,
  `item_possuiValidade` TINYINT NOT NULL,
  PRIMARY KEY (`item_id`)
);

CREATE TABLE IF NOT EXISTS `lotes` (
  `lot_id` INT NOT NULL AUTO_INCREMENT,
  
  `lot_validade` DATE NULL,
  `lot_qtde` DECIMAL(10,2) NOT NULL,

  `item_id` INT NOT NULL,
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
  `enc_data` DATE NOT NULL,
  `enc_horaInicio` TIME NOT NULL,
  `enc_horaFim` TIME NOT NULL,
  `enc_status` VARCHAR(20) NOT NULL DEFAULT 'a',
  `enc_qtdeMax` INT NOT NULL DEFAULT 1,
  `enc_qtde` INT NOT NULL DEFAULT 0,
  `enc_titulo` VARCHAR(100) NOT NULL,
  `enc_descricao` VARCHAR(100) NOT NULL,

  `enc_motivoCancelamento` VARCHAR(100) NULL,
  `enc_voluntariosAfetados` INT NOT NULL DEFAULT 0,
  `enc_lotesAfetados` INT NOT NULL DEFAULT 0,
  `enc_beneficiariosAfetados` INT NOT NULL DEFAULT 0,

  `loc_id` INT NOT NULL,
  PRIMARY KEY (`enc_id`)
);

CREATE TABLE IF NOT EXISTS `funcionarios` (
  `fun_id` INT NOT NULL AUTO_INCREMENT,
  `fun_nome` VARCHAR(45) NOT NULL,
  `fun_cargo` VARCHAR(100) NOT NULL,

  `fun_cpf` VARCHAR(45) NOT NULL UNIQUE,
  `fun_telefone` VARCHAR(45) NOT NULL,

  `fun_usuario` VARCHAR(45) NOT NULL UNIQUE,
  `fun_senha` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`fun_id`)
);

CREATE TABLE IF NOT EXISTS `locais`(
  `loc_id` INT NOT NULL AUTO_INCREMENT,
  `loc_nome` VARCHAR(100) NOT NULL UNIQUE,
  PRIMARY KEY (`loc_id`)
);

CREATE TABLE IF NOT EXISTS `lotesDoados` (
  `lotd_id` INT NOT NULL,
  `ben_id` INT NOT NULL,
  `data` DATE NOT NULL,
  PRIMARY KEY (`lotd_id`)
);

CREATE TABLE IF NOT EXISTS `lotesDoadosLotes` (
  `lotd_id` INT NOT NULL,
  `lot_id` INT NOT NULL,
  `qtde` INT NOT NULL,
  PRIMARY KEY (`lotd_id`, `lot_id`)
);

CREATE TABLE IF NOT EXISTS `encontrosLotes` (
  `enc_id` INT NOT NULL,
  `lot_id` INT NOT NULL,
  `qtde` INT NOT NULL,
  PRIMARY KEY (`enc_id`, `lot_id`)
);

CREATE TABLE IF NOT EXISTS `beneficiariosEncontros` (
  `enc_id` INT NOT NULL,
  `ben_id` INT NOT NULL,
  `participou` TINYINT NOT NULL,
  PRIMARY KEY (`enc_id`, `ben_id`)
);

CREATE TABLE IF NOT EXISTS `funcionariosEncontros` (
  `fun_id` INT NOT NULL,
  `enc_id` INT NOT NULL,
  `participou` TINYINT NOT NULL,
  `motivoCancelamento` VARCHAR(100) NULL,
  PRIMARY KEY (`fun_id`, `enc_id`)
);

alter table `despesas`
	add CONSTRAINT `fk_despesas_documentos`
		FOREIGN KEY (`doc_id`) REFERENCES `documentos` (`doc_id`);

alter table `doacoes`
	add CONSTRAINT `fk_doacoes_doadores`
		FOREIGN KEY (`doad_id`) REFERENCES `doadores` (`doad_id`);

alter table `lotes`
	add CONSTRAINT `fk_lotes_itens`
		FOREIGN KEY (`item_id`) REFERENCES `itens` (`item_id`);

alter table `encontros`
  add CONSTRAINT `fk_encontros_locais`
    FOREIGN KEY (`loc_id`) REFERENCES `locais`(`loc_id`);

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

alter table `encontrosLotes`
	add CONSTRAINT `fk_encontrosItens_encontros`
		FOREIGN KEY (`enc_id`) REFERENCES `encontros` (`enc_id`),
	add CONSTRAINT `fk_encontrosItens_lotes`
		FOREIGN KEY (`lot_id`) REFERENCES `lotes` (`lot_id`);

alter table `beneficiariosEncontros`
	add CONSTRAINT `fk_beneficiariosEncontros_beneficiarios`
		FOREIGN KEY (`ben_id`) REFERENCES `beneficiarios` (`ben_id`),
	add CONSTRAINT `fk_beneficiariosEncontros_Encontros`
		FOREIGN KEY (`enc_id`) REFERENCES `encontros` (`enc_id`);

alter table `funcionariosEncontros`
	add CONSTRAINT `fk_funcionariosEncontros_encontros`
		FOREIGN KEY (`enc_id`) REFERENCES `encontros` (`enc_id`),
	add CONSTRAINT `fk_funcionariosEncontros_funcionarios`
		FOREIGN KEY (`fun_id`) REFERENCES `funcionarios` (`fun_id`);
