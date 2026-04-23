import Itens from "../models/itensModel.js";
import SingletonDB from "../db/SingletonDB.js";

class itensControl{
    static async listar(req,res){
        try{
            const connection = await SingletonDB.getConnection();
            let resp = await Itens.listar(connection,req.query.nome,req.query.tipo);
            return res.status(200).json(resp);
        }catch(err){
            return res.status(500).json({err: err.message})
        }
    }
    static async buscarPorId(req,res){
        try{
            const connection = await SingletonDB.getConnection();
            let resp = await Itens.buscarPorId(connection,req.query.id);
            if(!resp){
                throw new Error(`Não existe item com id = ${req.query.id}`);
            }else{
                console.log(resp);
                return res.status(200).json(resp);
            }
        }catch(err){
            return res.status(500).json({err: err.message});
        }
    }

    static async alterar(req, res){
        try {
            const connection = await SingletonDB.getConnection();
            const { id, nome, descricao, tipo, possuiValidade} = req.body;
            const itemOriginal = await Itens.buscarPorId(connection,id);
            if(!itemOriginal){
                throw new Error("Id não existe");
            }
            if(itemOriginal.descricao !== descricao &&
                await Itens.buscarPorNome(connection,descricao)){
                throw new Error("Item já exite");
            }
            const item = new Itens(id,nome,descricao,tipo,possuiValidade);
            const resultado = await item.alterar(connection);
            return res.status(200).json(resultado);
        } catch (err) {
            return res.status(500).json({err: err.message});
        }
    }

    static async excluir(req, res){
        try {
            const connection = await SingletonDB.getConnection();
            let item = await Itens.buscarPorId(connection,req.query.id);
            if(!item){
                throw new Error(`Não existe item com id = ${req.query.id}`);
            }
            const resultado = await item.excluir(connection);
            res.status(200).json(resultado);
        } catch (err) {
            console.log(err);
            return res.status(500).json({err: err.message});
        }
    }
    
    static async cadastrar(req,res){
        try{
            const {descricao, nome, tipo, possuiValidade} = req.body;
            if (!nome) {
                return res.status(500).json({ 
                    err: "Nome vazio",
                    campos:{item_nome: nome}
                });
            }
            let item = new Itens(
                0,
                descricao,
                nome,
                tipo,
                possuiValidade
            );
            const connection = await SingletonDB.getConnection();
            let resp = await item.gravar(connection);
            return res.status(200).json(resp);
        }catch(err){
            return res.status(500).json({ err: err.message });
        }
    }
}

export default itensControl;