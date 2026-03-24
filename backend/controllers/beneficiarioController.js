import Beneficiario from "../models/beneficiarioModel.js";

class BeneficiarioController{
    static async listar(req,res){
        try{
            let resp = await Beneficiario.listar(req.query.filtro);
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
