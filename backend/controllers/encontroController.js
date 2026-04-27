import Encontro from "../models/encontroModel.js";

const MOTIVOS_CANCELAMENTO = [
    "falta de beneficiarios minimos",
    "ausencia de tutor/funcionario responsavel",
    "indisponibilidade do local",
    "problema climatico",
    "falta de materiais/itens necessarios",
    "conflito de agenda",
    "motivo emergencial/outros",
];

const OPCOES_CANCELAMENTO = [
    "semReposicao",
    "reagendar",
    "transferirInscritos",
];

class EncontroController {
    static async listar(req, res) {
        try {
            const resp = await Encontro.listar(req.query.filtro, req.query.status);
            return res.status(200).json(resp);
        } catch (err) {
            return res.status(500).json({ Erro: "Aconteceu um erro na hora de listar" });
        }
    }

    static async buscarPorId(req, res) {
        try {
            const resp = await Encontro.buscarPorId(req.query.id);
            if (!resp) {
                return res.status(500).json({ Erro: `Nao existe encontro com id ${req.query.id}` });
            }

            return res.status(200).json(resp);
        } catch (err) {
            return res.status(500).json({ Erro: "Aconteceu um erro na hora de buscar" });
        }
    }

    static async impacto(req, res) {
        try {
            const { id } = req.query;
            const resp = await Encontro.buscarImpacto(id);
            if (!resp) {
                return res.status(500).json({ Erro: `Nao existe encontro com id ${id}` });
            }

            return res.status(200).json(resp);
        } catch (err) {
            return res.status(500).json({ Erro: "Aconteceu um erro na hora de buscar o impacto" });
        }
    }

    static async listarResponsaveis(req, res) {
        try {
            const { id, filtroNome, filtroUsuario } = req.query;
            if (!id) {
                return res.status(400).json({ err: "ID do encontro e obrigatorio" });
            }

            const encontro = await Encontro.buscarPorId(id);
            if (!encontro) {
                return res.status(404).json({ err: `Nao existe encontro com id ${id}` });
            }

            const resp = await Encontro.listarResponsaveis(id, filtroNome, filtroUsuario);
            return res.status(200).json(resp);
        } catch (err) {
            return res.status(500).json({ err: "Aconteceu um erro na hora de listar responsaveis" });
        }
    }

    static async listarSubstitutos(req, res) {
        try {
            const { id, funIdAtual, filtroNome, filtroUsuario } = req.query;
            if (!id || !funIdAtual) {
                return res.status(400).json({ err: "ID do encontro e funcionario atual sao obrigatorios" });
            }

            const encontro = await Encontro.buscarPorId(id);
            if (!encontro) {
                return res.status(404).json({ err: `Nao existe encontro com id ${id}` });
            }

            const resp = await Encontro.listarSubstitutosDisponiveis(
                id,
                funIdAtual,
                filtroNome,
                filtroUsuario
            );

            return res.status(200).json(resp);
        } catch (err) {
            return res.status(500).json({ err: "Aconteceu um erro na hora de listar substitutos" });
        }
    }

    static async listarFuncionariosDisponiveis(req, res) {
        try {
            const { data, hora, filtroNome, filtroUsuario } = req.query;
            if (!data || !hora) {
                return res.status(400).json({ err: "Data e hora sao obrigatorias" });
            }

            const resp = await Encontro.listarFuncionariosDisponiveis(
                data,
                hora,
                filtroNome,
                filtroUsuario
            );

            return res.status(200).json(resp);
        } catch (err) {
            return res.status(500).json({ err: "Aconteceu um erro na hora de listar funcionarios disponiveis" });
        }
    }

    static async substituirTutor(req, res) {
        try {
            const { encId, funIdAtual, funIdNovo } = req.body;
            if (!encId || !funIdAtual || !funIdNovo) {
                return res.status(400).json({ err: "Encontro, tutor atual e tutor substituto sao obrigatorios" });
            }

            const resp = await Encontro.substituirTutor(encId, funIdAtual, funIdNovo);
            return res.status(200).json(resp);
        } catch (err) {
            return res.status(err.status || 500).json({ err: err.message || "Erro ao substituir tutor" });
        }
    }

    static async cancelar(req, res) {
        try {
            const { id, motivo, detalhes, opcao, novaData } = req.body;

            if (!id || !motivo) {
                return res.status(400).json({ err: "ID e motivo sao obrigatorios" });
            }

            if (!MOTIVOS_CANCELAMENTO.includes(motivo)) {
                return res.status(400).json({ err: "Motivo invalido" });
            }

            if (opcao && !OPCOES_CANCELAMENTO.includes(opcao)) {
                return res.status(400).json({ err: "Opcao de cancelamento invalida" });
            }

            const resposta = await Encontro.cancelarComFluxo({
                id,
                motivo,
                detalhes: detalhes || "",
                opcao,
                novaData,
            });

            return res.status(200).json({
                cancelled: true,
                motivo: resposta.motivo,
                detalhes: resposta.detalhes,
                acao: resposta.opcao,
                liberados: resposta.liberados,
                reagendamento: resposta.novoEncontroId
                    ? {
                        novoEncontroId: resposta.novoEncontroId,
                        transferencia: resposta.opcao === "transferirInscritos",
                        novaData: resposta.novaData,
                    }
                    : null,
            });
        } catch (err) {
            console.error(err);
            return res.status(err.status || 500).json({
                err: err.message || "Erro ao cancelar encontro",
            });
        }
    }

    static async alterar(req, res) {
        try {
            const { id, data, hora, disponibilidade, qtdeMax, qtde, local } = req.body;
            if (
                data == "" ||
                hora == "" ||
                (disponibilidade != "A" && disponibilidade != "E" && disponibilidade != "F") ||
                qtdeMax <= 0 ||
                qtde == null ||
                qtde < 0 ||
                local == ""
            ) {
                if (qtdeMax == 0) {
                    return res.status(500).json({
                        err: "Quantidade maxima nao pode ser menor ou igual a 0",
                        campos: {
                            enc_data: !data,
                            enc_hora: !hora,
                            enc_disponibilidade: !disponibilidade,
                            enc_qtdeMax: !qtdeMax,
                            enc_qtde: !qtde,
                            enc_local: !local,
                        },
                    });
                }
                if (qtde < 0) {
                    return res.status(500).json({
                        err: "Quantidade nao pode ser menor que 0",
                        campos: {
                            enc_data: !data,
                            enc_hora: !hora,
                            enc_disponibilidade: !disponibilidade,
                            enc_qtdeMax: !qtdeMax,
                            enc_qtde: !qtde,
                            enc_local: !local,
                        },
                    });
                }
                return res.status(500).json({
                    err: "Algum campo esta vazio",
                    campos: {
                        enc_data: !data,
                        enc_hora: !hora,
                        enc_disponibilidade: !disponibilidade,
                        enc_qtdeMax: !qtdeMax,
                        enc_qtde: !qtde,
                        enc_local: !local,
                    },
                });
            }

            if (qtde > qtdeMax) {
                return res.status(500).json({ err: "Quantidade atual nao pode ser maior que a maxima" });
            }

            const encontro = new Encontro(
                id,
                data,
                hora,
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

    static async excluir(req, res) {
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

    static async cadastrar(req, res) {
        try {
            const { data, hora, disponibilidade, qtdeMax, qtde, local, responsaveis = [] } = req.body;
            if (
                data == "" ||
                hora == "" ||
                (disponibilidade != "A" && disponibilidade != "E" && disponibilidade != "F") ||
                qtdeMax <= 0 ||
                qtde == null ||
                qtde < 0 ||
                local == ""
            ) {
                if (qtdeMax == 0) {
                    return res.status(500).json({
                        err: "Quantidade maxima nao pode ser menor ou igual a 0",
                        campos: {
                            enc_data: !data,
                            enc_hora: !hora,
                            enc_disponibilidade: !disponibilidade,
                            enc_qtdeMax: !qtdeMax,
                            enc_qtde: !qtde,
                            enc_local: !local,
                        },
                    });
                }
                if (qtde < 0) {
                    return res.status(500).json({
                        err: "Quantidade nao pode ser menor que 0",
                        campos: {
                            enc_data: !data,
                            enc_hora: !hora,
                            enc_disponibilidade: !disponibilidade,
                            enc_qtdeMax: !qtdeMax,
                            enc_qtde: !qtde,
                            enc_local: !local,
                        },
                    });
                }
                return res.status(500).json({
                    err: "Algum campo esta vazio",
                    campos: {
                        enc_data: !data,
                        enc_hora: !hora,
                        enc_disponibilidade: !disponibilidade,
                        enc_qtdeMax: !qtdeMax,
                        enc_qtde: !qtde,
                        enc_local: !local,
                    },
                });
            }

            if (qtde > qtdeMax) {
                return res.status(500).json({ err: "Quantidade atual nao pode ser maior que a maxima" });
            }

            const encontro = new Encontro(
                0,
                data,
                hora,
                disponibilidade,
                qtdeMax,
                qtde,
                local
            );

            const resp = await encontro.gravar();
            await Encontro.vincularResponsaveis(resp.insertId, responsaveis);
            return res.status(200).json(resp);
        } catch (err) {
            return res.status(500).json(err);
        }
    }
}

export default EncontroController;
