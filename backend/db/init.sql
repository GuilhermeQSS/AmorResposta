CREATE SCHEMA IF NOT EXISTS `amorresposta` DEFAULT CHARACTER SET utf8;
USE `amorresposta` ;

CREATE TABLE IF NOT EXISTS `funcionarios` (
	`fun_id` INT NOT NULL,
	`fun_nome` VARCHAR(45) NULL,
	`fun_usuario` VARCHAR(45) NULL,
	`fun_senha` VARCHAR(45) NULL,
	`fun_cargo` CHAR(1) NULL,
	PRIMARY KEY (`fun_id`)
  );

CREATE TABLE IF NOT EXISTS `beneficiarios` (
	`ben_id` INT NOT NULL auto_increment,
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
	PRIMARY KEY (`ben_id`)
);

CREATE TABLE IF NOT EXISTS `documentos` (
  	`doc_id` INT NOT NULL,
  	`doc_caminho` VARCHAR(45) NULL,
	PRIMARY KEY (`doc_id`)
);


CREATE TABLE IF NOT EXISTS `doacoes` (
  	`doa_id` INT NOT NULL,
  	`doa_doadorNome` VARCHAR(45) NULL,
  	`doc_dataEntrega` DATE NULL,
  	`doc_id` INT NULL,
  	PRIMARY KEY (`doa_id`)
);

CREATE TABLE IF NOT EXISTS `despesas` (
  	`des_id` INT NOT NULL,
  	`des_descricao` VARCHAR(45) NULL,
  	`doc_id` INT NULL,
  	PRIMARY KEY (`des_id`)
);

CREATE TABLE IF NOT EXISTS `encontros` (
  	`enc_id` INT NOT NULL,
  	`enc_data` DATE NULL,
  	`enc_disponibilidade` CHAR(1) NULL,
  	`enc_qtdeMax` INT NULL,
  	`enc_qtde` INT NULL,
  	`enc_local` VARCHAR(45) NULL,
  	PRIMARY KEY (`enc_id`)
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

CREATE TABLE IF NOT EXISTS `itens` (
  	`item_id` INT NOT NULL,
  	`item_descricao` VARCHAR(45) NULL,
  	`item_qtde` INT NULL,
  	`item_validade` DATE NULL,
  	PRIMARY KEY (`item_id`)
);

CREATE TABLE IF NOT EXISTS `materiais` (
  	`enc_id` INT NOT NULL,
  	`item_id` INT NOT NULL,
  	`qtde` INT NULL,
  	`utilizado` CHAR(1) NULL,
  	PRIMARY KEY (`enc_id`, `item_id`)
);

CREATE TABLE IF NOT EXISTS `doacoesItens` (
  `doa_id` INT NOT NULL,
  `item_id` INT NULL,
  `qtde` DOUBLE NULL,
  `descricao` VARCHAR(100) NULL,
  `tipo` VARCHAR(1) NULL,
  PRIMARY KEY (`doa_id`, `item_id`)
);

CREATE TABLE IF NOT EXISTS `itensDoados` (
  	`item_id` INT NOT NULL,
  	`ben_id` INT NOT NULL,
  	`qtde` INT NULL,
  	`data` DATE NULL,
  	PRIMARY KEY (`item_id`, `ben_id`)
);

ALTER TABLE `doacoes`
	ADD CONSTRAINT `fk_Doacoes_Documentos`
    	FOREIGN KEY (`doc_id`) REFERENCES `documentos` (`doc_id`);

ALTER TABLE `despesas`
	ADD CONSTRAINT `fk_Despesas_Documentos`
    	FOREIGN KEY (`doc_id`) REFERENCES `documentos` (`doc_id`);

ALTER TABLE `participantes`
	ADD CONSTRAINT `fk_Participantes_Encontros`
    	FOREIGN KEY (`enc_id`) REFERENCES `encontros` (`enc_id`),
  	ADD CONSTRAINT `fk_EParticipantes_Beneficiarios`
    	FOREIGN KEY (`ben_id`) REFERENCES `beneficiarios` (`ben_id`);

ALTER TABLE `responsaveis`
	ADD CONSTRAINT `fk_Responsaveis_Funcionarios`
    	FOREIGN KEY (`fun_id`) REFERENCES `funcionarios` (`fun_id`),
  	ADD CONSTRAINT `fk_Responsaveis_Encontros`
    	FOREIGN KEY (`enc_id`) REFERENCES `encontros` (`enc_id`);

ALTER TABLE `materiais`
	ADD CONSTRAINT `fk_Materiais_Encontros`
    	FOREIGN KEY (`enc_id`) REFERENCES `encontros` (`enc_id`),
  	ADD CONSTRAINT `fk_Materiais_Itens`
    	FOREIGN KEY (`item_id`) REFERENCES `itens` (`item_id`);

ALTER TABLE `doacoesItens`
	ADD CONSTRAINT `fk_DoacoesItens_Doacoes`
	    FOREIGN KEY (`doa_id`) REFERENCES `doacoes` (`doa_id`),
  	ADD CONSTRAINT `fk_DoacoesItens_Itens`
    	FOREIGN KEY (`item_id`) REFERENCES `itens` (`item_id`);

ALTER TABLE `itensDoados`
	ADD CONSTRAINT `fk_ItensDoados_Itens`
    	FOREIGN KEY (`item_id`) REFERENCES `itens` (`item_id`),
  	ADD CONSTRAINT `fk_ItensDoados_Beneficiarios`
    	FOREIGN KEY (`ben_id`) REFERENCES `beneficiarios` (`ben_id`);
