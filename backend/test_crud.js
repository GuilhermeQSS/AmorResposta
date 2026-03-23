import fetch from 'node-fetch';

const baseUrl = 'http://localhost:3000/documentos';

async function runTests() {
    console.log('Iniciando testes do CRUD de Documentos...');

    try {
        // 1. Cadastrar um documento
        console.log('\n1. Testando Cadastro...');
        const resPost = await fetch(`${baseUrl}/gravar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                titulo: 'Documento de Teste',
                tipo: 'PDF',
                dataCriacao: '2026-03-23',
                descricao: 'Descrição de teste',
                link: 'http://linkdeteste.com'
            })
        });
        const dataPost = await resPost.json();
        console.log('Resposta Cadastro:', dataPost);
        const newId = dataPost.insertId;

        // 2. Listar documentos
        console.log('\n2. Testando Listagem...');
        const resList = await fetch(`${baseUrl}/listar`);
        const dataList = await resList.json();
        console.log('Documentos listados:', dataList.length);

        // 3. Buscar por ID
        console.log('\n3. Testando Busca por ID...');
        const resGet = await fetch(`${baseUrl}/buscar?id=${newId}`);
        const dataGet = await resGet.json();
        console.log('Documento encontrado:', dataGet);

        // 4. Alterar documento
        console.log('\n4. Testando Alteração...');
        const resPut = await fetch(`${baseUrl}/alterar`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: newId,
                titulo: 'Documento Alterado',
                tipo: 'DOCX',
                dataCriacao: '2026-03-24',
                descricao: 'Descrição alterada',
                link: 'http://novo-link.com'
            })
        });
        const dataPut = await resPut.json();
        console.log('Resposta Alteração:', dataPut);

        // 5. Excluir documento
        console.log('\n5. Testando Exclusão...');
        const resDel = await fetch(`${baseUrl}/excluir`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: newId })
        });
        const dataDel = await resDel.json();
        console.log('Resposta Exclusão:', dataDel);

        console.log('\nTodos os testes concluídos com sucesso!');
    } catch (error) {
        console.error('Erro durante os testes:', error);
    }
}

runTests();
