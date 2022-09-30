import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Admin from "App/Models/Admin";
import User from "App/Models/User";

export default class AdminsController {
  public async store({ request, response }: HttpContextContract) {
    const body = request.body();

    // to User
    const email = body.email;
    const password = body.password;

    // to Admin
    const nome = body.nome;

    try {
      const user = await User.create({
        email: email,
        password: password,
        tipo: "admins",
      });

      const admin = await Admin.create({
        userId: user.id,
        nome: nome,
      });

      response.ok({ Admin: admin });
    } catch (error) {
      response
        .status(401)
        .json({
          message:
            "Servidor não atendeu a requisição pois está com uma sintaxe inválida.",
        });
    }
  }
}
