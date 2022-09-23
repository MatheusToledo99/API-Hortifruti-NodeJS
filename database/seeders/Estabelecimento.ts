import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Estabelecimento from 'App/Models/Estabelecimento';
import User from 'App/Models/User';

export default class extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
    const user = await User.create({
      email: 'estabelecimento@email.com',
      password: '123456',
      tipo: 'estabelecimentos',
    });

    await Estabelecimento.create({
      nome: 'Estabelecimento',
      bloqueado: false,
      online: true,
      userId: user.id,
    });
  }
}
