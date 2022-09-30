import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Cidade from "App/Models/Cidade";
import Estado from "App/Models/Estado";

export default class CidadesController {
  public async index({ response }: HttpContextContract) {
    const cidades = await Cidade.query()
      .whereHas("estabelecimentos", (query) => {
        query.where("bloqueado", false);
      })
      .preload("estado");

    return response.ok(cidades);
  }

  public async show({ response }: HttpContextContract) {
    const cidades = await Cidade.all();
    return response.ok(cidades);
  }

  public async estabelecimentos({ params, response }: HttpContextContract) {
    const cidade = await Cidade.query()
      .where("id", params.id)
      .preload("estabelecimentos")
      .firstOrFail();

    response.ok(cidade.estabelecimentos);
  }

  public async store({ request, response }: HttpContextContract) {
    const body = request.body();

    const nome = body.nome;
    const estado_id = body.estado_id;
    const ativo = body.ativo;

    const nomeExiste = await Cidade.findBy("nome", nome);

    if (!nome)
      return response.status(401).json({ error: "Campo nome é obrigatório" });

    if (nomeExiste)
      return response
        .status(401)
        .json({ error: "Essa cidade já está cadastrada" });

    await Estado.findByOrFail("id", estado_id);

    const cidade = Cidade.create({
      nome: nome,
      estado_id: estado_id,
      ativo: ativo,
    });

    return response.ok(cidade);
  }
}
