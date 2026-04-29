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
      return res
        .status(500)
        .json({ Erro: "Aconteceu um erro na hora de listar" });
    }
  }

  static async buscarPorId(req, res) {
    try {
      const resp = await Encontro.buscarPorId(req.query.id);
      if (!resp) {
        return res
          .status(500)
          .json({ Erro: `Nao existe encontro com id ${req.query.id}` });
      }

      return res.status(200).json(resp);
    } catch (err) {
      return res
        .status(500)
        .json({ Erro: "Aconteceu um erro na hora de buscar" });
    }
  }

  static async impacto(req, res) {
    try {
      const { id } = req.query;
      const resp = await Encontro.buscarImpacto(id);
      if (!resp) {
        return res
          .status(500)
          .json({ Erro: `Nao existe encontro com id ${id}` });
      }

      return res.status(200).json(resp);
    } catch (err) {
      return res
        .status(500)
        .json({ Erro: "Aconteceu um erro na hora de buscar o impacto" });
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
        return res
          .status(404)
          .json({ err: `Nao existe encontro com id ${id}` });
      }

      const resp = await Encontro.listarResponsaveis(
        id,
        filtroNome,
        filtroUsuario,
      );
      return res.status(200).json(resp);
    } catch (err) {
      return res
        .status(500)
        .json({ err: "Aconteceu um erro na hora de listar responsaveis" });
    }
  }

  static async listarSubstitutos(req, res) {
    try {
      const { id, funIdAtual, filtroNome, filtroUsuario } = req.query;
      if (!id || !funIdAtual) {
        return res
          .status(400)
          .json({ err: "ID do encontro e funcionario atual sao obrigatorios" });
      }

      const encontro = await Encontro.buscarPorId(id);
      if (!encontro) {
        return res
          .status(404)
          .json({ err: `Nao existe encontro com id ${id}` });
      }

      const resp = await Encontro.listarSubstitutosDisponiveis(
        id,
        funIdAtual,
        filtroNome,
        filtroUsuario,
      );

      return res.status(200).json(resp);
    } catch (err) {
      return res
        .status(500)
        .json({ err: "Aconteceu um erro na hora de listar substitutos" });
    }
  }

  static async listarFuncionariosDisponiveis(req, res) {
    try {
      const { data, hora, horaFim, filtroNome, filtroUsuario } = req.query;
      if (!data || !hora) {
        return res.status(400).json({ err: "Data e hora sao obrigatorias" });
      }

      const resp = await Encontro.listarFuncionariosDisponiveis(
        data,
        hora,
        horaFim || hora,
        filtroNome,
        filtroUsuario,
      );

      return res.status(200).json(resp);
    } catch (err) {
      return res
        .status(500)
        .json({
          err: "Aconteceu um erro na hora de listar funcionarios disponiveis",
        });
    }
  }

  static async substituirTutor(req, res) {
    try {
      const { encId, funIdAtual, funIdNovo } = req.body;
      if (!encId || !funIdAtual || !funIdNovo) {
        return res
          .status(400)
          .json({
            err: "Encontro, tutor atual e tutor substituto sao obrigatorios",
          });
      }

      const resp = await Encontro.substituirTutor(encId, funIdAtual, funIdNovo);
      return res.status(200).json(resp);
    } catch (err) {
      return res
        .status(err.status || 500)
        .json({ err: err.message || "Erro ao substituir tutor" });
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
      const { id, data, hora, horaFim, disponibilidade, qtdeMax, qtde, local } =
        req.body;
      if (
        data == "" ||
        hora == "" ||
        horaFim == "" ||
        (disponibilidade != "A" &&
          disponibilidade != "E" &&
          disponibilidade != "F") ||
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
              enc_hora_fim: !horaFim,
              enc_hora_fim: !horaFim,
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
              enc_hora_fim: !horaFim,
              enc_hora_fim: !horaFim,
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
        return res
          .status(500)
          .json({ err: "Quantidade atual nao pode ser maior que a maxima" });
      }

      Encontro.validarHorario(hora, horaFim);

      const encontro = new Encontro(
        id,
        data,
        hora,
        horaFim || null,
        disponibilidade,
        qtdeMax,
        qtde,
        local,
      );

      const resultado = await encontro.alterar();
      return res.status(200).json(resultado);
    } catch (error) {
      return res.status(error.status || 500).json({
        err: error.message || "Erro ao alterar encontro",
        campos: error.campos || {},
      });
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
      const {
        data,
        hora,
        horaFim,
        disponibilidade,
        qtdeMax,
        local,
        responsaveis = [],
        materiais = [],
      } = req.body;
      const qtdeInicial = 0;
      const localLimpo = String(local || "").trim();

      if (
        data == "" ||
        hora == "" ||
        horaFim == "" ||
        (disponibilidade != "A" &&
          disponibilidade != "E" &&
          disponibilidade != "F") ||
        qtdeMax <= 0 ||
        localLimpo == ""
      ) {
        if (qtdeMax == 0) {
          return res.status(500).json({
            err: "Quantidade maxima nao pode ser menor ou igual a 0",
            campos: {
              enc_data: !data,
              enc_hora: !hora,
              enc_disponibilidade: !disponibilidade,
              enc_qtdeMax: !qtdeMax,
              enc_local: !local,
            },
          });
        }
        return res.status(500).json({
          err: "Algum campo esta vazio",
          campos: {
            enc_data: !data,
            enc_hora: !hora,
            enc_hora_fim: !horaFim,
            enc_disponibilidade: !disponibilidade,
            enc_qtdeMax: !qtdeMax,
            enc_local: !localLimpo,
          },
        });
      }

      Encontro.validarAgendamento({
        data,
        hora,
        horaFim,
        local: localLimpo,
        qtdeMax,
        qtde: qtdeInicial,
        responsaveisIds: responsaveis,
      });

      const conflitoLocal = await Encontro.buscarConflitoLocal(
        data,
        hora,
        horaFim,
        localLimpo,
      );
      if (conflitoLocal) {
        return res.status(400).json({
          err: `Ja existe encontro agendado neste local e horario: #${conflitoLocal.enc_id}`,
          campos: {
            enc_local: "Local indisponivel neste horario",
          },
        });
      }

      const conflitosResponsaveis =
        await Encontro.listarResponsaveisComConflito(
          data,
          hora,
          horaFim,
          responsaveis,
        );
      if (conflitosResponsaveis.length > 0) {
        return res.status(400).json({
          err: `Responsavel indisponivel neste horario: ${conflitosResponsaveis[0].fun_nome}`,
          campos: {
            responsaveis:
              "Um ou mais responsaveis ja possuem encontro neste horario",
          },
        });
      }

      const materiaisNormalizados = Encontro.normalizarMateriais(materiais);
      if (
        Array.isArray(materiais) &&
        materiais.length > 0 &&
        materiaisNormalizados.length === 0
      ) {
        return res.status(400).json({
          err: "Informe materiais com item e quantidade valida",
          campos: {
            materiais: "Selecione item e quantidade maior que 0",
          },
        });
      }

      const conflitosMateriais = await Encontro.listarMateriaisComConflito(
        data,
        hora,
        horaFim,
        materiaisNormalizados,
      );
      if (conflitosMateriais.length > 0) {
        return res.status(400).json({
          err: `Material indisponivel neste horario: ${conflitosMateriais[0].item_nome}`,
          campos: {
            materiais:
              "Um ou mais materiais ja estao reservados para outro encontro neste horario",
          },
        });
      }

      const encontro = new Encontro(
        0,
        data,
        hora,
        horaFim,
        disponibilidade,
        qtdeMax,
        qtdeInicial,
        localLimpo,
      );

      const resp = await Encontro.gravarComRelacionamentos(
        encontro,
        responsaveis,
        materiaisNormalizados,
      );
      return res.status(200).json(resp);
    } catch (err) {
      return res.status(err.status || 500).json({
        err: err.message || "Erro ao cadastrar encontro",
        campos: err.campos || {},
      });
    }
  }

  static async finalizar(req, res) {
    try {
      const { id, participantes = [] } = req.body;

      if (!id) {
        return res.status(400).json({
          err: "ID do encontro é obrigatório",
        });
      }

      const encontro = await Encontro.buscarPorId(id);

      if (!encontro) {
        return res.status(404).json({
          err: "Encontro não encontrado",
        });
      }

      if (encontro.enc_disponibilidade === "F") {
        return res.status(400).json({
          err: "Encontro já finalizado",
        });
      }

      if (
        encontro.enc_disponibilidade !== "A" &&
        encontro.enc_disponibilidade !== "E"
      ) {
        return res.status(400).json({
          err: "Encontro não está em andamento",
        });
      }

      const resultado = await Encontro.finalizar({
        id,
        participantes,
      });

      return res.status(200).json({
        success: true,
        message: "Encontro finalizado com sucesso",
        data: resultado,
      });
    } catch (err) {
      console.error(err);
      return res.status(err.status || 500).json({
        err: err.message || "Erro ao finalizar encontro",
      });
    }
  }
}

export default EncontroController;
