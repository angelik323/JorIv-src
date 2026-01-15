export interface IFieldConfigExchangeTradedFund {
  label: string
  key: string
  format?: (val: string | number | null | undefined) => string | null
}

export interface IExchangeTradedFund {
  id?: number
  consecutive: number
  exchange_traded_fund_description: string
  exchange_traded_fund_number: number
  investment_porfolio_code: string
  investment_portfolio_description: string
  operation_date: string | null
  operation_number: number
  operation_type_description: string
  status_description: string
  status_id: number
  title_number: number
  operation_type?: string
}

export interface IEtfLocalBuyOperation {
  operation_date: string
  investment_portfolio_id: number
  operation_type_id: number
  exchange_traded_fund_id: number
  paper_type_id: number
  quantity_units: string
  operation_number_days: number
  commission_base: string
  commission_value: number
  value_unit_buy: string
  value_compliance: string
  seller_id: number
  value_real_commission?: number
}

export interface IEtfLocalBuyOperationResponse {
  basic_information?: {
    title_number?: string
    operation_number?: string
    operation_date?: string
    operation_type?: {
      code?: string
      description?: string
    }
    investment_portfolio?: {
      code?: string
      description?: string
    }
    status?: {
      id?: number
      status?: string
    }
  }
  business_condition?: {
    operation_number_days?: string
    exchange_traded_fund?: {
      code?: string
      description?: string
      isin?: {
        description?: string
        mnemonic?: string
      }
      administrator?: {
        nit?: string
        description?: string
      }
      transmitter?: {
        nit?: string
        description?: string
      }
    }
    paper_type?: {
      code?: string
    }
    commission?: {
      description?: string
      value?: string
    }
    seller?: {
      number_document?: string
      description?: string
    }
  }
  compliance_condition?: {
    quantity_units?: string
    value_unit_buy?: string
    value_compliance?: string
    operation_date?: string
  }
}

export interface IEtfLocalSellOperation
  extends Omit<IEtfLocalBuyOperation, 'quantity_units' | 'value_unit_buy'> {
  title_id: number
  quantity_sell_units: string
  value_unit_sell: number
  value_real_commission?: number
}

export interface IEtfForeignBuyOperation {
  basic_information: {
    investment_portfolio_id: number
    operation_type_id: number
    operation_date: string
  }
  negotiation_conditions: {
    exchange_traded_fund_id: number
    paper_type_id: number
    seller_id: number
    quantity_units: string
    folio_number: number
    operation_number_days: number
    commission_base: string
    commission_value: number
  }
  compliance_conditions: {
    origin_currency_id: number
    value_origin_currency: number
    compliance_currency_id: number
    value_negotiation_currency: number
    compliance_date: string
    colocation_resources_date: string
    factor_conversion: string
  }
  values_compliance: {
    value_unit_local_currency: string
    value_commission_local_currency: string
    value_total_local_currency: string
    value_unit_origin_currency: string
    value_commission_origin_currency: string
    value_total_origin_currency: string
    value_unit_compliance_currency: string
    value_commission_compliance_currency: string
    value_total_compliance_currency: string
  }
}

export interface IEtfForeignBuyOperationResponse
  extends Omit<
    IEtfLocalBuyOperationResponse,
    'basic_information' | 'business_condition'
  > {
  basic_data?: {
    title_number?: string
    operation_number?: string
    operation_date?: string
    operation_type?: {
      description?: string
      code?: string
    }
    investment_portfolio?: {
      description?: string
      code?: string
    }
    status?: {
      description: string
    }
  }
  negotiation_conditions?: {
    exchange_traded_fund?: {
      code?: string
      description?: string
      isin?: {
        description?: string
        mnemonic?: string
      }
      administrator?: {
        nit?: string
        description?: string
      }
      transmitter?: {
        nit?: string
        description?: string
      }
    }
    paper?: {
      description?: string
    }
    seller?: {
      nit?: string
      description?: string
    }
    quantity_units?: string
    folio_number?: string
    operation_number_days?: string
    commission_base?: string
    commission_value?: string
  }
  compliance_conditions?: {
    colocation_resources_date?: string
    compliance_currency?: {
      currency?: string
      value_currency?: string
    }
    compliance_date?: string
    factor_conversion?: string
    origin_currency?: {
      currency?: string
      value_currency?: string
    }
    quantity_units?: string
  }
  compliance_values?: {
    compliance_currency?: {
      currency?: string
      value_commission?: string
      value_total?: string
      value_unit?: string
    }
    local_currency?: {
      currency?: string
      value_commission?: string
      value_total?: string
      value_unit?: string
    }
    origin_currency?: {
      currency?: string
      value_commission?: string
      value_total?: string
      value_unit?: string
    }
  }
}

export interface IEtfForeignSellOperationResponse {
  basic_information?: {
    operation_date?: string
    operation_number?: number
    investment_portfolio?: {
      id?: number
      code?: string
      description?: string
    }
    operation_type?: {
      id?: number
      code?: number
      description?: string
    }
    status?: {
      id?: number
      description?: string
    }
  }
  negotiation_conditions?: {
    operation?: string
    operation_number_days?: number
    has_commission?: boolean
    commission_base?: string
    commission_value?: string
  }
  compliance_conditions?: {
    title?: {
      id?: number
      description?: string | number
      available_units?: string
    }
    exchange_traded_fund?: {
      id?: number
      code?: number
      description?: string
      transmitter?: {
        id?: number
        number_document?: string
        description?: string
      }
    }
    buyer?: {
      id?: number
      number_document?: string
      description?: string
    }
    agent_commission?: {
      id?: number
      number_document?: string
      description?: string
    }
    origin_currency?: {
      id?: number
      code?: string
      value?: string
      commission_value?: string
    }
    units_sell?: string
  }
  compliance_values?: {
    is_compliance_origin_currency?: boolean
    compliance_currency?: {
      id?: number
      code?: string
      value?: string | null
    }
    compliance_date?: string
    colocation_resources_date?: string
    origin_currency?: {
      value?: string
    }
    spot?: {
      rate?: string
      compliance?: string
    }
    factor_conversion?: string
    gyre_compliance_local_currency?: string
  }
}
