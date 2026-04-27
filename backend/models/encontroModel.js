import connection from "../db/connection.js"

class Encontro{
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
        dataCancelamento = null
    ){
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
    }

    static async listar(filtro, status = "ativos") {
        let queryString = `select * from encontros`;
        if (status === "cancelados") {
            queryString += ` where enc_cancelado = 'S'`;
        } else {
            queryString += ` where enc_cancelado = 'N'`;
        }

        if (filtro) {
            queryString += ` and enc_local like '%${filtro}%'`;
        }
        const [encontros] = await connection.query(queryString);
        let encontroList = [];
        encontros.forEach(f => {
            encontroList.push(new Encontro(
                f.enc_id,
                f.enc_data,
                f.enc_hora,
                f.enc_disponibilidade,
                f.enc_qtdeMax,
                f.enc_qtde,
                f.enc_local,
                f.enc_cancelado,
                f.enc_motivo_cancelamento,
                f.enc_detalhes_cancelamento,
                f.enc_data_cancelamento
            ));
        });
        return encontroList;
    }
    
    async alterar(){
        let queryString = `
            update encontros set
                enc_data = ?,
                enc_hora = ?,
                enc_disponibilidade = ?,
                enc_qtdeMax = ?,
                enc_qtde = ?,
                enc_local = ?
            where enc_id = ?;
        `;

        const [resultado] = await connection.query(queryString, [
            this.data,
            this.hora,
            this.disponibilidade,
            this.qtdeMax,
            this.qtde,
            this.local,
            this.id
        ]);
        return resultado;
    }

    async excluir(){
        let queryString = `
            delete from encontros
            where enc_id = ?;
        `;

        const [resultado] = await connection.query(queryString, [this.id]);
        return resultado;
    }

    async cancelar(motivo, detalhes){
        let queryString = `
            update encontros set
                enc_cancelado = 'S',
                enc_motivo_cancelamento = ?,
                enc_detalhes_cancelamento = ?,
                enc_data_cancelamento = curdate(),
                enc_disponibilidade = 'C'
            where enc_id = ?;
        `;

        const [resultado] = await connection.query(queryString, [
            motivo,
            detalhes,
            this.id
        ]);
        return resultado;
    }

    static async buscarPorLocal(local){
        let queryString = `select * from encontros where enc_local = ?`
        const [[encontro]] = await connection.query(queryString, [local]);
        if(!encontro){
            return null;
        }else{
            return new Encontro(
                encontro.enc_id,
                encontro.enc_data,
                encontro.enc_hora,
                encontro.enc_disponibilidade,
                encontro.enc_qtdeMax,
                encontro.enc_qtde,
                encontro.enc_local,
                encontro.enc_cancelado,
                encontro.enc_motivo_cancelamento,
                encontro.enc_detalhes_cancelamento,
                encontro.enc_data_cancelamento
            );
        }
    }

    static async buscarPorId(id){
        let queryString = `select * from encontros where enc_id = ?`
        const [[encontro]] = await connection.query(queryString, [id]);
        if(!encontro){
            return null;
        }else{
            return new Encontro(
                encontro.enc_id,
                encontro.enc_data,
                encontro.enc_hora,
                encontro.enc_disponibilidade,
                encontro.enc_qtdeMax,
                encontro.enc_qtde,
                encontro.enc_local,
                encontro.enc_cancelado,
                encontro.enc_motivo_cancelamento,
                encontro.enc_detalhes_cancelamento,
                encontro.enc_data_cancelamento
            );
        }
    }

    async gravar(){
        let queryString = `
            insert into encontros(
                enc_data,
                enc_hora,
                enc_disponibilidade,
                enc_qtdeMax,
                enc_qtde,
                enc_local
            ) values (?, ?, ?, ?, ?, ?);
        `;

        const [resultado] = await connection.query(queryString, [
            this.data,
            this.hora,
            this.disponibilidade,
            this.qtdeMax,
            this.qtde,
            this.local
        ]);

        return resultado;
    }

    static async buscarImpacto(id){
        const [[encontro]] = await connection.query(
            `select * from encontros where enc_id = ?`,
            [id]
        );
        if(!encontro){
            return null;
        }

        const [[beneficiarios]] = await connection.query(
            `select count(*) as total from participantes where enc_id = ?`,
            [id]
        );

        const [[responsaveis]] = await connection.query(
            `select count(*) as total from responsaveis where enc_id = ?`,
            [id]
        );

        const [[materiais]] = await connection.query(
            `select count(*) as total from materiais where enc_id = ?`,
            [id]
        );

        return {
            encontro: new Encontro(
                encontro.enc_id,
                encontro.enc_data,
                encontro.enc_hora,
                encontro.enc_disponibilidade,
                encontro.enc_qtdeMax,
                encontro.enc_qtde,
                encontro.enc_local,
                encontro.enc_cancelado,
                encontro.enc_motivo_cancelamento,
                encontro.enc_detalhes_cancelamento,
                encontro.enc_data_cancelamento
            ),
            beneficiarios: beneficiarios.total,
            responsaveis: responsaveis.total,
            materiais: materiais.total,
            documentos: 0,
            observacoes: 0,
            proximo: encontro.enc_data && new Date(encontro.enc_data) - new Date() <= 1000 * 60 * 60 * 24
        };
    }

    static async criarReagendamento(origId, novaData, transferirInscritos){
        const encontroAnterior = await Encontro.buscarPorId(origId);
        if(!encontroAnterior){
            return null;
        }

        const novoEncontro = new Encontro(
            0,
            novaData,
            encontroAnterior.hora,
            'A',
            encontroAnterior.qtdeMax,
            0,
            encontroAnterior.local
        );

        const resultado = await novoEncontro.gravar();
        const newId = resultado.insertId;

        if (transferirInscritos) {
            await connection.query(
                `insert ignore into participantes (enc_id, ben_id, participou)
                 select ?, ben_id, participou from participantes where enc_id = ?`,
                [newId, origId]
            );

            await connection.query(
                `insert ignore into responsaveis (fun_id, enc_id, participou)
                 select fun_id, ?, participou from responsaveis where enc_id = ?`,
                [newId, origId]
            );

            await connection.query(
                `insert ignore into materiais (enc_id, item_id, qtde, utilizado)
                 select ?, item_id, qtde, utilizado from materiais where enc_id = ?`,
                [newId, origId]
            );

            const [[{total}]] = await connection.query(
                `select count(*) as total from participantes where enc_id = ?`,
                [newId]
            );

            await connection.query(
                `update encontros set enc_qtde = ? where enc_id = ?`,
                [total, newId]
            );
        }

        return newId;
    }

    static mapFuncionarioRow(funcionario) {
        return {
            id: funcionario.fun_id,
            nome: funcionario.fun_nome,
            usuario: funcionario.fun_usuario,
            cargo: funcionario.fun_cargo,
            cpf: funcionario.fun_cpf,
            telefone: funcionario.fun_telefone
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
            tutorNovoId: Number(idFuncionarioNovo)
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
