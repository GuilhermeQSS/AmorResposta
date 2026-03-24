import Estoque from "../models/estoqueModel.js";

class EstoqueController{
    static async listar(req,res){
        try{
            const { descricao, dias } = req.query;
            let resp;

            if (descricao && dias){
                resp = await Estoque.buscarPorDescricaoEValidade(descricao, dias);
            } else if (dias){
                resp = await Estoque.buscarPorValidade(dias);
            } else {
                resp = await Estoque.listar(descricao);
            }
            return res.status(200).json(resp);
        }catch(err){
            return res.status(500).json({Erro:"Aconteceu um erro na hora de listar"})
        }
    }

    static async buscarPorId(req,res){
        try{
            let resp = await Estoque.buscarPorId(req.query.id);
            if(!resp){
                return res.status(500).json({Erro:`Não existe estoque com id ${req.query.id}`})
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
            const { id, descricao, qtde, validade, camposAlterados } = req.body;
            if (!descricao || qtde === undefined) {
                return res.status(500).json({ 
                    err: "Algum campo está vazio" ,
                    campos:{
                        est_descricao: !descricao,
                        est_qtde: !qtde
                    }
                });
            }
            const estoque = new Estoque(
                id,
                descricao,
                qtde,
                validade
            );
            const resultado = await estoque.alterar();
            return res.status(200).json(resultado);
        } catch (error) {
            return res.status(500).json({ erro: "Erro ao alterar estoque" });
        }
    }

    static async excluir(req, res){
        try {
            const { id } = req.body;
            const estoque = new Estoque(id);
            const resultado = await estoque.excluir();
            res.status(200).json(resultado);
        } catch (error) {
            console.error(error);
            res.status(500).json({ erro: "Erro ao excluir estoque" });
        }
    }
    
    static async cadastrar(req,res){
        try{
            const {descricao, qtde, validade} = req.body;
            if (qtde < 0) {
                return res.status(500).json({ 
                    err: "Quantidade inválida",
                    campos:{est_qtde: qtde}
                });
            }
            if (!descricao) {
                return res.status(500).json({ 
                    err: "Descrição vazia" ,
                    campos:{
                        est_descricao: !descricao
                    }
                });
            }
            if(validade && new Date(validade) < new Date()){
                return res.status(500).json({ 
                    err: "Validade inválida" ,
                    campos:{
                        est_descricao: !validade
                    }
                });
            }
            let estoque = new Estoque(
                0,
                descricao,
                qtde,
                validade
            );
            let resp = await estoque.gravar();
            return res.status(200).json(resp);
        }catch(err){
            return res.status(500).json(err);
        }
    }
}

export default EstoqueController;