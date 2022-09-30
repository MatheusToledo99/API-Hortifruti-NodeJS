import { DateTime } from "luxon";
import { BaseModel, column, hasOne, HasOne } from "@ioc:Adonis/Lucid/Orm";
import Pedido from "./Pedido";
import Status from "./Status";

export default class PedidoStatus extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column({ serializeAs: null })
  public pedido_id: number;

  @column()
  public status_id: number;

  @column()
  public observacao: string | null;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @hasOne(() => Pedido, {
    localKey: "pedido_id",
    foreignKey: "id",
  })
  public pedido: HasOne<typeof Pedido>;

  @hasOne(() => Status, {
    localKey: "status_id",
    foreignKey: "id",
  })
  public status: HasOne<typeof Status>;
}
