import Route from "@ioc:Adonis/Core/Route";

/*------------------------Rotas de Cidade ------------------------*/

Route.get("/cidades", "CidadesController.index");
Route.get("/cidades/all", "CidadesController.show");
Route.get(
  "/cidades/:id/estabelecimentos",
  "CidadesController.estabelecimentos"
);
Route.post("/cidades/cadastro", "CidadesController.store");

/*------------------------Rotas de Usuario ------------------------*/

Route.post("/login", "AuthController.login");
Route.post("/logout", "AuthController.logout");
Route.post("/cliente/cadastro", "ClientesController.store");
Route.post("/admin/cadastro", "AdminsController.store");

/*------------------------ Rotas Estabelecimento ------------------------*/
Route.post("/estabelecimento/cadastro", "EstabelecimentosController.store");
Route.get("/estabelecimento/:id", "EstabelecimentosController.show");
//
//

/*------------------------ Rotas Controladas ------------------------*/

Route.group(() => {
  Route.get("/auth/me", "AuthController.me");
  Route.patch("/cliente", "ClientesController.update");
  Route.get("/estabelecimento/pedidos", "EstabelecimentosController.pedidos");

  Route.resource("/enderecos", "EnderecosController").apiOnly();
  Route.post("/pedidos", "PedidosController.store");
  Route.get("/pedidos", "PedidosController.index");
  Route.get("/pedidos/:hash_id", "PedidosController.show");

  //
}).middleware("auth");

//
/*------------------------ Rotas Home ------------------------*/

Route.get("/", async () => {
  return {
    title: "Rota Home",
  };
});
