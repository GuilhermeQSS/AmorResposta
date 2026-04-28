import Doacao from "../models/doacaoModel.js";

class DoacaoController {
    static quantidadeItensValida(quantidadeItens) {
        const quantidade = Number(quantidadeItens);
        return Number.isInteger(quantidade) && quantidade > 0;
    }

    static documentoValido(documento) {
        if (!documento) {
            return true;
        }

        return Boolean(
            String(documento.nomeArquivo || "").trim() &&
            String(documento.conteudoBase64 || "").trim()
        );
    }

    static textoObrigatorioValido(valor) {
        return Boolean(String(valor || "").trim());
    }

    static async listar(req, res) {
        try {
            const tipoFiltro = req.query.tipoFiltro === "data"
                ? "data"
                : req.query.tipoFiltro === "periodo"
                    ? "periodo"
                    : "doador";
            const resp = await Doacao.listar(
                req.query.filtro,
                tipoFiltro,
                req.query.dataInicial,
                req.query.dataFinal
            );
            return res.status(200).json(resp);
        } catch (err) {
            return res.status(500).json({ erro: "Aconteceu um erro na hora de listar doacoes" });
        }
    }

    static async buscarPorId(req, res) {
        try {
            const resp = await Doacao.buscarPorId(req.query.id);

            if (!resp) {
                return res.status(404).json({ erro: `Nao existe doacao com id ${req.query.id}` });
            }

            return res.status(200).json(resp);
        } catch (err) {
            return res.status(500).json({ erro: "Aconteceu um erro na hora de buscar a doacao" });
        }
    }

    static async cadastrar(req, res) {
        try {
            const { doadorNome, dataEntrega, origem, formaEntrega, tipo, quantidadeItens, observacao, detalhes, documento } = req.body;

            if (!DoacaoController.documentoValido(documento)) {
                return res.status(400).json({
                    erro: "Documento invalido"
                });
            }

            if (
                !dataEntrega ||
                !DoacaoController.textoObrigatorioValido(origem) ||
                !formaEntrega ||
                !tipo ||
                !DoacaoController.quantidadeItensValida(quantidadeItens)
            ) {
                return res.status(400).json({
                    erro: "Origem, data, forma de entrega, tipo e quantidade de itens sao obrigatorios"
                });
            }

            const doacao = new Doacao(
                0,
                doadorNome,
                dataEntrega,
                origem,
                formaEntrega,
                tipo,
                quantidadeItens,
                observacao,
                detalhes,
                documento
            );

            const resp = await doacao.gravar();
            return res.status(200).json(resp);
        } catch (err) {
            return res.status(500).json({ erro: "Aconteceu um erro na hora de gravar a doacao" });
        }
    }

    static async alterar(req, res) {
        try {
            const { id, doadorNome, dataEntrega, origem, formaEntrega, tipo, quantidadeItens, observacao, detalhes } = req.body;

            if (
                !dataEntrega ||
                !DoacaoController.textoObrigatorioValido(origem) ||
                !formaEntrega ||
                !tipo ||
                !DoacaoController.quantidadeItensValida(quantidadeItens)
            ) {
                return res.status(400).json({
                    erro: "Origem, data, forma de entrega, tipo e quantidade de itens sao obrigatorios"
                });
            }

            const doacao = new Doacao(
                id,
                doadorNome,
                dataEntrega,
                origem,
                formaEntrega,
                tipo,
                quantidadeItens,
                observacao,
                detalhes
            );

            const resp = await doacao.alterar();
            return res.status(200).json(resp);
        } catch (err) {
            return res.status(500).json({ erro: "Aconteceu um erro na hora de alterar a doacao" });
        }
    }

    static async excluir(req, res) {
        try {
            const { id } = req.body;
            const doacao = new Doacao(id);
            const resp = await doacao.excluir();
            return res.status(200).json(resp);
        } catch (err) {
            return res.status(500).json({ erro: "Aconteceu um erro na hora de excluir a doacao" });
        }
    }
}

export default DoacaoController;
