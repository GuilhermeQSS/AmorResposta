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
            const { id, nome, endereco, telefone, usuario, senha, camposAlterados } = req.body;
            if (!nome || !endereco || !telefone || !usuario || !senha) {
                return res.status(500).json({
                    err: "Algum campo esta vazio",
                    campos: {
                        ben_nome: !nome,
                        ben_endereco: !endereco,
                        ben_telefone: !telefone,
                        ben_usuario: !usuario,
                        ben_senha: !senha
                    }
                });
            }
            if (camposAlterados?.usuario && await Beneficiario.buscarPorUsuario(usuario) ){
                return res.status(500).json({
                    err: "Usuario ja exite",
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
            return res.status(200).json(resultado);
        } catch (error) {
            return res.status(500).json({ erro: "Erro ao alterar beneficiario" });
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
            if (!nome || !endereco || !telefone || !usuario || !senha) {
                return res.status(500).json({
                    err: "Algum campo esta vazio",
                    campos: {
                        ben_nome: !nome,
                        ben_endereco: !endereco,
                        ben_telefone: !telefone,
                        ben_usuario: !usuario,
                        ben_senha: !senha
                    }
                });
            }
            if (await Beneficiario.buscarPorUsuario(usuario)) {
                return res.status(500).json({
                    err: "Usuario ja exite",
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
            return res.status(500).json(err);
        }
        
    }
}

export default BeneficiarioController;
