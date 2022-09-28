import { BaseModel, column, HasOne, hasOne, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Estabelecimento from './Estabelecimento';
import Estado from './Estado';

export default class Cidade extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public nome: string;

  @column()
  public estado_id: number;

  @column()
  public ativo: boolean;

  @hasOne(() => Estado, {
    foreignKey: "id",       // Nome da chave primaria do pai (ESTADO)
    localKey: "estado_id",  // Nome da chave local (Cidade) que faz referencia ao Pai (ESTADO)
  })

  public estado: HasOne<typeof Estado>

  @manyToMany(() => Estabelecimento, {
    pivotTable: "cidades_estabelecimentos",       // Tabela que faz o pivo
    localKey: "id",                               // Chave primaria da CIDADE
    pivotForeignKey: "cidade_id",                 // Chave estrangeira para estabelecer relacionamento com a CIDADE(PAI)       
    relatedKey: "id",                             // Chave primaria da tabela que cidade se relaciona, ou seja, ESTABELECIMENTO
    pivotRelatedForeignKey: "estabelecimento_id", // Chave estrangeira para estabelecer relacionamento com o ESTABELECIMENTO(FILHO)
  })
  public estabelecimentos: ManyToMany<typeof Estabelecimento>
}
