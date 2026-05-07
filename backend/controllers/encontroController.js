import Encontro from "../models/encontroModel.js";
import SingletonDB from "../db/SingletonDB.js";

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
      const connection = await SingletonDB.getConnection();
      const resp = await Encontro.listar(
        connection,
        req.query.filtro,
        req.query.status,
        req.query.dataInicial,
        req.query.dataFinal,
      );
      return res.status(200).json(resp);
    } catch (err) {
      return res
        .status(500)
        .json({ Erro: "Aconteceu um erro na hora de listar" });
    }
  }

  static async buscarPorId(req, res) {
    try {
      const connection = await SingletonDB.getConnection();
      const resp = await Encontro.buscarPorId(connection, req.query.id);
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
      const connection = await SingletonDB.getConnection();
      const { id } = req.query;
      const resp = await Encontro.buscarImpacto(connection, id);
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
      const connection = await SingletonDB.getConnection();
      const { id, filtroNome, filtroUsuario } = req.query;
      if (!id) {
        return res.status(400).json({ err: "ID do encontro e obrigatorio" });
      }

      const encontro = await Encontro.buscarPorId(connection, id);
      if (!encontro) {
        return res
          .status(404)
          .json({ err: `Nao existe encontro com id ${id}` });
      }

      const resp = await Encontro.listarResponsaveis(
        connection,
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

  static async listarMateriais(req, res) {
    try {
      const connection = await SingletonDB.getConnection();
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ err: "ID do encontro e obrigatorio" });
      }

      const encontro = await Encontro.buscarPorId(connection, id);
      if (!encontro) {
        return res
          .status(404)
          .json({ err: `Nao existe encontro com id ${id}` });
      }

      const resp = await Encontro.listarMateriaisPorEncontro(connection, id);
      return res.status(200).json(resp);
    } catch (err) {
      return res
        .status(500)
        .json({ err: "Aconteceu um erro na hora de listar materiais" });
    }
  }

  static async listarSubstitutos(req, res) {
    try {
      const connection = await SingletonDB.getConnection();
      const { id, funIdAtual, filtroNome, filtroUsuario } = req.query;
      if (!id || !funIdAtual) {
        return res
          .status(400)
          .json({ err: "ID do encontro e funcionario atual sao obrigatorios" });
      }

      const encontro = await Encontro.buscarPorId(connection, id);
      if (!encontro) {
        return res
          .status(404)
          .json({ err: `Nao existe encontro com id ${id}` });
      }

      const resp = await Encontro.listarSubstitutosDisponiveis(
        connection,
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
      const connection = await SingletonDB.getConnection();
      const { data, hora, horaFim, filtroNome, filtroUsuario, ignorarId } = req.query;
      if (!data || !hora) {
        return res.status(400).json({ err: "Data e hora sao obrigatorias" });
      }

      const resp = await Encontro.listarFuncionariosDisponiveis(
        connection,
        data,
        hora,
        horaFim || hora,
        filtroNome,
        filtroUsuario,
        ignorarId,
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
      const connection = await SingletonDB.getConnection();
      const { encId, funIdAtual, funIdNovo } = req.body;
      if (!encId || !funIdAtual || !funIdNovo) {
        return res
          .status(400)
          .json({
            err: "Encontro, tutor atual e tutor substituto sao obrigatorios",
          });
      }

      const resp = await Encontro.substituirTutor(
        connection,
        encId,
        funIdAtual,
        funIdNovo,
      );
      return res.status(200).json(resp);
    } catch (err) {
      return res
        .status(err.status || 500)
        .json({ err: err.message || "Erro ao substituir tutor" });
    }
  }

  static async cancelar(req, res) {
    try {
      const connection = await SingletonDB.getConnection();
      const {
        id,
        motivo,
        detalhes,
        opcao,
        novaData,
        novaHora,
        novaHoraFim,
        responsaveis = [],
        materiais = [],
      } = req.body;
      const canceladoPorId = Number(req.usuarioLogado?.id);

      if (!id || !motivo) {
        return res.status(400).json({ err: "ID e motivo sao obrigatorios" });
      }

      if (!Number.isInteger(canceladoPorId) || canceladoPorId <= 0) {
        return res
          .status(401)
          .json({ err: "Usuario autenticado invalido para cancelar encontro" });
      }

      if (!MOTIVOS_CANCELAMENTO.includes(motivo)) {
        return res.status(400).json({ err: "Motivo invalido" });
      }

      if (opcao && !OPCOES_CANCELAMENTO.includes(opcao)) {
        return res.status(400).json({ err: "Opcao de cancelamento invalida" });
      }

      const resposta = await Encontro.cancelarComFluxo(connection, {
        id,
        motivo,
        detalhes: detalhes || "",
        opcao,
        novaData,
        novaHora,
        novaHoraFim,
        responsaveis,
        materiais,
        canceladoPorId,
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
              novaHora: resposta.novaHora,
              novaHoraFim: resposta.novaHoraFim,
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
      const connection = await SingletonDB.getConnection();
      const { id, data, hora, horaFim, disponibilidade, qtdeMax, qtde, local } =
        req.body;
      const localLimpo = String(local || "").trim();

      if (!id) {
        return res.status(400).json({ err: "ID do encontro e obrigatorio" });
      }

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
        localLimpo == ""
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

      const conflitoLocal = await Encontro.buscarConflitoLocal(
        connection,
        data,
        hora,
        horaFim,
        localLimpo,
        id,
      );
      if (conflitoLocal) {
        return res.status(400).json({
          err: `Ja existe encontro agendado neste local e horario: #${conflitoLocal.enc_id}`,
          campos: {
            enc_local: "Local indisponivel neste horario",
          },
        });
      }

      const responsaveisAtuais = await Encontro.listarResponsaveisIds(connection, id);
      const conflitosResponsaveis =
        await Encontro.listarResponsaveisComConflito(
          connection,
          data,
          hora,
          horaFim,
          responsaveisAtuais,
          id,
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

      const materiaisAtuais = await Encontro.listarMateriaisPorEncontro(connection, id);
      const conflitosMateriais = await Encontro.listarMateriaisComConflito(
        connection,
        data,
        hora,
        horaFim,
        materiaisAtuais,
        id,
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
        id,
        data,
        hora,
        horaFim || null,
        disponibilidade,
        qtdeMax,
        qtde,
        localLimpo,
      );

      const resultado = await encontro.alterar(connection);
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
      const connection = await SingletonDB.getConnection();
      const { id } = req.body;
      if (!id) {
        return res.status(400).json({ erro: "ID do encontro e obrigatorio" });
      }

      const encontro = new Encontro(id);
      const resultado = await encontro.excluir(connection);
      if (!resultado.affectedRows) {
        return res.status(404).json({ erro: `Nao existe encontro com id ${id}` });
      }

      return res.status(200).json(resultado);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ erro: "Erro ao excluir encontro" });
    }
  }

  static async cadastrar(req, res) {
    try {
      const connection = await SingletonDB.getConnection();
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
        connection,
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
          connection,
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
        connection,
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
        connection,
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
      const connection = await SingletonDB.getConnection();
      const { id, participantes = [] } = req.body;

      if (!id) {
        return res.status(400).json({
          err: "ID do encontro é obrigatório",
        });
      }

      const encontro = await Encontro.buscarPorId(connection, id);
      if (!encontro) {
        return res.status(404).json({
          err: "Encontro não encontrado",
        });
      }

      if (encontro.disponibilidade === "F") {
        return res.status(400).json({
          err: "Encontro já finalizado",
        });
      }

      if (
        encontro.disponibilidade !== "A" &&
        encontro.disponibilidade !== "E"
      ) {
        return res.status(400).json({
          err: "Encontro não está em andamento",
        });
      }

      const resultado = await Encontro.finalizar(connection, {
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
