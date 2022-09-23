import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User';

export default class AuthController {
    public async login({ auth, request, response }: HttpContextContract) {
        const body = request.body();
        const email = body.email;
        const password = body.password;

        try {
            const user = await User.findByOrFail('email', email);

            if(user.password !== password){
                return response.json({message: "Senha inválida"});
            }

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

}
