const { Client } = require('pg');

export async function realizarTransacaoEstabelecimentoParceiro(client, UsuarioID, EstabelecimentoEstoqueID, transacaoEstabelecimentoParceiro) {
  try {
    // Obter o ParceiroID usando o UsuarioID
    const parceiroQuery = {
      text: 'SELECT ParceiroID FROM Parceiro WHERE UsuarioID = $1',
      values: [UsuarioID],
    };
    const parceiroResult = await client.query(parceiroQuery);
    const ParceiroID = parceiroResult.rows[0].ParceiroID;

    // Obter o EstabelecimentoID usando o EstabelecimentoEstoqueID
    const estabelecimentoQuery = {
      text: 'SELECT EstabelecimentoID FROM Estabelecimento WHERE EstabelecimentoEstoqueID = $1',
      values: [EstabelecimentoEstoqueID],
    };
    const estabelecimentoResult = await client.query(estabelecimentoQuery);
    const EstabelecimentoID = estabelecimentoResult.rows[0].EstabelecimentoID;

    // Iniciar uma transação no banco de dados
    await client.query('BEGIN');

    // Inserir na tabela TransacaoEstabelecimentoParceiro
    const transacaoQuery = {
      text: `
        INSERT INTO TransacaoEstabelecimentoParceiro (
          TransacaoEstabelecimentoParceiroID,
          ParceiroID,
          EstabelecimentoEstoqueID,
          EstabelecimentoEstoqueProdutoDescricao,
          EstabelecimentoEstoqueTipo,
          EstabelecimentoEstoqueProdutoQuantidade,
          ParceiroCreditoQuantidade
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `,
      values: [
        transacaoEstabelecimentoParceiro.TransacaoEstabelecimentoParceiroID,
        ParceiroID,
        EstabelecimentoEstoqueID,
        transacaoEstabelecimentoParceiro.EstabelecimentoEstoqueProdutoDescricao,
        transacaoEstabelecimentoParceiro.EstabelecimentoEstoqueTipo,
        transacaoEstabelecimentoParceiro.EstabelecimentoEstoqueProdutoQuantidade,
        transacaoEstabelecimentoParceiro.ParceiroCreditoQuantidade,
      ],
    };
    await client.query(transacaoQuery);

    // Atualizar a tabela Parceiro
    const updateParceiroQuery = {
      text: `
        UPDATE Parceiro
        SET ParceiroCreditoQuantidade = ParceiroCreditoQuantidade - $1
        WHERE ParceiroID = $2
      `,
      values: [
        transacaoEstabelecimentoParceiro.ParceiroCreditoQuantidade,
        ParceiroID,
      ],
    };
    await client.query(updateParceiroQuery);

    // Atualizar a quantidade de estoque no Estabelecimento
    const updateEstoqueQuery = {
      text: `
        UPDATE EstabelecimentoEstoque
        SET EstabelecimentoEstoqueProdutoQuantidade = EstabelecimentoEstoqueProdutoQuantidade - $1
        WHERE EstabelecimentoEstoqueID = $2
      `,
      values: [
        transacaoEstabelecimentoParceiro.EstabelecimentoEstoqueProdutoQuantidade,
        EstabelecimentoEstoqueID,
      ],
    };
    await client.query(updateEstoqueQuery);

    // Atualizar a quantidade de créditos no Estabelecimento
    const updateCreditoEstabelecimentoQuery = {
      text: `
        UPDATE Estabelecimento
        SET EstabelecimentoCreditoQuantidade = EstabelecimentoCreditoQuantidade + $1
        WHERE EstabelecimentoID = $2
      `,
      values: [
        transacaoEstabelecimentoParceiro.ParceiroCreditoQuantidade,
        EstabelecimentoID,
      ],
    };
    await client.query(updateCreditoEstabelecimentoQuery);

    // Commit da transação
    await client.query('COMMIT');

    console.log('Transação realizada com sucesso.');
  } catch (error) {
    // Rollback em caso de erro
    await client.query('ROLLBACK');
    console.error('Erro ao realizar a transação:', error);
  } finally {
    // Fechar a conexão com o banco de dados
    await client.end();
    return { isSucesso, mensagem: isSucesso ? 'Transação realizada com sucesso.' : 'Erro ao realizar a transação.' };
  }
}

// Exemplo de uso
// const transacaoEstabelecimentoParceiro = {
//   TransacaoEstabelecimentoParceiroID: 'uuid-gerado-para-a-transacao',
//   EstabelecimentoEstoqueID: 'uuid-do-estoque-do-estabelecimento',
//   EstabelecimentoEstoqueProdutoDescricao: 'Descrição do produto',
//   EstabelecimentoEstoqueTipo: 'Tipo do produto',
//   EstabelecimentoEstoqueProdutoQuantidade: 10,
//   ParceiroCreditoQuantidade: 5,
// };

// const UsuarioID = 'uuid-do-usuario';
// const EstabelecimentoID = 'uuid-do-estabelecimento';

// realizarTransacaoEstabelecimentoParceiro(
//   client,
//   UsuarioID,
//   EstabelecimentoID,
//   transacaoEstabelecimentoParceiro
// );