import Beneficiario from "../models/beneficiarioModel.js";
import SingletonDB from "../db/SingletonDB.js";

function campoVazio(valor) {
    return !valor || !String(valor).trim();
}

function telefoneVazio(valor) {
    return !String(valor || "").replace(/\D/g, "");
}

function numeroVazio(valor) {
    return !String(valor || "").replace(/\D/g, "");
}

function normalizarEndereco(body) {
    return {
        estado: String(body.estado ?? "").trim(),
        cidade: String(body.cidade ?? "").trim(),
        bairro: String(body.bairro ?? "").trim(),
        rua: String(body.rua ?? "").trim(),
        numero: String(body.numero ?? "").trim()
    };
}

function validarCamposEnderecoSeparados(dados) {
    return (
        campoVazio(dados.estado) ||
        campoVazio(dados.cidade) ||
        campoVazio(dados.bairro) ||
        campoVazio(dados.rua) ||
        numeroVazio(dados.numero)
    );
}

class BeneficiarioController{
    static async listar(req,res){
        try{
            const connection = await SingletonDB.getConnection();
            const resp = await Beneficiario.listar(connection, req.query.filtro, req.query.telefone);
            return res.status(200).json(resp);
        }catch(err){
            return res.status(500).json({Erro:"Aconteceu um erro na hora de listar"});
        }
    }

    static async buscarPorId(req,res){
        try{
            const connection = await SingletonDB.getConnection();
            const resp = await Beneficiario.buscarPorId(connection, req.query.id);
            if(!resp){
                return res.status(500).json({Erro:`Nao existe beneficiario com id ${req.query.id}`});
            }
            return res.status(200).json(resp);
        }catch(err){
            return res.status(500).json({Erro:"Aconteceu um erro na hora de buscar"});
        }
    }

    static async alterar(req, res){
        try {
            const { id, nome, telefone, usuario, senha } = req.body;
            const endereco = normalizarEndereco(req.body);

            if (campoVazio(nome) || telefoneVazio(telefone) || campoVazio(usuario) || campoVazio(senha)) {
                return res.status(500).json({
                    err: "Algum campo esta vazio",
                    campos: {
                        ben_nome: campoVazio(nome),
                        ben_telefone: telefoneVazio(telefone),
                        ben_usuario: campoVazio(usuario),
                        ben_senha: campoVazio(senha)
                    }
                });
            }

            if (validarCamposEnderecoSeparados(endereco)) {
                return res.status(500).json({
                    err: "Algum campo esta vazio",
                    campos: {
                        ben_estado: campoVazio(endereco.estado),
                        ben_cidade: campoVazio(endereco.cidade),
                        ben_bairro: campoVazio(endereco.bairro),
                        ben_rua: campoVazio(endereco.rua),
                        ben_numero: numeroVazio(endereco.numero)
                    }
                });
            }

            const beneficiario = new Beneficiario(
                id,
                nome,
                endereco.estado,
                endereco.cidade,
                endereco.bairro,
                endereco.rua,
                endereco.numero,
                telefone,
                usuario,
                senha
            );

            const connection = await SingletonDB.getConnection();
            const resultado = await beneficiario.alterar(connection);
            return res.status(200).json(resultado);
        } catch (error) {
            return res.status(500).json({ erro: "Erro ao alterar beneficiario" });
        }
    }

    static async excluir(req, res){
        try {
            const id = req.body?.id ?? req.query?.id;
            const beneficiario = new Beneficiario(id);
            const connection = await SingletonDB.getConnection();
            const resultado = await beneficiario.excluir(connection);
            return res.status(200).json(resultado);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ erro: "Erro ao excluir beneficiario" });
        }
    }

    static async cadastrar(req,res){
        try{
            const { nome, telefone, usuario, senha } = req.body;
            const endereco = normalizarEndereco(req.body);

            if (campoVazio(nome) || telefoneVazio(telefone) || campoVazio(usuario) || campoVazio(senha)) {
                return res.status(500).json({
                    err: "Algum campo esta vazio",
                    campos: {
                        ben_nome: campoVazio(nome),
                        ben_telefone: telefoneVazio(telefone),
                        ben_usuario: campoVazio(usuario),
                        ben_senha: campoVazio(senha)
                    }
                });
            }

            if (validarCamposEnderecoSeparados(endereco)) {
                return res.status(500).json({
                    err: "Algum campo esta vazio",
                    campos: {
                        ben_estado: campoVazio(endereco.estado),
                        ben_cidade: campoVazio(endereco.cidade),
                        ben_bairro: campoVazio(endereco.bairro),
                        ben_rua: campoVazio(endereco.rua),
                        ben_numero: numeroVazio(endereco.numero)
                    }
                });
            }

            const connection = await SingletonDB.getConnection();

            if (await Beneficiario.buscarPorUsuario(connection, usuario)) {
                return res.status(500).json({
                    err: "Usuario ja existe"
                });
            }

            const beneficiario = new Beneficiario(
                0,
                nome,
                endereco.estado,
                endereco.cidade,
                endereco.bairro,
                endereco.rua,
                endereco.numero,
                telefone,
                usuario,
                senha
            );

            const resp = await beneficiario.gravar(connection);
            return res.status(200).json(resp);
        }catch(err){
            console.error("Erro ao gravar beneficiario:", err);
            return res.status(500).json({
                Erro: err?.message || "Aconteceu um erro na hora de gravar"
            });
        }
    }
}

export default BeneficiarioController;
