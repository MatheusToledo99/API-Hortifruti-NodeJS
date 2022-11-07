import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Cidade from "App/Models/Cidade";
import CidadesEstabelecimento from "App/Models/CidadesEstabelecimento";
import Estabelecimento from "App/Models/Estabelecimento";
import Pedido from "App/Models/Pedido";
import User from "App/Models/User";

export default class EstabelecimentosController {
  public async store({ request, response }: HttpContextContract) {
    const body = request.body();

    // to User
    const email = body.email;
    const password = body.password;

    // to Estabelecimento
    const nome = body.nome;
    const logo = body.logo;
    const bloqueado = body.bloqueado;
    const online = body.online;

    try {
      const user = await User.create({
        email: email,
        password: password,
        tipo: "estabelecimentos",
      });

      const estabelecimento = await Estabelecimento.create({
        userId: user.id,
        nome: nome,
        logo: logo,
        bloqueado: bloqueado,
        online: online,
      });

      response.ok({ Estabelecimento: estabelecimento });
    } catch (error) {
      response.status(401).json({
        message:
          "Servidor não atendeu a requisição pois está com uma sintaxe inválida.",
      });
    }
  }

  public async pedidos({ response, auth }: HttpContextContract) {
    const userAuth = await auth.use("api").authenticate();
    const estabelecimento = await Estabelecimento.findBy(
      "user_id",
      userAuth.id
    );

    if (!estabelecimento) {
      return response.badRequest({
        error: "Você não tem autorização para realizar essa requisição",
      });
    }

    const pedidos = await Pedido.query()
      .where("estabelecimento_id", estabelecimento.id)
      .preload("cliente")
      .preload("pedido_status", (statusQuery) => {
        statusQuery.preload("status");
      })
      .orderBy("pedido_id", "desc");

    return response.ok(pedidos);
  }

  public async show({ params, response }: HttpContextContract) {
    const estabelecimentoId = params.id;

    let arrayCidades: any = [];

    const cidadesEstabelecimento = await CidadesEstabelecimento.query().where(
      // Tenho todas relações de um Estabelecimento
      "estabelecimento_id", // com a Cidades.
      estabelecimentoId
    );

    for await (const cidades_estabelecimento of cidadesEstabelecimento) {
      const cidade = await Cidade.findByOrFail(
        "id",
        cidades_estabelecimento.cidade_id
      );

      arrayCidades.push({
        id: cidade.id,
        cidade: cidade.nome,
        custo_entrega: cidades_estabelecimento.custo_entrega,
      });
    }

    const estabelecimento = await Estabelecimento.query()
      .where("id", estabelecimentoId)
      .preload("categorias", (query) => {
        query.preload("produtos");
      })
      .preload("meiosPagamento")
      .firstOrFail();

    return response.ok({
      id: estabelecimento.id,
      nome: estabelecimento.nome,
      logo: estabelecimento.logo,
      bloqueado: estabelecimento.bloqueado,
      online: estabelecimento.online,
      cidades: arrayCidades,
      meios_pagamentos: estabelecimento.meiosPagamento,
      categorias: estabelecimento.categorias,
    });
  }
}
