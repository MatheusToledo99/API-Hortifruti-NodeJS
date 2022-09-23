import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'categorias'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary();
      table.string('nome').notNullable();
      table.string('descricao').nullable();
      table.string('posicao').notNullable();
      table.boolean('ativo').notNullable();
      table.integer('estabelecimento_id').notNullable().unsigned().references('id').inTable('estabelecimentos').onDelete('RESTRICT');
      table.timestamps(true, true);
      table.timestamp('deleted_at').nullable();
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
