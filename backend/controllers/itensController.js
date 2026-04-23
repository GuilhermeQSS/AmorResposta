import Itens from "../models/itensModel.js";
import SingletonDB from "../db/SingletonDB.js";

class ItensController{
    static async listar(req,res){
        try{
            const connection = await SingletonDB.getConnection();
            const { descricao, dias } = req.query;
            let resp;

            if (descricao && dias){
                resp = await Itens.buscarPorDescricaoEValidade(connection, descricao, dias);
            } else if (dias){
                resp = await Itens.buscarPorValidade(connection, dias);
            } else {
                resp = await Itens.listar(connection, descricao);
            }
            return res.status(200).json(resp);
        }catch(err){
            return res.status(500).json({Erro:"Aconteceu um erro na hora de listar"})
        }
    }

    static async buscarPorId(req,res){
        try{
            const connection = await SingletonDB.getConnection();
            let resp = await Itens.buscarPorId(connection, req.query.id);
            if(!resp){
                return res.status(500).json({Erro:`Não existe itens com id ${req.query.id}`})
            }else{
                return res.status(200).json(resp);
            }
        }catch(err){
            console.log("ERRO REAL:", err);
            return res.status(500).json({err: err.message});
        }
    }

    static async alterar(req, res){
        try {
            const connection = await SingletonDB.getConnection();
            const { id, descricao, qtde, validade, camposAlterados } = req.body;
            if (!descricao || qtde === undefined) {
                return res.status(500).json({ 
                    err: "Algum campo está vazio" ,
                    campos:{
                        item_descricao: !descricao,
                        item_qtde: !qtde
                    }
                });
            }
            const itens = new Itens(
                id,
                descricao,
                qtde,
                validade
            );
            const resultado = await itens.alterar(connection);
            return res.status(200).json(resultado);
        } catch (error) {
            return res.status(500).json({ erro: "Erro ao alterar itens" });
        }
    }

    static async excluir(req, res){
        try {
            const connection = await SingletonDB.getConnection();
            const { id } = req.body;
            const itens = new Itens(id);
            const resultado = await itens.excluir(connection);
            res.status(200).json(resultado);
        } catch (error) {
            console.error(error);
            res.status(500).json({ erro: "Erro ao excluir itens" });
        }
    }
    
    static async cadastrar(req,res){
        try{
            const connection = await SingletonDB.getConnection();
            const {descricao, qtde, validade} = req.body;
            if (qtde < 0) {
                return res.status(500).json({ 
                    err: "Quantidade inválida",
                    campos:{item_qtde: qtde}
                });
            }
            if (!descricao) {
                return res.status(500).json({ 
                    err: "Descrição vazia" ,
                    campos:{
                        item_descricao: !descricao
                    }
                });
            }
            if(validade && new Date(validade) < new Date()){
                return res.status(500).json({ 
                    err: "Validade inválida" ,
                    campos:{
                        item_descricao: !validade
                    }
                });
            }
            let itens = new Itens(
                0,
                descricao,
                qtde,
                validade
            );
            let resp = await itens.gravar(connection);
            return res.status(200).json(resp);
        }catch(err){
            return res.status(500).json(err);
        }
    }
}

export default ItensController;
