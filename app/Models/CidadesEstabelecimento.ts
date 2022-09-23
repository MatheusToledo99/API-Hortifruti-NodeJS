import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class CidadesEstabelecimento extends BaseModel {

    @column({ isPrimary: true })
    public cidadeId: number;

    @column({isPrimary: true})
    public estabelecimentoId: number;

    @column()
    public custo_entrega: number;

}
