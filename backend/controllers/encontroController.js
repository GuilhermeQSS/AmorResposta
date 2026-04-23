import Encontro from "../models/encontroModel.js";

class EncontroController{
    static async listar(req,res){
        try{
            let resp = await Encontro.listar(req.query.filtro, req.query.status);
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

    static async impacto(req,res){
        try {
            const { id } = req.query;
            const resp = await Encontro.buscarImpacto(id);
            if(!resp){
                return res.status(500).json({Erro:`Não existe encontro com id ${id}`});
            }
            return res.status(200).json(resp);
        } catch (err) {
            return res.status(500).json({Erro:"Aconteceu um erro na hora de buscar o impacto"});
        }
    }

    static async cancelar(req,res){
        try {
            const { id, motivo, detalhes, opcao, novaData } = req.body;
            const motivosValidos = [
                "falta de beneficiários mínimos",
                "ausência de tutor/funcionário responsável",
                "indisponibilidade do local",
                "problema climático",
                "falta de materiais/itens necessários",
                "conflito de agenda",
                "motivo emergencial/outros"
            ];

            if (!id || !motivo) {
                return res.status(500).json({ err: "ID e motivo são obrigatórios" });
            }

            if (!motivosValidos.includes(motivo)) {
                return res.status(500).json({ err: "Motivo inválido" });
            }

            const encontroExistente = await Encontro.buscarPorId(id);
            if (!encontroExistente) {
                return res.status(500).json({ err: `Não existe encontro com id ${id}` });
            }

            if (encontroExistente.cancelado === 'S') {
                return res.status(400).json({ err: "Encontro já está cancelado" });
            }

            await encontroExistente.cancelar(motivo, detalhes || "");

            const resposta = {
                cancelled: true,
                motivo,
                detalhes: detalhes || "",
            };

            if (opcao === "reagendar" || opcao === "transferirInscritos") {
                if (!novaData) {
                    return res.status(500).json({ err: "Nova data é obrigatória para reagendamento" });
                }

                const newEncontroId = await Encontro.criarReagendamento(
                    id,
                    novaData,
                    opcao === "transferirInscritos"
                );

                resposta.reagendamento = {
                    novoEncontroId: newEncontroId,
                    transferencia: opcao === "transferirInscritos",
                    novaData,
                };
            }

            return res.status(200).json(resposta);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ err: "Erro ao cancelar encontro" });
        }
    }

    static async alterar(req, res){
        try {
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
            
            const resultado = await encontro.alterar();
            return res.status(200).json(resultado);
            
        } catch (error) {
            return res.status(500).json({ err: "Erro ao alterar encontro" });
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
            let resp = await encontro.gravar();
            return res.status(200).json(resp);
        }catch(err){
            return res.status(500).json(err);
        }
        
    }
}

export default EncontroController;