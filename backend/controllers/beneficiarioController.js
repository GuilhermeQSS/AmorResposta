import Beneficiario from "../models/beneficiarioModel.js";

class BeneficiarioController{
    static normalizarDados(body){
        return {
            id: Number(body.id),
            nome: `${body.nome ?? ""}`.trim(),
            endereco: `${body.endereco ?? ""}`.trim(),
            telefone: `${body.telefone ?? ""}`.trim(),
            usuario: `${body.usuario ?? ""}`.trim(),
            senha: `${body.senha ?? ""}`.trim()
        };
    }

    static validarCamposObrigatorios(dados, incluirId = false){
        const camposVazios = [];

        if (incluirId && (!Number.isInteger(dados.id) || dados.id <= 0)) {
            camposVazios.push("id");
        }
        if (!dados.nome) camposVazios.push("nome");
        if (!dados.endereco) camposVazios.push("endereco");
        if (!dados.telefone) camposVazios.push("telefone");
        if (!dados.usuario) camposVazios.push("usuario");
        if (!dados.senha) camposVazios.push("senha");

        if (camposVazios.length > 0) {
            return `Preencha todos os campos obrigatorios: ${camposVazios.join(", ")}`;
        }

        return null;
    }

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
            const dados = BeneficiarioController.normalizarDados(req.body);
            const erroCampos = BeneficiarioController.validarCamposObrigatorios(dados, true);

            if (erroCampos) {
                return res.status(400).json({ erro: erroCampos });
            }

            const beneficiarioExistente = await Beneficiario.buscarPorId(dados.id);
            if (!beneficiarioExistente) {
                return res.status(404).json({ erro: `Nao existe beneficiario com id ${dados.id}` });
            }

            const usuarioRepetido = await Beneficiario.buscarPorUsuario(dados.usuario, dados.id);
            if (usuarioRepetido) {
                return res.status(409).json({ erro: "Ja existe um beneficiario com esse usuario" });
            }

            const beneficiario = new Beneficiario(
                dados.id,
                dados.nome,
                dados.endereco,
                dados.telefone,
                dados.usuario,
                dados.senha
            );
            const resultado = await beneficiario.alterar();
            res.status(200).json(resultado);
        } catch (error) {
            if (error?.code === "ER_DUP_ENTRY") {
                return res.status(409).json({ erro: "Ja existe um beneficiario com esse usuario" });
            }
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
            const dados = BeneficiarioController.normalizarDados(req.body);
            const erroCampos = BeneficiarioController.validarCamposObrigatorios(dados);

            if (erroCampos) {
                return res.status(400).json({ erro: erroCampos });
            }

            const usuarioRepetido = await Beneficiario.buscarPorUsuario(dados.usuario);
            if (usuarioRepetido) {
                return res.status(409).json({ erro: "Ja existe um beneficiario com esse usuario" });
            }

            let beneficiario = new Beneficiario(
                0,
                dados.nome,
                dados.endereco,
                dados.telefone,
                dados.usuario,
                dados.senha
            );
            let resp = await beneficiario.gravar();
            return res.status(200).json(resp);
        }catch(err){
            if (err?.code === "ER_DUP_ENTRY") {
                return res.status(409).json({ erro: "Ja existe um beneficiario com esse usuario" });
            }
            return res.status(500).json({Erro:"Aconteceu um erro na hora de gravar"})
        }
        
    }
}

export default BeneficiarioController;
