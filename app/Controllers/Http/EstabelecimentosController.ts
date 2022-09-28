import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Estabelecimento from 'App/Models/Estabelecimento';
import User from 'App/Models/User';

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
                online: online
            });

            response.ok({ Estabelecimento: estabelecimento });

        } catch (error) {
            response.status(401).json({ message: "Servidor não atendeu a requisição pois está com uma sintaxe inválida." })
        }
    }
}
