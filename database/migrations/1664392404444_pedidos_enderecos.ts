import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "pedidos_enderecos";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id").primary();
      table
        .integer("cidade_id")
        .notNullable()
        .unsigned()
        .references("id")
        .inTable("cidades");
      table.string("rua").notNullable();
      table.string("numero");
      table.string("bairro").notNullable();
      table.string("ponto_referencia");
      table.string("complemento");
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
