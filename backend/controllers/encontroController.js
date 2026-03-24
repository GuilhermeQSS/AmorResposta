import Encontro from "../models/encontroModel.js";

class EncontroController{
    static async listar(req,res){
        try{
            let resp = await Encontro.listar(req.query.filtro);
            return res.status(200).json(resp);
        }catch(err){
            return res.status(500).json({Erro:"Aconteceu um erro na hora de listar"})
        }
    }

    static async buscarPorId(req,res){
        try{
            let resp = await Encontro.buscarPorId(req.query.id);
            if(!resp){
                return res.status(500).json({Erro:`Não existe encontro com id ${req.query.id}`})
            }else{
                return res.status(200).json(resp);
            }
        }catch(err){
            return res.status(500).json({Erro:"Aconteceu um erro na hora de buscar"})
        }
    }

    static async alterar(req, res){
        try {
            const { id, data, disponibilidade, qtdeMax, qtde, local, camposAlterados } = req.body;
            if (data == null || disponibilidade == null || qtdeMax == null || qtde == null || local == null){
                return res.status(500).json({ 
                    err: "Algum campo está vazio" ,
                    campos:{
                        enc_data: !data,
                        enc_disponibilidade: !disponibilidade,
                        enc_qtdeMax: !qtdeMax,
                        enc_qtde: !qtde,
                        enc_local: !local
                    }
                });
            }
            // if(await Encontro.buscarPorLocal(local)){
            //     return res.status(500).json({ 
            //         err: "Local já exite",
            //     });
            // }
            const encontro = new Encontro(
                id,
                data,
                disponibilidade,
                qtdeMax,
                qtde,
                local
            );
            const resultado = await encontro.alterar();
            return res.status(200).json(resultado);
        } catch (error) {
            return res.status(500).json({ erro: "Erro ao alterar encontro" });
        }
    }

    static async excluir(req, res){
        try {
            const { id } = req.body;
            const encontro = new Encontro(id);
            const resultado = await encontro.excluir();
            res.status(200).json(resultado);
        } catch (error) {
            console.error(error);
            res.status(500).json({ erro: "Erro ao excluir encontro" });
        }
    }

    static async cadastrar(req,res){
        try{
            const {data, disponibilidade, qtdeMax, qtde, local} = req.body;
            if (data == null || disponibilidade == null || qtdeMax == null || qtde == null || local == null) {
                return res.status(500).json({ 
                    err: "Algum campo está vazio" ,
                    campos:{
                        enc_data: !data,
                        enc_disponibilidade: !disponibilidade,
                        enc_qtdeMax: !qtdeMax,
                        enc_qtde: !qtde,
                        enc_local: !local
                    }
                });
            }
            // if(await Encontro.buscarPorLocal(local)){
            //     return res.status(500).json({ 
            //         err: "Local já exite",
            //     });
            // }
            let encontro = new Encontro(
                0,
                data,
                disponibilidade,
                qtdeMax,
                qtde,
                local
            );
            let resp = await encontro.gravar();
            return res.status(200).json(resp);
        }catch(err){
            return res.status(500).json(err);
        }
        
    }
}

export default EncontroController;