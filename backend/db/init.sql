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
	`ben_id` INT NOT NULL,
	`ben_usuario` VARCHAR(45) NULL,
	`ben_senha` VARCHAR(45) NULL,
	PRIMARY KEY (`ben_id`)
);
