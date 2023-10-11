import { Pool } from "pg";
import express from "express"
import cors from "cors"
import { LoginUsuario } from "../Procedures/Functions/LoginUsuario";
import { POSTCadastroParceiro } from "../Procedures/POSTs/POSTCadastroParceiro";
import { POSTCadastroEstabelecimento } from "../Procedures/POSTs/POSTCadastroEstabelecimento";
import { enviarEmailComToken } from "../Procedures/Functions/SendEmail";
import { VerificaUserEmail } from "../Procedures/Functions/VerificaUserEmail";
import { GETParceiro } from "../Procedures/GETs/GETParceiro";
import { GETEstabelecimento } from "../Procedures/GETs/GETEstabelecimento";
import { realizarTransacaoEstabelecimentoParceiro } from "../Procedures/Functions/FuncaoDeTransacao";
import { GETEstabelecimentoEstoquePorTipo } from "../Procedures/GETs/GETEstabelecimentoEstoquePorTipoEstoque";
import { GETListaEstabelecimento } from "../Procedures/GETs/GETListaEstabelecimento";
import { GETEstabelecimentoEstoqueByUsuarioID } from "../Procedures/GETs/GETEstabelecimentoEstoqueByUsuarioID";
import { processarEstoque } from "../Procedures/POSTs/POSTEstabelecimentoEstoque";
import { GETEstabelecimentoByNomeFantasia } from "../Procedures/GETs/GETEstabelecimentoByNomeFantasia";

const client = new Pool({
    user: "postgres",
    host: "localhost",
    database: "API - 4Desk",    //trocar para o nome do seu banco local
    password: "123",      //trocar para a senha do seu banco local
    port: 5432
})

// const cloud = new Pool({ //conexão com o banco do servidor
//     connectionString: "postgres://foucqfeg:V-vXAAIje_4WXTk40Zs73_UCSc9gjInB@silly.db.elephantsql.com/foucqfeg", 
//     ssl: {
//         rejectUnauthorized: false
//     }
// })

const app = express()
app.use(cors())
app.use(express.json())

app.post("/login", async (req, res) => {

    const { email } = req.body
    const { password } = req.body

    const messages = ''
    const isSucesso = false
    const usuarioReturn = {
        UsuarioNome: "",
        UsuarioSenha: "",
        UsuarioEmail: "",
        UsuarioTipo: "",
        UsuarioDataCadastro: ""
    }

    const usuario = {
        UsuarioNome: "",
        UsuarioSenha: password,
        UsuarioEmail: email,
        UsuarioTipo: "",
        UsuarioDataCadastro: ""
    }

    const resultadoLogin = await LoginUsuario(client, usuario);

    if (resultadoLogin.isSucesso) {
        res.send({ msg: resultadoLogin.messages, usuario: resultadoLogin.usuarioReturn, isSucesso: resultadoLogin.isSucesso })
    } else {
        res.send({ msg: resultadoLogin.messages, usuario: resultadoLogin.usuarioReturn, isSucesso: resultadoLogin.isSucesso })
    }


})

app.post("/cadastro-parceiro", async (req, res) => {
    const { usuario } = req.body
    const { parceiro } = req.body
    
    const resultado = await POSTCadastroParceiro(client, usuario, parceiro)
    console.log(resultado?.isSucesso)

    if (resultado?.isSucesso) {
        res.send({ msg: "Usuário cadastrado com sucesso.", Sucesso: resultado.isSucesso, id: resultado.id, Usuario: resultado.usuarioReturn })
    } else {
        res.send({ msg: "Erro ao realizar o cadastro do usuário." })
    }
})

app.post("/cadastro-estabelecimento", async (req, res) => {
    const { usuario } = req.body
    const { estabelecimento } = req.body

    const resultado = await POSTCadastroEstabelecimento(client, usuario, estabelecimento)
    console.log(resultado?.isSucesso)

    if (resultado?.isSucesso) {
        res.send({ msg: "Usuário cadastrado com sucesso.", Sucesso: resultado.isSucesso, id: resultado.id, Usuario: resultado.retonoUsuario })
    } else {
        res.send({ msg: "Erro ao realizar o cadastro do usuário." })
    }
})

app.post("/sendEmail", async (req, res) => {

    const { email } = req.body;

    enviarEmailComToken(email)
        .then(result => {
            if (result.isSuccess) {
                res.send({ token: result.token, isSucesso: result.isSuccess, msg: result.messages[0] });
            } else {
                console.error('Erro:', result.messages[0]);
            }
        })
        .catch(error => console.error('Erro:', error));
})


app.post("/verifica-usuario", async (req, res) => {
    const { email } = req.body

    const emailValido = await VerificaUserEmail(client, email)

    if (emailValido) {
        res.send({msg: "Email já existente"})
    } else {
        res.send({msg: "Email válido para cadastro"})
    }

})

app.get("/recupera-credito-parceiro/:usuarioID", async (req, res) => {
    const { usuarioID } = req.params

    const retorno = await GETParceiro(client, usuarioID)

    if (retorno?.isSucesso) {
        res.send({Sucesso: retorno.isSucesso, ParceiroCredito: retorno.retornoParceiro.ParceiroCreditoQuantidade})
    } else {
        res.send({msg: "Deu ruim"})
    }
})

app.get("/recupera-credito-estabelecimento/:usuarioID", async (req, res) => {
    const { usuarioID } = req.params

    const retorno = await GETEstabelecimento(client, usuarioID)

    if (retorno?.isSucesso) {
        res.send({Sucesso: retorno.isSucesso, EstabCredito: retorno.retornoEstab.EstabelecimentoCreditoQuantidade})
    } else {
        res.send({msg: "Deu ruim"})
    }
})

app.get("/GETEstabelecimentoByNomeFantasia/:nomeFantasia", async (req, res) => {
    const { nomeFantasia } = req.params

   const retorno = await GETEstabelecimentoByNomeFantasia(client, nomeFantasia)

    if (retorno?.isSucesso) {
        res.send({Sucesso: retorno.isSucesso, Estabelecimento: retorno.retornoEstab})
    } else {
        res.send({msg: "Deu ruim"})
    }
})

app.post("/POSTTransacaoParceiroEstabelecimento", async (req, res) => {
    const { transacaoEstabelecimentoParceiro } = req.body

    // const transacaoEstabelecimentoParceiro = {
    //     TransacaoEstabelecimentoParceiroID: req.body,
    //     EstabelecimentoEstoqueID: req.body,
    //     EstabelecimentoEstoqueProdutoDescricao: req.body,
    //     EstabelecimentoEstoqueTipo: req.body,
    //     EstabelecimentoEstoqueProdutoQuantidade: req.body,
    //     ParceiroCreditoQuantidade: req.body,
    // };
    
    const { EstabelecimentoEstoqueID } = req.body
    const { UsuarioID } = req.body

    const returnTRN = await realizarTransacaoEstabelecimentoParceiro(client, UsuarioID, EstabelecimentoEstoqueID, transacaoEstabelecimentoParceiro)

    if (returnTRN?.isSucesso) {
        res.send({ Sucesso: returnTRN.isSucesso, msg: returnTRN.mensagem })
    }
})

app.get("/GETEstabelecimentoEstoquePorTipo", async (req, res)=>{
    const EstabelecimentoID = req.body
    const EstoqueTipo = req.body

    const estabelecimentoEstoque = await GETEstabelecimentoEstoquePorTipo(client, EstabelecimentoID, EstoqueTipo)
    if(estabelecimentoEstoque){
        res.send({estabelecimentoEstoque: estabelecimentoEstoque, msg:"Sucesso"})
    }
})

app.get("/recupera-estabelecimentos", async (req, res)=>{

    const resultEstabelecimentos = await GETListaEstabelecimento(client)

    if (resultEstabelecimentos.isSucesso) {
      console.log('Estabelecimentos encontrados:');
      res.send({Estabelecimentos: resultEstabelecimentos.retornoEstabs});
    } else {
      console.log('Nenhum estabelecimento encontrado.');
    }

})

app.get("/GETEstabelecimentoEstoqueByUsuarioID/:usuarioID", async (req, res)=>{

    const { usuarioID } = req.params

    GETEstabelecimentoEstoqueByUsuarioID(client,usuarioID)
    
      .then(estoque =>{
        
        var EstabelecimentoEstoque = JSON.stringify(estoque)
        console.log('TESTEEEEEEE   '+EstabelecimentoEstoque)

        res.send({msg:'GET com sucesso', EstabelecimentoEstoque:EstabelecimentoEstoque})
      } )
      .catch(error => console.error('Erro ao obter o estoque:', error));
})

app.post("/POSTEstabelecimentoEstoque", async (req, res) => {
    const {estabelecimentoEstoqueJson} = req.body
    const {EstabelecimentoEstoque} = req.body
    const {usuarioID} = req.body


    const returnPOST = await processarEstoque(client,estabelecimentoEstoqueJson,usuarioID,EstabelecimentoEstoque)
    res.send({isSucesso:returnPOST })
})

app.listen(3001, () => {
    console.log("Servidor rodando!")
})
