import Beneficiario from "../models/beneficiarioModel.js";

function campoVazio(valor){
    return !valor || !String(valor).trim();
}

function telefoneVazio(valor){
    return !String(valor || "").replace(/\D/g, "");
}

class BeneficiarioController{
    static async listar(req,res){
        try{
            let resp = await Beneficiario.listar(req.query.filtro, req.query.telefone);
            return res.status(200).json(resp);
        }catch(err){
            return res.status(500).json({Erro:"Aconteceu um erro na hora de listar"})
        }
    }

    static async buscarPorId(req,res){
        try{
            let resp = await Beneficiario.buscarPorId(req.query.id);
            if(!resp){
                return res.status(500).json({Erro:`Nao existe beneficiario com id ${req.query.id}`})
            }else{
                return res.status(200).json(resp);
            }
        }catch(err){
            return res.status(500).json({Erro:"Aconteceu um erro na hora de buscar"})
        }
    }

    static async alterar(req, res){
        try {
            const { id, nome, endereco, telefone, usuario, senha } = req.body;
            if (campoVazio(nome) || campoVazio(endereco) || telefoneVazio(telefone) || campoVazio(usuario) || campoVazio(senha)) {
                return res.status(500).json({
                    err: "Algum campo está vazio",
                    campos: {
                        ben_nome: campoVazio(nome),
                        ben_endereco: campoVazio(endereco),
                        ben_telefone: telefoneVazio(telefone),
                        ben_usuario: campoVazio(usuario),
                        ben_senha: campoVazio(senha)
                    }
                });
            }
            const beneficiario = new Beneficiario(
                id,
                nome,
                endereco,
                telefone,
                usuario,
                senha
            );
            const resultado = await beneficiario.alterar();
            res.status(200).json(resultado);
        } catch (error) {
            res.status(500).json({ erro: "Erro ao alterar beneficiario" });
        }
    }

    static async excluir(req, res){
        try {
            const { id } = req.body;
            const beneficiario = new Beneficiario(id);
            const resultado = await beneficiario.excluir();
            res.status(200).json(resultado);
        } catch (error) {
            console.error(error);
            res.status(500).json({ erro: "Erro ao excluir beneficiario" });
        }
    }

    static async cadastrar(req,res){
        try{
            const { nome, endereco, telefone, usuario, senha } = req.body;
            if (campoVazio(nome) || campoVazio(endereco) || telefoneVazio(telefone) || campoVazio(usuario) || campoVazio(senha)) {
                return res.status(500).json({
                    err: "Algum campo está vazio",
                    campos: {
                        ben_nome: campoVazio(nome),
                        ben_endereco: campoVazio(endereco),
                        ben_telefone: telefoneVazio(telefone),
                        ben_usuario: campoVazio(usuario),
                        ben_senha: campoVazio(senha)
                    }
                });
            }
            let beneficiario = new Beneficiario(
                0,
                nome,
                endereco,
                telefone,
                usuario,
                senha
            );
            let resp = await beneficiario.gravar();
            return res.status(200).json(resp);
        }catch(err){
            return res.status(500).json({Erro:"Aconteceu um erro na hora de gravar"})
        }
        
    }
}

export default BeneficiarioController;
