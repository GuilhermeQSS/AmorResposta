import Itens from "../models/itensModel.js";
import SingletonDB from "../db/SingletonDB.js";

class ItensController{
    static async listar(req,res){
        try{
            const connection = await SingletonDB.getConnection();
            let resp = await Funcionario.listar(connection,req.query.filtroNome,req.query.filtroTipo);
            return res.status(200).json(resp);
        }catch(err){
            return res.status(500).json({err: err.message})
        }
    }

    static async alterar(req, res){
        try {
            if (!req.query.nome || req.query.qtde === undefined || !req.query.tipo) {
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
                nome,
                tipo
            );
            const connection = await SingletonDB.getConnection();
            let resultado = await itens.alterar(connection);
            return res.status(200).json(resultado);
        } catch (error) {
            return res.status(500).json({ erro: "Erro ao alterar itens" });
        }
    }

    static async excluir(req, res){
        try {
            const { id } = req.body;
            const itens = new Itens(id);
            const connection = await SingletonDB.getConnection();
            const resultado = await itens.excluir(connection);
            res.status(200).json(resultado);
        } catch (error) {
            console.error(error);
            res.status(500).json({ erro: "Erro ao excluir itens" });
        }
    }
    
    static async cadastrar(req,res){
        try{
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
            const connection = await SingletonDB.getConnection();
            let resp = await itens.gravar(connection);
            return res.status(200).json(resp);
        }catch(err){
            return res.status(500).json(err);
        }
    }
}

export default ItensController;