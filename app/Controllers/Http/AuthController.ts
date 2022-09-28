import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Admin from 'App/Models/Admin';
import Cliente from 'App/Models/Cliente';
import Estabelecimento from 'App/Models/Estabelecimento';
import User from 'App/Models/User';

export default class AuthController {

    //acesso ao token
    public async login({ auth, request, response }: HttpContextContract) {
        const body = request.body();
        const email = body.email;
        const password = body.password;

        try {
            const user = await User.findByOrFail('email', email);

            // if(user.password !== password){
            //     return response.json({message: "Senha inválida"});
            // }

            let expira; //expirar token

            switch (user.tipo) {
                case "clientes":
                    expira = "30days";
                    break;
                case "estabelecimentos":
                    expira = "7days";
                    break;
                case "admins":
                    expira = "1day";
                    break;
                default:
                    expira = "30days";
                    break;
            }

            const token = await auth.use("api").attempt(email, password, {

                expiresIn: expira, name: user.serialize().email
            });

            return response.ok(token);

        } catch (error) {
            return response.badRequest({ message: "Este usuário não existe" });
        }
    }

    public async logout({ auth, response }: HttpContextContract) {

        try {
            await auth.use("api").revoke();
        } catch (error) {
            return response.unauthorized({ message: "Você não está autorizado" });
        }

        return response.ok({ message: "Você foi desconectado" });
    }

    public async me({ auth, response }: HttpContextContract) {
        const userAuth = await auth.use("api").authenticate();

        switch (userAuth.tipo) {
            case "clientes":
                const cliente = await Cliente.findByOrFail("userId", userAuth.id);
                return cliente;
            case "estabelecimentos":
                const estabelecimento = await Estabelecimento.findByOrFail("userId", userAuth.id);
                return estabelecimento;           
            case "admins":
                const admin = await Admin.findByOrFail("userId", userAuth.id);
                return admin;
            default:
                return response.unauthorized("Usuário não autorizado");
        }
    }
}
