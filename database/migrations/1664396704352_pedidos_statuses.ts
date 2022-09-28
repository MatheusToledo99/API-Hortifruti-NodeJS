import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'pedidos_statuses'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('pedido_id').unsigned().notNullable().references('id').inTable('pedidos');
      table.integer('status_id').unsigned().notNullable().references('id').inTable('statuses');
      table.string('observacao');
      table.timestamp('created_at');
      table.primary(['pedido_id','status_id']);

    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
