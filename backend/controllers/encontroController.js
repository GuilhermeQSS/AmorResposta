import Encontro from "../models/encontroModel.js";
import SingletonDB from "../db/SingletonDB.js";

class EncontroController{
    static async listar(req,res){
        try{
            const connection = await SingletonDB.getConnection();
            let resp = await Encontro.listar(connection, req.query.filtro);
            return res.status(200).json(resp);
        }catch(err){
            return res.status(500).json({Erro:"Aconteceu um erro na hora de listar"})
        }
    }

    static async buscarPorId(req,res){
        try{
            const connection = await SingletonDB.getConnection();
            let resp = await Encontro.buscarPorId(connection, req.query.id);
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
            const connection = await SingletonDB.getConnection();
            const { id, data, disponibilidade, qtdeMax, qtde, local, camposAlterados } = req.body;
            if (data == "" || (disponibilidade != 'A' && disponibilidade != 'E' && disponibilidade != 'F') || qtdeMax <= 0 || qtde == null || qtde < 0 || local == ""){
                if(qtdeMax == 0){
                     return res.status(500).json({ 
                    err: "Quantidade maxima não pode ser menor ou igual a 0" ,
                    campos:{
                        enc_data: !data,
                        enc_disponibilidade: !disponibilidade,
                        enc_qtdeMax: !qtdeMax,
                        enc_qtde: !qtde,
                        enc_local: !local
                    }
                });
                }
                if(qtde < 0){
                     return res.status(500).json({ 
                    err: "Quantidade não pode ser menor que 0" ,
                    campos:{
                        enc_data: !data,
                        enc_disponibilidade: !disponibilidade,
                        enc_qtdeMax: !qtdeMax,
                        enc_qtde: !qtde,
                        enc_local: !local
                    }
                });
                }
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
            if (qtde > qtdeMax) {
                return res.status(500).json({ err: "Quantidade atual não pode ser maior que a máxima" });
            }
            const encontro = new Encontro(
                id,
                data,
                disponibilidade,
                qtdeMax,
                qtde,
                local
            );
            
            const resultado = await encontro.alterar(connection);
            return res.status(200).json(resultado);
            
        } catch (error) {
            return res.status(500).json({ err: "Erro ao alterar encontro" });
        }
    }

    static async excluir(req, res){
        try {
            const connection = await SingletonDB.getConnection();
            const { id } = req.body;
            const encontro = new Encontro(id);
            const resultado = await encontro.excluir(connection);
            res.status(200).json(resultado);
        } catch (error) {
            console.error(error);
            res.status(500).json({ erro: "Erro ao excluir encontro" });
        }
    }

    static async cadastrar(req,res){
        try{
            const connection = await SingletonDB.getConnection();
            const {data, disponibilidade, qtdeMax, qtde, local} = req.body;
            if (data == "" || (disponibilidade != 'A' && disponibilidade != 'E' && disponibilidade != 'F') || qtdeMax <= 0 || qtde == null || qtde < 0 || local == ""){
                if(qtdeMax == 0){
                     return res.status(500).json({ 
                    err: "Quantidade maxima não pode ser menor ou igual a 0" ,
                    campos:{
                        enc_data: !data,
                        enc_disponibilidade: !disponibilidade,
                        enc_qtdeMax: !qtdeMax,
                        enc_qtde: !qtde,
                        enc_local: !local
                    }
                });
                }
                if(qtde < 0){
                     return res.status(500).json({ 
                    err: "Quantidade não pode ser menor que 0" ,
                    campos:{
                        enc_data: !data,
                        enc_disponibilidade: !disponibilidade,
                        enc_qtdeMax: !qtdeMax,
                        enc_qtde: !qtde,
                        enc_local: !local
                    }
                });
                }
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
            if (qtde > qtdeMax) {
                return res.status(500).json({ err: "Quantidade atual não pode ser maior que a máxima" });
            }
            let encontro = new Encontro(
                0,
                data,
                disponibilidade,
                qtdeMax,
                qtde,
                local
            );
            let resp = await encontro.gravar(connection);
            return res.status(200).json(resp);
        }catch(err){
            return res.status(500).json(err);
        }
        
    }
}

export default EncontroController;
