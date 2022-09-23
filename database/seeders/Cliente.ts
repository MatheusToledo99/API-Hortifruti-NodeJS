import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Cliente from 'App/Models/Cliente';
import User from 'App/Models/User'

export default class extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
    const user = await User.create({
      email: 'cliente@email.com',
      password: '123456',
      tipo: 'clientes',
    });

    await Cliente.create({
      nome: 'Cliente',
      telefone: '11 99999-9999',
      userId: user.id,
    });
  }
}
