import connection from "../db/connection.js";

function normalizarData(data) {
    return data ? new Date(data) : null;
}

class Encontro {
    constructor(
        id,
        data,
        hora,
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
        this.hora = hora;
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
            row.enc_hora,
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
            : ` order by enc_data asc, enc_hora asc, enc_id asc`;

        const [rows] = await connection.query(queryString, params);
        return rows.map((row) => Encontro.fromRow(row));
    }

    async alterar() {
        const [resultado] = await connection.query(
            `
                update encontros set
                    enc_data = ?,
                    enc_hora = ?,
                    enc_disponibilidade = ?,
                    enc_qtdeMax = ?,
                    enc_qtde = ?,
                    enc_local = ?
                where enc_id = ?
            `,
            [
                this.data,
                this.hora,
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
                    enc_hora,
                    enc_disponibilidade,
                    enc_qtdeMax,
                    enc_qtde,
                    enc_local
                ) values (?, ?, ?, ?, ?, ?)
            `,
            [
                this.data,
                this.hora,
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

        const detalhesLimpos = (detalhes || "").trim();
        if (resumoImpacto.exigeDetalhes && detalhesLimpos.length < 15) {
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
                    enc_hora,
                    enc_disponibilidade,
                    enc_qtdeMax,
                    enc_qtde,
                    enc_local
                ) values (?, ?, ?, ?, ?, ?)
            `,
            [
                novaData,
                encontroAnterior.hora,
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

    static mapFuncionarioRow(funcionario) {
        return {
            id: funcionario.fun_id,
            nome: funcionario.fun_nome,
            usuario: funcionario.fun_usuario,
            cargo: funcionario.fun_cargo,
            cpf: funcionario.fun_cpf,
            telefone: funcionario.fun_telefone,
        };
    }

    static async listarResponsaveis(idEncontro, filtroNome = "", filtroUsuario = "") {
        let queryString = `
            select f.*
            from responsaveis r
            inner join funcionarios f on f.fun_id = r.fun_id
            where r.enc_id = ?
        `;
        const valores = [idEncontro];

        if (filtroNome) {
            queryString += ` and f.fun_nome like ?`;
            valores.push(`%${filtroNome}%`);
        }

        if (filtroUsuario) {
            queryString += ` and f.fun_usuario like ?`;
            valores.push(`%${filtroUsuario}%`);
        }

        queryString += ` order by f.fun_nome asc`;

        const [responsaveis] = await connection.query(queryString, valores);
        return responsaveis.map((funcionario) => Encontro.mapFuncionarioRow(funcionario));
    }

    static async listarSubstitutosDisponiveis(idEncontro, idFuncionarioAtual, filtroNome = "", filtroUsuario = "") {
        let queryString = `
            select f.*
            from funcionarios f
            inner join encontros atual on atual.enc_id = ?
            where atual.enc_cancelado = 'N'
              and f.fun_id <> ?
              and not exists (
                  select 1
                  from responsaveis mesmo_encontro
                  where mesmo_encontro.enc_id = atual.enc_id
                    and mesmo_encontro.fun_id = f.fun_id
              )
              and not exists (
                  select 1
                  from responsaveis conflito
                  inner join encontros outro on outro.enc_id = conflito.enc_id
                  where conflito.fun_id = f.fun_id
                    and conflito.enc_id <> atual.enc_id
                    and outro.enc_cancelado = 'N'
                    and outro.enc_data = atual.enc_data
                    and coalesce(outro.enc_hora, '') = coalesce(atual.enc_hora, '')
              )
        `;
        const valores = [idEncontro, idFuncionarioAtual];

        if (filtroNome) {
            queryString += ` and f.fun_nome like ?`;
            valores.push(`%${filtroNome}%`);
        }

        if (filtroUsuario) {
            queryString += ` and f.fun_usuario like ?`;
            valores.push(`%${filtroUsuario}%`);
        }

        queryString += ` order by f.fun_nome asc`;

        const [substitutos] = await connection.query(queryString, valores);
        return substitutos.map((funcionario) => Encontro.mapFuncionarioRow(funcionario));
    }

    static async substituirTutor(idEncontro, idFuncionarioAtual, idFuncionarioNovo) {
        const encontro = await Encontro.buscarPorId(idEncontro);
        if (!encontro) {
            throw Object.assign(new Error("Encontro nao encontrado"), { status: 404 });
        }

        if (encontro.cancelado === "S") {
            throw Object.assign(new Error("Nao e possivel substituir tutor em encontro cancelado"), { status: 400 });
        }

        const [[responsavelAtual]] = await connection.query(
            `select * from responsaveis where enc_id = ? and fun_id = ?`,
            [idEncontro, idFuncionarioAtual]
        );

        if (!responsavelAtual) {
            throw Object.assign(new Error("Funcionario atual nao esta vinculado a este encontro"), { status: 404 });
        }

        const [[funcionarioNovo]] = await connection.query(
            `select * from funcionarios where fun_id = ?`,
            [idFuncionarioNovo]
        );

        if (!funcionarioNovo) {
            throw Object.assign(new Error("Funcionario substituto nao encontrado"), { status: 404 });
        }

        const [[jaResponsavel]] = await connection.query(
            `select * from responsaveis where enc_id = ? and fun_id = ?`,
            [idEncontro, idFuncionarioNovo]
        );

        if (jaResponsavel) {
            throw Object.assign(new Error("Funcionario substituto ja esta vinculado a este encontro"), { status: 400 });
        }

        const [[conflito]] = await connection.query(
            `
                select outro.enc_id, outro.enc_local, outro.enc_data
                from responsaveis conflito
                inner join encontros outro on outro.enc_id = conflito.enc_id
                inner join encontros atual on atual.enc_id = ?
                where conflito.fun_id = ?
                  and conflito.enc_id <> atual.enc_id
                  and outro.enc_cancelado = 'N'
                  and outro.enc_data = atual.enc_data
                  and coalesce(outro.enc_hora, '') = coalesce(atual.enc_hora, '')
                limit 1
            `,
            [idEncontro, idFuncionarioNovo]
        );

        if (conflito) {
            throw Object.assign(
                new Error(`Funcionario ja esta vinculado ao encontro ${conflito.enc_id} na mesma data`),
                { status: 400 }
            );
        }

        const [resultado] = await connection.query(
            `
                update responsaveis
                set fun_id = ?
                where enc_id = ? and fun_id = ?
            `,
            [idFuncionarioNovo, idEncontro, idFuncionarioAtual]
        );

        if (!resultado.affectedRows) {
            throw Object.assign(new Error("Nao foi possivel substituir o tutor"), { status: 400 });
        }

        return {
            encontroId: Number(idEncontro),
            tutorAnteriorId: Number(idFuncionarioAtual),
            tutorNovoId: Number(idFuncionarioNovo),
        };
    }

    static async listarFuncionariosDisponiveis(data, hora, filtroNome = "", filtroUsuario = "") {
        let queryString = `
            select f.*
            from funcionarios f
            where not exists (
                select 1
                from responsaveis r
                inner join encontros e on e.enc_id = r.enc_id
                where r.fun_id = f.fun_id
                  and e.enc_cancelado = 'N'
                  and e.enc_data = ?
                  and coalesce(e.enc_hora, '') = coalesce(?, '')
            )
        `;
        const valores = [data, hora];

        if (filtroNome) {
            queryString += ` and f.fun_nome like ?`;
            valores.push(`%${filtroNome}%`);
        }

        if (filtroUsuario) {
            queryString += ` and f.fun_usuario like ?`;
            valores.push(`%${filtroUsuario}%`);
        }

        queryString += ` order by f.fun_nome asc`;

        const [funcionarios] = await connection.query(queryString, valores);
        return funcionarios.map((funcionario) => Encontro.mapFuncionarioRow(funcionario));
    }

    static async vincularResponsaveis(idEncontro, responsaveisIds = []) {
        if (!Array.isArray(responsaveisIds) || responsaveisIds.length === 0) {
            return;
        }

        const idsUnicos = [...new Set(responsaveisIds.map((id) => Number(id)).filter(Boolean))];
        for (const funId of idsUnicos) {
            await connection.query(
                `insert ignore into responsaveis (fun_id, enc_id, participou) values (?, ?, null)`,
                [funId, idEncontro]
            );
        }
    }
}

export default Encontro;
