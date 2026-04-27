import connection from "../db/connection.js";

function normalizarData(data) {
    return data ? new Date(data) : null;
}

class Encontro {
    constructor(
        id,
        data,
        disponibilidade,
        qtdeMax,
        qtde,
        local,
        cancelado = "N",
        motivoCancelamento = null,
        detalhesCancelamento = null,
        dataCancelamento = null,
        acaoCancelamento = null,
        reagendadoPara = null,
        beneficiariosAfetados = 0,
        responsaveisAfetados = 0,
        materiaisAfetados = 0
    ) {
        this.id = id;
        this.data = data;
        this.disponibilidade = disponibilidade;
        this.qtdeMax = qtdeMax;
        this.qtde = qtde;
        this.local = local;
        this.cancelado = cancelado;
        this.motivoCancelamento = motivoCancelamento;
        this.detalhesCancelamento = detalhesCancelamento;
        this.dataCancelamento = dataCancelamento;
        this.acaoCancelamento = acaoCancelamento;
        this.reagendadoPara = reagendadoPara;
        this.beneficiariosAfetados = beneficiariosAfetados;
        this.responsaveisAfetados = responsaveisAfetados;
        this.materiaisAfetados = materiaisAfetados;
    }

    static fromRow(row) {
        return new Encontro(
            row.enc_id,
            row.enc_data,
            row.enc_disponibilidade,
            row.enc_qtdeMax,
            row.enc_qtde,
            row.enc_local,
            row.enc_cancelado,
            row.enc_motivo_cancelamento,
            row.enc_detalhes_cancelamento,
            row.enc_data_cancelamento,
            row.enc_acao_cancelamento,
            row.enc_reagendado_para,
            row.enc_beneficiarios_afetados,
            row.enc_responsaveis_afetados,
            row.enc_materiais_afetados
        );
    }

    static async listar(filtro, status = "ativos") {
        let queryString = `select * from encontros where enc_cancelado = ?`;
        const params = [status === "cancelados" ? "S" : "N"];

        if (filtro) {
            const termo = `%${filtro}%`;
            queryString += `
                and (
                    enc_local like ?
                    or cast(enc_id as char) like ?
                    or coalesce(enc_motivo_cancelamento, '') like ?
                )
            `;
            params.push(termo, termo, termo);
        }

        queryString += status === "cancelados"
            ? ` order by enc_data_cancelamento desc, enc_id desc`
            : ` order by enc_data asc, enc_id asc`;

        const [rows] = await connection.query(queryString, params);
        return rows.map((row) => Encontro.fromRow(row));
    }

    async alterar() {
        const [resultado] = await connection.query(
            `
                update encontros set
                    enc_data = ?,
                    enc_disponibilidade = ?,
                    enc_qtdeMax = ?,
                    enc_qtde = ?,
                    enc_local = ?
                where enc_id = ?
            `,
            [
                this.data,
                this.disponibilidade,
                this.qtdeMax,
                this.qtde,
                this.local,
                this.id,
            ]
        );

        return resultado;
    }

    async excluir() {
        const [resultado] = await connection.query(
            `
                delete from encontros
                where enc_id = ?
            `,
            [this.id]
        );

        return resultado;
    }

    async gravar() {
        const [resultado] = await connection.query(
            `
                insert into encontros(
                    enc_data,
                    enc_disponibilidade,
                    enc_qtdeMax,
                    enc_qtde,
                    enc_local
                ) values (?, ?, ?, ?, ?)
            `,
            [
                this.data,
                this.disponibilidade,
                this.qtdeMax,
                this.qtde,
                this.local,
            ]
        );

        return resultado;
    }

    static async buscarPorLocal(local) {
        const [[row]] = await connection.query(
            `select * from encontros where enc_local = ?`,
            [local]
        );

        return row ? Encontro.fromRow(row) : null;
    }

    static async buscarPorId(id) {
        const [[row]] = await connection.query(
            `select * from encontros where enc_id = ?`,
            [id]
        );

        return row ? Encontro.fromRow(row) : null;
    }

    static async contarImpacto(connectionRef, id) {
        const [[beneficiarios]] = await connectionRef.query(
            `select count(*) as total from participantes where enc_id = ?`,
            [id]
        );

        const [[responsaveis]] = await connectionRef.query(
            `select count(*) as total from responsaveis where enc_id = ?`,
            [id]
        );

        const [[materiais]] = await connectionRef.query(
            `select count(*) as total from materiais where enc_id = ?`,
            [id]
        );

        return {
            beneficiarios: beneficiarios.total,
            responsaveis: responsaveis.total,
            materiais: materiais.total,
        };
    }

    static montarResumoImpacto(encontro, impacto) {
        const dataEncontro = normalizarData(encontro.data);
        const agora = new Date();
        const distancia = dataEncontro ? dataEncontro.getTime() - agora.getTime() : null;
        const proximo = distancia !== null && distancia <= 1000 * 60 * 60 * 24;

        const motivosBloqueio = [];
        if (encontro.cancelado === "S") {
            motivosBloqueio.push("Este encontro ja foi cancelado.");
        }
        if (encontro.disponibilidade === "F") {
            motivosBloqueio.push("Encontro finalizado nao pode ser cancelado.");
        }

        return {
            encontro,
            ...impacto,
            documentos: 0,
            observacoes: 0,
            proximo,
            exigeDetalhes: encontro.disponibilidade === "E" || proximo,
            confirmacaoReforcada:
                impacto.beneficiarios > 0 ||
                impacto.responsaveis > 0 ||
                impacto.materiais > 0,
            motivosBloqueio,
        };
    }

    static async buscarImpacto(id) {
        const encontro = await Encontro.buscarPorId(id);
        if (!encontro) {
            return null;
        }

        const impacto = await Encontro.contarImpacto(connection, id);
        return Encontro.montarResumoImpacto(encontro, impacto);
    }

    static validarCancelamento(resumoImpacto, detalhes, opcao, novaData) {
        if (resumoImpacto.motivosBloqueio.length > 0) {
            const erro = new Error(resumoImpacto.motivosBloqueio[0]);
            erro.status = 400;
            throw erro;
        }

        if (resumoImpacto.exigeDetalhes && detalhes.trim().length < 15) {
            const erro = new Error(
                "Informe uma justificativa detalhada para encontros em andamento ou proximos da data."
            );
            erro.status = 400;
            throw erro;
        }

        if (opcao === "transferirInscritos" && resumoImpacto.beneficiarios === 0) {
            const erro = new Error("Nao ha inscritos para transferir para um novo encontro.");
            erro.status = 400;
            throw erro;
        }

        if (opcao === "reagendar" || opcao === "transferirInscritos") {
            if (!novaData) {
                const erro = new Error("Nova data obrigatoria para reagendamento.");
                erro.status = 400;
                throw erro;
            }

            const novaDataNormalizada = normalizarData(novaData);
            const dataOriginal = normalizarData(resumoImpacto.encontro.data);

            if (!novaDataNormalizada || Number.isNaN(novaDataNormalizada.getTime())) {
                const erro = new Error("Nova data invalida.");
                erro.status = 400;
                throw erro;
            }

            if (
                dataOriginal &&
                novaDataNormalizada.toISOString().slice(0, 10) === dataOriginal.toISOString().slice(0, 10)
            ) {
                const erro = new Error("A nova data precisa ser diferente da data original do encontro.");
                erro.status = 400;
                throw erro;
            }

            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0);
            novaDataNormalizada.setHours(0, 0, 0, 0);

            if (novaDataNormalizada < hoje) {
                const erro = new Error("A nova data precisa estar no presente ou no futuro.");
                erro.status = 400;
                throw erro;
            }
        }
    }

    static async criarReagendamentoTransacional(connectionRef, encontroAnterior, novaData, transferirInscritos) {
        const [resultado] = await connectionRef.query(
            `
                insert into encontros(
                    enc_data,
                    enc_disponibilidade,
                    enc_qtdeMax,
                    enc_qtde,
                    enc_local
                ) values (?, ?, ?, ?, ?)
            `,
            [
                novaData,
                "A",
                encontroAnterior.qtdeMax,
                0,
                encontroAnterior.local,
            ]
        );

        const novoEncontroId = resultado.insertId;

        if (transferirInscritos) {
            await connectionRef.query(
                `
                    insert ignore into participantes (enc_id, ben_id, participou)
                    select ?, ben_id, participou
                    from participantes
                    where enc_id = ?
                `,
                [novoEncontroId, encontroAnterior.id]
            );

            await connectionRef.query(
                `
                    insert ignore into responsaveis (fun_id, enc_id, participou)
                    select fun_id, ?, participou
                    from responsaveis
                    where enc_id = ?
                `,
                [novoEncontroId, encontroAnterior.id]
            );

            await connectionRef.query(
                `
                    insert ignore into materiais (enc_id, item_id, qtde, utilizado)
                    select ?, item_id, qtde, utilizado
                    from materiais
                    where enc_id = ?
                `,
                [novoEncontroId, encontroAnterior.id]
            );

            const [[{ total }]] = await connectionRef.query(
                `select count(*) as total from participantes where enc_id = ?`,
                [novoEncontroId]
            );

            await connectionRef.query(
                `update encontros set enc_qtde = ? where enc_id = ?`,
                [total, novoEncontroId]
            );
        }

        return novoEncontroId;
    }

    static async liberarVinculos(connectionRef, encontroId) {
        await connectionRef.query(`delete from participantes where enc_id = ?`, [encontroId]);
        await connectionRef.query(`delete from responsaveis where enc_id = ?`, [encontroId]);
        await connectionRef.query(`delete from materiais where enc_id = ?`, [encontroId]);
    }

    static async cancelarComFluxo({ id, motivo, detalhes = "", opcao = "semReposicao", novaData = null }) {
        await connection.beginTransaction();

        try {
            const [[row]] = await connection.query(
                `select * from encontros where enc_id = ? for update`,
                [id]
            );

            if (!row) {
                const erro = new Error(`Nao existe encontro com id ${id}`);
                erro.status = 404;
                throw erro;
            }

            const encontro = Encontro.fromRow(row);
            const impacto = await Encontro.contarImpacto(connection, id);
            const resumoImpacto = Encontro.montarResumoImpacto(encontro, impacto);

            Encontro.validarCancelamento(resumoImpacto, detalhes, opcao, novaData);

            let novoEncontroId = null;
            if (opcao === "reagendar" || opcao === "transferirInscritos") {
                novoEncontroId = await Encontro.criarReagendamentoTransacional(
                    connection,
                    encontro,
                    novaData,
                    opcao === "transferirInscritos"
                );
            }

            await Encontro.liberarVinculos(connection, id);

            await connection.query(
                `
                    update encontros set
                        enc_cancelado = 'S',
                        enc_motivo_cancelamento = ?,
                        enc_detalhes_cancelamento = ?,
                        enc_data_cancelamento = now(),
                        enc_disponibilidade = 'C',
                        enc_acao_cancelamento = ?,
                        enc_reagendado_para = ?,
                        enc_beneficiarios_afetados = ?,
                        enc_responsaveis_afetados = ?,
                        enc_materiais_afetados = ?,
                        enc_qtde = 0
                    where enc_id = ?
                `,
                [
                    motivo,
                    detalhes,
                    opcao,
                    novoEncontroId,
                    impacto.beneficiarios,
                    impacto.responsaveis,
                    impacto.materiais,
                    id,
                ]
            );

            await connection.commit();

            return {
                encontroId: id,
                motivo,
                detalhes,
                opcao,
                novaData,
                novoEncontroId,
                liberados: {
                    beneficiarios: impacto.beneficiarios,
                    responsaveis: impacto.responsaveis,
                    materiais: impacto.materiais,
                },
            };
        } catch (error) {
            await connection.rollback();
            throw error;
        }
    }
}

export default Encontro;
