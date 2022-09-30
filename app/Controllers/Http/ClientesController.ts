// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Database from "@ioc:Adonis/Lucid/Database";
import Cliente from "App/Models/Cliente";
import User from "App/Models/User";

export default class ClientesController {
  public async store({ request, response }) {
    const body = request.body();
    const email = body.email;
    const password = body.password;

    try {
      const user = await User.create({
        email: email,
        password: password,
        tipo: "clientes",
      });

      const cliente = await Cliente.create({
        userId: user.id,
        nome: body.nome,
        telefone: body.telefone,
      });

      response.ok({ Usurio: user, Cliente: cliente });
    } catch (error) {
      response
        .status(400)
        .json({
          message:
            "Servidor não atendeu a requisição pois está com uma sintaxe inválida.",
        });
    }
  }

  public async update({ auth, request, response }) {
    const body = request.body();
    const userAuth = await auth.use("api").authenticate();
    // console.log(userAuth);

    const transacao = await Database.transaction();

    try {
      const user = await User.findByOrFail("id", userAuth.id);
      const cliente = await Cliente.findByOrFail("user_id", userAuth.id);

      user.email = body.email;
      user.password = body.password;
      cliente.nome = body.nome;
      cliente.telefone = body.telefone;

      await user.save();
      await cliente.save();
      await transacao.commit();

      return response.ok({
        id: cliente.id,
        nome: cliente.nome,
        telefone: cliente.telefone,
        email: user.email,
        senha: user.password,
      });
    } catch (err) {
      await transacao.rollback();
      return response.status(400).json({
        message: "Algo deu errado, tente novamente",
      });
    }
  }
}
