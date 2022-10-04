import {
  BaseModel,
  column,
  HasOne,
  hasOne,
  ManyToMany,
  manyToMany,
} from "@ioc:Adonis/Lucid/Orm";
import Estabelecimento from "./Estabelecimento";
import Estado from "./Estado";

export default class Cidade extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public nome: string;

  @column()
  public estado_id: number;

  @column()
  public ativo: boolean;

  @hasOne(() => Estado, {
    foreignKey: "id", //-----------------------------------------    Nome da chave primaria do pai (ESTADO)
    localKey: "estado_id", //------------------------------------    Nome da chave local (Cidade) que faz referencia ao Pai (ESTADO)
  })
  public estado: HasOne<typeof Estado>;

  @manyToMany(() => Estabelecimento, {
    localKey: "id", //-------------------------------------------    Chave primaria CIDADE
    relatedKey: "id", //-----------------------------------------    Chave primaria ESTABELECIMENTO
    pivotTable: "cidades_estabelecimentos", //--------------------    Tabela que faz o pivo CIDADES_ESTABELECIMENTOS
    pivotForeignKey: "cidade_id", //-----------------------------    Chave para CIDADE na tabela CIDADES_ESTABELECIMENTOS
    pivotRelatedForeignKey: "estabelecimento_id", //-------------    Chave para ESTABELECIMENTO na tabela CIDADES_ESTABELECIMENTOS,
  })
  public estabelecimentos: ManyToMany<typeof Estabelecimento>;
}
