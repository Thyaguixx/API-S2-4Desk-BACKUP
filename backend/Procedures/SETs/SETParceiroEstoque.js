export async function SETParceiroEstoque(client, parceiroEstoque) {
    // await client.connect();

    try {

        let isSucesso = false

        const query = `
        INSERT INTO ParceiroEstoque (ParceiroID, ParceiroEstoqueProdutoDescricao, ParceiroEstoqueTipo, ParceiroEstoqueProdutoQuantidade) VALUES ($1, $2, $3, $4) RETURNING ParceiroEstoqueID;`;

        const values = [
            parceiroEstoque.ParceiroID,
            parceiroEstoque.ParceiroEstoqueProdutoDescricao,
            parceiroEstoque.ParceiroEstoqueTipo,
            parceiroEstoque.ParceiroEstoqueProdutoQuantidade
        ];

        const result = await client.query(query, values);
        
        if (result) {
            console.log(`Estoque de parceiro inserido com sucesso. ID: ${result.rows[0].parceiroestoqueid}`);
            const id = result.rows[0].parceiroestoqueid
            isSucesso = true

        }

        return { id, isSucesso };

    } catch (error) {
        console.error('Erro ao inserir estoque de parceiro:', error);
        throw error;
    }
}