import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import MeioPagamento from "App/Models/MeioPagamento";

export default class MeioPagamentosController {
  public async store({ request }: HttpContextContract) {
    await MeioPagamento.create({ nome: request.body().nome });
  }
}
