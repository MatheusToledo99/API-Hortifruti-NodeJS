import { DateTime } from "luxon";
import { BaseModel, column, HasMany, hasMany } from "@ioc:Adonis/Lucid/Orm";
import Produto from "./Produto";

export default class Categoria extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public nome: string;

  @column()
  public descricao: string;

  @column()
  public posicao: number;

  @column()
  public ativo: string;

  @column()
  public estabecimento_id: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @column.dateTime()
  public deletedAt: DateTime | null;

  @hasMany(() => Produto, {
    foreignKey: "categoria_id",
    localKey: "id",
  })
  public produtos: HasMany<typeof Produto>;
}
