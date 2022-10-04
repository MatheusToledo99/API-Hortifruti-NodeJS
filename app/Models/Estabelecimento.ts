import { DateTime } from "luxon";
import {
  BaseModel,
  column,
  HasMany,
  hasMany,
  ManyToMany,
  manyToMany,
} from "@ioc:Adonis/Lucid/Orm";
import MeioPagamento from "./MeioPagamento";
import Categoria from "./Categoria";

export default class Estabelecimento extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public userId: number;

  @column()
  public nome: string;

  @column()
  public logo: string | null;

  @column()
  public bloqueado: boolean;

  @column()
  public online: boolean;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @manyToMany(() => MeioPagamento, {
    localKey: "id",
    relatedKey: "id",
    pivotTable: "estabelecimento_meio_pagamentos",
    pivotForeignKey: "estabelecimento_id",
    pivotRelatedForeignKey: "meio_pagamento_id",
  })
  public meiosPagamento: ManyToMany<typeof MeioPagamento>;

  @hasMany(() => Categoria, {
    localKey: "id",
    foreignKey: "estabelecimento_id",
  })
  public categorias: HasMany<typeof Categoria>;
}
