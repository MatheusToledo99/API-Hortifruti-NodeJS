import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Cidade from 'App/Models/Cidade';
import Cliente from 'App/Models/Cliente';
import Endereco from 'App/Models/Endereco';

export default class EnderecosController {
    public async store({ request, response, auth }: HttpContextContract) {

        const userAuth = await auth.use("api").authenticate();

        const body = request.body();

        await Cidade.findByOrFail('id', body.cidadeId);
        const cliente = await Cliente.findBy('user_id', userAuth.id);

        if (!cliente) {
            return response.badRequest({ message: "Somente usuários clientes podem cadastrar endereço." });
        }

        const endereco = await Endereco.create({
            cidadeId: body.cidadeId,
            clienteId: cliente.id,
            rua: body.rua,
            numero: body.numero,
            bairro: body.bairro,
            pontoReferencia: body.pontoReferencia,
            complemento: body.complemento
        });

        return response.ok({ endereco: endereco });
    }

    public async index({ auth, response }: HttpContextContract) {
        const userAuth = await auth.use("api").authenticate();

        const cliente = await Cliente.findBy('user_id', userAuth.id);

        if (!cliente) {
            return response.badRequest({ message: "Somente usuários clientes podem cadastrar endereço." });
        }

        const getCliente = await Cliente.query()
            .where('id', cliente.id)
            .preload('enderecos', (cidadeQuery) => {
                cidadeQuery.preload("cidade", (queryEstado) => {
                    queryEstado.preload("estado")
                });
            }).firstOrFail();

        response.ok(getCliente.enderecos);
    }

    public async update({ params, request, response, auth }: HttpContextContract) {

        const userAuth = await auth.use("api").authenticate();

        const body = request.body();

        const enderecoUpdate = await Endereco.findByOrFail("id", params.id);

        const cliente = await Cliente.findByOrFail("id", enderecoUpdate.clienteId);

        if (userAuth.id !== cliente.userId) {
            return response.unauthorized({ message: "Você não está autorizado a alterar este registro." })
        }

        enderecoUpdate.merge(body);

        await enderecoUpdate.save();

        response.ok({ Atualizado: enderecoUpdate });

    }

    public async destroy({ params, response, auth }: HttpContextContract) {

        const userAuth = await auth.use("api").authenticate();

        try {
            const enderecoDelete = await Endereco.findByOrFail("id", params.id);

            const cliente = await Cliente.findByOrFail("id", enderecoDelete.clienteId);

            if (userAuth.id !== cliente.userId) {
                return response.unauthorized({ message: "Você não está autorizado a excluir este registro." })
            }

            await enderecoDelete.delete();

            response.ok({ Deletado: enderecoDelete });

        } catch (error) {
            response.notFound({message: "Registro não encontrado."});
        }


    }
}
