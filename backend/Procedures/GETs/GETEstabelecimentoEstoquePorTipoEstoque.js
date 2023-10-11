const { Client } = require('pg');

export async function GETEstabelecimentoEstoquePorTipo(client, EstabelecimentoID, EstabelecimentoEstoqueTipo) {
  await client.connect();
  try{
    const estabelecimentoEstoqueQuery = {
      text: 'SELECT * FROM EstabelecimentoEstoque WHERE EstabelecimentoID = $1 AND EstabelecimentoEstoqueTipo = $2',
      values: [EstabelecimentoID, EstabelecimentoEstoqueTipo],
    };
    const estabelecimentoEstoqueResult = await client.query(estabelecimentoEstoqueQuery);
    return estabelecimentoEstoqueResult.rows;
  } catch (error) {
    console.error('Erro ao obter o EstabelecimentoEstoque:', error);
    throw error; // Você pode tratar o erro conforme necessário ou relançá-lo
  } finally {
    await client.end();
  }
}
