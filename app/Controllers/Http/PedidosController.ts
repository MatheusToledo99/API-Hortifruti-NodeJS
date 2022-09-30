import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import CidadesEstabelecimento from "App/Models/CidadesEstabelecimento";
import Cliente from "App/Models/Cliente";
import Endereco from "App/Models/Endereco";
import Estabelecimento from "App/Models/Estabelecimento";
import MeioPagamento from "App/Models/MeioPagamento";
import Pedido from "App/Models/Pedido";
import PedidoEndereco from "App/Models/PedidoEndereco";
import PedidoProduto from "App/Models/PedidoProduto";
import PedidoStatus from "App/Models/PedidoStatus";
import Produto from "App/Models/Produto";
let randomstring = require("randomstring");

export default class PedidosController {
  public async store({ auth, request, response }: HttpContextContract) {
    const body = request.body();

    const userAuth = await auth.use("api").authenticate();
    const cliente = await Cliente.findByOrFail("userId", userAuth.id);

    let hash_id: string = "";

    hash_id = randomstring.generate({
      lenght: 8,
      charset: "alphabetic",
      capitalization: "uppercase",
    });

    const formaDePagar = await MeioPagamento.findOrFail(body.meio_pagamento_id);

    console.log("aqui nao aparece");

    const estabelecimento = await Estabelecimento.findByOrFail(
      "id",
      body.estabecimento_id
    );

    const endereco = await Endereco.findByOrFail("id", body.endereco_id);

    const transacao = await Database.transaction();

    try {
      const pedidoEndereco = await PedidoEndereco.create({
        cidadeId: endereco.cidadeId,
        rua: endereco.rua,
        bairro: endereco.bairro,
        complemento: endereco.complemento,
        numero: endereco.numero,
        ponto_referencia: endereco.pontoReferencia,
      });

      //Busca do custo de entrega e calcular o valor total.

      const cidadeEstabelecimento = await CidadesEstabelecimento.query()
        .where("estabelecimento_id", body.estabelecimento_id)
        .where("cidade_id", endereco.cidadeId)
        .firstOrFail();

      let valorPedido = 0;

      for await (const produto of body.produtos) {
        const prod = await Produto.findByOrFail("id", produto.produto_id);
        valorPedido = valorPedido + prod.preco * produto.quantidade;
      }

      valorPedido = valorPedido + cidadeEstabelecimento.custo_entrega;

      valorPedido = parseFloat(valorPedido.toFixed(2));

      if (body.troco_para !== null && body.troco_para < valorPedido) {
        transacao.rollback();
        return response.badRequest(
          "O valor para troco deve ser maior que o pedido"
        );
      }

      const pedido = await Pedido.create({
        hash_id: hash_id,
        cliente_id: userAuth.id,
        custo_entrega: cidadeEstabelecimento.custo_entrega,
        estabelecimento_id: body.estabelecimento_id,
        meio_pagamento_id: formaDePagar.id,
        observacao: body.observacao,
        pedido_endereco_id: pedidoEndereco.id,
        troco_para: body.troco_para,
        valor: valorPedido,
      });

      body.produtos.forEach(async (element) => {
        let getProduto = await Produto.findByOrFail("id", element.produto_id);
        await PedidoProduto.create({
          pedido_id: pedido.id,
          produto_id: element.id,
          valor: getProduto.preco,
          quantidade: element.quantidade,
          observacao: element.observacao,
        });
      });

      await PedidoStatus.create({
        pedido_id: pedido.id,
        status_id: 1,
      });

      await transacao.commit();

      response.ok({
        Pedido: hash_id,
        Cliente: cliente.nome,
        Estabelecimento: estabelecimento.nome,
        Entrega: cidadeEstabelecimento.custo_entrega,
        Pagamento: formaDePagar.nome,
        Endereco: pedidoEndereco,
        Observacao: body.observacao,
        Troco_Para: body.troco_para,
        Valor: valorPedido,
        Produtos: body.produtos,
      });
    } catch (error) {
      transacao.rollback();
      return response.badRequest("Pedido não concluída, algo deu errado");
    }
  }

  public async index({ auth, response }: HttpContextContract) {
    const userAuth = await auth.use("api").authenticate();
    const cliente = await Cliente.findByOrFail("userId", userAuth.id);

    const pedidos = await Pedido.query()
      .where("cliente_id", cliente.id)
      .preload("pedido_status", (psQuery) => {
        psQuery.preload("status");
      })
      .preload("cliente")
      .preload("estabelecimento")
      .orderBy("pedido_id", "desc");

    return response.ok(pedidos);
  }

  public async show({ auth, params, response }: HttpContextContract) {
    const userAuth = await auth.use("api").authenticate();

    const cliente = await Cliente.findByOrFail("userId", userAuth.id);

    const pedido = await Pedido.query()
      .where("cliente_id", cliente.id)
      .where("hash_id", params.hash_id)
      .preload("pedidosProduto", (ppQuery) => {
        ppQuery.preload("produto");
      })
      .preload("cliente")
      .preload("estabelecimento")
      .preload("meioPagamento")
      .preload("pedido_status", (psQuery) => {
        psQuery.preload("status");
      })
      .firstOrFail();

    return response.ok(pedido);
  }
}
