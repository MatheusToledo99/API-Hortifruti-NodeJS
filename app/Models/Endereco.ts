import { BaseModel, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Cidade from './Cidade';

export default class Endereco extends BaseModel {
  @column({ isPrimary: true })
  public id: number;
  @column()
  public cidadeId: number;
  @column()
  public clienteId: number;
  @column()
  public rua: string;
  @column()
  public numero: string | null;
  @column()
  public bairro: string;
  @column()
  public pontoReferencia: string | null;
  @column()
  public complemento: string | null;

  @hasOne(()=> Cidade, {
    localKey: 'cidadeId',     /* A chave local é sempre a chave primária do modelo pai, mas também pode ser definida explicitamente. */
    foreignKey: 'id',          /* Por padrão, a ForeignKey é a representação camelCase do nome do modelo pai e sua chave primária. */  
  })
  public cidade : HasOne<typeof Cidade>
}
