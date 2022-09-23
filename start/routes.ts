import Route from '@ioc:Adonis/Core/Route'


Route.get('/', async () => {
  return {
    title: 'Rota Home'
  }

});
