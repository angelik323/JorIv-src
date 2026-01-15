import { IFormulaTax, ILiquidationParamRow, TaxesUIMap } from "@/interfaces/customs/clients/ClientIndirectNaturalPerson";

export const TAX_TYPE_TO_FIELD_MAP: Record<
  IFormulaTax['tax_type'],
  keyof Pick<
    ILiquidationParamRow,
    | 'iva'
    | 'retelca'
    | 'retefuente'
    | 'multiretelca'
    | 'impuestos_municipales'
  >
> = {
    RIV: 'iva',
    RIC: 'retelca',
    RFT: 'retefuente',
    MRC: 'multiretelca',
    RTE: 'impuestos_municipales',
}

export const EMPTY_TAXES_UI: TaxesUIMap = {
  iva: null,
  retelca: null,
  retefuente: null,
  multiretelca: null,
  impuestos_municipales: null,
}