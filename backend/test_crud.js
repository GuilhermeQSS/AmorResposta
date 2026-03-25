import fetch from 'node-fetch';

const baseUrl = 'http://localhost:3000/documentos';

let passed = 0;
let failed = 0;

function assert(condition, message) {
    if (condition) {
        console.log(`  ✅ ${message}`);
        passed++;
    } else {
        console.error(`  ❌ ${message}`);
        failed++;
    }
}

async function runTests() {
    console.log('='.repeat(55));
    console.log(' Testes do CRUD de Documentos + Filtros Duplos');
    console.log('='.repeat(55));

    let newId;
    let ataId;

    try {
        // ─── 1. CADASTRAR ────────────────────────────────────────
        console.log('\n1. Cadastro');
        const resPost = await fetch(`${baseUrl}/gravar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                titulo: 'Relatório Anual',
                tipo: 'PDF',
                dataCriacao: '2026-03-23',
                descricao: 'Relatório anual de atividades',
                link: 'http://linkdeteste.com'
            })
        });
        const dataPost = await resPost.json();
        newId = dataPost.insertId;
        assert(resPost.status === 201, `Status 201 ao cadastrar`);
        assert(newId > 0, `insertId retornado: ${newId}`);

        // Segundo documento para testes de filtro
        const resPost2 = await fetch(`${baseUrl}/gravar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                titulo: 'Ata de Reunião',
                tipo: 'DOCX',
                dataCriacao: '2026-03-24',
                descricao: 'Ata da reunião mensal',
                link: 'http://ata.com'
            })
        });
        const dataPost2 = await resPost2.json();
        ataId = dataPost2.insertId;
        console.log('  (segundo documento cadastrado para testes de filtro)');

        // ─── 2. LISTAR SEM FILTRO ────────────────────────────────
        console.log('\n2. Listar sem filtro');
        const resList = await fetch(`${baseUrl}/listar`);
        const dataList = await resList.json();
        assert(resList.status === 200, `Status 200`);
        assert(Array.isArray(dataList), `Retornou array`);
        assert(dataList.length >= 2, `Pelo menos 2 documentos (${dataList.length})`);

        // ─── 3. FILTRO POR TÍTULO ────────────────────────────────
        console.log('\n3. Filtro por título');
        const resListTitulo = await fetch(`${baseUrl}/listar?filtroTitulo=Relat`);
        const dataListTitulo = await resListTitulo.json();
        assert(resListTitulo.status === 200, `Status 200`);
        assert(Array.isArray(dataListTitulo), `Retornou array`);
        assert(
            dataListTitulo.every(d => d.titulo.toLowerCase().includes('relat')),
            `Todos contêm "relat" no título`
        );
        assert(
            !dataListTitulo.some(d => d.titulo === 'Ata de Reunião'),
            `"Ata de Reunião" não aparece no filtro "Relat"`
        );

        // ─── 4. FILTRO POR TIPO ──────────────────────────────────
        console.log('\n4. Filtro por tipo');
        const resListTipo = await fetch(`${baseUrl}/listar?filtroTipo=DOCX`);
        const dataListTipo = await resListTipo.json();
        assert(resListTipo.status === 200, `Status 200`);
        assert(Array.isArray(dataListTipo), `Retornou array`);
        assert(
            dataListTipo.every(d => d.tipo.toLowerCase().includes('docx')),
            `Todos têm tipo "DOCX"`
        );
        assert(
            !dataListTipo.some(d => d.tipo === 'PDF'),
            `Tipo "PDF" não aparece no filtro "DOCX"`
        );

        // ─── 5. DOIS FILTROS COMBINADOS ──────────────────────────
        console.log('\n5. Filtros combinados (título + tipo)');
        const resListAmbos = await fetch(`${baseUrl}/listar?filtroTitulo=Relat&filtroTipo=PDF`);
        const dataListAmbos = await resListAmbos.json();
        assert(resListAmbos.status === 200, `Status 200`);
        assert(Array.isArray(dataListAmbos), `Retornou array`);
        assert(
            dataListAmbos.every(d =>
                d.titulo.toLowerCase().includes('relat') &&
                d.tipo.toLowerCase().includes('pdf')
            ),
            `Resultados satisfazem os dois filtros`
        );

        // ─── 6. BUSCAR POR ID ────────────────────────────────────
        console.log('\n6. Buscar por ID');
        const resGet = await fetch(`${baseUrl}/buscar?id=${newId}`);
        const dataGet = await resGet.json();
        assert(resGet.status === 200, `Status 200`);
        assert(dataGet.id == newId, `ID correto: ${dataGet.id}`);
        assert(dataGet.titulo === 'Relatório Anual', `Título correto`);

        // ─── 7. ALTERAR ──────────────────────────────────────────
        console.log('\n7. Alterar');
        const resPut = await fetch(`${baseUrl}/alterar`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: newId,
                titulo: 'Relatório Alterado',
                tipo: 'XLSX',
                dataCriacao: '2026-03-24',
                descricao: 'Descrição alterada',
                link: 'http://novo-link.com'
            })
        });
        const dataPut = await resPut.json();
        assert(resPut.status === 200, `Status 200`);
        assert(dataPut.affectedRows === 1, `affectedRows = 1`);

        const resVerify = await fetch(`${baseUrl}/buscar?id=${newId}`);
        const dataVerify = await resVerify.json();
        assert(dataVerify.titulo === 'Relatório Alterado', `Título alterado persistido`);
        assert(dataVerify.tipo === 'XLSX', `Tipo alterado persistido`);

        // ─── 8. EXCLUIR ──────────────────────────────────────────
        console.log('\n8. Excluir');
        const resDel = await fetch(`${baseUrl}/excluir`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: newId })
        });
        const dataDel = await resDel.json();
        assert(resDel.status === 200, `Status 200`);
        assert(dataDel.affectedRows === 1, `affectedRows = 1`);

        const resAfterDel = await fetch(`${baseUrl}/buscar?id=${newId}`);
        assert(resAfterDel.status === 404, `404 após exclusão`);

        // Limpeza
        if (ataId) {
            await fetch(`${baseUrl}/excluir`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: ataId })
            });
        }

    } catch (error) {
        console.error('\n💥 Erro inesperado:', error.message);
        failed++;
    }

    console.log('\n' + '='.repeat(55));
    console.log(` Resultado: ${passed} passaram | ${failed} falharam`);
    console.log('='.repeat(55));
    if (failed === 0) {
        console.log(' 🎉 Todos os testes passaram!\n');
    } else {
        console.log(' ⚠️  Alguns testes falharam.\n');
    }
}

runTests();
